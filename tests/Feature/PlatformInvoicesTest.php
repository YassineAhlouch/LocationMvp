<?php

namespace Tests\Feature;

use App\Enums\PaymentRecordStatus;
use App\Enums\PaymentStatus;
use App\Models\Agency;
use App\Models\Car;
use App\Models\Client;
use App\Models\Payment;
use App\Models\PlatformAdmin;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformInvoicesTest extends TestCase
{
    use RefreshDatabase;

    public function test_platform_can_list_invoices_within_one_agency(): void
    {
        $first = Agency::factory()->create(['name' => 'Agence A']);
        $second = Agency::factory()->create(['name' => 'Agence B']);

        $car = Car::factory()->create(['agency_id' => $first->id]);
        $client = Client::factory()->create(['agency_id' => $first->id]);

        Reservation::factory()->create([
            'agency_id' => $first->id,
            'reservation_number' => 'RES-111111',
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
            'total_amount' => 900,
        ]);
        Reservation::factory()->create([
            'agency_id' => $second->id,
            'reservation_number' => 'RES-222222',
            'total_amount' => 450,
        ]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson("/api/v1/platform/invoices?agency_id={$first->id}")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.reservation_number', 'RES-111111')
            ->assertJsonPath('data.0.agency.id', $first->id)
            ->assertJsonPath('data.0.agency.name', 'Agence A');
    }

    public function test_invoice_payload_contains_ledger_and_balance(): void
    {
        $agency = Agency::factory()->create(['name' => 'Agence A']);
        $car = Car::factory()->create(['agency_id' => $agency->id]);
        $client = Client::factory()->create(['agency_id' => $agency->id]);

        $reservation = Reservation::factory()->create([
            'agency_id' => $agency->id,
            'reservation_number' => 'RES-333333',
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
            'total_amount' => 900,
            'payment_status' => PaymentStatus::Partial,
        ]);

        Payment::factory()->create([
            'agency_id' => $agency->id,
            'reservation_id' => $reservation->id,
            'amount' => 300,
            'status' => PaymentRecordStatus::Paid,
        ]);
        Payment::factory()->create([
            'agency_id' => $agency->id,
            'reservation_id' => $reservation->id,
            'amount' => 600,
            'status' => PaymentRecordStatus::Pending,
        ]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/invoices')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.total_amount', 900)
            ->assertJsonPath('data.0.paid_amount', 300)
            ->assertJsonPath('data.0.balance_amount', 600)
            ->assertJsonPath('data.0.payment_status', 'partial')
            ->assertJsonCount(2, 'data.0.payments')
            ->assertJsonPath('data.0.payments.0.status', 'paid')
            ->assertJsonPath('data.0.primary_client.id', $client->id)
            ->assertJsonPath('data.0.car.id', $car->id);
    }

    public function test_invoices_can_be_filtered_by_payment_status(): void
    {
        $agency = Agency::factory()->create();

        Reservation::factory()->create([
            'agency_id' => $agency->id,
            'reservation_number' => 'RES-PAID-01',
            'payment_status' => PaymentStatus::Paid,
        ]);
        Reservation::factory()->create([
            'agency_id' => $agency->id,
            'reservation_number' => 'RES-OPEN-01',
            'payment_status' => PaymentStatus::Unpaid,
        ]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/invoices?payment_status=paid')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.reservation_number', 'RES-PAID-01');
    }

    public function test_invoices_can_be_searched_by_reservation_number(): void
    {
        $agency = Agency::factory()->create();

        Reservation::factory()->create([
            'agency_id' => $agency->id,
            'reservation_number' => 'RES-SEARCH-ME',
        ]);
        Reservation::factory()->create([
            'agency_id' => $agency->id,
            'reservation_number' => 'RES-OTHER',
        ]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/invoices?q=SEARCH')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.reservation_number', 'RES-SEARCH-ME');
    }

    public function test_invoice_agency_filter_validates_existing_agency(): void
    {
        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/invoices?agency_id=999999')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['agency_id']);
    }
}
