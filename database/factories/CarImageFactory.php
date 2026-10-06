<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\CarImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CarImage>
 */
class CarImageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'car_id' => Car::factory(),
            'image' => 'cars/'.fake()->uuid().'.jpg',
            'is_primary' => false,
            'sort_order' => 0,
        ];
    }
}
