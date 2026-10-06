<?php

namespace Database\Factories;

use App\Enums\ReservationChangeType;
use App\Models\Reservation;
use App\Models\ReservationChange;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReservationChange>
 */
class ReservationChangeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reservation_id' => Reservation::factory(),
            'field_name' => 'expected_return_datetime',
            'change_type' => ReservationChangeType::Extension,
            'old_value' => now()->addDays(3)->toDateTimeString(),
            'new_value' => now()->addDays(5)->toDateTimeString(),
            'reason' => fake()->sentence(),
            'created_by' => User::factory(),
        ];
    }
}
