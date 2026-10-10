<?php

namespace App\Enums;

/**
 * The condition recorded for one inspected area of the car.
 */
enum InspectionCondition: string
{
    case Ok = 'ok';
    case Minor = 'minor';
    case Damage = 'damage';

    public function label(): string
    {
        return match ($this) {
            self::Ok => 'OK',
            self::Minor => 'Minor wear',
            self::Damage => 'Damage',
        };
    }
}
