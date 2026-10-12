<?php

namespace Tests\Feature;

use App\Enums\PaymentRecordStatus;
use App\Models\Agency;
use App\Models\Car;
use App\Models\Client;
use App\Models\Payment;
use App\Models\PlatformAdmin;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_stats_return_platform_wide_counts(): void
    {
        $active = Agency::factory()->create(['is_active' => true]);
        $inactive = Agency::factory()->create(['is_active' => false]);

        $user = User::factory()->create(['agency_id' => $active->id]);
        User::factory()->create(['agency_id' => $active->id]);

        $car = Car::factory()->create(['agency_id' => $active->id]);
        $client = Client::factory()->create(['agency_id' => $active->id]);

        $reservation = Reservation::factory()->create([
            'agency_id' => $active->id,
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
            'created_by' => $user->id,
            'total_amount' => 900,
        ]);

        Payment::factory()->create([
            'agency_id' => $active->id,
            'reservation_id' => $reservation->id,
            'created_by' => $user->id,
            'amount' => 500,
            'status' => PaymentRecordStatus::Paid,
        ]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/dashboard/stats')
            ->assertOk()
            ->assertJsonPath('agencies.total', 2)
            ->assertJsonPath('agencies.active', 1)
            ->assertJsonPath('agencies.inactive', 1)
            ->assertJsonPath('users', 2)
            ->assertJsonPath('cars', 1)
            ->assertJsonPath('clients', 1)
            ->assertJsonPath('reservations', 1)
            ->assertJsonPath('monthly_revenue', 500);
    }

    public function test_dashboard_stats_include_recent_agencies(): void
    {
        $agency = Agency::factory()->create(['name' => 'Agence Récente', 'city' => 'Marrakech']);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/dashboard/stats')
            ->assertOk()
            ->assertJsonCount(1, 'recent_agencies')
            ->assertJsonPath('recent_agencies.0.name', 'Agence Récente')
            ->assertJsonPath('recent_agencies.0.city', 'Marrakech');
    }
}
