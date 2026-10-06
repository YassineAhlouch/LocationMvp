<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
use App\Enums\PaymentRecordStatus;
use App\Enums\PricingAdjustmentType;
use App\Enums\PricingRuleType;
use App\Enums\ReservationChangeType;
use App\Enums\ReservationStatus;
use App\Models\ActivityLog;
use App\Models\Agency;
use App\Models\Car;
use App\Models\Client;
use App\Models\Payment;
use App\Models\PricingRule;
use App\Models\Reservation;
use App\Models\ReservationChange;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityLogTest extends TestCase
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

    /**
     * @return array<string, mixed>
     */
    private function storePayload(Car $car, Client $client): array
    {
        $pickup = now()->addDay()->setTime(9, 0);

        return [
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
            'pickup_datetime' => $pickup->toDateTimeString(),
            'expected_return_datetime' => $pickup->copy()->addDays(4)->toDateTimeString(),
            'deposit_amount' => 1000,
        ];
    }

    public function test_login_and_logout_are_logged(): void
    {
        $user = $this->actor(['*']);

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
            'device_name' => 'phpunit',
        ])->assertOk();

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'auth',
            'action' => 'login',
            'entity_type' => User::class,
            'entity_id' => $user->id,
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
        ]);

        $token = $user->createToken('phpunit')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logged out successfully.');

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'auth',
            'action' => 'logout',
            'entity_type' => User::class,
            'entity_id' => $user->id,
        ]);
    }

    public function test_failed_login_is_logged_for_known_users_only(): void
    {
        $user = $this->actor(['*']);

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'not-the-password',
        ])->assertStatus(401)
            ->assertJsonPath('code', 'invalid_credentials');

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'auth',
            'action' => 'login_failed',
            'entity_type' => User::class,
            'entity_id' => $user->id,
        ]);

        // Unknown emails have no morph target — they are not logged.
        $this->postJson('/api/v1/auth/login', [
            'email' => 'nobody@location.ma',
            'password' => 'whatever',
        ])->assertStatus(401);

        $this->assertDatabaseCount('activity_logs', 1);
    }

    public function test_reservation_lifecycle_is_logged(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $client = $this->client();

        $created = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client));

        $created->assertCreated();
        $id = $created->json('id');
        $reservation = Reservation::findOrFail($id);

        $creation = ActivityLog::query()
            ->where('module', 'reservations')
            ->where('action', 'created')
            ->where('entity_id', $id)
            ->firstOrFail();

        $this->assertNotNull($creation->description);
        $this->assertStringContainsString($reservation->reservation_number, $creation->description);
        $this->assertSame('pending', $creation->new_values['status'] ?? null);
        $this->assertSame('1440.00', $creation->new_values['total_amount'] ?? null);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/confirm")
            ->assertOk();

        $confirmed = ActivityLog::query()
            ->where('module', 'reservations')
            ->where('action', 'confirmed')
            ->where('entity_id', $id)
            ->firstOrFail();

        $this->assertSame('pending', $confirmed->old_values['status']);
        $this->assertSame('confirmed', $confirmed->new_values['status']);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/cancel", ['reason' => 'Client postponed the trip'])
            ->assertOk();

        $cancelled = ActivityLog::query()
            ->where('module', 'reservations')
            ->where('action', 'cancelled')
            ->where('entity_id', $id)
            ->firstOrFail();

        $this->assertStringContainsString('Client postponed the trip', $cancelled->description);
    }

    public function test_failed_transition_leaves_no_activity_trace(): void
    {
        $actor = $this->actor(['reservations.*']);
        $reservation = Reservation::factory()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $this->car()->id,
            'primary_client_id' => $this->client()->id,
            'status' => ReservationStatus::Pending,
        ]);

        // pending → completed is not in the state machine.
        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/complete")
            ->assertStatus(422)
            ->assertJsonPath('code', 'invalid_transition');

        $this->assertDatabaseCount('activity_logs', 0);
    }

    public function test_payment_events_are_logged(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = Reservation::factory()->create([
            'agency_id' => $this->agency->id,
            'total_amount' => 900,
        ]);

        $stored = $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", [
                'amount' => 900,
                'method' => 'cash',
            ]);

        $stored->assertCreated();
        $paymentId = $stored->json('id');

        $recorded = ActivityLog::query()
            ->where('module', 'payments')
            ->where('action', 'recorded')
            ->where('entity_id', $paymentId)
            ->firstOrFail();

        $this->assertSame('900.00', $recorded->new_values['amount']);
        $this->assertSame('cash', $recorded->new_values['method']);
        $this->assertSame($actor->id, $recorded->user_id);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/payments/{$paymentId}/refund", ['reason' => 'Duplicate charge'])
            ->assertOk();

        $refunded = ActivityLog::query()
            ->where('module', 'payments')
            ->where('action', 'refunded')
            ->where('entity_id', $paymentId)
            ->firstOrFail();

        $this->assertSame('paid', $refunded->old_values['status']);
        $this->assertSame('refunded', $refunded->new_values['status']);
        $this->assertStringContainsString('Duplicate charge', $refunded->description);

        // A pending row that never landed is deleted, not refunded.
        $pending = Payment::factory()->create([
            'agency_id' => $this->agency->id,
            'reservation_id' => $reservation->id,
            'status' => PaymentRecordStatus::Pending,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson("/api/v1/reservations/{$reservation->id}/payments/{$pending->id}")
            ->assertNoContent();

        $deleted = ActivityLog::query()
            ->where('module', 'payments')
            ->where('action', 'deleted')
            ->where('entity_id', $pending->id)
            ->firstOrFail();

        $this->assertSame('pending', $deleted->old_values['status']);
    }

    public function test_pricing_rule_crud_is_logged(): void
    {
        $actor = $this->actor(['pricing.*']);

        $created = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/pricing/rules', [
                'name' => 'Summer high season',
                'rule_type' => PricingRuleType::Season->value,
                'starts_on' => '2026-07-01',
                'ends_on' => '2026-08-31',
                'adjustment_type' => PricingAdjustmentType::Percent->value,
                'adjustment_value' => 15,
            ]);

        $created->assertCreated();
        $ruleId = $created->json('id');

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'pricing',
            'action' => 'created',
            'entity_type' => PricingRule::class,
            'entity_id' => $ruleId,
            'user_id' => $actor->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/pricing/rules/{$ruleId}", ['adjustment_value' => 20])
            ->assertOk();

        $updated = ActivityLog::query()
            ->where('module', 'pricing')
            ->where('action', 'updated')
            ->where('entity_id', $ruleId)
            ->firstOrFail();

        $this->assertSame('15.00', $updated->old_values['adjustment_value']);
        $this->assertSame('20.00', $updated->new_values['adjustment_value']);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson("/api/v1/pricing/rules/{$ruleId}")
            ->assertNoContent();

        $deleted = ActivityLog::query()
            ->where('module', 'pricing')
            ->where('action', 'deleted')
            ->where('entity_id', $ruleId)
            ->firstOrFail();

        $this->assertSame('Summer high season', $deleted->old_values['name']);
    }

    public function test_update_and_extend_are_logged_with_field_diffs(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $client = $this->client();

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client))
            ->json('id');
        $oldPhone = $client->phone;

        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/reservations/{$id}", ['primary_driver_phone' => '999-999-999'])
            ->assertOk();

        $updated = ActivityLog::query()
            ->where('module', 'reservations')
            ->where('action', 'updated')
            ->where('entity_id', $id)
            ->orderByDesc('id')
            ->firstOrFail();

        $this->assertSame($oldPhone, $updated->old_values['primary_driver_phone']);
        $this->assertSame('999-999-999', $updated->new_values['primary_driver_phone']);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/extend", [
                'expected_return_datetime' => now()->addDays(6)->setTime(9, 0)->toDateTimeString(),
                'reason' => 'Client extended the stay',
            ])
            ->assertOk();

        $extended = ActivityLog::query()
            ->where('module', 'reservations')
            ->where('action', 'extended')
            ->where('entity_id', $id)
            ->firstOrFail();

        $this->assertStringContainsString('Client extended the stay', $extended->description);
        $this->assertArrayHasKey('expected_return_datetime', $extended->old_values);
        $this->assertArrayHasKey('total_amount', $extended->new_values);
    }

    public function test_activity_logs_index_enforces_permission_and_resources(): void
    {
        $actor = $this->actor(['activity_logs.view']);
        ActivityLog::factory()->create([
            'agency_id' => $this->agency->id,
            'user_id' => $actor->id,
            'module' => 'auth',
            'action' => 'login',
        ]);

        $response = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/activity-logs');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.module', 'auth')
            ->assertJsonPath('data.0.action', 'login')
            ->assertJsonPath('data.0.user.id', $actor->id)
            ->assertJsonPath('data.0.user.full_name', $actor->full_name);

        $outsider = $this->actor(['reservations.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/activity-logs')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'activity_logs.view');
    }

    public function test_activity_logs_filters_scope_the_feed(): void
    {
        $manager = $this->actor(['activity_logs.view']);
        $cashier = $this->actor(['activity_logs.view']);

        ActivityLog::factory()->create([
            'agency_id' => $this->agency->id,
            'user_id' => $cashier->id,
            'module' => 'payments',
            'action' => 'refunded',
            'created_at' => now()->subDays(3),
        ]);
        ActivityLog::factory()->create([
            'agency_id' => $this->agency->id,
            'user_id' => $manager->id,
            'module' => 'reservations',
            'action' => 'cancelled',
            'created_at' => now()->subDay(),
        ]);

        $moduleFiltered = $this->actingAs($manager, 'sanctum')
            ->getJson('/api/v1/activity-logs?module=payments');

        $moduleFiltered->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.action', 'refunded');

        $userFiltered = $this->actingAs($manager, 'sanctum')
            ->getJson("/api/v1/activity-logs?user_id={$manager->id}");

        $userFiltered->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.action', 'cancelled');

        // Date-only "to" is inclusive of the whole day.
        $dayFiltered = $this->actingAs($manager, 'sanctum')
            ->getJson('/api/v1/activity-logs?from='.now()->subDays(3)->toDateString().'&to='.now()->subDays(2)->toDateString());

        $dayFiltered->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.action', 'refunded');
    }

    public function test_activity_logs_are_tenant_scoped(): void
    {
        $actor = $this->actor(['activity_logs.view']);

        $foreign = ActivityLog::factory()->create(['agency_id' => Agency::factory()]);
        $own = ActivityLog::factory()->create([
            'agency_id' => $this->agency->id,
            'user_id' => $actor->id,
            'action' => 'created',
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/activity-logs')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $own->id);

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/activity-logs/{$foreign->id}")
            ->assertNotFound();

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/activity-logs/{$own->id}")
            ->assertOk();
    }

    public function test_reservation_changes_global_feed_is_scoped_and_filterable(): void
    {
        $actor = $this->actor(['reservations.*']);
        $car = $this->car();
        $client = $this->client();

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($car, $client))
            ->json('id');

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$id}/confirm")
            ->assertOk();

        // A foreign agency's change rows must stay invisible — the feed
        // scopes through the reservation, which carries the agency scope.
        $foreignReservation = Reservation::factory()->create(['agency_id' => Agency::factory()]);

        ReservationChange::factory()->create([
            'reservation_id' => $foreignReservation->id,
            'field_name' => 'status',
            'change_type' => ReservationChangeType::StatusChange->value,
            'old_value' => 'pending',
            'new_value' => 'cancelled',
            'created_by' => User::factory(),
        ]);

        $feed = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservation-changes');

        $feed->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.change_type', 'status_change');

        $statusOnly = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservation-changes?change_type=status_change');

        $statusOnly->assertOk()
            ->assertJsonCount(1, 'data');

        $outsider = $this->actor(['activity_logs.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/reservation-changes')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'reservations.view');
    }
}
