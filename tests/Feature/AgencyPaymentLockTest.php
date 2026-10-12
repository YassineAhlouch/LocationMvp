<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\AgencyPayment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * An agency whose subscription invoice is past due is read-only: writes are
 * rejected with 402 payment_required, reads (and signing out) still work. The
 * lock lifts the moment the invoice is marked paid.
 */
class AgencyPaymentLockTest extends TestCase
{
    use RefreshDatabase;

    public function test_agency_with_an_overdue_invoice_is_read_only(): void
    {
        $agency = Agency::factory()->create();
        $user = User::factory()->create(['agency_id' => $agency->id]);
        AgencyPayment::factory()->overdue()->create(['agency_id' => $agency->id]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/cars', [])
            ->assertStatus(402)
            ->assertJsonPath('code', 'payment_required');
    }

    public function test_reads_stay_available_while_locked(): void
    {
        $agency = Agency::factory()->create();
        $user = User::factory()->create(['agency_id' => $agency->id]);
        AgencyPayment::factory()->overdue()->create(['agency_id' => $agency->id]);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/subscription')
            ->assertOk()
            ->assertJsonPath('locked', true);
    }

    public function test_agency_can_still_sign_out_while_locked(): void
    {
        $agency = Agency::factory()->create();
        $user = User::factory()->create(['agency_id' => $agency->id]);
        AgencyPayment::factory()->overdue()->create(['agency_id' => $agency->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/auth/logout');

        $this->assertNotSame(402, $response->getStatusCode());
    }

    public function test_invoice_not_yet_due_does_not_lock_the_agency(): void
    {
        $agency = Agency::factory()->create();
        $user = User::factory()->create(['agency_id' => $agency->id]);
        AgencyPayment::factory()->create([
            'agency_id' => $agency->id,
            'due_date' => now()->addDays(3)->toDateString(),
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/cars', []);

        $this->assertNotSame(402, $response->getStatusCode());
    }

    public function test_paying_the_invoice_lifts_the_lock(): void
    {
        $agency = Agency::factory()->create();
        $user = User::factory()->create(['agency_id' => $agency->id]);
        $invoice = AgencyPayment::factory()->overdue()->create(['agency_id' => $agency->id]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/cars', [])
            ->assertStatus(402);

        $invoice->update(['paid_at' => now()]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/cars', []);

        $this->assertNotSame(402, $response->getStatusCode());
    }

    public function test_subscription_endpoint_summarises_the_billing_standing(): void
    {
        $agency = Agency::factory()->create();
        $user = User::factory()->create(['agency_id' => $agency->id]);
        AgencyPayment::factory()->overdue()->create(['agency_id' => $agency->id, 'amount' => 400]);
        AgencyPayment::factory()->create(['agency_id' => $agency->id, 'amount' => 600]);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/subscription')
            ->assertOk()
            ->assertJsonPath('locked', true)
            ->assertJsonPath('outstanding_amount', fn ($value) => (float) $value === 1000.0)
            ->assertJsonCount(2, 'invoices');
    }
}
