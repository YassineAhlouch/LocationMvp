<?php

namespace Database\Factories;

use App\Models\CarCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CarCategory>
 */
class CarCategoryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Category '.fake()->unique()->numberBetween(1, 9999),
            'description' => fake()->sentence(),
        ];
    }
}
