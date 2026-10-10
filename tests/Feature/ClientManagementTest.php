<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
use App\Enums\ClientSource;
use App\Enums\ClientStatus;
use App\Models\ActivityLog;
use App\Models\Agency;
use App\Models\Car;
use App\Models\Client;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientManagementTest extends TestCase
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

    private function client(array $attributes = []): Client
    {
        return Client::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
        ], $attributes));
    }

    private function car(): Car
    {
        return Car::factory()->create([
            'agency_id' => $this->agency->id,
            'daily_price' => 300,
            'status' => CarStatus::Available,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function storePayload(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Youssef',
            'last_name' => 'Amrani',
            'phone' => '0612345678',
            'cin' => 'CIN-A1B2C3',
            'driving_license_number' => 'DL-A1B2C3',
        ], $overrides);
    }

    public function test_index_requires_permission_and_returns_paginated_resource(): void
    {
        $outsider = $this->actor(['reservations.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/clients')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'clients.view');

        $actor = $this->actor(['clients.view']);
        $this->client(['first_name' => 'Nadia', 'last_name' => 'Fassi', 'phone' => '0600000001']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/clients')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.full_name', 'Nadia Fassi')
            ->assertJsonPath('data.0.phone', '0600000001')
            ->assertJsonPath('data.0.status', 'normal')
            ->assertJsonPath('data.0.bookings_count', 0)
            ->assertJsonPath('meta.total', 1);
    }

    public function test_index_is_tenant_scoped(): void
    {
        $actor = $this->actor(['clients.view']);
        $foreign = Client::factory()->create([
            'agency_id' => Agency::factory(),
            'first_name' => 'Intruder',
            'last_name' => 'Foreign',
        ]);
        $own = $this->client(['first_name' => 'Karim', 'last_name' => 'Own']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/clients')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $own->id);

        // The foreign client is 404 on the detail route too (bind is scoped).
        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/clients/{$foreign->id}")
            ->assertNotFound();
    }

    public function test_search_finds_clients_by_name_phone_and_cin(): void
    {
        $actor = $this->actor(['clients.view']);
        $this->client(['first_name' => 'Youssef', 'last_name' => 'Amrani', 'phone' => '0612345678', 'cin' => 'CIN-XYZ-1']);
        $benali = $this->client(['first_name' => 'Hassan', 'last_name' => 'Benali', 'phone' => '0698765432', 'cin' => 'CIN-ABC-2']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/clients?q=Amrani')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.last_name', 'Amrani');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/clients?q=98765432')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $benali->id);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/clients?q=CIN-ABC')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $benali->id);
    }

    public function test_filters_and_sorting_are_supported(): void
    {
        $actor = $this->actor(['clients.view']);
        $this->client(['first_name' => 'Amina', 'last_name' => 'Zeroual', 'status' => ClientStatus::Vip, 'city' => 'Ouarzazate']);
        $this->client(['first_name' => 'Omar', 'last_name' => 'Idrissi', 'status' => ClientStatus::Normal, 'is_active' => false]);
        $this->client(['first_name' => 'Salma', 'last_name' => 'Bennani']);

        // status filter.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/clients?status=vip')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.last_name', 'Zeroual');

        // is_active=false arrives as a boolean, not the string "false".
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/clients?is_active=false')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.last_name', 'Idrissi');

        // city filter.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/clients?city=Ouarzazate')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.last_name', 'Zeroual');

        // sort by last name ascending.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/clients?sort_by=last_name&sort_dir=asc')
            ->assertOk()
            ->assertJsonPath('data.0.last_name', 'Bennani')
            ->assertJsonPath('data.2.last_name', 'Zeroual');
    }

    public function test_sorting_rejects_unknown_columns_and_directions(): void
    {
        $actor = $this->actor(['clients.view']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/clients?sort_by=password')
            ->assertStatus(422);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/clients?sort_dir=sideways')
            ->assertStatus(422);
    }

    public function test_store_creates_client_and_logs_activity(): void
    {
        $actor = $this->actor(['clients.*']);

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload([
                'source' => ClientSource::Whatsapp->value,
            ]));

        $response->assertCreated()
            ->assertJsonPath('full_name', 'Youssef Amrani')
            ->assertJsonPath('phone', '0612345678')
            ->assertJsonPath('cin', 'CIN-A1B2C3')
            ->assertJsonPath('status', 'normal')
            ->assertJsonPath('source', 'whatsapp')
            ->assertJsonPath('is_active', true);

        $id = $response->json('id');

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'clients',
            'action' => 'created',
            'entity_type' => Client::class,
            'entity_id' => $id,
            'user_id' => $actor->id,
        ]);

        $creation = ActivityLog::query()
            ->where('module', 'clients')
            ->where('action', 'created')
            ->where('entity_id', $id)
            ->firstOrFail();

        $this->assertSame('Youssef', $creation->new_values['first_name']);
        $this->assertSame('normal', $creation->new_values['status']);

        // Store without the create permission is forbidden.
        $viewer = $this->actor(['clients.view']);

        $this->actingAs($viewer, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload(['phone' => '0600000999']))
            ->assertStatus(403)
            ->assertJsonPath('permission', 'clients.create');
    }

    public function test_store_enforces_unique_phone_scoped_to_agency_and_valid_enums(): void
    {
        $actor = $this->actor(['clients.*']);

        // Same agency, same phone → rejected.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload())
            ->assertCreated();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload(['last_name' => 'Other']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);

        // Invalid enum values → rejected.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload(['phone' => '0600000002', 'status' => 'gold']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload(['phone' => '0600000003', 'source' => 'tiktok']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['source']);

        // Same phone in a different agency is a different tenant → allowed.
        Client::factory()->create([
            'agency_id' => Agency::factory(),
            'first_name' => 'Other',
            'last_name' => 'Agency',
            'phone' => '0699999999',
        ]);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload(['phone' => '0699999999', 'last_name' => 'Again']))
            ->assertCreated();
    }

    public function test_store_requires_an_identity_document_and_driving_license(): void
    {
        $actor = $this->actor(['clients.*']);

        // Neither a CIN nor a passport → both identity fields report an error.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload([
                'phone' => '0600000101',
                'cin' => null,
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['cin', 'passport_number']);

        // A driving license is mandatory.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload([
                'phone' => '0600000102',
                'driving_license_number' => '',
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['driving_license_number']);

        // A passport alone satisfies the identity requirement.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload([
                'phone' => '0600000103',
                'cin' => null,
                'passport_number' => 'PA123456',
            ]))
            ->assertCreated();
    }

    public function test_update_keeps_identity_and_license_mandatory(): void
    {
        $actor = $this->actor(['clients.*']);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload())
            ->assertCreated()->json('id');

        // Clearing both identity documents is rejected.
        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/clients/{$id}", [
                'cin' => null,
                'passport_number' => null,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['cin']);

        // Clearing the driving license is rejected.
        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/clients/{$id}", [
                'driving_license_number' => null,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['driving_license_number']);

        // A partial update that leaves them untouched still succeeds.
        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/clients/{$id}", ['last_name' => 'Idrissi'])
            ->assertOk();
    }

    public function test_soft_deleted_contact_details_can_be_reused(): void
    {
        $actor = $this->actor(['clients.*']);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload())
            ->assertCreated()->json('id');

        $this->actingAs($actor, 'sanctum')
            ->deleteJson("/api/v1/clients/{$id}")
            ->assertNoContent();

        // The trashed client no longer blocks its phone number.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload(['last_name' => 'Replacement']))
            ->assertCreated();
    }

    public function test_update_changes_fields_ignores_self_and_logs(): void
    {
        $actor = $this->actor(['clients.*']);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload())
            ->assertCreated()->json('id');

        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/clients/{$id}", [
                'last_name' => 'El Fassi',
                'phone' => '0699999999',
            ])
            ->assertOk()
            ->assertJsonPath('full_name', 'Youssef El Fassi')
            ->assertJsonPath('phone', '0699999999');

        $this->assertDatabaseHas('clients', [
            'id' => $id,
            'last_name' => 'El Fassi',
            'phone' => '0699999999',
        ]);

        // PATCHing the same phone back (no-op on uniqueness) must not 422.
        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/clients/{$id}", ['phone' => '0699999999'])
            ->assertOk();

        $updated = ActivityLog::query()
            ->where('module', 'clients')
            ->where('action', 'updated')
            ->where('entity_id', $id)
            ->orderBy('id')
            ->firstOrFail();

        $this->assertSame('Amrani', $updated->old_values['last_name']);
        $this->assertSame('El Fassi', $updated->new_values['last_name']);

        $viewer = $this->actor(['clients.view']);

        $this->actingAs($viewer, 'sanctum')
            ->patchJson("/api/v1/clients/{$id}", ['last_name' => 'Hacked'])
            ->assertStatus(403)
            ->assertJsonPath('permission', 'clients.update');
    }

    public function test_update_rejects_phone_taken_by_another_client(): void
    {
        $actor = $this->actor(['clients.*']);
        $this->client(['first_name' => 'Hassan', 'last_name' => 'Benali', 'phone' => '0698765432']);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/clients', $this->storePayload())
            ->assertCreated()->json('id');

        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/clients/{$id}", ['phone' => '0698765432'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    public function test_show_includes_bookings_count_and_rejects_foreign_and_trashed(): void
    {
        $actor = $this->actor(['clients.*', 'reservations.*']);
        $client = $this->client(['first_name' => 'Nadia', 'last_name' => 'Fassi']);
        $car = $this->car();
        $pickup = now()->addDay()->setTime(9, 0);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', [
                'car_id' => $car->id,
                'primary_client_id' => $client->id,
                'pickup_datetime' => $pickup->toDateTimeString(),
                'expected_return_datetime' => $pickup->copy()->addDays(2)->toDateTimeString(),
                'deposit_amount' => 500,
            ])
            ->assertCreated();

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/clients/{$client->id}")
            ->assertOk()
            ->assertJsonPath('full_name', 'Nadia Fassi')
            ->assertJsonPath('bookings_count', 1);

        // Trashed clients are 404 on the bind.
        $this->actingAs($actor, 'sanctum')
            ->deleteJson("/api/v1/clients/{$client->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('clients', ['id' => $client->id]);

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/clients/{$client->id}")
            ->assertNotFound();

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'clients',
            'action' => 'deleted',
            'entity_type' => Client::class,
            'entity_id' => $client->id,
            'user_id' => $actor->id,
        ]);

        $deleted = ActivityLog::query()
            ->where('module', 'clients')
            ->where('action', 'deleted')
            ->where('entity_id', $client->id)
            ->firstOrFail();

        $this->assertSame('Nadia', $deleted->old_values['first_name']);
    }

    public function test_destroy_requires_delete_permission_and_hides_client_from_list(): void
    {
        $actor = $this->actor(['clients.view']);
        $client = $this->client(['first_name' => 'Omar', 'last_name' => 'Idrissi']);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson("/api/v1/clients/{$client->id}")
            ->assertStatus(403)
            ->assertJsonPath('permission', 'clients.delete');

        $manager = $this->actor(['clients.view', 'clients.delete']);

        $this->actingAs($manager, 'sanctum')
            ->deleteJson("/api/v1/clients/{$client->id}")
            ->assertNoContent();

        $this->actingAs($manager, 'sanctum')
            ->getJson('/api/v1/clients')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }
}
