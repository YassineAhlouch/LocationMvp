<?php

namespace App\Enums;

enum PricingAdjustmentType: string
{
    case Percent = 'percent';
    case Fixed = 'fixed';
}
