<?php

namespace Database\Seeders;

use App\Models\InvoiceTemplate;
use Illuminate\Database\Seeder;

class InvoiceTemplateSeeder extends Seeder
{
    /**
     * Built-in contract layouts. Slugs are the stable keys the frontend maps
     * to a renderer, so they must never change — only names/visibility may.
     *
     * @var array<string, string>
     */
    private const TEMPLATES = [
        'classic' => 'Classic (letterhead)',
        'atlas' => 'Atlas (bilingual FR/AR)',
    ];

    public function run(): void
    {
        foreach (self::TEMPLATES as $slug => $name) {
            InvoiceTemplate::updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'is_active' => true],
            );
        }
    }
}
