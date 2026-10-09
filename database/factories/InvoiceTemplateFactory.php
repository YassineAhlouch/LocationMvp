<?php

namespace Database\Factories;

use App\Models\InvoiceTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InvoiceTemplate>
 */
class InvoiceTemplateFactory extends Factory
{
    protected $model = InvoiceTemplate::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->slug(2),
            'name' => fake()->words(2, true),
            'is_active' => true,
        ];
    }

    public function classic(): static
    {
        return $this->state(fn (): array => [
            'slug' => 'classic',
            'name' => 'Classic (letterhead)',
        ]);
    }

    public function atlas(): static
    {
        return $this->state(fn (): array => [
            'slug' => 'atlas',
            'name' => 'Atlas (bilingual FR/AR)',
        ]);
    }
}
