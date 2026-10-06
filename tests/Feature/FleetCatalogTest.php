<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
use App\Models\ActivityLog;
use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarCategory;
use App\Models\CarModel;
use App\Models\Client;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FleetCatalogTest extends TestCase
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

    private function brand(array $attributes = []): Brand
    {
        return Brand::factory()->create($attributes);
    }

    private function model(Brand $brand, array $attributes = []): CarModel
    {
        return CarModel::factory()->create(array_merge(['brand_id' => $brand->id], $attributes));
    }

    private function category(array $attributes = []): CarCategory
    {
        return CarCategory::factory()->create($attributes);
    }

    private function car(Brand $brand, CarModel $model, array $attributes = []): Car
    {
        return Car::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'brand_id' => $brand->id,
            'model_id' => $model->id,
            'category_id' => $this->category()->id,
            'daily_price' => 300,
            'status' => CarStatus::Available,
        ], $attributes));
    }

    private function client(): Client
    {
        return Client::factory()->create(['agency_id' => $this->agency->id]);
    }

    // ---------------------------------------------------------------- brands

    public function test_brands_index_requires_permission_and_lists_models_count(): void
    {
        $outsider = $this->actor(['reservations.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/fleet/brands')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'fleet.view');

        $actor = $this->actor(['fleet.*']);
        $renault = $this->brand(['name' => 'Renault']);
        $this->model($renault, ['name' => 'Clio']);
        $this->brand(['name' => 'Dacia']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/fleet/brands?sort_by=name&sort_dir=asc')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.name', 'Dacia')
            ->assertJsonPath('data.1.name', 'Renault')
            ->assertJsonPath('data.1.models_count', 1);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/fleet/brands?q=Renault')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $renault->id);
    }

    public function test_brand_store_update_and_logs(): void
    {
        $actor = $this->actor(['fleet.*']);

        $created = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/fleet/brands', ['name' => 'Toyota'])
            ->assertCreated()
            ->assertJsonPath('name', 'Toyota');

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'fleet',
            'action' => 'created',
            'entity_type' => Brand::class,
            'entity_id' => $created->json('id'),
            'user_id' => $actor->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/fleet/brands', ['name' => 'Toyota'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/fleet/brands/'.$created->json('id'), ['name' => 'Toyota Motor'])
            ->assertOk()
            ->assertJsonPath('name', 'Toyota Motor');

        $updated = ActivityLog::query()
            ->where('module', 'fleet')
            ->where('action', 'updated')
            ->where('entity_id', $created->json('id'))
            ->firstOrFail();

        $this->assertSame('Toyota', $updated->old_values['name']);
        $this->assertSame('Toyota Motor', $updated->new_values['name']);

        // Create without permission is forbidden.
        $viewer = $this->actor(['fleet.view']);

        $this->actingAs($viewer, 'sanctum')
            ->postJson('/api/v1/fleet/brands', ['name' => 'Kia'])
            ->assertStatus(403)
            ->assertJsonPath('permission', 'fleet.create');
    }

    public function test_brand_destroy_is_blocked_while_cars_reference_it(): void
    {
        $actor = $this->actor(['fleet.*']);

        // Empty brand deletes cleanly.
        $empty = $this->brand(['name' => 'Unused']);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson('/api/v1/fleet/brands/'.$empty->id)
            ->assertNoContent();

        $this->assertDatabaseMissing('brands', ['id' => $empty->id]);

        // A brand with only models deletes (models cascade).
        $withModels = $this->brand(['name' => 'Models Only']);
        $this->model($withModels, ['name' => 'Sport']);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson('/api/v1/fleet/brands/'.$withModels->id)
            ->assertNoContent();

        $this->assertDatabaseMissing('car_models', ['brand_id' => $withModels->id]);

        // A brand with a car directly attached is protected.
        $direct = $this->brand(['name' => 'Protect Direct']);
        $directModel = $this->model($direct, ['name' => 'Clio']);
        $this->car($direct, $directModel);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson('/api/v1/fleet/brands/'.$direct->id)
            ->assertStatus(409)
            ->assertJsonPath('code', 'brand_in_use');

        $this->assertDatabaseHas('brands', ['id' => $direct->id]);
        $this->assertDatabaseHas('car_models', ['brand_id' => $direct->id]);
    }

    // ---------------------------------------------------------------- models

    public function test_model_store_is_unique_per_brand(): void
    {
        $actor = $this->actor(['fleet.*']);
        $renault = $this->brand(['name' => 'Renault']);
        $dacia = $this->brand(['name' => 'Dacia']);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/fleet/models', ['brand_id' => $renault->id, 'name' => 'Sport'])
            ->assertCreated();

        // Same name, same brand → duplicate.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/fleet/models', ['brand_id' => $renault->id, 'name' => 'Sport'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);

        // Same name, different brand → fine.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/fleet/models', ['brand_id' => $dacia->id, 'name' => 'Sport'])
            ->assertCreated();
    }

    public function test_models_index_filters_and_brand_sublist(): void
    {
        $actor = $this->actor(['fleet.*']);
        $renault = $this->brand(['name' => 'Renault']);
        $dacia = $this->brand(['name' => 'Dacia']);
        $this->model($renault, ['name' => 'Clio']);
        $this->model($renault, ['name' => 'Megane']);
        $this->model($dacia, ['name' => 'Duster']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/fleet/models?brand_id='.$renault->id)
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/fleet/models?q=Clio')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Clio')
            ->assertJsonPath('data.0.brand.name', 'Renault');

        // The nested picker for one brand.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/fleet/brands/'.$renault->id.'/models')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.name', 'Clio');
    }

    public function test_model_destroy_is_blocked_while_cars_reference_it(): void
    {
        $actor = $this->actor(['fleet.*']);
        $brand = $this->brand(['name' => 'Citroen']);
        $unused = $this->model($brand, ['name' => 'C3']);
        $used = $this->model($brand, ['name' => 'Berlingo']);
        $this->car($brand, $used);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson('/api/v1/fleet/models/'.$unused->id)
            ->assertNoContent();

        $this->actingAs($actor, 'sanctum')
            ->deleteJson('/api/v1/fleet/models/'.$used->id)
            ->assertStatus(409)
            ->assertJsonPath('code', 'car_model_in_use');

        $this->assertDatabaseHas('car_models', ['id' => $used->id]);
    }

    // ------------------------------------------------------------ categories

    public function test_category_crud_and_in_use_rule(): void
    {
        $actor = $this->actor(['fleet.*']);

        $created = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/fleet/categories', ['name' => 'Luxury', 'description' => 'Top range'])
            ->assertCreated()
            ->assertJsonPath('name', 'Luxury')
            ->assertJsonPath('description', 'Top range');

        $id = $created->json('id');

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/fleet/categories/'.$id, ['name' => 'Premium'])
            ->assertOk()
            ->assertJsonPath('name', 'Premium');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/fleet/categories?q=Premium')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $empty = $this->category(['name' => 'Empty Cat']);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson('/api/v1/fleet/categories/'.$empty->id)
            ->assertNoContent();

        $using = $this->category(['name' => 'Used Cat']);
        $brand = $this->brand(['name' => 'Peugeot']);
        $this->car($brand, $this->model($brand, ['name' => '208']), ['category_id' => $using->id]);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson('/api/v1/fleet/categories/'.$using->id)
            ->assertStatus(409)
            ->assertJsonPath('code', 'car_category_in_use');

        $this->assertDatabaseHas('car_categories', ['id' => $using->id]);
    }

    public function test_reference_catalog_is_global_across_agencies(): void
    {
        $actor = $this->actor(['fleet.*']);

        // A brand created by another agency's actor is visible here — the
        // catalog is shared, only cars are tenant data.
        $otherAgency = Agency::factory()->create();
        $otherRole = Role::factory()->create(['permissions' => ['fleet.*']]);
        $other = User::factory()->create(['agency_id' => $otherAgency->id, 'role_id' => $otherRole->id]);
        $foreignBrand = $this->brand(['name' => 'Shared Brand']);

        $this->actingAs($other, 'sanctum')
            ->postJson('/api/v1/fleet/models', ['brand_id' => $foreignBrand->id, 'name' => 'Global Model'])
            ->assertCreated();

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/fleet/brands?q=Shared')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/fleet/models?q=Global')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }
}
