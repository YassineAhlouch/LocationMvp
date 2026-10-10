<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\CarFinancing;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CarFinancing>
 */
class CarFinancingFactory extends Factory
{
    protected $model = CarFinancing::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $purchasePrice = fake()->randomFloat(2, 80000, 300000);
        $downPayment = round($purchasePrice * 0.2, 2);
        $count = 12;
        $financed = round($purchasePrice - $downPayment, 2);

        return [
            'car_id' => Car::factory(),
            'purchase_date' => now()->subMonths(6)->toDateString(),
            'purchase_price' => $purchasePrice,
            'down_payment' => $downPayment,
            'financed_amount' => $financed,
            'installment_amount' => round($financed / $count, 2),
            'installments_count' => $count,
            'first_due_date' => now()->subMonths(5)->startOfMonth()->toDateString(),
            'lender' => fake()->company(),
            'notes' => null,
        ];
    }
}
