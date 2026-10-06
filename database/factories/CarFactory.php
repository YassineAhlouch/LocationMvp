<?php

namespace Database\Factories;

use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarCategory;
use App\Models\CarModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Car>
 */
class CarFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $mileage = fake()->numberBetween(5000, 120000);

        return [
            'agency_id' => Agency::factory(),
            'brand_id' => Brand::factory(),
            'model_id' => CarModel::factory(),
            'category_id' => CarCategory::factory(),
            'registration_number' => fake()->unique()->numerify('#####-A-##'),
            'vin' => fake()->unique()->numerify('W0L##############'),
            'year' => fake()->numberBetween(2016, 2025),
            'color' => fake()->safeColorName(),
            'seats_count' => fake()->numberBetween(4, 7),
            'doors_count' => 4,
            'transmission_type' => fake()->randomElement(TransmissionType::cases()),
            'fuel_type' => fake()->randomElement(FuelType::cases()),
            'daily_price' => fake()->randomFloat(2, 150, 800),
            'purchase_price' => fake()->randomFloat(2, 80000, 350000),
            'initial_mileage' => $mileage,
            'current_mileage' => $mileage,
            'current_fuel_level' => 100,
            'status' => CarStatus::Available,
            'is_active' => true,
        ];
    }
}
