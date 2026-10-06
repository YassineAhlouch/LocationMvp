<?php

namespace Tests\Feature;

use App\Http\Middleware\ApplyAgencyScope;
use App\Models\Role;
use App\Models\User;
use App\Support\Tenancy\AgencyContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class PermissionsTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        app(AgencyContext::class)->clear();

        parent::tearDown();
    }

    private function userWith(array $permissions): User
    {
        $role = Role::factory()->create(['permissions' => $permissions]);

        return User::factory()->create(['role_id' => $role->id]);
    }

    public function test_exact_and_wildcard_grants_match_correctly(): void
    {
        $user = $this->userWith(['reservations.*', 'clients.view']);

        $this->assertTrue($user->hasPermission('reservations.confirm'));
        $this->assertTrue($user->hasPermission('reservations.cancel'));
        $this->assertTrue($user->hasPermission('clients.view'));

        $this->assertFalse($user->hasPermission('clients.delete'));
        $this->assertFalse($user->hasPermission('payments.create'));
        $this->assertFalse($user->hasPermission('reservationsx.view'));
    }

    public function test_admin_star_grants_everything(): void
    {
        $admin = $this->userWith(['*']);

        $this->assertTrue($admin->hasPermission('payments.refund'));
        $this->assertTrue($admin->hasPermission('anything.at_all'));
        $this->assertSame(['*'], $admin->expandedPermissions());
    }

    public function test_expanded_permissions_flatten_wildcards_for_token_abilities(): void
    {
        $user = $this->userWith(['reservations.*', 'dashboard.view']);

        $expanded = $user->expandedPermissions();

        $this->assertContains('reservations.confirm', $expanded);
        $this->assertContains('reservations.view', $expanded);
        $this->assertContains('dashboard.view', $expanded);
        $this->assertNotContains('reservations.*', $expanded);
        $this->assertNotContains('clients.view', $expanded);
    }

    public function test_permission_middleware_allows_and_denies(): void
    {
        Route::middleware(['auth:sanctum', 'permission:payments.refund'])
            ->get('/api/v1/_test/refunds', fn () => response()->json(['ok' => true]));

        $finance = $this->userWith(['payments.*']);
        $agent = $this->userWith(['reservations.*']);

        $this->actingAs($finance, 'sanctum')
            ->getJson('/api/v1/_test/refunds')
            ->assertOk()
            ->assertJsonPath('ok', true);

        $this->actingAs($agent, 'sanctum')
            ->getJson('/api/v1/_test/refunds')
            ->assertStatus(403)
            ->assertJsonPath('code', 'forbidden')
            ->assertJsonPath('permission', 'payments.refund');
    }

    public function test_agency_scope_middleware_publishes_context(): void
    {
        $user = User::factory()->create();

        $request = Request::create('/api/v1/auth/me', 'GET');
        $request->setUserResolver(fn () => $user);

        (new ApplyAgencyScope)->handle($request, fn () => response()->noContent());

        $this->assertSame((int) $user->agency_id, app(AgencyContext::class)->id());
    }
}
