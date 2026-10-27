<?php

namespace Database\Factories;

use App\Models\Agency;
use App\Models\QrCode;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QrCode>
 */
class QrCodeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agency_id' => Agency::factory(),
            'name' => fake()->unique()->words(2, true),
        ];
    }

    /**
     * Attach the advertised cars once the poster exists (pivot needs its id).
     *
     * @param  array<int, int>  $carIds
     */
    public function withCars(array $carIds): self
    {
        return $this->afterCreating(function (QrCode $qr) use ($carIds) {
            $qr->cars()->sync($carIds);
        });
    }
}
