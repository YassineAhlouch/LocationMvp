<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\Car;
use App\Models\Currency;
use App\Models\QrCode;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QrCodeManagementTest extends TestCase
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

    private function car(array $attributes = []): Car
    {
        return Car::factory()->create(array_merge(['agency_id' => $this->agency->id], $attributes));
    }

    public function test_the_qr_catalog_lists_every_poster_with_its_fleet(): void
    {
        $actor = $this->actor(['fleet.view']);
        $car = $this->car();
        $qr = QrCode::factory()->create(['agency_id' => $this->agency->id, 'name' => 'Showroom']);
        $qr->cars()->sync([$car->id]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/qr-codes')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.name', 'Showroom')
            ->assertJsonPath('0.slug', 'showroom')
            ->assertJsonPath('0.cars.0.slug', $car->slug);
    }

    public function test_creating_a_qr_derives_the_slug_from_the_name(): void
    {
        $actor = $this->actor(['fleet.create']);
        $car = $this->car();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/qr-codes', ['name' => 'Showroom Parking', 'car_ids' => [$car->id]])
            ->assertCreated()
            ->assertJsonPath('name', 'Showroom Parking')
            ->assertJsonPath('slug', 'showroom-parking')
            ->assertJsonCount(1, 'cars');

        $qr = QrCode::query()->sole();
        $this->assertSame([$car->id], $qr->cars->modelKeys());
    }

    public function test_creating_a_qr_requires_a_name_and_at_least_one_car(): void
    {
        $actor = $this->actor(['fleet.create']);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/qr-codes', ['name' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'car_ids']);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/qr-codes', [
                'name' => 'Empty poster',
                'car_ids' => [9_999_999],
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['car_ids.0']);
    }

    public function test_a_poster_cannot_list_a_car_from_another_agency(): void
    {
        $actor = $this->actor(['fleet.create']);
        $outsider = Car::factory()->create();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/qr-codes', ['name' => 'Poster', 'car_ids' => [$outsider->id]])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['car_ids.0']);
    }

    public function test_slug_conflicts_are_resolved_with_a_suffix(): void
    {
        $actor = $this->actor(['fleet.create']);
        $car = $this->car();
        QrCode::factory()->create(['agency_id' => $this->agency->id, 'name' => 'Showroom']);

        $second = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/qr-codes', ['name' => 'Showroom', 'car_ids' => [$car->id]])
            ->assertCreated()
            ->assertJsonPath('slug', 'showroom-2');

        $this->assertNotSame(
            QrCode::query()->firstOrFail()->slug,
            $second->json('slug'),
        );
    }

    public function test_renaming_a_qr_re_derives_its_slug(): void
    {
        $actor = $this->actor(['fleet.update']);
        $qr = QrCode::factory()->create(['agency_id' => $this->agency->id, 'name' => 'Showroom']);

        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/qr-codes/{$qr->id}", ['name' => 'Airport Desk'])
            ->assertOk()
            ->assertJsonPath('name', 'Airport Desk')
            ->assertJsonPath('slug', 'airport-desk');
    }

    public function test_updating_only_the_fleet_keeps_the_printed_link(): void
    {
        $actor = $this->actor(['fleet.update']);
        $qr = QrCode::factory()->create(['agency_id' => $this->agency->id, 'name' => 'Showroom']);
        $qr->cars()->sync([$this->car()->id]);

        $newFleet = $this->car()->id;

        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/qr-codes/{$qr->id}", ['car_ids' => [$newFleet]])
            ->assertOk()
            ->assertJsonPath('slug', 'showroom');

        $this->assertSame([$newFleet], $qr->refresh()->cars->modelKeys());
    }

    public function test_a_qr_is_deleted_with_its_poster_links(): void
    {
        $actor = $this->actor(['fleet.delete']);
        $qr = QrCode::factory()->create(['agency_id' => $this->agency->id, 'name' => 'Departure']);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson("/api/v1/qr-codes/{$qr->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('qr_codes', ['id' => $qr->id]);
    }

    public function test_qr_routes_require_the_fleet_permissions(): void
    {
        $viewer = $this->actor(['fleet.view']);

        $this->actingAs($viewer, 'sanctum')
            ->postJson('/api/v1/qr-codes', ['name' => 'Poster', 'car_ids' => [$this->car()->id]])
            ->assertForbidden()
            ->assertJsonPath('permission', 'fleet.create');

        $updater = $this->actor(['fleet.update']);
        $qr = QrCode::factory()->create(['agency_id' => $this->agency->id, 'name' => 'Poster']);

        $this->actingAs($viewer, 'sanctum')
            ->deleteJson("/api/v1/qr-codes/{$qr->id}")
            ->assertForbidden()
            ->assertJsonPath('permission', 'fleet.delete');

        $this->actingAs($updater, 'sanctum')
            ->patchJson("/api/v1/qr-codes/{$qr->id}", ['name' => 'Renamed'])
            ->assertOk();
    }
}
