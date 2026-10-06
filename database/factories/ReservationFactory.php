<?php

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Enums\ReservationStatus;
use App\Models\Agency;
use App\Models\Car;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pickup = now()->addDay()->setTime(9, 0);

        return [
            'agency_id' => Agency::factory(),
            'reservation_number' => 'RES-'.fake()->unique()->numerify('######'),
            'car_id' => Car::factory(),
            'primary_client_id' => Client::factory(),
            'secondary_client_id' => null,
            'primary_driver_name' => fake()->name(),
            'primary_driver_phone' => fake()->numerify('06########'),
            'primary_driver_cin' => strtoupper(fake()->bothify('?#?#?#?#')),
            'pickup_location' => 'Marrakech Agency',
            'return_location' => 'Marrakech Agency',
            'pickup_datetime' => $pickup,
            'expected_return_datetime' => $pickup->copy()->addDays(3),
            'daily_rate' => 300,
            'rental_days' => 3,
            'subtotal' => 900,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'deposit_amount' => 1000,
            'total_amount' => 900,
            'payment_status' => PaymentStatus::Unpaid,
            'status' => ReservationStatus::Pending,
            'created_by' => User::factory(),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReservationStatus::Confirmed,
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReservationStatus::Active,
            'pickup_datetime' => now()->subDay()->setTime(9, 0),
            'expected_return_datetime' => now()->addDays(2)->setTime(9, 0),
            'pickup_mileage' => 50000,
            'pickup_fuel_level' => 100,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReservationStatus::Completed,
            'pickup_datetime' => now()->subDays(5)->setTime(9, 0),
            'expected_return_datetime' => now()->subDays(2)->setTime(9, 0),
            'actual_return_datetime' => now()->subDays(2)->setTime(10, 0),
            'pickup_mileage' => 50000,
            'return_mileage' => 51200,
            'pickup_fuel_level' => 100,
            'return_fuel_level' => 60,
        ]);
    }
}
