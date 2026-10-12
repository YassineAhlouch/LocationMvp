<?php

namespace Database\Factories;

use App\Models\Agency;
use App\Models\AgencyPayment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AgencyPayment>
 */
class AgencyPaymentFactory extends Factory
{
    protected $model = AgencyPayment::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $due = now()->addDays(10);

        return [
            'agency_id' => Agency::factory(),
            'currency_id' => null,
            'amount' => fake()->randomFloat(2, 300, 3000),
            'period' => $due->format('Y-m'),
            'due_date' => $due->toDateString(),
            'paid_at' => null,
            'reference' => null,
            'notes' => null,
            'recorded_by' => null,
        ];
    }

    public function paid(): static
    {
        return $this->state(fn () => ['paid_at' => now()]);
    }

    public function overdue(): static
    {
        return $this->state(fn () => [
            'due_date' => now()->subDays(5)->toDateString(),
        ]);
    }
}
