<?php

namespace App\Enums;

enum ExpenseType: string
{
    case Insurance = 'insurance';
    case Maintenance = 'maintenance';
    case Repair = 'repair';
    case Tax = 'tax';
    case OilChange = 'oil_change';
    case Tires = 'tires';
    case Inspection = 'inspection';
}
