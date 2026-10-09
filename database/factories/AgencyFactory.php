<?php

namespace Database\Factories;

use App\Models\Agency;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Agency>
 */
class AgencyFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'email' => fake()->companyEmail(),
            'phone' => fake()->numerify('+212 5 ## ## ## ## ##'),
            'address' => fake()->streetAddress(),
            'city' => fake()->randomElement(['Marrakech', 'Casablanca', 'Rabat', 'Agadir']),
            'country' => 'Morocco',
            'ice' => fake()->numerify('#############'),
            'rc' => fake()->bothify('RC/?????/####/#####'),
            'daily_mileage_allowance' => 250,
            'extra_mileage_fee_per_km' => 1,
            'is_active' => true,
        ];
    }
}
