<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Agency;
use App\Models\Currency;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgencyCurrencyTest extends TestCase
{
    use RefreshDatabase;

    private Agency $agency;

    private Currency $mad;

    private Currency $euro;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mad = Currency::factory()->create([
            'code' => 'MAD',
            'name' => 'Moroccan Dirham',
            'symbol' => 'DH',
        ]);
        $this->euro = Currency::factory()->create([
            'code' => 'EUR',
            'name' => 'Euro',
            'symbol' => '€',
        ]);

        $this->agency = Agency::factory()->create(['currency_id' => $this->mad->id]);
    }

    private function actor(array $permissions): User
    {
        $role = Role::factory()->create(['permissions' => $permissions]);

        return User::factory()->create([
            'agency_id' => $this->agency->id,
            'role_id' => $role->id,
        ]);
    }

    public function test_currency_catalog_requires_the_settings_permission(): void
    {
        $outsider = $this->actor(['reservations.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/currencies')
            ->assertStatus(403);
    }

    public function test_currency_catalog_lists_only_active_currencies(): void
    {
        Currency::factory()->create(['code' => 'OLD', 'is_active' => false]);

        $actor = $this->actor(['settings.manage']);

        $codes = array_column(
            $this->actingAs($actor, 'sanctum')
                ->getJson('/api/v1/currencies')
                ->assertOk()
                ->json(),
            'code',
        );

        $this->assertContains('MAD', $codes);
        $this->assertContains('EUR', $codes);
        $this->assertNotContains('OLD', $codes);
    }

    public function test_agency_currency_can_be_changed(): void
    {
        $actor = $this->actor(['settings.manage']);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/settings/currency', ['currency_id' => $this->euro->id])
            ->assertOk()
            ->assertJsonPath('currency.code', 'EUR');

        $this->assertSame($this->euro->id, $this->agency->refresh()->currency_id);
    }

    public function test_changing_agency_currency_requires_the_settings_permission(): void
    {
        $outsider = $this->actor(['reservations.view']);

        $this->actingAs($outsider, 'sanctum')
            ->patchJson('/api/v1/settings/currency', ['currency_id' => $this->euro->id])
            ->assertStatus(403);

        $this->assertSame($this->mad->id, $this->agency->refresh()->currency_id);
    }

    public function test_unknown_currency_is_rejected(): void
    {
        $actor = $this->actor(['settings.manage']);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/settings/currency', ['currency_id' => 999999])
            ->assertStatus(422)
            ->assertJsonValidationErrors('currency_id');
    }

    public function test_inactive_currency_is_rejected(): void
    {
        $retired = Currency::factory()->create(['code' => 'RET', 'is_active' => false]);
        $actor = $this->actor(['settings.manage']);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/settings/currency', ['currency_id' => $retired->id])
            ->assertStatus(422)
            ->assertJsonValidationErrors('currency_id');
    }

    public function test_currency_change_is_written_to_the_activity_trail(): void
    {
        $actor = $this->actor(['settings.manage']);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/settings/currency', ['currency_id' => $this->euro->id])
            ->assertOk();

        $log = ActivityLog::query()->latest('id')->firstOrFail();

        $this->assertSame('settings', $log->module);
        $this->assertSame('updated', $log->action);
        $this->assertSame('MAD', $log->old_values['currency'] ?? null);
        $this->assertSame('EUR', $log->new_values['currency'] ?? null);
    }

    public function test_setting_the_same_currency_writes_no_activity(): void
    {
        $actor = $this->actor(['settings.manage']);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/settings/currency', ['currency_id' => $this->mad->id])
            ->assertOk();

        $this->assertDatabaseCount('activity_logs', 0);
    }
}
