<?php

namespace App\Services\Pricing;

use App\Enums\PricingAdjustmentType;
use App\Enums\PricingType;
use Carbon\CarbonInterface;

/**
 * Pricing math for every writer (create / update / extend / late complete)
 * and for the dry-run quote endpoint — one code path, so a rule change
 * always reaches all of them.
 *
 *   rate      = Σ per-day base adjusted by pricing_rules
 *               (percent points add, fixed amounts sum, never compounded)
 *   subtotal  = rate − duration discount (weekly/monthly tiers) + extras
 *   total     = (subtotal − manual discount) + tax
 *
 * The duration discount folds into the subtotal so persisted columns
 * always reconcile without an extra column:
 * total = subtotal − discount_amount + tax_amount.
 * The deposit stays outside the formula — held funds, not revenue.
 *
 * No HTTP, no transactions: given rules and config this is deterministic.
 */
class PricingService
{
    public function __construct(private readonly PricingRuleResolver $rules) {}

    /**
     * Full quote for a rental window, including the per-day breakdown the
     * quote endpoint exposes. Write paths use the scalar keys only.
     *
     * @param  array<int, array{pricing_type: PricingType|string, unit_price: int|float|string, quantity?: int}>  $extras
     * @return array{
     *     rental_days: int,
     *     rate_subtotal: float,
     *     duration_discount: float,
     *     duration_tier: int|null,
     *     extras_total: float,
     *     subtotal: float,
     *     discount_amount: float,
     *     tax_amount: float,
     *     total_amount: float,
     *     days: array<int, array{date: string, base_rate: float, day_rate: float, adjustments: array<int, array{rule_id: int, name: string, adjustment_type: string, value: float, amount: float}>}>,
     * }
     */
    public function quote(
        CarbonInterface $pickup,
        CarbonInterface $return,
        int|float|string $dailyRate,
        array $extras = [],
        int|float|string $discount = 0,
        ?int $agencyId = null,
    ): array {
        $days = $this->rentalDays($pickup, $return);
        $baseRate = round((float) $dailyRate, 2);

        $candidates = $agencyId === null
            ? collect()
            : $this->rules->candidates($agencyId, $pickup, $pickup->copy()->addDays($days - 1));

        $breakdown = [];
        $rateSubtotal = 0.0;

        for ($offset = 0; $offset < $days; $offset++) {
            $day = $pickup->copy()->startOfDay()->addDays($offset);
            $dayRate = $baseRate;
            $adjustments = [];

            foreach ($this->rules->matching($candidates, $day) as $adjustment) {
                $amount = $adjustment['adjustment_type'] === PricingAdjustmentType::Percent->value
                    ? round($baseRate * $adjustment['value'] / 100, 2)
                    : $adjustment['value'];

                $dayRate += $amount;
                $adjustment['amount'] = $amount;
                $adjustments[] = $adjustment;
            }

            $dayRate = max(0.0, round($dayRate, 2));
            $rateSubtotal += $dayRate;

            $breakdown[] = [
                'date' => $day->toDateString(),
                'base_rate' => $baseRate,
                'day_rate' => $dayRate,
                'adjustments' => $adjustments,
            ];
        }

        $rateSubtotal = round($rateSubtotal, 2);
        [$durationDiscount, $durationTier] = $this->durationDiscount($rateSubtotal, $days);
        $extrasTotal = $this->extrasTotal($extras, $days);

        $subtotal = round($rateSubtotal - $durationDiscount + $extrasTotal, 2);
        $discountAmount = min(max((float) $discount, 0), $subtotal);
        $taxable = $subtotal - $discountAmount;
        $taxAmount = round($taxable * (float) config('pricing.tax_rate', 0), 2);

        return [
            'rental_days' => $days,
            'rate_subtotal' => $rateSubtotal,
            'duration_discount' => round($durationDiscount, 2),
            'duration_tier' => $durationTier,
            'extras_total' => round($extrasTotal, 2),
            'subtotal' => $subtotal,
            'discount_amount' => round($discountAmount, 2),
            'tax_amount' => $taxAmount,
            'total_amount' => round($taxable + $taxAmount, 2),
            'days' => $breakdown,
        ];
    }

    /**
     * Billing days are calendar days (a same-day rental counts as 1 day).
     * Start-of-day diff keeps 23:00 → 01:00 from billing as 2 days.
     */
    public function rentalDays(CarbonInterface $pickup, CarbonInterface $return): int
    {
        return max(1, $pickup->copy()->startOfDay()->diffInDays($return->copy()->startOfDay()));
    }

    /**
     * Price of one extras line for the rental period.
     * Daily extras multiply by rental days; fixed ones do not.
     */
    public function lineTotal(PricingType|string $pricingType, int|float|string $unitPrice, int $quantity, int $rentalDays): float
    {
        $type = $pricingType instanceof PricingType ? $pricingType : PricingType::from((string) $pricingType);
        $line = (float) $unitPrice * max(1, $quantity);

        return $type === PricingType::Daily ? $line * $rentalDays : $line;
    }

    /**
     * @param  array<int, array{pricing_type: PricingType|string, unit_price: int|float|string, quantity?: int}>  $extras
     */
    public function extrasTotal(array $extras, int $rentalDays): float
    {
        $total = 0.0;

        foreach ($extras as $extra) {
            $total += $this->lineTotal(
                $extra['pricing_type'],
                $extra['unit_price'],
                (int) ($extra['quantity'] ?? 1),
                $rentalDays,
            );
        }

        return $total;
    }

    /**
     * Long-rental concession on the rate portion (extras excluded). The
     * highest matching tier wins — 28+ days gets 10%, never 15% stacked.
     *
     * @return array{0: float, 1: int|null} [amount, matched min_days]
     */
    private function durationDiscount(float $rateSubtotal, int $days): array
    {
        $tier = collect(config('pricing.duration_tiers', []))
            ->filter(fn (array $tier): bool => $days >= (int) $tier['min_days'])
            ->sortByDesc('min_days')
            ->first();

        if ($tier === null) {
            return [0.0, null];
        }

        return [
            round($rateSubtotal * ((float) $tier['percent']) / 100, 2),
            (int) $tier['min_days'],
        ];
    }
}
