<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\InvoiceTemplate;
use App\Models\PlatformAdmin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformInvoiceTemplatesTest extends TestCase
{
    use RefreshDatabase;

    public function test_platform_can_list_active_invoice_templates(): void
    {
        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->getJson('/api/v1/platform/invoice-templates')
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.slug', 'classic')
            ->assertJsonPath('0.name', 'Classic (letterhead)');
    }

    public function test_agency_can_be_created_with_an_invoice_template(): void
    {
        $template = InvoiceTemplate::query()->firstOrFail();

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->postJson('/api/v1/platform/agencies', [
                'name' => 'Agence Template',
                'invoice_template_id' => $template->id,
            ])
            ->assertCreated()
            ->assertJsonPath('name', 'Agence Template')
            ->assertJsonPath('invoice_template.id', $template->id)
            ->assertJsonPath('invoice_template.slug', $template->slug);

        $this->assertDatabaseHas('agencies', [
            'name' => 'Agence Template',
            'invoice_template_id' => $template->id,
        ]);
    }

    public function test_agency_invoice_template_can_be_updated(): void
    {
        $templates = InvoiceTemplate::query()->orderBy('id')->get();

        $agency = Agency::factory()->create(['invoice_template_id' => $templates[0]->id]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->patchJson("/api/v1/platform/agencies/{$agency->id}", [
                'invoice_template_id' => $templates[1]->id,
            ])
            ->assertOk()
            ->assertJsonPath('invoice_template.id', $templates[1]->id);

        $this->assertDatabaseHas('agencies', [
            'id' => $agency->id,
            'invoice_template_id' => $templates[1]->id,
        ]);
    }

    public function test_inactive_invoice_template_is_rejected(): void
    {
        $inactive = InvoiceTemplate::query()->create([
            'slug' => 'legacy',
            'name' => 'Legacy layout',
            'is_active' => false,
        ]);

        $this->actingAs(PlatformAdmin::factory()->create(), 'sanctum')
            ->postJson('/api/v1/platform/agencies', [
                'name' => 'Agence Bad Template',
                'invoice_template_id' => $inactive->id,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['invoice_template_id']);
    }
}
