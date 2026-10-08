<?php

namespace Tests\Feature;

use App\Enums\PricingType;
use App\Models\Agency;
use App\Models\Extra;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExtraCatalogTest extends TestCase
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

    private function extra(string $name, PricingType $type, float $price, array $attributes = []): Extra
    {
        return Extra::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'name' => $name,
            'pricing_type' => $type,
            'default_price' => $price,
            'sort_order' => 0,
        ], $attributes));
    }

    public function test_active_extras_are_listed_in_display_order(): void
    {
        $actor = $this->actor(['extras.view']);

        $this->extra('GPS', PricingType::Daily, 30, ['sort_order' => 2]);
        $this->extra('Baby seat', PricingType::Daily, 25, ['sort_order' => 1]);
        $this->extra('Retired', PricingType::Fixed, 10, ['is_active' => false]);

        $response = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/extras')
            ->assertOk();

        $data = $response->json('data');
        $names = collect($data)->pluck('name')->all();

        $this->assertSame(['Baby seat', 'GPS'], array_values($names));
        $this->assertNotContains('Retired', $names);

        $gps = collect($data)->firstWhere('name', 'GPS');
        $this->assertSame('daily', $gps['pricing_type']);
        $this->assertEqualsWithDelta(30.0, (float) $gps['default_price'], 0.001);
    }

    public function test_extras_require_the_extras_view_permission(): void
    {
        $actor = $this->actor(['reservations.view']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/extras')
            ->assertStatus(403);
    }
}
