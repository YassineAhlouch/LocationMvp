<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\InvoiceTemplate;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgencySettingsTest extends TestCase
{
    use RefreshDatabase;

    private Agency $agency;

    private InvoiceTemplate $classic;

    private InvoiceTemplate $atlas;

    protected function setUp(): void
    {
        parent::setUp();

        // The built-in catalog is inserted by the invoice_templates migration.
        $this->classic = InvoiceTemplate::query()->where('slug', 'classic')->firstOrFail();
        $this->atlas = InvoiceTemplate::query()->where('slug', 'atlas')->firstOrFail();

        $this->agency = Agency::factory()->create([
            'invoice_template_id' => $this->classic->id,
        ]);
    }

    private function actor(array $permissions): User
    {
        $role = Role::factory()->create(['permissions' => $permissions]);

        return User::factory()->create([
            'agency_id' => $this->agency->id,
            'role_id' => $role->id,
        ]);
    }

    public function test_templates_catalog_requires_the_settings_permission(): void
    {
        $outsider = $this->actor(['reservations.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/invoice-templates')
            ->assertStatus(403);
    }

    public function test_templates_catalog_lists_the_built_in_layouts(): void
    {
        $actor = $this->actor(['settings.manage']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/invoice-templates')
            ->assertOk()
            ->assertJsonFragment(['slug' => 'classic'])
            ->assertJsonFragment(['slug' => 'atlas']);
    }

    public function test_agencies_listing_exposes_the_assigned_template(): void
    {
        $actor = $this->actor(['settings.manage']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/agencies')
            ->assertOk()
            ->assertJsonPath('0.id', $this->agency->id)
            ->assertJsonPath('0.invoice_template.slug', 'classic');
    }

    public function test_a_template_can_be_assigned_to_an_agency(): void
    {
        $actor = $this->actor(['settings.manage']);

        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/agencies/{$this->agency->id}", [
                'invoice_template_id' => $this->atlas->id,
            ])
            ->assertOk()
            ->assertJsonPath('invoice_template.slug', 'atlas');

        $this->assertSame($this->atlas->id, $this->agency->refresh()->invoice_template_id);
    }

    public function test_assigning_a_template_requires_the_settings_permission(): void
    {
        $outsider = $this->actor(['reservations.view']);

        $this->actingAs($outsider, 'sanctum')
            ->patchJson("/api/v1/agencies/{$this->agency->id}", [
                'invoice_template_id' => $this->atlas->id,
            ])
            ->assertStatus(403);

        $this->assertSame($this->classic->id, $this->agency->refresh()->invoice_template_id);
    }

    public function test_assigning_an_unknown_template_is_rejected(): void
    {
        $actor = $this->actor(['settings.manage']);

        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/agencies/{$this->agency->id}", [
                'invoice_template_id' => 999999,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('invoice_template_id');
    }
}
