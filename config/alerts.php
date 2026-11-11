<?php

return [
    // Fleet document alerts (insurance, technical inspection) are raised once
    // per stage of decay — inside the warning window, again inside the urgent
    // window, and once expired. Renewal resets the cycle because the sweep
    // keys on the new expiry date.
    'expiry_days' => (int) env('ALERTS_EXPIRY_DAYS', 30),
    'urgent_days' => (int) env('ALERTS_URGENT_DAYS', 7),

    // A return that lands at or below this fuel percentage raises a
    // low-fuel alert.
    'fuel_low_percent' => (int) env('ALERTS_FUEL_LOW_PERCENT', 20),
];
