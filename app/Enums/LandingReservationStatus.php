<?php

namespace App\Enums;

enum LandingReservationStatus: string
{
    case New = 'new';
    case Contacted = 'contacted';
    case Converted = 'converted';
    case Rejected = 'rejected';

    /**
     * Statuses a landing request can still leave.
     *
     * @return array<int, self>
     */
    public function transitions(): array
    {
        return match ($this) {
            self::New => [self::Contacted, self::Converted, self::Rejected],
            self::Contacted => [self::Converted, self::Rejected],
            default => [],
        };
    }
}
