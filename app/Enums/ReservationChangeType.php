<?php

namespace App\Enums;

enum ReservationChangeType: string
{
    case Creation = 'creation';
    case StatusChange = 'status_change';
    case Extension = 'extension';
    case Discount = 'discount';
    case DateChange = 'date_change';
    case ManualEdit = 'manual_edit';
    case PricingUpdate = 'pricing_update';
    case Payment = 'payment';
}
