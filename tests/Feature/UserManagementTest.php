<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Agency;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    private Agency $agency;

    protected function setUp(): void
    {
        parent::setUp();

        $this->agency = Agency::factory()->create();
    }

    private function actor(array $permissions, array $attributes = []): User
    {
        $role = Role::factory()->create(['permissions' => $permissions]);

        return User::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'role_id' => $role->id,
        ], $attributes));
    }

    private function staff(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'role_id' => Role::factory()->create(['permissions' => ['clients.view']])->id,
        ], $attributes));
    }

    private function adminRole(): Role
    {
        return Role::factory()->create(['name' => 'Admin Team', 'permissions' => ['*']]);
    }

    public function test_index_requires_permission_and_shapes_the_resource(): void
    {
        $outsider = $this->actor(['clients.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/users')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'users.view');

        $actor = $this->actor(['users.view']);
        $role = Role::factory()->create(['permissions' => ['reservations.view']]);
        $alice = $this->staff(['first_name' => 'Alice', 'role_id' => $role->id]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/users')
            ->assertOk()
            ->assertJsonCount(3, 'data') // outsider + actor + alice
            ->assertJsonPath('data.0.role.name', $role->name)
            ->assertJsonMissingPath('data.0.password')
            ->assertJsonPath('data.0.agency.id', $this->agency->id);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/users/'.$alice->id)
            ->assertOk()
            ->assertJsonPath('id', $alice->id)
            ->assertJsonPath('full_name', 'Alice '.$alice->last_name)
            ->assertJsonPath('role.permissions.0', 'reservations.view')
            ->assertJsonPath('is_active', true);
    }

    public function test_index_search_and_filters_support(): void
    {
        // 'zzz@zzz.ma' sorts after every staff email, keeping the email-asc
        // assertion deterministic with the actor in the same list.
        $actor = $this->actor(['users.view'], ['first_name' => 'Zakaria', 'email' => 'zzz@zzz.ma']);
        $agents = Role::factory()->create(['permissions' => ['clients.view']]);
        $managers = Role::factory()->create(['permissions' => ['clients.*']]);

        $this->staff(['first_name' => 'Fatima', 'last_name' => 'Zahra', 'email' => 'fatima@agency.ma', 'role_id' => $agents->id]);
        $this->staff(['first_name' => 'Youssef', 'last_name' => 'Amrani', 'email' => 'youssef@agency.ma', 'role_id' => $managers->id]);
        $this->staff(['first_name' => 'Retired', 'last_name' => 'User', 'email' => 'retired@agency.ma', 'role_id' => $agents->id, 'is_active' => false]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/users?q=Amrani')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.email', 'youssef@agency.ma');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/users?role_id='.$managers->id)
            ->assertOk()
            ->assertJsonCount(1, 'data');

        // is_active=false arrives as a real boolean, not the string "false".
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/users?is_active=false')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.email', 'retired@agency.ma');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/users?sort_by=email&sort_dir=asc')
            ->assertOk()
            ->assertJsonPath('data.0.email', 'fatima@agency.ma')
            ->assertJsonPath('data.3.email', 'zzz@zzz.ma')
            ->assertJsonCount(4, 'data'); // actor + 3 staff
    }

    public function test_index_is_tenant_scoped(): void
    {
        $actor = $this->actor(['users.view']);
        $foreign = User::factory()->create(['agency_id' => Agency::factory()]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/users')
            ->assertOk()
            ->assertJsonCount(1, 'data'); // only the actor herself

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/users/'.$foreign->id)
            ->assertNotFound();
    }

    public function test_store_creates_user_with_hashed_password_and_logs(): void
    {
        $actor = $this->actor(['users.*']);
        $role = Role::factory()->create(['permissions' => ['clients.*']]);

        $created = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/users', [
                'first_name' => 'Nadia',
                'last_name' => 'Benali',
                'email' => 'nadia@agency.ma',
                'phone' => '0612345678',
                'password' => 'Secret123!',
                'role_id' => $role->id,
            ])
            ->assertCreated()
            ->assertJsonPath('first_name', 'Nadia')
            ->assertJsonPath('email', 'nadia@agency.ma')
            ->assertJsonPath('is_active', true)
            ->assertJsonPath('role.id', $role->id)
            ->assertJsonMissingPath('password');

        $id = $created->json('id');

        $this->assertTrue(Hash::check('Secret123!', User::findOrFail($id)->password));

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'users',
            'action' => 'created',
            'entity_type' => User::class,
            'entity_id' => $id,
            'agency_id' => $this->agency->id,
            'user_id' => $actor->id,
        ]);

        // Global identity + policy rules.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/users', [
                'first_name' => 'Nadia',
                'last_name' => 'Benali',
                'email' => 'nadia@agency.ma',
                'password' => 'Secret123!',
                'role_id' => $role->id,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/users', [
                'first_name' => 'Weak',
                'last_name' => 'Password',
                'email' => 'weak@agency.ma',
                'password' => 'short',
                'role_id' => $role->id,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['password']);

        // Inactive roles are not assignable.
        $frozen = Role::factory()->create(['permissions' => ['clients.view'], 'is_active' => false]);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/users', [
                'first_name' => 'Blocked',
                'last_name' => 'Role',
                'email' => 'blocked@agency.ma',
                'password' => 'Secret123!',
                'role_id' => $frozen->id,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['role_id']);
    }

    public function test_update_changes_fields_role_and_password(): void
    {
        $actor = $this->actor(['users.*']);
        $agentRole = Role::factory()->create(['permissions' => ['clients.view']]);
        $managerRole = Role::factory()->create(['permissions' => ['clients.*']]);
        $target = $this->staff(['first_name' => 'Alice', 'role_id' => $agentRole->id]);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/users/'.$target->id, [
                'first_name' => 'Renamed',
                'role_id' => $managerRole->id,
                'password' => 'NewSecret456!',
            ])
            ->assertOk()
            ->assertJsonPath('first_name', 'Renamed')
            ->assertJsonPath('role.id', $managerRole->id);

        $this->assertTrue(Hash::check('NewSecret456!', $target->fresh()->password));

        $updated = ActivityLog::query()
            ->where('module', 'users')
            ->where('action', 'updated')
            ->where('entity_id', $target->id)
            ->firstOrFail();

        $this->assertSame('Alice', $updated->old_values['first_name']);
        $this->assertSame('Renamed', $updated->new_values['first_name']);
        $this->assertArrayNotHasKey('password', $updated->new_values);
    }

    public function test_self_deactivation_is_blocked(): void
    {
        $actor = $this->actor(['users.*']);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/users/'.$actor->id, ['is_active' => false])
            ->assertStatus(409)
            ->assertJsonPath('code', 'self_deactivation');

        $this->assertDatabaseHas('users', ['id' => $actor->id, 'is_active' => 1]);
    }

    public function test_last_admin_cannot_be_removed(): void
    {
        // The actor manages staff but is NOT an admin; the only '*' grantee
        // is the target — removing it would orphan the agency.
        $actor = $this->actor(['users.view', 'users.update']);
        $adminRole = $this->adminRole();
        $soleAdmin = User::factory()->create([
            'agency_id' => $this->agency->id,
            'role_id' => $adminRole->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/users/'.$soleAdmin->id, ['is_active' => false])
            ->assertStatus(409)
            ->assertJsonPath('code', 'last_admin');

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/users/'.$soleAdmin->id, ['role_id' => $actor->role_id])
            ->assertStatus(409)
            ->assertJsonPath('code', 'last_admin');

        $this->assertDatabaseHas('users', ['id' => $soleAdmin->id, 'is_active' => 1, 'role_id' => $adminRole->id]);
    }

    public function test_second_admin_can_be_deactivated(): void
    {
        $actor = $this->actor(['users.*']);
        $adminRole = $this->adminRole();

        // The actor holds '*' herself, so a second admin is removable.
        $actor->role()->associate($adminRole)->save();
        $second = User::factory()->create([
            'agency_id' => $this->agency->id,
            'role_id' => $adminRole->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/users/'.$second->id, ['is_active' => false])
            ->assertOk()
            ->assertJsonPath('is_active', false);

        $this->assertDatabaseHas('users', ['id' => $second->id, 'is_active' => 0]);
    }
}
