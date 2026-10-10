<?php

namespace Database\Factories;

use App\Enums\InstallmentStatus;
use App\Models\Car;
use App\Models\CarFinancing;
use App\Models\CarInstallment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CarInstallment>
 */
class CarInstallmentFactory extends Factory
{
    protected $model = CarInstallment::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'financing_id' => CarFinancing::factory(),
            'car_id' => Car::factory(),
            'installment_number' => 1,
            'due_date' => now()->addMonth()->toDateString(),
            'amount' => fake()->randomFloat(2, 5000, 20000),
            'paid_date' => null,
            'status' => InstallmentStatus::Pending,
            'reference' => null,
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => InstallmentStatus::Paid,
            'paid_date' => now()->subDay()->toDateString(),
        ]);
    }

    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => InstallmentStatus::Pending,
            'due_date' => now()->subMonth()->toDateString(),
        ]);
    }
}
