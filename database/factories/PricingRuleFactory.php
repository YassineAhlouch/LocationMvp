<?php

namespace Database\Factories;

use App\Enums\PricingAdjustmentType;
use App\Enums\PricingRuleType;
use App\Models\Agency;
use App\Models\PricingRule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PricingRule>
 */
class PricingRuleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agency_id' => Agency::factory(),
            'name' => ucfirst(fake()->words(3, true)),
            'rule_type' => PricingRuleType::Season,
            'starts_on' => now()->subDay()->toDateString(),
            'ends_on' => now()->addDays(60)->toDateString(),
            'days_of_week' => null,
            'adjustment_type' => PricingAdjustmentType::Percent,
            'adjustment_value' => 15,
            'is_active' => true,
        ];
    }

    /**
     * Year-round weekday rule (window cleared).
     *
     * @param  array<int, int>  $days  ISO weekdays, 1=Mon..7=Sun
     */
    public function dayOfWeek(array $days): static
    {
        return $this->state(fn () => [
            'rule_type' => PricingRuleType::DayOfWeek,
            'starts_on' => null,
            'ends_on' => null,
            'days_of_week' => $days,
        ]);
    }

    public function fixed(float $value): static
    {
        return $this->state(fn () => [
            'adjustment_type' => PricingAdjustmentType::Fixed,
            'adjustment_value' => $value,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
