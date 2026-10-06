<?php

namespace App\Enums;

enum PricingRuleType: string
{
    case Season = 'season';
    case DayOfWeek = 'day_of_week';
}
