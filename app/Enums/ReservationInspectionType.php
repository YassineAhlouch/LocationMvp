<?php

namespace App\Enums;

/**
 * A reservation has at most two car inspections: one when the car leaves
 * (pickup / handover) and one when it comes back (return).
 */
enum ReservationInspectionType: string
{
    case Pickup = 'pickup';
    case Return = 'return';

    public function label(): string
    {
        return match ($this) {
            self::Pickup => 'Pickup inspection',
            self::Return => 'Return inspection',
        };
    }
}
