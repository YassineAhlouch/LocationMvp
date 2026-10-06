<?php

namespace App\Enums;

enum ReservationStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Active = 'active';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    /**
     * Statuses that hold the car and block overlapping bookings.
     *
     * @return array<int, self>
     */
    public static function blocking(): array
    {
        return [self::Pending, self::Confirmed, self::Active];
    }

    /**
     * Statuses from which no further transition is allowed.
     */
    public function isTerminal(): bool
    {
        return in_array($this, [self::Completed, self::Cancelled], strict: true);
    }

    /**
     * The reservation state machine: only these moves are legal.
     * Extend is not a transition — the status stays the same, dates move.
     */
    public function canTransitionTo(self $target): bool
    {
        return match ($this) {
            self::Pending => in_array($target, [self::Confirmed, self::Cancelled], strict: true),
            self::Confirmed => in_array($target, [self::Active, self::Cancelled], strict: true),
            self::Active => $target === self::Completed,
            self::Completed, self::Cancelled => false,
        };
    }

    /**
     * Whether a reservation in this status still occupies the car.
     */
    public function blocksAvailability(): bool
    {
        return ! $this->isTerminal();
    }
}
