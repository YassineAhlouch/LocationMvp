<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
use App\Enums\ReservationStatus;
use App\Models\Agency;
use App\Models\Car;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\ReservationInspection;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReservationInspectionTest extends TestCase
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

    private function reservation(ReservationStatus $status, array $carAttributes = []): Reservation
    {
        $car = $this->car($carAttributes);

        return Reservation::factory()
            ->state(['status' => $status])
            ->create([
                'agency_id' => $this->agency->id,
                'car_id' => $car->id,
                'primary_client_id' => Client::factory()->create(['agency_id' => $this->agency->id])->id,
                'created_by' => User::factory(),
                'pickup_datetime' => now()->subDay(),
                'expected_return_datetime' => now()->addDays(3),
            ]);
    }

    public function test_activation_records_pickup_inspection_with_areas_and_photos(): void
    {
        Storage::fake('public');
        $actor = $this->actor(['reservations.*']);
        $reservation = $this->reservation(ReservationStatus::Confirmed);

        $this->actingAs($actor, 'sanctum')
            ->post("/api/v1/reservations/{$reservation->id}/activate", [
                'pickup_mileage' => 42000,
                'pickup_fuel_level' => 80,
                'inspection' => [
                    'condition_notes' => 'Clean body, small scratch on the rear door.',
                    'areas' => [
                        'front' => ['condition' => 'ok'],
                        'rear' => ['condition' => 'minor', 'notes' => 'Scratch on door'],
                    ],
                    'photos' => [
                        ['area' => 'front', 'file' => UploadedFile::fake()->image('front.jpg')],
                        ['area' => 'rear', 'file' => UploadedFile::fake()->image('rear.jpg')],
                    ],
                ],
            ])
            ->assertOk()
            ->assertJsonPath('status', 'active');

        $inspection = ReservationInspection::query()
            ->where('reservation_id', $reservation->id)
            ->where('type', 'pickup')
            ->first();

        $this->assertNotNull($inspection);
        $this->assertSame(42000, $inspection->mileage);
        $this->assertSame(80, $inspection->fuel_level);
        $this->assertSame('minor', $inspection->areas['rear']['condition']);
        $this->assertSame('Scratch on door', $inspection->areas['rear']['notes']);
        $this->assertCount(2, $inspection->photos);
        $this->assertNotNull($inspection->inspected_at);

        foreach ($inspection->photos as $photo) {
            Storage::disk('public')->assertExists(
                (string) preg_replace('#^/storage/#', '', $photo->image)
            );
        }
    }

    public function test_completion_records_return_inspection(): void
    {
        Storage::fake('public');
        $actor = $this->actor(['reservations.*']);
        $reservation = $this->reservation(ReservationStatus::Active, ['status' => CarStatus::Rented]);

        $this->actingAs($actor, 'sanctum')
            ->post("/api/v1/reservations/{$reservation->id}/complete", [
                'return_mileage' => 43000,
                'return_fuel_level' => 40,
                'inspection' => [
                    'condition_notes' => 'Returned with a chipped windscreen.',
                    'areas' => [
                        'front' => ['condition' => 'damage', 'notes' => 'Windscreen chip'],
                    ],
                    'photos' => [
                        ['area' => 'front', 'file' => UploadedFile::fake()->image('front.jpg')],
                    ],
                ],
            ])
            ->assertOk()
            ->assertJsonPath('status', 'completed');

        $inspection = ReservationInspection::query()
            ->where('reservation_id', $reservation->id)
            ->where('type', 'return')
            ->first();

        $this->assertNotNull($inspection);
        $this->assertSame(43000, $inspection->mileage);
        $this->assertSame('damage', $inspection->areas['front']['condition']);
        $this->assertCount(1, $inspection->photos);
    }

    public function test_transitions_without_an_inspection_store_nothing(): void
    {
        $actor = $this->actor(['reservations.*']);
        $reservation = $this->reservation(ReservationStatus::Confirmed);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/activate", [
                'pickup_mileage' => 50000,
            ])
            ->assertOk();

        $this->assertDatabaseCount('reservation_inspections', 0);
    }

    public function test_show_exposes_recorded_inspections_but_contract_keeps_them_internal(): void
    {
        Storage::fake('public');
        $actor = $this->actor(['reservations.*']);
        $reservation = $this->reservation(ReservationStatus::Confirmed);

        $this->actingAs($actor, 'sanctum')
            ->post("/api/v1/reservations/{$reservation->id}/activate", [
                'pickup_mileage' => 42000,
                'inspection' => [
                    'areas' => ['front' => ['condition' => 'ok']],
                    'photos' => [
                        ['area' => 'front', 'file' => UploadedFile::fake()->image('front.jpg')],
                    ],
                ],
            ])
            ->assertOk();

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/reservations/{$reservation->id}")
            ->assertOk()
            ->assertJsonPath('inspections.0.type', 'pickup')
            ->assertJsonPath('inspections.0.photos.0.area', 'front');

        // Inspections are internal: they must never reach the printed contract.
        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/reservations/{$reservation->id}/contract")
            ->assertOk()
            ->assertJsonMissingPath('reservation.inspections');
    }

    public function test_inspection_rejects_unknown_condition_and_area(): void
    {
        $actor = $this->actor(['reservations.*']);
        $reservation = $this->reservation(ReservationStatus::Confirmed);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$reservation->id}/activate", [
                'inspection' => [
                    'areas' => ['front' => ['condition' => 'exploded']],
                ],
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('inspection.areas.front.condition');

        $this->actingAs($actor, 'sanctum')
            ->post("/api/v1/reservations/{$reservation->id}/activate", [
                'inspection' => [
                    'photos' => [
                        ['area' => 'roof', 'file' => UploadedFile::fake()->image('roof.jpg')],
                    ],
                ],
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('inspection.photos.0.area');
    }
}
