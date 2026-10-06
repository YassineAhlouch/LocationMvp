<?php

namespace Database\Factories;

use App\Enums\ExpenseStatus;
use App\Enums\ExpenseType;
use App\Models\Agency;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CarExpense>
 */
class CarExpenseFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agency_id' => Agency::factory(),
            'car_id' => Car::factory(),
            'type' => ExpenseType::Maintenance,
            'title' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'amount' => fake()->randomFloat(2, 200, 5000),
            'vendor' => fake()->company(),
            'start_date' => now()->toDateString(),
            'due_date' => now()->addWeek()->toDateString(),
            'paid_date' => null,
            'attachment' => null,
            'status' => ExpenseStatus::Pending,
            'created_by' => User::factory(),
        ];
    }
}
