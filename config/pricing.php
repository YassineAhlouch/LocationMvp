<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Pricing Rules
    |--------------------------------------------------------------------------
    | Shared inputs for the pricing engine:
    |
    |   rate     = Σ per-day car rate adjusted by pricing_rules (agency
    |              seasons / day-of-week modifiers; percent points add,
    |              fixed amounts sum)
    |   subtotal = rate − duration discount + extras lines
    |   total    = (subtotal − manual discount) + tax
    |
    | The deposit is deliberately outside the formula — held funds, not
    | revenue (STEP 6 books it).
    */

    // Moroccan TVA. Override with PRICING_TAX_RATE (0 disables tax).
    'tax_rate' => (float) env('PRICING_TAX_RATE', 0.20),

    // ISO-4217 code surfaced by the quote endpoint.
    'currency' => env('PRICING_CURRENCY', 'MAD'),

    // A return later than expected + this window is recharged for every
    // extra calendar day held. 0 disables the late-return charge.
    'late_grace_minutes' => (int) env('PRICING_LATE_GRACE_MINUTES', 60),

    // Automatic concession on the rate portion for long rentals; the
    // highest matching tier wins (never stacked) and the amount folds
    // into the subtotal so persisted totals always reconcile.
    'duration_tiers' => [
        ['min_days' => 7, 'percent' => (float) env('PRICING_WEEKLY_DISCOUNT', 5.0)],
        ['min_days' => 28, 'percent' => (float) env('PRICING_MONTHLY_DISCOUNT', 10.0)],
    ],

];
