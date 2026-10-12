<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarCategory;
use App\Models\CarModel;
use App\Models\PlatformAdmin;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PlatformAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_platform_admin_can_login_and_receives_wildcard_token(): void
    {
        $admin = PlatformAdmin::factory()->create(['email' => 'root@platform.ma']);

        $response = $this->postJson('/api/v1/platform/auth/login', [
            'email' => 'root@platform.ma',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'expires_at', 'user'])
            ->assertJsonPath('user.id', $admin->id)
            ->assertJsonPath('user.email', 'root@platform.ma');

        $abilities = json_decode(
            DB::table('personal_access_tokens')
                ->where('tokenable_id', $admin->id)
                ->where('tokenable_type', $admin->getMorphClass())
                ->value('abilities'),
            true,
        );

        $this->assertSame(['*'], $abilities);
        $this->assertNotNull($admin->refresh()->last_login_at);
    }

    public function test_platform_login_rejects_invalid_credentials(): void
    {
        $admin = PlatformAdmin::factory()->create();

        $this->postJson('/api/v1/platform/auth/login', [
            'email' => $admin->email,
            'password' => 'wrong-password',
        ])
            ->assertStatus(401)
            ->assertJsonPath('code', 'invalid_credentials');

        $this->postJson('/api/v1/platform/auth/login', [
            'email' => 'ghost@platform.ma',
            'password' => 'whatever',
        ])
            ->assertStatus(401)
            ->assertJsonPath('code', 'invalid_credentials');
    }

    public function test_platform_login_rejects_deactivated_admin(): void
    {
        $admin = PlatformAdmin::factory()->inactive()->create();

        $this->postJson('/api/v1/platform/auth/login', [
            'email' => $admin->email,
            'password' => 'password',
        ])
            ->assertStatus(403)
            ->assertJsonPath('code', 'account_disabled');
    }

    public function test_deactivated_platform_admin_cannot_use_an_existing_token(): void
    {
        $admin = PlatformAdmin::factory()->create();

        $token = $this->postJson('/api/v1/platform/auth/login', [
            'email' => $admin->email,
            'password' => 'password',
        ])->json('token');

        $admin->update(['is_active' => false]);

        $this->withToken($token)
            ->getJson('/api/v1/platform/auth/me')
            ->assertStatus(403)
            ->assertJsonPath('code', 'account_disabled');
    }

    public function test_platform_routes_reject_ordinary_staff_tokens(): void
    {
        $staff = User::factory()->create([
            'role_id' => Role::factory()->create(['permissions' => ['fleet.*']])->id,
        ]);

        $this->actingAs($staff, 'sanctum')
            ->getJson('/api/v1/platform/agencies')
            ->assertStatus(401);

        $this->actingAs($staff, 'sanctum')
            ->getJson('/api/v1/platform/users')
            ->assertStatus(401);
    }

    public function test_platform_routes_require_authentication(): void
    {
        $this->getJson('/api/v1/platform/agencies')->assertStatus(401);
        $this->getJson('/api/v1/platform/users')->assertStatus(401);
    }

    public function test_platform_can_list_agencies_with_counts(): void
    {
        $agency = Agency::factory()->create(['name' => 'Agence Test']);
        User::factory()->create(['agency_id' => $agency->id]);
        User::factory()->create(['agency_id' => $agency->id]);
        Car::factory()->create(['agency_id' => $agency->id]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/agencies')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Agence Test')
            ->assertJsonPath('data.0.users_count', 2)
            ->assertJsonPath('data.0.cars_count', 1);
    }

    public function test_platform_can_create_an_agency(): void
    {
        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->postJson('/api/v1/platform/agencies', [
                'name' => 'Location Agadir',
                'city' => 'Agadir',
                'email' => 'hello@agadir.ma',
            ])
            ->assertCreated()
            ->assertJsonPath('name', 'Location Agadir')
            ->assertJsonPath('city', 'Agadir')
            ->assertJsonPath('is_active', true);

        $this->assertDatabaseHas('agencies', ['name' => 'Location Agadir']);
    }

    public function test_creating_an_agency_can_seed_its_first_admin(): void
    {
        $role = Role::factory()->create(['name' => 'admin']);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->postJson('/api/v1/platform/agencies', [
                'name' => 'Location Fes',
                'admin' => [
                    'first_name' => 'Fes',
                    'last_name' => 'Manager',
                    'email' => 'manager@fes.ma',
                    'password' => 'secret-password',
                    'role_id' => $role->id,
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('users_count', 1);

        $this->assertDatabaseHas('users', [
            'email' => 'manager@fes.ma',
            'first_name' => 'Fes',
            'role_id' => $role->id,
        ]);
    }

    public function test_platform_can_update_an_agency(): void
    {
        $agency = Agency::factory()->create(['name' => 'Old Name']);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->patchJson("/api/v1/platform/agencies/{$agency->id}", [
                'name' => 'New Name',
                'is_active' => false,
            ])
            ->assertOk()
            ->assertJsonPath('name', 'New Name')
            ->assertJsonPath('is_active', false);
    }

    public function test_platform_can_create_staff_for_any_agency(): void
    {
        $agency = Agency::factory()->create();
        $role = Role::factory()->create();

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->postJson('/api/v1/platform/users', [
                'agency_id' => $agency->id,
                'first_name' => 'New',
                'last_name' => 'Agent',
                'email' => 'agent@agency.ma',
                'password' => 'secret-password',
                'role_id' => $role->id,
            ])
            ->assertCreated()
            ->assertJsonPath('email', 'agent@agency.ma')
            ->assertJsonPath('agency.id', $agency->id)
            ->assertJsonPath('role.id', $role->id);

        $this->assertDatabaseHas('users', [
            'email' => 'agent@agency.ma',
            'agency_id' => $agency->id,
        ]);
    }

    public function test_platform_user_list_spans_every_agency(): void
    {
        $agencyA = Agency::factory()->create();
        $agencyB = Agency::factory()->create();
        User::factory()->create(['agency_id' => $agencyA->id, 'email' => 'a@one.ma']);
        User::factory()->create(['agency_id' => $agencyB->id, 'email' => 'b@two.ma']);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/users')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson("/api/v1/platform/users?agency_id={$agencyA->id}")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.email', 'a@one.ma');
    }

    public function test_platform_can_list_roles(): void
    {
        Role::factory()->create(['name' => 'manager']);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/roles')
            ->assertOk()
            ->assertJsonFragment(['name' => 'manager']);
    }

    public function test_platform_can_manage_the_fleet_catalog(): void
    {
        $admin = PlatformAdmin::factory()->create();

        $brandId = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/platform/fleet/brands', ['name' => 'Dacia'])
            ->assertCreated()
            ->json('id');

        $categoryId = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/platform/fleet/categories', [
                'name' => 'SUV',
                'description' => 'Sport utility vehicles',
            ])
            ->assertCreated()
            ->json('id');

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/platform/fleet/models', [
                'brand_id' => $brandId,
                'name' => 'Duster',
            ])
            ->assertCreated()
            ->assertJsonPath('brand.id', $brandId);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/platform/fleet/brands')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Dacia')
            ->assertJsonPath('data.0.models_count', 1);

        $this->assertDatabaseHas('car_categories', ['id' => $categoryId, 'name' => 'SUV']);
        $this->assertDatabaseHas('car_models', ['brand_id' => $brandId, 'name' => 'Duster']);
    }

    public function test_catalog_name_is_unique_per_brand(): void
    {
        $admin = PlatformAdmin::factory()->create();
        $brand = Brand::factory()->create();
        CarModel::factory()->create(['brand_id' => $brand->id, 'name' => 'Clio']);

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/platform/fleet/models', [
                'brand_id' => $brand->id,
                'name' => 'Clio',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_platform_health_of_a_category_in_use_blocks_deletion(): void
    {
        $admin = PlatformAdmin::factory()->create();
        $category = CarCategory::factory()->create();
        Car::factory()->create(['category_id' => $category->id]);

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/platform/fleet/categories/{$category->id}")
            ->assertStatus(409);

        $this->assertDatabaseHas('car_categories', ['id' => $category->id]);
    }

    public function test_platform_logout_revokes_the_token(): void
    {
        $admin = PlatformAdmin::factory()->create();

        $token = $this->postJson('/api/v1/platform/auth/login', [
            'email' => $admin->email,
            'password' => 'password',
        ])->json('token');

        $this->withToken($token)
            ->postJson('/api/v1/platform/auth/logout')
            ->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $admin->id,
            'tokenable_type' => $admin->getMorphClass(),
        ]);
    }
}
