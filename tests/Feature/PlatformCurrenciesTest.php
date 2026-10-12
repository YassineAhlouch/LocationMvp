<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\Currency;
use App\Models\PlatformAdmin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformCurrenciesTest extends TestCase
{
    use RefreshDatabase;

    public function test_platform_can_list_currencies_with_counts(): void
    {
        $currency = Currency::factory()->create(['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$']);
        Agency::factory()->create(['currency_id' => $currency->id]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/fleet/currencies')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.code', 'USD')
            ->assertJsonPath('data.0.symbol', '$')
            ->assertJsonPath('data.0.agencies_count', 1);
    }

    public function test_platform_can_create_a_currency(): void
    {
        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->postJson('/api/v1/platform/fleet/currencies', [
                'code' => 'eur',
                'name' => 'Euro',
                'symbol' => '€',
                'decimals' => 2,
            ])
            ->assertCreated()
            ->assertJsonPath('code', 'EUR')
            ->assertJsonPath('name', 'Euro')
            ->assertJsonPath('decimals', 2)
            ->assertJsonPath('is_active', true);
    }

    public function test_currency_code_must_be_unique(): void
    {
        Currency::factory()->create(['code' => 'MAD']);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->postJson('/api/v1/platform/fleet/currencies', [
                'code' => 'MAD',
                'name' => 'Moroccan Dirham',
                'symbol' => 'DH',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['code']);
    }

    public function test_platform_can_update_a_currency(): void
    {
        $currency = Currency::factory()->create(['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$']);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->patchJson("/api/v1/platform/fleet/currencies/{$currency->id}", [
                'decimals' => 0,
                'is_active' => false,
            ])
            ->assertOk()
            ->assertJsonPath('decimals', 0)
            ->assertJsonPath('is_active', false);
    }

    public function test_currency_in_use_cannot_be_deleted(): void
    {
        $currency = Currency::factory()->create(['code' => 'MAD']);
        Agency::factory()->create(['currency_id' => $currency->id]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->deleteJson("/api/v1/platform/fleet/currencies/{$currency->id}")
            ->assertStatus(409)
            ->assertJsonPath('code', 'currency_in_use');

        $this->assertDatabaseHas('currencies', ['id' => $currency->id]);
    }

    public function test_unused_currency_can_be_deleted(): void
    {
        $currency = Currency::factory()->create(['code' => 'CHF']);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->deleteJson("/api/v1/platform/fleet/currencies/{$currency->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('currencies', ['id' => $currency->id]);
    }
}
