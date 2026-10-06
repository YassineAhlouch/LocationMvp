<?php

namespace App\Services\Pricing;

use App\Models\PricingRule;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

/**
 * Resolves which pricing rules apply to each charged calendar day of a
 * rental window.
 *
 * Matching is deliberately two-phase: SQL prefilters by agency, active
 * flag and window overlap (an agency holds dozens of rules, not
 * thousands), then cheap per-day checks — window bounds and ISO weekday —
 * run in memory over that small candidate set.
 */
class PricingRuleResolver
{
    /**
     * Active rules whose date window overlaps the charged-day span
     * [firstDay..lastDay], both inclusive.
     *
     * @return Collection<int, PricingRule>
     */
    public function candidates(int $agencyId, CarbonInterface $firstDay, CarbonInterface $lastDay): Collection
    {
        return PricingRule::query()
            ->where('agency_id', $agencyId)
            ->where('is_active', true)
            ->where(fn ($query) => $query
                ->whereNull('starts_on')
                ->orWhere('starts_on', '<=', $lastDay->toDateString()))
            ->where(fn ($query) => $query
                ->whereNull('ends_on')
                ->orWhere('ends_on', '>=', $firstDay->toDateString()))
            ->orderBy('id')
            ->get();
    }

    /**
     * Candidate rules matching one calendar day.
     *
     * @param  Collection<int, PricingRule>  $candidates
     * @return array<int, array{rule_id: int, name: string, adjustment_type: string, value: float}>
     */
    public function matching(Collection $candidates, CarbonInterface $day): array
    {
        $date = $day->toDateString();
        $weekday = $day->isoWeekday();

        $matches = [];

        foreach ($candidates as $rule) {
            if ($rule->starts_on !== null && $date < $rule->starts_on->toDateString()) {
                continue;
            }

            if ($rule->ends_on !== null && $date > $rule->ends_on->toDateString()) {
                continue;
            }

            if ($rule->days_of_week !== null && ! in_array($weekday, $rule->days_of_week, true)) {
                continue;
            }

            $matches[] = [
                'rule_id' => (int) $rule->id,
                'name' => (string) $rule->name,
                'adjustment_type' => $rule->adjustment_type->value,
                'value' => (float) $rule->adjustment_value,
            ];
        }

        return $matches;
    }
}
