<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Agency;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleManagementTest extends TestCase
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

    private function role(array $attributes = []): Role
    {
        return Role::factory()->create($attributes);
    }

    public function test_index_requires_permission_and_lists_users_count(): void
    {
        $outsider = $this->actor(['clients.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/roles')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'roles.view');

        $actor = $this->actor(['roles.view']);
        $agents = $this->role(['name' => 'Agents', 'permissions' => ['clients.view']]);
        $this->role(['name' => 'Admins', 'permissions' => ['*']]);

        User::factory()->count(2)->create(['agency_id' => $this->agency->id, 'role_id' => $agents->id]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/roles')
            ->assertOk()
            ->assertJsonCount(4, 'data') // outsider + actor roles, plus Admins + Agents
            ->assertJsonPath('data.0.name', 'Admins')
            ->assertJsonPath('data.1.name', 'Agents')
            ->assertJsonPath('data.1.users_count', 2)
            ->assertJsonPath('data.1.permissions.0', 'clients.view')
            ->assertJsonPath('data.1.is_active', true);
    }

    public function test_store_validates_permissions_against_catalog_and_logs(): void
    {
        $actor = $this->actor(['roles.*']);

        $created = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/roles', [
                'name' => 'Supervisor',
                'permissions' => ['clients.view', 'reservations.*'],
            ])
            ->assertCreated()
            ->assertJsonPath('name', 'Supervisor')
            ->assertJsonPath('permissions.0', 'clients.view')
            ->assertJsonPath('permissions.1', 'reservations.*');

        $id = $created->json('id');

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'roles',
            'action' => 'created',
            'entity_type' => Role::class,
            'entity_id' => $id,
            'agency_id' => $this->agency->id,
            'user_id' => $actor->id,
        ]);

        // The master key and duplicate names.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/roles', ['name' => 'Super Admin', 'permissions' => ['*']])
            ->assertCreated();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/roles', ['name' => 'Supervisor', 'permissions' => ['clients.view']])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);

        // Garbage grants are rejected — permissions are code, not free text.
        foreach ([
            ['billing.view'],
            ['clients.manage'],
            ['abc'],
            [''],
        ] as $grants) {
            $this->actingAs($actor, 'sanctum')
                ->postJson('/api/v1/roles', ['name' => 'Bad '.fake()->unique()->word(), 'permissions' => $grants])
                ->assertStatus(422)
                ->assertJsonValidationErrors(['permissions']);
        }

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/roles', ['name' => 'Empty', 'permissions' => []])
            ->assertStatus(422);

        // Store requires roles.manage, not just roles.view.
        $viewer = $this->actor(['roles.view']);

        $this->actingAs($viewer, 'sanctum')
            ->postJson('/api/v1/roles', ['name' => 'Nope', 'permissions' => ['clients.view']])
            ->assertStatus(403)
            ->assertJsonPath('permission', 'roles.manage');
    }

    public function test_update_renames_and_replaces_permissions(): void
    {
        $actor = $this->actor(['roles.*']);
        $role = $this->role(['name' => 'Old Name', 'permissions' => ['clients.view']]);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/roles/'.$role->id, [
                'name' => 'New Name',
                'permissions' => ['clients.*', 'payments.view'],
            ])
            ->assertOk()
            ->assertJsonPath('name', 'New Name')
            ->assertJsonPath('permissions.0', 'clients.*');

        $updated = ActivityLog::query()
            ->where('module', 'roles')
            ->where('action', 'updated')
            ->where('entity_id', $role->id)
            ->firstOrFail();

        $this->assertSame('Old Name', $updated->old_values['name']);
        $this->assertSame('New Name', $updated->new_values['name']);
    }

    public function test_deactivation_is_blocked_while_users_hold_the_role(): void
    {
        $actor = $this->actor(['roles.*']);
        $held = $this->role(['permissions' => ['clients.view']]);
        User::factory()->create(['agency_id' => $this->agency->id, 'role_id' => $held->id]);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/roles/'.$held->id, ['is_active' => false])
            ->assertStatus(409)
            ->assertJsonPath('code', 'role_in_use');

        $this->assertDatabaseHas('roles', ['id' => $held->id, 'is_active' => 1]);

        // A role nobody holds can be frozen.
        $free = $this->role(['permissions' => ['clients.view']]);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/roles/'.$free->id, ['is_active' => false])
            ->assertOk()
            ->assertJsonPath('is_active', false);
    }

    public function test_permissions_catalog_endpoint(): void
    {
        $outsider = $this->actor(['clients.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/roles/permissions')
            ->assertStatus(403);

        $actor = $this->actor(['roles.view']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/roles/permissions')
            ->assertOk()
            ->assertJsonCount(count(config('permissions')))
            ->assertJsonFragment(['module' => 'reservations'])
            ->assertJsonFragment(['module' => 'users', 'actions' => ['view', 'create', 'update']]);
    }

    public function test_roles_are_a_shared_catalog_across_agencies(): void
    {
        $otherAgency = Agency::factory()->create();
        $otherRole = Role::factory()->create(['permissions' => ['roles.*']]);
        $other = User::factory()->create(['agency_id' => $otherAgency->id, 'role_id' => $otherRole->id]);

        $shared = $this->role(['name' => 'Shared Role', 'permissions' => ['clients.view']]);

        $this->actingAs($other, 'sanctum')
            ->getJson('/api/v1/roles?q=Shared')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $shared->id);
    }
}
