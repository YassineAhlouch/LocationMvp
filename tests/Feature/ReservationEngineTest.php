<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
use App\Enums\PaymentStatus;
use App\Enums\PricingType;
use App\Enums\ReservationChangeType;
use App\Enums\ReservationStatus;
use App\Models\Agency;
use App\Models\Car;
use App\Models\Client;
use App\Models\Extra;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationEngineTest extends TestCase
{
    use RefreshDatabase;

    private Agency $agency;

    protected function setUp(): void
    {
        parent::setUp();

        $this->agency = Agency::factory()->create();
    }

    private function actor(array $permissions): User
    {
        $role = Role::factory()->create(['permissions' => $permissions]);

        return User::factory()->create([
            'agency_id' => $this->agency->id,
            'role_id' => $role->id,
        ]);
    }

    private function car(array $attributes = []): Car
    {
        return Car::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'daily_price' => 300,
            'status' => CarStatus::Available,
        ], $attributes));
    }

    private function client(): Client
    {
        return Client::factory()->create(['agency_id' => $this->agency->id]);
    }

    private function extra(string $name, PricingType $type, float $price): Extra
    {
        return Extra::factory()->create([
            'agency_id' => $this->agency->id,
            'name' => $name,
            'pricing_type' => $type,
            'default_price' => $price,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function storePayload(Car $car, Client $client, array $overrides = []): array
    {
        $pickup = now()->addDay()->setTime(9, 0);

        return array_merge([
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
            'pickup_datetime' => $pickup->toDateTimeString(),
            'expected_return_datetime' => $pickup->copy()->addDays(4)->toDateTimeString(),
            'deposit_amount' => 1000,
        ], $overrides);
    }

    private function existingReservation(
        CarbonInterface $pickup,
        CarbonInterface $return,
        ?Car $car = null,
        ReservationStatus $status = ReservationStatus::Confirmed,
    ): Reservation {
        $car ??= $this->car();

        return Reservation::factory()
            ->state(['status' => $status])
            ->create([
                'agency_id' => $this->agency->id,
                'car_id' => $car->id,
                'primary_client_id' => $this->client()->id,
                'created_by' => User::factory(),
                'pickup_datetime' => $pickup,
                'expected_return_datetime' => $return,
            ]);
    }

    public function test_create_reservation_computes_pricing_and_snapshots_extras(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car(['daily_price' => 300]);
        $client = $this->client();

        $this->extra('GPS', PricingType::Fixed, 100);
        $this->extra('Chauffeur', PricingType::Daily, 50);

        $pickup = now()->addDay()->setTime(9, 0);

        $response = $this->actingAs($actor, 'sanctum')->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
            'pickup_datetime' => $pickup->toDateTimeString(),
            'expected_return_datetime' => $pickup->copy()->addDays(4)->toDateTimeString(),
            'daily_rate' => 300,
            'discount_amount' => 50,
            'discount_reason' => 'Repeat client',
            'extras' => [
                ['extra_id' => Extra::where('name', 'GPS')->value('id'), 'quantity' => 1],
                ['extra_id' => Extra::where('name', 'Chauffeur')->value('id'), 'quantity' => 2],
            ],
        ]));

        // 300×4 days + (100 fixed + 50×2×4 daily) = 1700; −50 discount → tax 330 → total 1980.
        $response->assertCreated()
            ->assertJsonPath('status', 'pending')
            ->assertJsonPath('payment_status', 'unpaid')
            ->assertJsonPath('rental_days', 4);

        $this->assertMatchesRegularExpression('/^RES-\d{8}-[A-Z0-9]{5}$/', $response->json('reservation_number'));

        // Whole-number floats serialize without a fraction (json_encode(300.0) === "300"),
        // so money values are asserted with a delta instead of assertSame.
        $this->assertEqualsWithDelta(300.0, $response->json('daily_rate'), 0.001);
        $this->assertEqualsWithDelta(50.0, $response->json('discount_amount'), 0.001);
        $this->assertEqualsWithDelta(1700.0, $response->json('subtotal'), 0.001);
        $this->assertEqualsWithDelta(330.0, $response->json('tax_amount'), 0.001);
        $this->assertEqualsWithDelta(1980.0, $response->json('total_amount'), 0.001);

        $reservationId = $response->json('id');

        $this->assertDatabaseHas('reservation_extras', [
            'reservation_id' => $reservationId,
            'name' => 'GPS',
            'quantity' => 1,
            'unit_price' => 100,
            'total_price' => 100,
        ]);

        $this->assertDatabaseHas('reservation_extras', [
            'reservation_id' => $reservationId,
            'name' => 'Chauffeur',
            'quantity' => 2,
            'unit_price' => 50,
            'total_price' => 400,
        ]);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $reservationId,
            'field_name' => 'status',
            'change_type' => ReservationChangeType::Creation->value,
            'old_value' => null,
            'new_value' => 'pending',
            'created_by' => $actor->id,
        ]);

        // A pending booking does not flip the car — only confirmation does.
        $this->assertSame(CarStatus::Available, $car->fresh()->status);
    }

    public function test_create_reservation_accepts_free_form_extras(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car(['daily_price' => 300]);
        $client = $this->client();

        $pickup = now()->addDay()->setTime(9, 0);

        $response = $this->actingAs($actor, 'sanctum')->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
            'extras' => [
                [
                    'name' => 'GPS',
                    'description' => 'With charger',
                    'pricing_type' => 'fixed',
                    'quantity' => 1,
                    'unit_price' => 100,
                ],
                [
                    'name' => 'Chauffeur',
                    'pricing_type' => 'daily',
                    'quantity' => 2,
                    'unit_price' => 50,
                ],
            ],
        ]));

        $response->assertCreated();

        $reservationId = $response->json('id');

        $this->assertDatabaseHas('reservation_extras', [
            'reservation_id' => $reservationId,
            'name' => 'GPS',
            'description' => 'With charger',
            'pricing_type' => 'fixed',
            'quantity' => 1,
            'unit_price' => 100,
            'total_price' => 100,
        ]);

        // 50 × 2 × 4 rental days for the daily line.
        $this->assertDatabaseHas('reservation_extras', [
            'reservation_id' => $reservationId,
            'name' => 'Chauffeur',
            'description' => null,
            'pricing_type' => 'daily',
            'quantity' => 2,
            'unit_price' => 50,
            'total_price' => 400,
        ]);
    }

    public function test_free_form_extra_without_required_fields_is_rejected(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $client = $this->client();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
                'extras' => [
                    ['name' => 'GPS'],
                ],
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'extras.0.pricing_type',
                'extras.0.unit_price',
                'extras.0.quantity',
            ]);
    }

    public function test_overlapping_reservation_is_rejected_with_conflict_payload(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $client = $this->client();

        $pickup = now()->addDay()->setTime(9, 0);
        $existing = $this->existingReservation(
            $pickup->copy()->addDay(),
            $pickup->copy()->addDays(3),
            $car,
        );

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
                'pickup_datetime' => $pickup->copy()->addDays(2)->toDateTimeString(),
                'expected_return_datetime' => $pickup->copy()->addDays(5)->toDateTimeString(),
            ]))
            ->assertStatus(409)
            ->assertJsonPath('code', 'car_unavailable')
            ->assertJsonPath('conflicts.0.reservation_number', $existing->reservation_number);
    }

    public function test_back_to_back_rentals_are_allowed(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);
        $this->existingReservation($pickup, $pickup->copy()->addDays(3), $car);

        // Half-open intervals: new pickup equals the existing return → legal.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client(), [
                'pickup_datetime' => $pickup->copy()->addDays(3)->toDateTimeString(),
                'expected_return_datetime' => $pickup->copy()->addDays(6)->toDateTimeString(),
            ]))
            ->assertCreated();
    }

    public function test_cancelled_reservations_do_not_block_availability(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);
        $this->existingReservation(
            $pickup,
            $pickup->copy()->addDays(3),
            $car,
            ReservationStatus::Cancelled,
        );

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client()))
            ->assertCreated();
    }

    public function test_invalid_window_is_rejected(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client(), [
                'pickup_datetime' => $pickup->toDateTimeString(),
                'expected_return_datetime' => $pickup->toDateTimeString(),
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('expected_return_datetime');
    }

    public function test_confirm_moves_car_to_reserved_and_audits(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client()))
            ->json('id');

        $response = $this->actingAs($actor, 'sanctum')->postJson("/api/v1/reservations/{$id}/confirm");

        $response->assertOk()
            ->assertJsonPath('status', 'confirmed');

        $this->assertSame(CarStatus::Reserved, $car->fresh()->status);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'status',
            'change_type' => ReservationChangeType::StatusChange->value,
            'old_value' => 'pending',
            'new_value' => 'confirmed',
            'created_by' => $actor->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/reservations/{$id}/changes")
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.change_type', 'status_change')
            ->assertJsonPath('1.change_type', 'creation');
    }

    public function test_illegal_transitions_are_rejected(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client()))
            ->json('id');

        // pending → active skips confirmation.
        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/activate")
            ->assertStatus(422)
            ->assertJsonPath('code', 'invalid_transition')
            ->assertJsonPath('from', 'pending')
            ->assertJsonPath('to', 'active');

        $this->actingAs($actor, 'sanctum')->postJson("/api/v1/reservations/{$id}/confirm")->assertOk();

        // confirmed → confirmed is not a move.
        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/confirm")
            ->assertStatus(422)
            ->assertJsonPath('code', 'invalid_transition');
    }

    public function test_full_lifecycle_updates_car_state_and_mileage(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client()))
            ->json('id');

        $this->actingAs($actor, 'sanctum')->postJson("/api/v1/reservations/{$id}/confirm")->assertOk();
        $this->assertSame(CarStatus::Reserved, $car->fresh()->status);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/activate", [
                'pickup_mileage' => 50000,
                'pickup_fuel_level' => 90,
            ])
            ->assertOk()
            ->assertJsonPath('status', 'active');

        $this->assertSame(CarStatus::Rented, $car->fresh()->status);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/complete", [
                'return_mileage' => 51200,
                'return_fuel_level' => 60,
            ])
            ->assertOk()
            ->assertJsonPath('status', 'completed');

        $car->refresh();
        $this->assertSame(CarStatus::Available, $car->status);
        $this->assertSame(51200, $car->current_mileage);
        $this->assertSame(60, $car->current_fuel_level);

        $reservation = Reservation::find($id);
        $this->assertNotNull($reservation->actual_return_datetime);
    }

    public function test_completion_sends_car_to_maintenance_when_service_due(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car(['next_service_mileage' => 50500]);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client()))
            ->json('id');

        $this->actingAs($actor, 'sanctum')->postJson("/api/v1/reservations/{$id}/confirm")->assertOk();
        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/activate", ['pickup_mileage' => 50000])
            ->assertOk();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/complete", ['return_mileage' => 51000])
            ->assertOk();

        $this->assertSame(CarStatus::Maintenance, $car->fresh()->status);
    }

    public function test_cancel_requires_reason_and_releases_car(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client()))
            ->json('id');

        $this->actingAs($actor, 'sanctum')->postJson("/api/v1/reservations/{$id}/confirm")->assertOk();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/cancel")
            ->assertStatus(422)
            ->assertJsonValidationErrors('reason');

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/cancel", ['reason' => 'Client postponed the trip'])
            ->assertOk()
            ->assertJsonPath('status', 'cancelled');

        $this->assertSame(CarStatus::Available, $car->fresh()->status);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'status',
            'new_value' => 'cancelled',
            'reason' => 'Client postponed the trip',
        ]);
    }

    public function test_no_show_requires_reason_and_releases_car(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client(), [
                'status' => 'reserved',
            ]))
            ->json('id');

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/no-show")
            ->assertStatus(422)
            ->assertJsonValidationErrors('reason');

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/no-show", ['reason' => 'Client never arrived'])
            ->assertOk()
            ->assertJsonPath('status', 'no_show');

        $this->assertSame(CarStatus::Available, $car->fresh()->status);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'status',
            'new_value' => 'no_show',
            'reason' => 'Client never arrived',
        ]);
    }

    public function test_cancel_keeps_car_reserved_when_another_booking_holds_it(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);
        $first = $this->existingReservation($pickup, $pickup->copy()->addDays(2), $car, ReservationStatus::Pending);
        $second = $this->existingReservation(
            $pickup->copy()->addDays(4),
            $pickup->copy()->addDays(6),
            $car,
            ReservationStatus::Pending,
        );

        $this->actingAs($actor, 'sanctum')->postJson("/api/v1/reservations/{$first->id}/confirm")->assertOk();
        $this->actingAs($actor, 'sanctum')->postJson("/api/v1/reservations/{$second->id}/confirm")->assertOk();
        $this->assertSame(CarStatus::Reserved, $car->fresh()->status);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$first->id}/cancel", ['reason' => 'No-show'])
            ->assertOk();

        // The second confirmed booking still holds the car.
        $this->assertSame(CarStatus::Reserved, $car->fresh()->status);
    }

    public function test_extend_recomputes_pricing_and_audits(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);
        $return = $pickup->copy()->addDays(3);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client(), [
                'pickup_datetime' => $pickup->toDateTimeString(),
                'expected_return_datetime' => $return->toDateTimeString(),
            ]))
            ->json('id');

        // 3 days at 300: subtotal 900, tax 180, total 1080.
        $this->assertEqualsWithDelta(1080.0, (float) Reservation::find($id)->total_amount, 0.001);

        $newReturn = $return->copy()->addDays(5);

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/extend", [
                'expected_return_datetime' => $newReturn->toDateTimeString(),
                'reason' => 'Client extended the stay',
            ]);

        // 8 days at 300: rate 2400 − 5% weekly tier (120) = subtotal 2280,
        // tax 456, total 2736 (duration discount folds into the subtotal).
        $response->assertOk()
            ->assertJsonPath('rental_days', 8);

        $this->assertEqualsWithDelta(2736.0, $response->json('total_amount'), 0.001);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'expected_return_datetime',
            'change_type' => ReservationChangeType::Extension->value,
            'new_value' => $newReturn->toDateTimeString(),
            'reason' => 'Client extended the stay',
        ]);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'total_amount',
            'change_type' => ReservationChangeType::PricingUpdate->value,
            'old_value' => '1080.00',
            'new_value' => '2736.00',
        ]);
    }

    public function test_extend_into_conflicting_window_is_rejected(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);
        $first = $this->existingReservation($pickup, $pickup->copy()->addDays(2), $car);
        $this->existingReservation($pickup->copy()->addDays(3), $pickup->copy()->addDays(5), $car);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$first->id}/extend", [
                'expected_return_datetime' => $pickup->copy()->addDays(4)->toDateTimeString(),
            ])
            ->assertStatus(409)
            ->assertJsonPath('code', 'car_unavailable');
    }

    public function test_update_reprices_and_records_field_changes(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client(), [
                'pickup_datetime' => $pickup->toDateTimeString(),
                'expected_return_datetime' => $pickup->copy()->addDays(3)->toDateTimeString(),
            ]))
            ->json('id');

        $response = $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/reservations/{$id}", ['daily_rate' => 350]);

        // 350×3 = 1050; tax 210; total 1260.
        $response->assertOk()
            ->assertJsonPath('daily_rate', 350)
            ->assertJsonPath('rental_days', 3);

        $this->assertEqualsWithDelta(1260.0, $response->json('total_amount'), 0.001);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'daily_rate',
            'change_type' => ReservationChangeType::ManualEdit->value,
            'old_value' => '300.00',
            'new_value' => '350',
        ]);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'total_amount',
            'change_type' => ReservationChangeType::PricingUpdate->value,
            'old_value' => '1080.00',
            'new_value' => '1260.00',
        ]);
    }

    public function test_update_can_advance_status_through_the_state_machine(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client(), [
                'pickup_datetime' => $pickup->toDateTimeString(),
                'expected_return_datetime' => $pickup->copy()->addDays(3)->toDateTimeString(),
                'status' => 'confirmed',
            ]))
            ->json('id');

        // Confirmation holds the car; the edit then activates it.
        $this->assertSame(CarStatus::Reserved, $car->fresh()->status);

        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/reservations/{$id}", ['status' => 'active'])
            ->assertOk()
            ->assertJsonPath('status', 'active');

        $this->assertSame(CarStatus::Rented, $car->fresh()->status);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'status',
            'change_type' => ReservationChangeType::StatusChange->value,
            'old_value' => 'confirmed',
            'new_value' => 'active',
            'created_by' => $actor->id,
        ]);
    }

    public function test_update_rejects_illegal_status_transition(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client()))
            ->json('id');

        // pending → active skips confirmation.
        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/reservations/{$id}", ['status' => 'active'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'invalid_transition')
            ->assertJsonPath('from', 'pending')
            ->assertJsonPath('to', 'active');
    }

    public function test_update_replaces_extras_and_reprices(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client(), [
                'pickup_datetime' => $pickup->toDateTimeString(),
                'expected_return_datetime' => $pickup->copy()->addDays(3)->toDateTimeString(),
            ]))
            ->json('id');

        $response = $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/reservations/{$id}", [
                'extras' => [
                    ['name' => 'GPS', 'pricing_type' => 'fixed', 'quantity' => 1, 'unit_price' => 100],
                    ['name' => 'Chauffeur', 'pricing_type' => 'daily', 'quantity' => 1, 'unit_price' => 50],
                ],
            ]);

        // 300×3 + (100 fixed + 50×3 daily) = 1150; tax 230 → total 1380.
        $response->assertOk()
            ->assertJsonPath('rental_days', 3);

        $this->assertEqualsWithDelta(1380.0, $response->json('total_amount'), 0.001);

        $this->assertDatabaseHas('reservation_extras', [
            'reservation_id' => $id,
            'name' => 'GPS',
            'quantity' => 1,
            'unit_price' => 100,
            'total_price' => 100,
        ]);

        $this->assertDatabaseHas('reservation_extras', [
            'reservation_id' => $id,
            'name' => 'Chauffeur',
            'quantity' => 1,
            'unit_price' => 50,
            'total_price' => 150,
        ]);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'extras',
            'change_type' => ReservationChangeType::ManualEdit->value,
        ]);
    }

    public function test_terminal_reservations_are_frozen(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->subDays(5)->setTime(9, 0);
        $reservation = $this->existingReservation(
            $pickup,
            $pickup->copy()->addDays(2),
            $car,
            ReservationStatus::Completed,
        );

        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/reservations/{$reservation->id}", ['remarks' => 'Edited'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'reservation_not_editable');

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/confirm")
            ->assertStatus(422)
            ->assertJsonPath('code', 'invalid_transition');
    }

    public function test_index_filters_by_status_and_scopes_by_agency(): void
    {
        $actor = $this->actor(['reservations.*']);
        $pickup = now()->addDay()->setTime(9, 0);

        $pending = $this->existingReservation($pickup, $pickup->copy()->addDays(2), status: ReservationStatus::Pending);
        $confirmed = $this->existingReservation(
            $pickup->copy()->addDays(4),
            $pickup->copy()->addDays(6),
        );

        // Another agency's booking must never leak into this one's listing.
        $otherAgency = Agency::factory()->create();
        Reservation::factory()->confirmed()->create([
            'agency_id' => $otherAgency->id,
            'car_id' => Car::factory()->create(['agency_id' => $otherAgency->id])->id,
            'primary_client_id' => Client::factory()->create(['agency_id' => $otherAgency->id])->id,
            'created_by' => User::factory(),
        ]);

        $response = $this->actingAs($actor, 'sanctum')->getJson('/api/v1/reservations?status=confirmed');

        $response->assertOk()->assertJsonCount(1, 'data');
        $this->assertSame($confirmed->id, $response->json('data.0.id'));
        $this->assertNotSame($pending->id, $response->json('data.0.id'));

        // Cross-agency direct access is a 404, never data.
        $foreign = Reservation::query()->where('agency_id', $otherAgency->id)->firstOrFail();

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/reservations/{$foreign->id}")
            ->assertNotFound();
    }

    public function test_index_filters_by_payment_status(): void
    {
        $actor = $this->actor(['reservations.*']);
        $pickup = now()->addDay()->setTime(9, 0);

        $paid = $this->existingReservation($pickup, $pickup->copy()->addDays(2));
        $paid->payment_status = PaymentStatus::Paid;
        $paid->save();

        $partial = $this->existingReservation(
            $pickup->copy()->addDays(4),
            $pickup->copy()->addDays(6),
        );
        $partial->payment_status = PaymentStatus::Partial;
        $partial->save();

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?payment_status=partial')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $partial->id);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?payment_status=unpaid')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_availability_endpoint_reports_conflicts(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);
        $existing = $this->existingReservation($pickup, $pickup->copy()->addDays(3), $car);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations/availability?'.http_build_query([
                'car_id' => $car->id,
                'pickup_datetime' => $pickup->copy()->addDay()->toDateTimeString(),
                'expected_return_datetime' => $pickup->copy()->addDays(2)->toDateTimeString(),
            ]))
            ->assertOk()
            ->assertJsonPath('available', false)
            ->assertJsonPath('conflicts.0.reservation_number', $existing->reservation_number);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations/availability?'.http_build_query([
                'car_id' => $car->id,
                'pickup_datetime' => $pickup->copy()->addDays(10)->toDateTimeString(),
                'expected_return_datetime' => $pickup->copy()->addDays(12)->toDateTimeString(),
            ]))
            ->assertOk()
            ->assertJsonPath('available', true)
            ->assertJsonPath('conflicts', []);
    }

    public function test_permissions_gate_reservation_writes(): void
    {
        $finance = $this->actor(['payments.*']);
        $car = $this->car();
        $client = $this->client();

        // Finance staff hold no reservation permissions.
        $this->actingAs($finance)
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client))
            ->assertStatus(403)
            ->assertJsonPath('code', 'forbidden');

        // An agent without reservations.cancel cannot cancel.
        $limited = $this->actor(['reservations.view', 'reservations.create']);

        $id = $this->actingAs($limited)
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client))
            ->assertCreated()
            ->json('id');

        $this->actingAs($limited)
            ->postJson("/api/v1/reservations/{$id}/cancel", ['reason' => 'Not allowed'])
            ->assertStatus(403)
            ->assertJsonPath('permission', 'reservations.cancel');
    }

    public function test_create_reservation_persists_secondary_client(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $primary = $this->client();
        $secondary = $this->client();

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $primary, [
                'secondary_client_id' => $secondary->id,
            ]))
            ->assertCreated();

        $this->assertSame($secondary->id, $response->json('secondary_client.id'));

        $this->assertDatabaseHas('reservations', [
            'id' => $response->json('id'),
            'primary_client_id' => $primary->id,
            'secondary_client_id' => $secondary->id,
        ]);
    }

    public function test_create_reservation_as_confirmed_marks_car_reserved(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $client = $this->client();

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
                'status' => 'confirmed',
            ]))
            ->assertCreated()
            ->assertJsonPath('status', 'confirmed');

        // Same lifecycle step as the dedicated confirm endpoint: the car flips
        // to reserved inside the creation transaction.
        $this->assertSame(CarStatus::Reserved, $car->fresh()->status);

        $id = $response->json('id');

        // Created as confirmed, with the pending → confirmed move audited too.
        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'status',
            'change_type' => ReservationChangeType::Creation->value,
            'new_value' => 'confirmed',
        ]);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'status',
            'change_type' => ReservationChangeType::StatusChange->value,
            'old_value' => 'pending',
            'new_value' => 'confirmed',
        ]);
    }

    public function test_create_reservation_as_reserved_marks_car_reserved(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $client = $this->client();

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
                'status' => 'reserved',
            ]))
            ->assertCreated()
            ->assertJsonPath('status', 'reserved');

        // A phone-hold still occupies the car until confirmed or released.
        $this->assertSame(CarStatus::Reserved, $car->fresh()->status);

        $id = $response->json('id');

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'status',
            'change_type' => ReservationChangeType::StatusChange->value,
            'old_value' => 'pending',
            'new_value' => 'reserved',
        ]);
    }

    public function test_create_reservation_rejects_statuses_outside_startup_choices(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $client = $this->client();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
                'status' => 'active',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
                'status' => 'no_show',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $this->assertDatabaseCount('reservations', 0);
    }

    public function test_create_reservation_with_paid_initial_payment_derives_payment_status(): void
    {
        $actor = $this->actor(['reservations.*', 'payments.create']);
        $car = $this->car(['daily_price' => 300]);
        $client = $this->client();

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
                'payment' => [
                    'amount' => 500,
                    'method' => 'cash',
                    'reference' => 'REC-001',
                ],
            ]))
            ->assertCreated()
            // 500 < the quoted total → the ledger derives "partial".
            ->assertJsonPath('payment_status', 'partial');

        $this->assertDatabaseHas('payments', [
            'reservation_id' => $response->json('id'),
            'amount' => 500,
            'method' => 'cash',
            'status' => 'paid',
            'reference' => 'REC-001',
        ]);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $response->json('id'),
            'field_name' => 'payment_status',
            'change_type' => ReservationChangeType::Payment->value,
            'old_value' => 'unpaid',
            'new_value' => 'partial',
        ]);
    }

    public function test_create_reservation_with_pending_initial_payment_stays_unpaid(): void
    {
        $actor = $this->actor(['reservations.*', 'payments.create']);
        $car = $this->car();
        $client = $this->client();

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
                'payment' => [
                    'amount' => 500,
                    'method' => 'transfer',
                    'status' => 'pending',
                ],
            ]))
            ->assertCreated()
            ->assertJsonPath('payment_status', 'unpaid');

        $this->assertDatabaseHas('payments', [
            'reservation_id' => $response->json('id'),
            'amount' => 500,
            'method' => 'transfer',
            'status' => 'pending',
        ]);
    }

    public function test_initial_payment_requires_payments_create_permission(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $client = $this->client();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
                'payment' => ['amount' => 100, 'method' => 'cash'],
            ]))
            ->assertStatus(403)
            ->assertJsonPath('permission', 'payments.create');
    }

    public function test_create_reservation_records_multiple_initial_payments(): void
    {
        $actor = $this->actor(['reservations.*', 'payments.create']);
        $car = $this->car(['daily_price' => 300]);
        $client = $this->client();

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
                'payments' => [
                    ['amount' => 500, 'method' => 'cash', 'reference' => 'REC-001'],
                    ['amount' => 300, 'method' => 'transfer', 'status' => 'paid'],
                ],
            ]))
            ->assertCreated()
            // 800 paid of the 1440 quoted total → partial.
            ->assertJsonPath('payment_status', 'partial');

        $reservationId = $response->json('id');

        $this->assertDatabaseHas('payments', [
            'reservation_id' => $reservationId,
            'amount' => 500,
            'method' => 'cash',
            'status' => 'paid',
            'reference' => 'REC-001',
        ]);

        $this->assertDatabaseHas('payments', [
            'reservation_id' => $reservationId,
            'amount' => 300,
            'method' => 'transfer',
            'status' => 'paid',
        ]);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $reservationId,
            'field_name' => 'payment_status',
            'change_type' => ReservationChangeType::Payment->value,
            'old_value' => 'unpaid',
            'new_value' => 'partial',
        ]);
    }

    public function test_multiple_initial_payments_require_payments_create_permission(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $client = $this->client();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client, [
                'payments' => [
                    ['amount' => 500, 'method' => 'cash'],
                ],
            ]))
            ->assertStatus(403)
            ->assertJsonPath('permission', 'payments.create');
    }

    public function test_calendar_projects_the_booking_window(): void
    {
        $actor = $this->actor(['reservations.view']);
        $car = $this->car(['registration_number' => 'CAL-001']);
        $client = $this->client();

        $pickup = now()->addDays(2)->setTime(9, 0);

        $reservation = Reservation::factory()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
            'created_by' => User::factory(),
            'pickup_datetime' => $pickup,
            'expected_return_datetime' => $pickup->copy()->addDays(3),
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations/calendar')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $reservation->id)
            ->assertJsonPath('0.car.registration_number', 'CAL-001')
            ->assertJsonPath('0.primary_client.id', $client->id)
            // The full record (extras, audit trail, …) is fetched lazily on
            // open; the calendar feed stays a light projection.
            ->assertJsonMissingPath('0.extras')
            ->assertJsonMissingPath('0.changes');
    }

    public function test_calendar_window_filters_by_overlap_and_validates_bounds(): void
    {
        $actor = $this->actor(['reservations.view']);

        $inside = $this->existingReservation(
            now()->addDays(3)->setTime(9, 0),
            now()->addDays(6)->setTime(9, 0),
        );
        // Started before the window but returns inside it — must still show.
        $straddling = $this->existingReservation(
            now()->subDays(2)->setTime(9, 0),
            now()->addDay()->setTime(9, 0),
        );
        $outside = $this->existingReservation(
            now()->addDays(20)->setTime(9, 0),
            now()->addDays(25)->setTime(9, 0),
        );

        $from = now()->startOfDay()->toDateString();
        $to = now()->addDays(7)->toDateString();

        $response = $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/reservations/calendar?from={$from}&to={$to}")
            ->assertOk()
            ->assertJsonCount(2);

        $ids = collect($response->json())->pluck('id');

        $this->assertTrue($ids->contains($inside->id));
        $this->assertTrue($ids->contains($straddling->id));
        $this->assertFalse($ids->contains($outside->id));

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations/calendar?from=not-a-date')
            ->assertStatus(422);
    }
}
