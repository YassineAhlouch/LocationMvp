<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\CarModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CarModel>
 */
class CarModelFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'brand_id' => Brand::factory(),
            'name' => 'Model '.fake()->unique()->numberBetween(1, 99999),
        ];
    }
}
