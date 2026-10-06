<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    private function staffUser(array $permissions = ['reservations.*']): User
    {
        $role = Role::factory()->create(['permissions' => $permissions]);

        return User::factory()->create(['role_id' => $role->id]);
    }

    public function test_staff_can_login_and_receives_scoped_token(): void
    {
        $user = $this->staffUser([
            'dashboard.*',
            'reservations.*',
            'clients.view',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'expires_at', 'user'])
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.role.name', $user->role->name)
            ->assertJsonPath('user.agency.id', $user->agency_id);

        $this->assertNotNull($response->json('token'));

        $abilities = json_decode(
            DB::table('personal_access_tokens')
                ->where('tokenable_id', $user->id)
                ->value('abilities'),
            true,
        );

        // Wildcards are expanded from config/permissions.php at issue time.
        $this->assertContains('reservations.confirm', $abilities);
        $this->assertContains('reservations.complete', $abilities);
        $this->assertContains('dashboard.view', $abilities);
        $this->assertContains('clients.view', $abilities);
        $this->assertNotContains('clients.delete', $abilities);
        $this->assertNotContains('reservations.*', $abilities);

        $this->assertNotNull($user->refresh()->last_login_at);
    }

    public function test_admin_token_holds_wildcard_ability(): void
    {
        $user = $this->staffUser(['*']);

        $token = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->json('token');

        $abilities = json_decode(
            DB::table('personal_access_tokens')
                ->where('tokenable_id', $user->id)
                ->value('abilities'),
            true,
        );

        $this->assertSame(['*'], $abilities);
        $this->assertNotNull($token);
    }

    public function test_login_rejects_invalid_credentials_with_stable_code(): void
    {
        $user = $this->staffUser();

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])
            ->assertStatus(401)
            ->assertJsonPath('code', 'invalid_credentials');

        $this->postJson('/api/v1/auth/login', [
            'email' => 'nobody@media.ma',
            'password' => 'whatever',
        ])
            ->assertStatus(401)
            ->assertJsonPath('code', 'invalid_credentials');
    }

    public function test_login_rejects_deactivated_account(): void
    {
        $user = User::factory()->inactive()->create([
            'role_id' => Role::factory()->create()->id,
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ])
            ->assertStatus(403)
            ->assertJsonPath('code', 'account_disabled');
    }

    public function test_me_returns_current_staff_profile(): void
    {
        $user = $this->staffUser();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('role.name', $user->role->name)
            ->assertJsonPath('agency.id', $user->agency_id)
            ->assertJsonPath('is_active', true);
    }

    public function test_logout_revokes_the_current_token(): void
    {
        $user = $this->staffUser();

        $token = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->json('token');

        $this->withToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_deactivated_staff_cannot_use_an_existing_token(): void
    {
        $user = $this->staffUser();

        $token = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->json('token');

        $user->update(['is_active' => false]);

        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertStatus(403)
            ->assertJsonPath('code', 'account_disabled');
    }
}
