<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\Agency;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agency_id' => Agency::factory(),
            'user_id' => User::factory(),
            'module' => 'reservations',
            'entity_type' => Reservation::class,
            'entity_id' => Reservation::factory(),
            'action' => 'created',
            'description' => fake()->sentence(),
            'old_values' => null,
            'new_values' => null,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }
}
