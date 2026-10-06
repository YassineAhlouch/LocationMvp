<?php

namespace Database\Factories;

use App\Enums\PricingType;
use App\Models\Reservation;
use App\Models\ReservationExtra;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReservationExtra>
 */
class ReservationExtraFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement(['Insurance', 'Baby Seat', 'GPS', 'Airport Delivery', 'Extra Driver']);

        return [
            'reservation_id' => Reservation::factory(),
            'name' => $name,
            'description' => null,
            'pricing_type' => fake()->randomElement(PricingType::cases()),
            'quantity' => 1,
            'unit_price' => 100,
            'total_price' => 100,
        ];
    }
}
