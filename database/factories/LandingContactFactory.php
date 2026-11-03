<?php

namespace Database\Factories;

use App\Models\LandingContact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LandingContact>
 */
class LandingContactFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'agency_name' => fake()->company(),
            'phone' => fake()->numerify('+212 6 ## ## ## ##'),
            'email' => fake()->safeEmail(),
            'message' => fake()->optional()->sentence(),
        ];
    }
}
