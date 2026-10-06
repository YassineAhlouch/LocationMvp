<?php

namespace Tests\Feature;

use App\Enums\PaymentRecordStatus;
use App\Enums\PaymentStatus;
use App\Enums\ReservationStatus;
use App\Models\Agency;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentsTest extends TestCase
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

    private function reservation(array $attributes = []): Reservation
    {
        return Reservation::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'total_amount' => 900,
            'payment_status' => PaymentStatus::Unpaid,
        ], $attributes));
    }

    public function test_store_payment_derives_status_and_audits(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation();

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", [
                'amount' => 400,
                'method' => 'cash',
            ]);

        $response->assertCreated()
            ->assertJsonPath('reservation_id', $reservation->id)
            ->assertJsonPath('amount', 400)
            ->assertJsonPath('method', 'cash')
            ->assertJsonPath('status', 'paid')
            ->assertJsonPath('created_by.id', $actor->id);

        $this->assertDatabaseHas('payments', [
            'id' => $response->json('id'),
            'agency_id' => $this->agency->id,
            'created_by' => $actor->id,
        ]);

        $this->assertSame(PaymentStatus::Partial, $reservation->fresh()->payment_status);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $reservation->id,
            'field_name' => 'total_paid',
            'change_type' => 'payment',
            'old_value' => '0.00',
            'new_value' => '400.00',
            'reason' => 'Payment of 400.00 recorded (cash)',
            'created_by' => $actor->id,
        ]);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $reservation->id,
            'field_name' => 'payment_status',
            'change_type' => 'payment',
            'old_value' => 'unpaid',
            'new_value' => 'partial',
            'created_by' => $actor->id,
        ]);
    }

    public function test_accumulated_payments_reach_paid_status(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", ['amount' => 400, 'method' => 'cash'])
            ->assertCreated();

        $this->assertSame(PaymentStatus::Partial, $reservation->fresh()->payment_status);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", ['amount' => 500, 'method' => 'card'])
            ->assertCreated();

        $this->assertSame(PaymentStatus::Paid, $reservation->fresh()->payment_status);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $reservation->id,
            'field_name' => 'total_paid',
            'old_value' => '400.00',
            'new_value' => '900.00',
        ]);
    }

    public function test_overpayment_reads_as_paid_for_deposit_ledger(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation();

        // A deposit pushed past the invoice total still reads as settled —
        // the ledger counts money received, not what is owed.
        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", [
                'amount' => 1000,
                'method' => 'cash',
                'notes' => 'Caution deposit',
            ])
            ->assertCreated()
            ->assertJsonPath('notes', 'Caution deposit');

        $this->assertSame(PaymentStatus::Paid, $reservation->fresh()->payment_status);
    }

    public function test_pending_is_not_counted_until_confirmed(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation();

        $stored = $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", [
                'amount' => 400,
                'method' => 'transfer',
                'status' => 'pending',
            ]);

        $stored->assertCreated()->assertJsonPath('status', 'pending');

        $this->assertSame(PaymentStatus::Unpaid, $reservation->fresh()->payment_status);
        $this->assertDatabaseMissing('reservation_changes', [
            'reservation_id' => $reservation->id,
            'field_name' => 'total_paid',
        ]);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/payments/{$stored->json('id')}/confirm")
            ->assertOk()
            ->assertJsonPath('status', 'paid');

        $this->assertSame(PaymentStatus::Partial, $reservation->fresh()->payment_status);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $reservation->id,
            'field_name' => 'total_paid',
            'new_value' => '400.00',
            'reason' => 'Pending payment of 400.00 confirmed',
        ]);

        // paid rows never confirm a second time.
        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/payments/{$stored->json('id')}/confirm")
            ->assertStatus(422)
            ->assertJsonPath('code', 'invalid_payment_state')
            ->assertJsonPath('from', 'paid')
            ->assertJsonPath('to', 'paid');
    }

    public function test_refund_reverses_payment_and_recomputes(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation();

        $payment = $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", ['amount' => 900, 'method' => 'cash'])
            ->json('id');

        $this->assertSame(PaymentStatus::Paid, $reservation->fresh()->payment_status);

        // A refund demands a reason.
        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/payments/{$payment}/refund", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('reason');

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/payments/{$payment}/refund", ['reason' => 'Duplicate charge'])
            ->assertOk()
            ->assertJsonPath('status', 'refunded');

        $this->assertSame(PaymentStatus::Unpaid, $reservation->fresh()->payment_status);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $reservation->id,
            'field_name' => 'total_paid',
            'old_value' => '900.00',
            'new_value' => '0.00',
            'reason' => 'Duplicate charge',
        ]);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $reservation->id,
            'field_name' => 'payment_status',
            'old_value' => 'paid',
            'new_value' => 'unpaid',
            'reason' => 'Duplicate charge',
        ]);

        // Refunded is terminal.
        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/payments/{$payment}/refund", ['reason' => 'Again'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'invalid_payment_state')
            ->assertJsonPath('from', 'refunded');
    }

    public function test_partial_refund_keeps_remaining_balance_partial(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", ['amount' => 500, 'method' => 'cash'])
            ->assertCreated();

        $second = $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", ['amount' => 400, 'method' => 'card'])
            ->json('id');

        $this->assertSame(PaymentStatus::Paid, $reservation->fresh()->payment_status);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/payments/{$second}/refund", ['reason' => 'Card charged twice'])
            ->assertOk();

        $this->assertSame(PaymentStatus::Partial, $reservation->fresh()->payment_status);

        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $reservation->id,
            'field_name' => 'payment_status',
            'old_value' => 'paid',
            'new_value' => 'partial',
        ]);
    }

    public function test_store_validates_payment_input(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation();
        $url = "/api/v1/reservations/{$reservation->id}/payments";

        $this->actingAs($actor, 'sanctum')
            ->postJson($url, ['amount' => 0, 'method' => 'cash'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('amount');

        $this->actingAs($actor, 'sanctum')
            ->postJson($url, ['amount' => 100, 'method' => 'bitcoin'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('method');

        // Refunded is reachable only through the refund endpoint.
        $this->actingAs($actor, 'sanctum')
            ->postJson($url, ['amount' => 100, 'method' => 'cash', 'status' => 'refunded'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('status');

        $this->actingAs($actor, 'sanctum')
            ->postJson($url, ['method' => 'cash'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('amount');
    }

    public function test_endpoints_enforce_payment_permissions(): void
    {
        $reservation = $this->reservation();

        $viewer = $this->actor(['payments.view']);

        $this->actingAs($viewer, 'sanctum')
            ->getJson("/api/v1/reservations/{$reservation->id}/payments")
            ->assertOk();

        $this->actingAs($viewer, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", ['amount' => 100, 'method' => 'cash'])
            ->assertStatus(403)
            ->assertJsonPath('code', 'forbidden')
            ->assertJsonPath('permission', 'payments.create');

        $payment = Payment::factory()->create([
            'agency_id' => $this->agency->id,
            'reservation_id' => $reservation->id,
        ]);

        $this->actingAs($viewer, 'sanctum')
            ->postJson("/api/v1/payments/{$payment->id}/confirm")
            ->assertStatus(403)
            ->assertJsonPath('permission', 'payments.create');

        $this->actingAs($viewer, 'sanctum')
            ->postJson("/api/v1/payments/{$payment->id}/refund", ['reason' => 'Nope'])
            ->assertStatus(403)
            ->assertJsonPath('permission', 'payments.refund');

        // Can create and confirm, but money-out needs the refund verb.
        $cashier = $this->actor(['payments.create']);

        $this->actingAs($cashier, 'sanctum')
            ->postJson("/api/v1/payments/{$payment->id}/refund", ['reason' => 'Nope'])
            ->assertStatus(403)
            ->assertJsonPath('permission', 'payments.refund');

        $outsider = $this->actor(['reservations.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson("/api/v1/reservations/{$reservation->id}/payments")
            ->assertStatus(403)
            ->assertJsonPath('permission', 'payments.view');
    }

    public function test_endpoints_are_tenant_scoped(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation();

        $foreign = Reservation::factory()->create(['agency_id' => Agency::factory()]);

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/reservations/{$foreign->id}/payments")
            ->assertNotFound();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$foreign->id}/payments", ['amount' => 100, 'method' => 'cash'])
            ->assertNotFound();

        $foreignPayment = Payment::factory()->create(['agency_id' => Agency::factory()]);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/payments/{$foreignPayment->id}/confirm")
            ->assertNotFound();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/payments/{$foreignPayment->id}/refund", ['reason' => 'Nope'])
            ->assertNotFound();

        // Same agency, but the payment belongs to another reservation:
        // the nested pair must agree.
        $other = $this->reservation();
        $payment = Payment::factory()->create([
            'agency_id' => $this->agency->id,
            'reservation_id' => $other->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson("/api/v1/reservations/{$reservation->id}/payments/{$payment->id}")
            ->assertNotFound();
    }

    public function test_cancelled_reservation_rejects_new_payments(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation(['status' => ReservationStatus::Cancelled]);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", ['amount' => 100, 'method' => 'cash'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'reservation_not_editable')
            ->assertJsonPath('status', 'cancelled');
    }

    public function test_completed_reservation_still_accepts_payment(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation(['status' => ReservationStatus::Completed]);

        // Clients settle at dropoff — completion freezes pricing, not money.
        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", ['amount' => 900, 'method' => 'cash'])
            ->assertCreated();

        $this->assertSame(PaymentStatus::Paid, $reservation->fresh()->payment_status);
    }

    public function test_only_pending_payments_are_deletable(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation();

        $pending = Payment::factory()->create([
            'agency_id' => $this->agency->id,
            'reservation_id' => $reservation->id,
            'status' => PaymentRecordStatus::Pending,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson("/api/v1/reservations/{$reservation->id}/payments/{$pending->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('payments', ['id' => $pending->id]);

        $paid = Payment::factory()->create([
            'agency_id' => $this->agency->id,
            'reservation_id' => $reservation->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson("/api/v1/reservations/{$reservation->id}/payments/{$paid->id}")
            ->assertStatus(422)
            ->assertJsonPath('code', 'payment_not_deletable')
            ->assertJsonPath('status', 'paid');

        $this->assertDatabaseHas('payments', ['id' => $paid->id]);
    }

    public function test_index_lists_payments_newest_first(): void
    {
        $actor = $this->actor(['payments.*']);
        $reservation = $this->reservation();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", [
                'amount' => 100,
                'method' => 'cash',
                'payment_date' => now()->subDays(2)->toDateTimeString(),
            ])
            ->assertCreated();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/payments", [
                'amount' => 200,
                'method' => 'card',
            ])
            ->assertCreated();

        $response = $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/reservations/{$reservation->id}/payments");

        $response->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.amount', 200)
            ->assertJsonPath('0.created_by.id', $actor->id)
            ->assertJsonPath('1.amount', 100);
    }
}
