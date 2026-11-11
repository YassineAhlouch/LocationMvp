<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarModel;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\DatabaseNotification;
use Tests\TestCase;

class FleetAlertsTest extends TestCase
{
    use RefreshDatabase;

    private Agency $agency;

    protected function setUp(): void
    {
        parent::setUp();

        $this->agency = Agency::factory()->create();
    }

    private function user(array $permissions): User
    {
        $role = Role::factory()->create(['permissions' => $permissions]);

        return User::factory()->create([
            'agency_id' => $this->agency->id,
            'role_id' => $role->id,
        ]);
    }

    private function car(array $attributes = []): Car
    {
        $brand = Brand::factory()->create(['name' => 'Dacia']);
        $model = CarModel::factory()->create(['brand_id' => $brand->id, 'name' => 'Logan']);

        return Car::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'brand_id' => $brand->id,
            'model_id' => $model->id,
            'registration_number' => '12345-A-6',
        ], $attributes));
    }

    private function runSweep(): void
    {
        $this->artisan('fleet:expiry-alerts')->assertSuccessful();
    }

    public function test_insurance_sweep_alerts_fleet_holders_once_per_stage(): void
    {
        $manager = $this->user(['fleet.update']);
        $outsiderAgency = Agency::factory()->create();
        $foreignManager = User::factory()->create([
            'agency_id' => $outsiderAgency->id,
            'role_id' => Role::factory()->create(['permissions' => ['*']])->id,
        ]);
        $bystander = $this->user(['clients.view']);
        $expiry = today()->addDays(10);
        $this->car(['insurance_expiry_date' => $expiry]);

        $this->runSweep();

        $alert = $manager->notifications()->where('type', 'car_insurance')->first();
        $this->assertNotNull($alert);
        $this->assertSame(10, $alert->data['days_left']);
        $this->assertSame('expiring', $alert->data['stage']);
        $this->assertSame('Dacia Logan', $alert->data['car_label']);
        $this->assertSame('12345-A-6', $alert->data['registration_number']);
        $this->assertSame($expiry->toDateString(), $alert->data['expiry_date']);

        // Replay without any change: the same stage is never re-sent.
        $this->runSweep();
        $this->assertSame(1, $manager->notifications()->where('type', 'car_insurance')->count());

        // Inside the urgent window the reminder re-arms.
        Car::query()->update(['insurance_expiry_date' => today()->addDays(3)]);
        $this->runSweep();
        $this->assertSame(2, $manager->notifications()->where('type', 'car_insurance')->count());
        $this->assertSame(3, $manager->notifications()->where('type', 'car_insurance')->where('data->stage', 'urgent')->first()->data['days_left']);

        // Past the date itself: one final expired alert, days gone negative.
        Car::query()->update(['insurance_expiry_date' => today()->subDays(5)]);
        $this->runSweep();
        $this->assertSame(3, $manager->notifications()->where('type', 'car_insurance')->count());
        $this->assertSame(
            -5,
            $manager->notifications()->where('type', 'car_insurance')->where('data->stage', 'expired')->first()->data['days_left'],
        );

        // Only the people who can act on the fleet, and only in the car's
        // agency, are told.
        $this->assertSame(3, DatabaseNotification::query()->where('type', 'car_insurance')->count());
        $this->assertSame(0, $foreignManager->notifications()->count());
        $this->assertSame(0, $bystander->notifications()->count());
    }

    public function test_inspection_sweep_alerts_fleet_holders(): void
    {
        $manager = $this->user(['fleet.update']);
        $this->car(['technical_inspection_expiry' => today()->addDays(21)]);

        $this->runSweep();

        $alert = $manager->notifications()->where('type', 'car_inspection')->first();
        $this->assertNotNull($alert);
        $this->assertSame(21, $alert->data['days_left']);
        $this->assertSame('expiring', $alert->data['stage']);
    }

    public function test_far_future_documents_raise_no_alert(): void
    {
        $manager = $this->user(['fleet.update']);
        $this->car([
            'insurance_expiry_date' => today()->addDays(180),
            'technical_inspection_expiry' => today()->addYear(),
        ]);

        $this->runSweep();

        $this->assertSame(0, $manager->notifications()->count());
    }

    public function test_insurance_expense_updates_car_and_resolves_alerts(): void
    {
        $actor = $this->user(['expenses.create']);
        $manager = $this->user(['fleet.update']);
        $car = $this->car(['insurance_expiry_date' => today()->addDays(5)]);

        $this->runSweep();
        $this->assertSame(1, $manager->notifications()->where('type', 'car_insurance')->count());

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/expenses', [
                'car_id' => $car->id,
                'type' => 'insurance',
                'title' => 'Assurance annuelle',
                'amount' => 3500,
                'vendor' => 'Wafa Assurance',
                'due_date' => today()->addDays(400)->toDateString(),
            ])
            ->assertCreated();

        $car->refresh();
        $this->assertSame(today()->addDays(400)->toDateString(), $car->insurance_expiry_date->toDateString());
        $this->assertSame('Wafa Assurance', $car->insurance_company);

        // A forward renewal resolves the pending alert rows…
        $this->assertNotNull(
            DatabaseNotification::query()
                ->where('type', 'car_insurance')
                ->where('data->car_id', $car->id)
                ->first()
                ->read_at,
        );

        // …and the sweep stays silent: the new date is outside the window.
        $this->runSweep();
        $this->assertSame(1, $manager->notifications()->where('type', 'car_insurance')->count());
    }

    public function test_non_insurance_expenses_do_not_touch_car_documents(): void
    {
        $actor = $this->user(['expenses.create']);
        $car = $this->car(['insurance_expiry_date' => today()->addDays(30)]);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/expenses', [
                'car_id' => $car->id,
                'type' => 'maintenance',
                'title' => 'Vidange',
                'amount' => 600,
                'vendor' => 'Garage Atlas',
                'due_date' => today()->addDays(90)->toDateString(),
            ])
            ->assertCreated();

        $this->assertSame(today()->addDays(30)->toDateString(), $car->refresh()->insurance_expiry_date->toDateString());
    }

    public function test_inspection_expense_sets_next_inspection_date(): void
    {
        $actor = $this->user(['expenses.create']);
        $car = $this->car();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/expenses', [
                'car_id' => $car->id,
                'type' => 'inspection',
                'title' => 'Visite technique',
                'amount' => 250,
                'due_date' => today()->addDays(365)->toDateString(),
            ])
            ->assertCreated();

        $this->assertSame(
            today()->addDays(365)->toDateString(),
            $car->refresh()->technical_inspection_expiry->toDateString(),
        );
    }

    public function test_low_fuel_return_alerts_fleet_holders_except_the_actor(): void
    {
        $actor = $this->user(['reservations.complete']);
        $manager = $this->user(['fleet.update']);
        $client = Client::factory()->create(['agency_id' => $this->agency->id]);
        $car = $this->car(['current_fuel_level' => 100]);
        $reservation = Reservation::factory()->active()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/complete", ['return_fuel_level' => 15])
            ->assertJsonPath('status', 'completed');

        // The return syncs the car's tank…
        $this->assertSame(15, $car->refresh()->current_fuel_level);

        // …and raises the alert to fleet holders, excluding the actor.
        $alert = $manager->notifications()->where('type', 'car_fuel')->first();
        $this->assertNotNull($alert);
        $this->assertSame(15, $alert->data['fuel_level']);
        $this->assertSame($reservation->reservation_number, $alert->data['reservation_number']);
        $this->assertSame('Dacia Logan', $alert->data['car_label']);
        $this->assertSame(0, $actor->notifications()->count());
    }

    public function test_polling_the_badge_raises_the_alert_without_cron(): void
    {
        $manager = $this->user(['fleet.update', 'notifications.view']);
        $this->car(['insurance_expiry_date' => today()->addDays(12)]);

        // No cron worker anywhere: the badge poll itself keeps the alerts
        // fresh (cached, one sweep per agency per window).
        $this->actingAs($manager, 'sanctum')
            ->getJson('/api/v1/notifications/unread-count')
            ->assertOk();

        $this->assertSame(1, $manager->notifications()->where('type', 'car_insurance')->count());

        $this->actingAs($manager, 'sanctum')
            ->getJson('/api/v1/notifications/unread-count')
            ->assertOk();

        $this->assertSame(1, $manager->notifications()->where('type', 'car_insurance')->count());
    }

    public function test_normal_fuel_return_raises_no_alert(): void
    {
        $actor = $this->user(['reservations.complete']);
        $manager = $this->user(['fleet.update']);
        $client = Client::factory()->create(['agency_id' => $this->agency->id]);
        $car = $this->car();
        $reservation = Reservation::factory()->active()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/complete", ['return_fuel_level' => 75])
            ->assertJsonPath('status', 'completed');

        $this->assertSame(75, $car->refresh()->current_fuel_level);
        $this->assertSame(0, $manager->notifications()->count());
    }
}
