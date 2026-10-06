<?php

namespace Database\Factories;

use App\Enums\ClientSource;
use App\Enums\ClientStatus;
use App\Models\Agency;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Client>
 */
class ClientFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agency_id' => Agency::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'phone' => fake()->numerify('06########'),
            'secondary_phone' => null,
            'email' => fake()->boolean(70) ? fake()->unique()->safeEmail() : null,
            'cin' => strtoupper(fake()->bothify('?#?#?#?#')),
            'passport_number' => null,
            'driving_license_number' => strtoupper(fake()->bothify('##########')),
            'driving_license_expiry' => now()->addYears(fake()->numberBetween(1, 5))->toDateString(),
            'birth_date' => fake()->dateTimeBetween('-60 years', '-21 years')->format('Y-m-d'),
            'birth_place' => null,
            'nationality' => 'Moroccan',
            'address' => null,
            'city' => fake()->randomElement(['Marrakech', 'Casablanca', 'Rabat', 'Agadir']),
            'country' => 'Morocco',
            'notes' => null,
            'source' => fake()->randomElement(ClientSource::cases()),
            'status' => ClientStatus::Normal,
            'is_active' => true,
        ];
    }
}
