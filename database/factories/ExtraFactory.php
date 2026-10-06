<?php

namespace Database\Factories;

use App\Enums\PricingType;
use App\Models\Agency;
use App\Models\Extra;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Extra>
 */
class ExtraFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agency_id' => Agency::factory(),
            'name' => 'Extra '.fake()->unique()->numberBetween(1, 9999),
            'description' => fake()->sentence(),
            'pricing_type' => fake()->randomElement(PricingType::cases()),
            'default_price' => fake()->randomFloat(2, 50, 300),
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}
