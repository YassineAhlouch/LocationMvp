<?php

namespace Database\Factories;

use App\Models\Agency;
use App\Models\LandingReservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LandingReservation>
 */
class LandingReservationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agency_id' => Agency::factory(),
            'full_name' => fake()->name(),
            'phone' => fake()->numerify('+212 6 ## ## ## ##'),
            'email' => fake()->safeEmail(),
            'pickup_datetime' => fake()->dateTimeBetween('+1 days', '+7 days'),
            'expected_return_datetime' => fake()->dateTimeBetween('+8 days', '+14 days'),
            'message' => fake()->optional()->sentence(),
            'status' => fake()->randomElement(['new', 'contacted', 'converted', 'rejected']),
        ];
    }
}
