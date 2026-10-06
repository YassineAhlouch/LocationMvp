<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
use App\Enums\PricingType;
use App\Enums\ReservationChangeType;
use App\Models\Agency;
use App\Models\Car;
use App\Models\Client;
use App\Models\Extra;
use App\Models\PricingRule;
use App\Models\Reservation;
use App\Models\ReservationExtra;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class PricingEngineTest extends TestCase
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

    /**
     * @return array<string, mixed>
     */
    private function quotePayload(Car $car, array $overrides = []): array
    {
        $pickup = now()->addDay()->setTime(9, 0);

        return array_merge([
            'car_id' => $car->id,
            'pickup_datetime' => $pickup->toDateTimeString(),
            'expected_return_datetime' => $pickup->copy()->addDays(4)->toDateTimeString(),
            'daily_rate' => 300,
        ], $overrides);
    }

    /**
     * The persisted columns must always reconcile on their own:
     * total = subtotal − discount + tax, and tax = (subtotal − discount) × rate.
     */
    private function assertMoneyInvariants(Reservation $reservation): void
    {
        $subtotal = (float) $reservation->subtotal;
        $discount = (float) $reservation->discount_amount;
        $tax = (float) $reservation->tax_amount;
        $total = (float) $reservation->total_amount;

        $this->assertEqualsWithDelta($total, $subtotal - $discount + $tax, 0.01);
        $this->assertEqualsWithDelta(
            $tax,
            round(($subtotal - $discount) * (float) config('pricing.tax_rate'), 2),
            0.01,
        );
    }

    public function test_quote_without_rules_matches_flat_formula(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $gps = $this->extra('GPS', PricingType::Fixed, 100);

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', $this->quotePayload($car, [
                'discount_amount' => 50,
                'deposit_amount' => 1000,
                'extras' => [['extra_id' => $gps->id, 'quantity' => 1]],
            ]));

        $response->assertOk()
            ->assertJsonPath('currency', 'MAD')
            ->assertJsonPath('tax_rate', 0.2)
            ->assertJsonPath('duration_tier', null)
            ->assertJsonCount(4, 'days');

        $this->assertEqualsWithDelta(1200.0, $response->json('rate_subtotal'), 0.001);
        $this->assertEqualsWithDelta(0.0, $response->json('duration_discount'), 0.001);
        $this->assertEqualsWithDelta(100.0, $response->json('extras_total'), 0.001);
        $this->assertEqualsWithDelta(1300.0, $response->json('subtotal'), 0.001);
        $this->assertEqualsWithDelta(50.0, $response->json('discount_amount'), 0.001);
        $this->assertEqualsWithDelta(250.0, $response->json('tax_amount'), 0.001);
        $this->assertEqualsWithDelta(1500.0, $response->json('total_amount'), 0.001);
        $this->assertEqualsWithDelta(1000.0, $response->json('deposit_amount'), 0.001);
        $this->assertEqualsWithDelta(300.0, $response->json('base_daily_price'), 0.001);

        $this->assertEqualsWithDelta(300.0, $response->json('days.0.day_rate'), 0.001);
        $this->assertSame([], $response->json('days.0.adjustments'));
    }

    public function test_season_rule_adjusts_day_rates(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        PricingRule::factory()->create([
            'agency_id' => $this->agency->id,
            'name' => 'High Season',
            'adjustment_value' => 15,
        ]);

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', $this->quotePayload($car));

        $response->assertOk()->assertJsonCount(4, 'days');

        $this->assertEqualsWithDelta(345.0, $response->json('days.0.day_rate'), 0.001);
        $this->assertEqualsWithDelta(300.0, $response->json('days.0.base_rate'), 0.001);
        $this->assertEqualsWithDelta(45.0, $response->json('days.0.adjustments.0.amount'), 0.001);
        $this->assertSame('High Season', $response->json('days.0.adjustments.0.name'));
        $this->assertSame('percent', $response->json('days.0.adjustments.0.adjustment_type'));

        $this->assertEqualsWithDelta(1380.0, $response->json('rate_subtotal'), 0.001);
        $this->assertEqualsWithDelta(1380.0, $response->json('subtotal'), 0.001);
        $this->assertEqualsWithDelta(276.0, $response->json('tax_amount'), 0.001);
        $this->assertEqualsWithDelta(1656.0, $response->json('total_amount'), 0.001);
    }

    public function test_season_and_weekday_rules_stack_additively(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        PricingRule::factory()->create([
            'agency_id' => $this->agency->id,
            'name' => 'High Season',
            'adjustment_value' => 10,
        ]);

        PricingRule::factory()
            ->dayOfWeek([5])
            ->fixed(50)
            ->create(['agency_id' => $this->agency->id, 'name' => 'Friday Supplement']);

        $friday = Carbon::now()->next(Carbon::FRIDAY)->setTime(9, 0);

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', $this->quotePayload($car, [
                'pickup_datetime' => $friday->toDateTimeString(),
                'expected_return_datetime' => $friday->copy()->addDays(2)->toDateTimeString(),
            ]));

        $response->assertOk()->assertJsonCount(2, 'days');

        // Friday: 300 × 1.10 + 50. Saturday: 300 × 1.10. Percent points add,
        // fixed amounts sum — no compounding between matching rules.
        $this->assertEquals([380, 330], array_column($response->json('days'), 'day_rate'));
        $response->assertJsonCount(2, 'days.0.adjustments');
        $response->assertJsonCount(1, 'days.1.adjustments');

        $this->assertEqualsWithDelta(710.0, $response->json('rate_subtotal'), 0.001);
        $this->assertEqualsWithDelta(142.0, $response->json('tax_amount'), 0.001);
        $this->assertEqualsWithDelta(852.0, $response->json('total_amount'), 0.001);
    }

    public function test_foreign_and_inactive_rules_are_ignored(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        // Another agency's season (+15%) and our own disabled rule (+70%).
        PricingRule::factory()->create();
        PricingRule::factory()
            ->inactive()
            ->create(['agency_id' => $this->agency->id, 'adjustment_value' => 70]);

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', $this->quotePayload($car));

        $response->assertOk()->assertJsonCount(4, 'days');

        $this->assertEqualsWithDelta(1200.0, $response->json('rate_subtotal'), 0.001);
        $this->assertEqualsWithDelta(1440.0, $response->json('total_amount'), 0.001);
        $this->assertSame([], $response->json('days.0.adjustments'));
    }

    public function test_duration_discount_tiers(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        // 6 days: no tier yet.
        $six = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', $this->quotePayload($car, [
                'expected_return_datetime' => now()->addDay()->setTime(9, 0)->addDays(6)->toDateTimeString(),
            ]));

        $six->assertOk()->assertJsonPath('duration_tier', null);
        $this->assertEqualsWithDelta(0.0, $six->json('duration_discount'), 0.001);
        $this->assertEqualsWithDelta(1800.0, $six->json('subtotal'), 0.001);
        $this->assertEqualsWithDelta(2160.0, $six->json('total_amount'), 0.001);

        // 7 days: weekly tier, 5% of the rate portion.
        $weekly = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', $this->quotePayload($car, [
                'expected_return_datetime' => now()->addDay()->setTime(9, 0)->addDays(7)->toDateTimeString(),
            ]));

        $weekly->assertOk()->assertJsonPath('duration_tier', 7);
        $this->assertEqualsWithDelta(105.0, $weekly->json('duration_discount'), 0.001);
        $this->assertEqualsWithDelta(1995.0, $weekly->json('subtotal'), 0.001);
        $this->assertEqualsWithDelta(399.0, $weekly->json('tax_amount'), 0.001);
        $this->assertEqualsWithDelta(2394.0, $weekly->json('total_amount'), 0.001);

        // 28 days: monthly tier replaces the weekly one (never stacked).
        $monthly = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', $this->quotePayload($car, [
                'expected_return_datetime' => now()->addDay()->setTime(9, 0)->addDays(28)->toDateTimeString(),
            ]));

        $monthly->assertOk()->assertJsonPath('duration_tier', 28);
        $this->assertEqualsWithDelta(840.0, $monthly->json('duration_discount'), 0.001);
        $this->assertEqualsWithDelta(7560.0, $monthly->json('subtotal'), 0.001);
        $this->assertEqualsWithDelta(1512.0, $monthly->json('tax_amount'), 0.001);
        $this->assertEqualsWithDelta(9072.0, $monthly->json('total_amount'), 0.001);
    }

    public function test_quote_endpoint_validates_input(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', $this->quotePayload($car, [
                'expected_return_datetime' => $pickup->copy()->subDays(1)->toDateTimeString(),
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('expected_return_datetime');

        $foreignCar = Car::factory()->create(['agency_id' => Agency::factory()]);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', $this->quotePayload($car, ['car_id' => $foreignCar->id]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('car_id');

        $inactiveExtra = Extra::factory()->create([
            'agency_id' => $this->agency->id,
            'is_active' => false,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', $this->quotePayload($car, [
                'extras' => [['extra_id' => $inactiveExtra->id, 'quantity' => 1]],
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('extras.0.extra_id');

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('car_id');
    }

    public function test_quote_requires_reservation_create_permission(): void
    {
        $actor = $this->actor(['reservations.view']);
        $car = $this->car();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/quote', $this->quotePayload($car))
            ->assertStatus(403)
            ->assertJsonPath('code', 'forbidden')
            ->assertJsonPath('permission', 'reservations.create');
    }

    public function test_rule_crud_enforces_permissions_and_tenancy(): void
    {
        $agent = $this->actor(['reservations.*']);
        $manager = $this->actor(['pricing.*']);

        $this->actingAs($agent, 'sanctum')
            ->getJson('/api/v1/pricing/rules')
            ->assertStatus(403)
            ->assertJsonPath('code', 'forbidden')
            ->assertJsonPath('permission', 'pricing.view');

        $stored = $this->actingAs($manager, 'sanctum')
            ->postJson('/api/v1/pricing/rules', [
                'name' => 'Marrakech High Season',
                'rule_type' => 'season',
                'starts_on' => now()->toDateString(),
                'ends_on' => now()->addDays(30)->toDateString(),
                'adjustment_type' => 'percent',
                'adjustment_value' => 15,
            ]);

        $stored->assertCreated()->assertJsonPath('rule_type', 'season');

        $this->assertDatabaseHas('pricing_rules', [
            'id' => $stored->json('id'),
            'agency_id' => $this->agency->id,
        ]);

        // The index only lists this agency's rules.
        $this->actingAs($manager, 'sanctum')
            ->getJson('/api/v1/pricing/rules')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $foreign = PricingRule::factory()->create();

        $this->actingAs($manager, 'sanctum')
            ->getJson("/api/v1/pricing/rules/{$foreign->id}")
            ->assertNotFound();

        $this->actingAs($manager, 'sanctum')
            ->patchJson("/api/v1/pricing/rules/{$foreign->id}", ['name' => 'Hijacked'])
            ->assertNotFound();

        $this->actingAs($manager, 'sanctum')
            ->deleteJson("/api/v1/pricing/rules/{$foreign->id}")
            ->assertNotFound();

        $ruleId = $stored->json('id');

        $this->actingAs($manager, 'sanctum')
            ->patchJson("/api/v1/pricing/rules/{$ruleId}", ['name' => 'Peak Season'])
            ->assertOk()
            ->assertJsonPath('name', 'Peak Season');

        $this->actingAs($manager, 'sanctum')
            ->deleteJson("/api/v1/pricing/rules/{$ruleId}")
            ->assertNoContent();

        $this->assertDatabaseMissing('pricing_rules', ['id' => $ruleId]);
    }

    public function test_rule_crud_validates_by_type(): void
    {
        $manager = $this->actor(['pricing.*']);

        // Season requires its window.
        $this->actingAs($manager, 'sanctum')
            ->postJson('/api/v1/pricing/rules', [
                'name' => 'No window',
                'rule_type' => 'season',
                'adjustment_type' => 'percent',
                'adjustment_value' => 15,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('starts_on');

        // Day-of-week requires its weekday list.
        $this->actingAs($manager, 'sanctum')
            ->postJson('/api/v1/pricing/rules', [
                'name' => 'No days',
                'rule_type' => 'day_of_week',
                'adjustment_type' => 'percent',
                'adjustment_value' => 15,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('days_of_week');

        // A percentage above 100 would invert the price.
        $this->actingAs($manager, 'sanctum')
            ->postJson('/api/v1/pricing/rules', [
                'name' => 'Ridiculous',
                'rule_type' => 'season',
                'starts_on' => now()->toDateString(),
                'ends_on' => now()->addDays(10)->toDateString(),
                'adjustment_type' => 'percent',
                'adjustment_value' => 150,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('adjustment_value');

        $this->actingAs($manager, 'sanctum')
            ->postJson('/api/v1/pricing/rules', [
                'name' => 'Backwards',
                'rule_type' => 'season',
                'starts_on' => now()->addDays(10)->toDateString(),
                'ends_on' => now()->toDateString(),
                'adjustment_type' => 'percent',
                'adjustment_value' => 15,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('ends_on');

        $this->actingAs($manager, 'sanctum')
            ->postJson('/api/v1/pricing/rules', [
                'name' => 'Weekend Supplement',
                'rule_type' => 'day_of_week',
                'days_of_week' => [5, 6],
                'adjustment_type' => 'fixed',
                'adjustment_value' => 80,
            ])
            ->assertCreated()
            ->assertJsonPath('days_of_week', [5, 6])
            ->assertJsonPath('starts_on', null);
    }

    public function test_late_return_beyond_grace_recharges_extra_days(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $seat = $this->extra('Baby Seat', PricingType::Daily, 50);

        $pickup = now()->addDay()->setTime(9, 0);
        $expected = $pickup->copy()->addDays(3);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client(), [
                'pickup_datetime' => $pickup->toDateTimeString(),
                'expected_return_datetime' => $expected->toDateTimeString(),
                'extras' => [['extra_id' => $seat->id, 'quantity' => 2]],
            ]))
            ->json('id');

        // 3 days: rate 900 + extras 50 × 2 × 3 = 300 → subtotal 1200, total 1440.
        $this->assertEqualsWithDelta(1440.0, (float) Reservation::find($id)->total_amount, 0.001);

        $this->actingAs($actor, 'sanctum')->postJson("/api/v1/reservations/{$id}/confirm")->assertOk();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/activate", [
                'pickup_mileage' => 50000,
                'pickup_fuel_level' => 90,
            ])
            ->assertOk();

        // Returned 1 day + 2 h past expectation — beyond the 60-minute grace.
        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/complete", [
                'return_mileage' => 51000,
                'return_fuel_level' => 60,
                'actual_return_datetime' => $expected->copy()->addDay()->addHours(2)->toDateTimeString(),
            ])
            ->assertOk()
            ->assertJsonPath('status', 'completed');

        $reservation = Reservation::find($id);

        // 4 calendar days now: rate 1200 + extras 400 → subtotal 1600, total 1920.
        $this->assertSame(4, (int) $reservation->rental_days);
        $this->assertEqualsWithDelta(1600.0, (float) $reservation->subtotal, 0.001);
        $this->assertEqualsWithDelta(320.0, (float) $reservation->tax_amount, 0.001);
        $this->assertEqualsWithDelta(1920.0, (float) $reservation->total_amount, 0.001);
        $this->assertMoneyInvariants($reservation);

        $extraLine = ReservationExtra::query()
            ->where('reservation_id', $id)
            ->where('name', 'Baby Seat')
            ->firstOrFail();
        $this->assertEqualsWithDelta(400.0, (float) $extraLine->total_price, 0.001);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'rental_days',
            'change_type' => ReservationChangeType::PricingUpdate->value,
            'old_value' => '3',
            'new_value' => '4',
        ]);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'total_amount',
            'change_type' => ReservationChangeType::PricingUpdate->value,
            'old_value' => '1440.00',
            'new_value' => '1920.00',
        ]);
    }

    public function test_return_within_grace_is_not_recharged(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();

        $pickup = now()->addDay()->setTime(9, 0);
        $expected = $pickup->copy()->addDays(2)->setTime(23, 30);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client(), [
                'pickup_datetime' => $pickup->toDateTimeString(),
                'expected_return_datetime' => $expected->toDateTimeString(),
            ]))
            ->json('id');

        // 2 charged days: rate 600, total 720.
        $this->assertEqualsWithDelta(720.0, (float) Reservation::find($id)->total_amount, 0.001);

        $this->actingAs($actor, 'sanctum')->postJson("/api/v1/reservations/{$id}/confirm")->assertOk();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/activate", [
                'pickup_mileage' => 50000,
                'pickup_fuel_level' => 90,
            ])
            ->assertOk();

        // Crosses midnight (3 calendar days held) but lands inside the
        // grace window (expected + 60 min) — no extra day is billed.
        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/complete", [
                'return_mileage' => 50500,
                'return_fuel_level' => 70,
                'actual_return_datetime' => $expected->copy()->addMinutes(30)->toDateTimeString(),
            ])
            ->assertOk();

        $reservation = Reservation::find($id);

        $this->assertSame(2, (int) $reservation->rental_days);
        $this->assertEqualsWithDelta(720.0, (float) $reservation->total_amount, 0.001);

        $this->assertDatabaseMissing('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'rental_days',
        ]);
    }

    public function test_early_return_never_refunds(): void
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

        $this->actingAs($actor, 'sanctum')->postJson("/api/v1/reservations/{$id}/confirm")->assertOk();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/activate", [
                'pickup_mileage' => 50000,
                'pickup_fuel_level' => 90,
            ])
            ->assertOk();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/complete", [
                'return_mileage' => 50200,
                'return_fuel_level' => 80,
                'actual_return_datetime' => $pickup->copy()->addDay()->addHour()->toDateTimeString(),
            ])
            ->assertOk();

        $reservation = Reservation::find($id);

        // Contracted days stay billed: no automatic refunds at completion.
        $this->assertSame(3, (int) $reservation->rental_days);
        $this->assertEqualsWithDelta(1080.0, (float) $reservation->total_amount, 0.001);

        $this->assertDatabaseMissing('reservation_changes', [
            'reservation_id' => $id,
            'field_name' => 'rental_days',
        ]);
    }

    public function test_create_and_reprice_persist_rule_adjusted_totals(): void
    {
        $actor = $this->actor(['reservations.*', 'pricing.*']);
        $car = $this->car();

        $rule = PricingRule::factory()->create([
            'agency_id' => $this->agency->id,
            'adjustment_value' => 15,
        ]);

        $pickup = now()->addDay()->setTime(9, 0);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client(), [
                'pickup_datetime' => $pickup->toDateTimeString(),
                'expected_return_datetime' => $pickup->copy()->addDays(3)->toDateTimeString(),
            ]))
            ->json('id');

        // 3 days at 300 × 1.15 = 345 → subtotal 1035, tax 207, total 1242.
        $reservation = Reservation::find($id);
        $this->assertEqualsWithDelta(1035.0, (float) $reservation->subtotal, 0.001);
        $this->assertEqualsWithDelta(1242.0, (float) $reservation->total_amount, 0.001);
        $this->assertMoneyInvariants($reservation);

        // Rules are resolved at reprice time — the new rate lands on extend.
        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/pricing/rules/{$rule->id}", ['adjustment_value' => 20])
            ->assertOk();

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/extend", [
                'expected_return_datetime' => $pickup->copy()->addDays(5)->toDateTimeString(),
                'reason' => 'Longer stay at the new season rate',
            ]);

        $response->assertOk()->assertJsonPath('rental_days', 5);

        // 5 days at 300 × 1.20 = 360 → subtotal 1800, tax 360, total 2160.
        $reservation->refresh();
        $this->assertEqualsWithDelta(1800.0, (float) $reservation->subtotal, 0.001);
        $this->assertEqualsWithDelta(360.0, (float) $reservation->tax_amount, 0.001);
        $this->assertEqualsWithDelta(2160.0, (float) $reservation->total_amount, 0.001);
        $this->assertMoneyInvariants($reservation);
    }
}
