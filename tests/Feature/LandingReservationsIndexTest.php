<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
use App\Models\Agency;
use App\Models\Car;
use App\Models\Currency;
use App\Models\LandingReservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandingReservationsIndexTest extends TestCase
{
    use RefreshDatabase;

    private Agency $agency;

    protected function setUp(): void
    {
        parent::setUp();

        $this->agency = Agency::factory()->create([
            'currency_id' => Currency::factory()->create(['code' => 'MAD'])->id,
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

    private function lead(array $attributes = []): LandingReservation
    {
        $car = Car::factory()->create([
            'agency_id' => $this->agency->id,
            'status' => CarStatus::Available,
        ]);

        return LandingReservation::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'status' => 'new',
        ], $attributes));
    }

    public function test_the_landing_pipeline_lists_agency_leads_with_their_car(): void
    {
        $actor = $this->actor(['reservations.view']);
        $this->lead([
            'full_name' => 'Youssef Bennis',
            'phone' => '+212 6 11 22 33 44',
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/landing-reservations')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.full_name', 'Youssef Bennis')
            ->assertJsonPath('data.0.phone', '+212 6 11 22 33 44')
            ->assertJsonPath('data.0.status', 'new');
    }

    public function test_other_agencies_leads_stay_invisible(): void
    {
        $actor = $this->actor(['reservations.view']);
        $this->lead();

        $other = Agency::factory()->create([
            'currency_id' => Currency::factory()->create(['code' => 'EUR'])->id,
        ]);
        $otherCar = Car::factory()->create(['agency_id' => $other->id]);
        LandingReservation::factory()->create([
            'agency_id' => $other->id,
            'car_id' => $otherCar->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/landing-reservations')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    public function test_leads_can_be_searched_and_filtered(): void
    {
        $actor = $this->actor(['reservations.view']);
        $this->lead(['full_name' => 'Amina Kadiri', 'phone' => '+212 6 00 11 22 33']);
        $this->lead(['full_name' => 'Hicham Alaoui', 'status' => 'contacted']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/landing-reservations?q=Amina')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.full_name', 'Amina Kadiri');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/landing-reservations?status=contacted')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.full_name', 'Hicham Alaoui');
    }

    public function test_the_empty_car_of_a_deleted_vehicle_still_shows(): void
    {
        $actor = $this->actor(['reservations.view']);
        $this->lead(['car_id' => null]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/landing-reservations')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.car', null);
    }

    public function test_listing_requires_the_reservations_permission(): void
    {
        $actor = $this->actor(['fleet.view']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/landing-reservations')
            ->assertForbidden();
    }

    public function test_the_lead_status_moves_through_the_pipeline(): void
    {
        $actor = $this->actor(['reservations.view', 'reservations.update']);
        $lead = $this->lead();

        $this->actingAs($actor, 'sanctum')
            ->putJson("/api/v1/landing-reservations/{$lead->id}/status", [
                'status' => 'contacted',
            ])
            ->assertOk()
            ->assertJsonPath('status', 'contacted');

        $this->assertDatabaseHas('landing_reservations', [
            'id' => $lead->id,
            'status' => 'contacted',
        ]);
    }

    public function test_terminal_leads_cannot_move_again(): void
    {
        $actor = $this->actor(['reservations.view', 'reservations.update']);
        $lead = $this->lead(['status' => 'converted']);

        $this->actingAs($actor, 'sanctum')
            ->putJson("/api/v1/landing-reservations/{$lead->id}/status", [
                'status' => 'contacted',
            ])
            ->assertStatus(422);
    }

    public function test_invalid_status_values_are_rejected(): void
    {
        $actor = $this->actor(['reservations.view', 'reservations.update']);
        $lead = $this->lead(['status' => 'rejected']);

        $this->actingAs($actor, 'sanctum')
            ->putJson("/api/v1/landing-reservations/{$lead->id}/status", [
                'status' => 'whatever',
            ])
            ->assertStatus(422);

        $this->assertDatabaseHas('landing_reservations', [
            'id' => $lead->id,
            'status' => 'rejected',
        ]);
    }

    public function test_other_agencies_leads_cannot_be_updated(): void
    {
        $actor = $this->actor(['reservations.view', 'reservations.update']);

        $other = Agency::factory()->create([
            'currency_id' => Currency::factory()->create(['code' => 'EUR'])->id,
        ]);
        $otherCar = Car::factory()->create(['agency_id' => $other->id]);
        $lead = LandingReservation::factory()->create([
            'agency_id' => $other->id,
            'car_id' => $otherCar->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->putJson("/api/v1/landing-reservations/{$lead->id}/status", [
                'status' => 'contacted',
            ])
            ->assertNotFound();
    }

    public function test_updating_requires_the_update_permission(): void
    {
        $actor = $this->actor(['reservations.view']);
        $lead = $this->lead();

        $this->actingAs($actor, 'sanctum')
            ->putJson("/api/v1/landing-reservations/{$lead->id}/status", [
                'status' => 'contacted',
            ])
            ->assertForbidden();
    }
}
