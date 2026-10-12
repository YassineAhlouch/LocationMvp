<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\AgencyPayment;
use App\Models\Currency;
use App\Models\PlatformAdmin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformAgencyPaymentsTest extends TestCase
{
    use RefreshDatabase;

    public function test_platform_can_list_agency_payments_with_agency(): void
    {
        $agency = Agency::factory()->create(['name' => 'Atlas Rentals']);
        AgencyPayment::factory()->create(['agency_id' => $agency->id, 'amount' => 1200]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/agency-payments')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.agency.name', 'Atlas Rentals')
            ->assertJsonPath('data.0.amount', fn ($value) => (float) $value === 1200.0);
    }

    public function test_list_can_be_filtered_by_status_and_agency(): void
    {
        $agency = Agency::factory()->create();
        $other = Agency::factory()->create();

        AgencyPayment::factory()->overdue()->create(['agency_id' => $agency->id]);
        AgencyPayment::factory()->paid()->create(['agency_id' => $agency->id]);
        AgencyPayment::factory()->create(['agency_id' => $other->id]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/agency-payments?status=overdue')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'overdue');

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/agency-payments?agency_id='.$other->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.agency.id', $other->id);
    }

    public function test_platform_can_create_an_invoice(): void
    {
        $agency = Agency::factory()->create();
        $currency = Currency::factory()->create(['code' => 'MAD', 'name' => 'Dirham', 'symbol' => 'DH']);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->postJson('/api/v1/platform/agency-payments', [
                'agency_id' => $agency->id,
                'currency_id' => $currency->id,
                'amount' => 1500,
                'period' => '2026-10',
                'due_date' => now()->addWeek()->toDateString(),
                'reference' => 'INV-0001',
            ])
            ->assertCreated()
            ->assertJsonPath('status', 'pending')
            ->assertJsonPath('amount', fn ($value) => (float) $value === 1500.0)
            ->assertJsonPath('period', '2026-10')
            ->assertJsonPath('currency.code', 'MAD');
    }

    public function test_invoice_requires_a_valid_agency_and_amount(): void
    {
        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->postJson('/api/v1/platform/agency-payments', [
                'agency_id' => 999,
                'amount' => 0,
                'due_date' => 'not-a-date',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['agency_id', 'due_date']);
    }

    public function test_platform_can_update_an_invoice(): void
    {
        $payment = AgencyPayment::factory()->create(['amount' => 100, 'notes' => null]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->patchJson("/api/v1/platform/agency-payments/{$payment->id}", [
                'amount' => 250,
                'notes' => 'Adjusted for extra seats',
            ])
            ->assertOk()
            ->assertJsonPath('amount', fn ($value) => (float) $value === 250.0)
            ->assertJsonPath('notes', 'Adjusted for extra seats');
    }

    public function test_platform_can_mark_an_invoice_paid(): void
    {
        $admin = PlatformAdmin::factory()->create();
        $payment = AgencyPayment::factory()->overdue()->create();

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/platform/agency-payments/{$payment->id}/pay")
            ->assertOk()
            ->assertJsonPath('status', 'paid')
            ->assertJsonPath('recorded_by.id', $admin->id);

        $this->assertNotNull($payment->fresh()->paid_at);
    }

    public function test_platform_can_revert_a_payment(): void
    {
        $payment = AgencyPayment::factory()->paid()->create([
            'recorded_by' => PlatformAdmin::factory(),
        ]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->postJson("/api/v1/platform/agency-payments/{$payment->id}/unpay")
            ->assertOk()
            ->assertJsonPath('status', 'pending')
            ->assertJsonPath('recorded_by', null);
    }

    public function test_platform_can_delete_an_invoice(): void
    {
        $payment = AgencyPayment::factory()->create();

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->deleteJson("/api/v1/platform/agency-payments/{$payment->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('agency_payments', ['id' => $payment->id]);
    }

    public function test_agency_resource_exposes_a_billing_summary(): void
    {
        $agency = Agency::factory()->create();
        AgencyPayment::factory()->overdue()->create(['agency_id' => $agency->id, 'amount' => 800]);
        AgencyPayment::factory()->create(['agency_id' => $agency->id, 'amount' => 200]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/agencies')
            ->assertOk()
            ->assertJsonPath('data.0.billing.outstanding_amount', fn ($value) => (float) $value === 1000.0)
            ->assertJsonPath('data.0.billing.has_overdue_payment', true);
    }

    public function test_dashboard_reports_billing_kpis(): void
    {
        $agency = Agency::factory()->create();
        AgencyPayment::factory()->overdue()->create(['agency_id' => $agency->id, 'amount' => 900]);
        AgencyPayment::factory()->paid()->create(['agency_id' => $agency->id, 'amount' => 100]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/dashboard/stats')
            ->assertOk()
            ->assertJsonPath('billing.outstanding_total', fn ($value) => (float) $value === 900.0)
            ->assertJsonPath('billing.overdue_agencies', 1);
    }
}
