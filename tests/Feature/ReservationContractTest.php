<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarCategory;
use App\Models\CarModel;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationContractTest extends TestCase
{
    use RefreshDatabase;

    private Agency $agency;

    protected function setUp(): void
    {
        parent::setUp();

        $this->agency = Agency::factory()->create([
            'daily_mileage_allowance' => 250,
            'extra_mileage_fee_per_km' => 1,
        ]);
    }

    private function actor(array $permissions): User
    {
        $role = Role::factory()->create(['permissions' => $permissions]);

        return User::factory()->create([
            'agency_id' => $this->agency->id,
            'role_id' => $role->id,
        ]);
    }

    private function car(): Car
    {
        $brand = Brand::factory()->create();
        $model = CarModel::factory()->create(['brand_id' => $brand->id]);

        return Car::factory()->create([
            'agency_id' => $this->agency->id,
            'brand_id' => $brand->id,
            'model_id' => $model->id,
            'category_id' => CarCategory::factory()->create()->id,
        ]);
    }

    private function reservation(array $attributes = []): Reservation
    {
        return Reservation::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'car_id' => $this->car()->id,
            'primary_client_id' => Client::factory()->create([
                'agency_id' => $this->agency->id,
            ])->id,
        ], $attributes));
    }

    public function test_contract_requires_the_view_permission(): void
    {
        $reservation = $this->reservation();
        $outsider = $this->actor(['fleet.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson("/api/v1/reservations/{$reservation->id}/contract")
            ->assertStatus(403);
    }

    public function test_contract_returns_the_document_payload_with_mileage_math(): void
    {
        $actor = $this->actor(['reservations.view']);
        $client = Client::factory()->create([
            'agency_id' => $this->agency->id,
            'address' => 'Rue de la Liberté',
            'cin' => 'BH123456',
            'driving_license_number' => 'P220685',
        ]);

        $reservation = Reservation::factory()->completed()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $this->car()->id,
            'primary_client_id' => $client->id,
            'created_by' => $actor->id,
            'rental_days' => 3,
            'pickup_mileage' => 50000,
            'return_mileage' => 51200,
        ]);

        Payment::factory()->create([
            'agency_id' => $this->agency->id,
            'reservation_id' => $reservation->id,
            'created_by' => $actor->id,
            'amount' => 500,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/reservations/{$reservation->id}/contract")
            ->assertOk()
            ->assertJsonPath('reservation.id', $reservation->id)
            ->assertJsonPath('reservation.reservation_number', $reservation->reservation_number)
            ->assertJsonPath('agency.id', $this->agency->id)
            ->assertJsonPath('agency.daily_mileage_allowance', 250)
            ->assertJsonPath('agency.extra_mileage_fee_per_km', 1)
            ->assertJsonPath('agency.invoice_template.slug', 'classic')
            ->assertJsonPath('car.registration_number', $reservation->car->registration_number)
            ->assertJsonPath('primary_client.id', $client->id)
            ->assertJsonPath('primary_client.address', 'Rue de la Liberté')
            ->assertJsonPath('primary_client.driving_license_number', 'P220685')
            ->assertJsonCount(1, 'payments')
            ->assertJsonPath('payments.0.amount', 500)
            ->assertJsonPath('mileage.distance', 1200)
            ->assertJsonPath('mileage.allowance', 750)
            ->assertJsonPath('mileage.excess', 450)
            ->assertJsonPath('mileage.extra_fee', 450)
            ->assertJsonPath('mileage.daily_allowance', 250)
            ->assertJsonPath('mileage.fee_per_km', 1);
    }

    public function test_mileage_distance_is_null_while_the_car_is_still_out(): void
    {
        $actor = $this->actor(['reservations.view']);
        $reservation = $this->reservation(['rental_days' => 3]);

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/reservations/{$reservation->id}/contract")
            ->assertOk()
            ->assertJsonPath('mileage.distance', null)
            ->assertJsonPath('mileage.allowance', 750)
            ->assertJsonPath('mileage.excess', 0)
            ->assertJsonPath('mileage.extra_fee', 0);
    }

    public function test_contract_is_scoped_to_the_actors_agency(): void
    {
        $actor = $this->actor(['reservations.view']);

        $otherAgency = Agency::factory()->create();
        $foreign = Reservation::factory()->create([
            'agency_id' => $otherAgency->id,
            'car_id' => Car::factory()->create([
                'agency_id' => $otherAgency->id,
            ])->id,
            'primary_client_id' => Client::factory()->create([
                'agency_id' => $otherAgency->id,
            ])->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/reservations/{$foreign->id}/contract")
            ->assertStatus(404);
    }

    public function test_agency_endpoint_returns_the_authenticated_users_agency(): void
    {
        $actor = $this->actor([]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/agency')
            ->assertOk()
            ->assertJsonPath('id', $this->agency->id)
            ->assertJsonPath('name', $this->agency->name)
            ->assertJsonPath('daily_mileage_allowance', 250)
            ->assertJsonPath('extra_mileage_fee_per_km', 1)
            ->assertJsonPath('invoice_template.slug', 'classic');
    }
}
