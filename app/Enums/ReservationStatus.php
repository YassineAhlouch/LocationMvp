<?php

namespace App\Enums;

enum ReservationStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Reserved = 'reserved';
    case Active = 'active';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case NoShow = 'no_show';

    /**
     * Statuses that hold the car and block overlapping bookings.
     *
     * @return array<int, self>
     */
    public static function blocking(): array
    {
        return [self::Pending, self::Confirmed, self::Reserved, self::Active];
    }

    /**
     * Statuses from which no further transition is allowed.
     */
    public function isTerminal(): bool
    {
        return in_array($this, [self::Completed, self::Cancelled, self::NoShow], strict: true);
    }

    /**
     * The reservation state machine: only these moves are legal.
     *
     * - pending → confirmed | reserved (phone hold) | cancelled | no_show
     * - confirmed → active (contract signed) | cancelled | no_show
     * - reserved → confirmed | active | cancelled | no_show
     * - active → completed
     *
     * Extend is not a transition — the status stays the same, dates move.
     */
    public function canTransitionTo(self $target): bool
    {
        return match ($this) {
            self::Pending => in_array($target, [self::Confirmed, self::Reserved, self::Cancelled, self::NoShow], strict: true),
            self::Confirmed => in_array($target, [self::Active, self::Cancelled, self::NoShow], strict: true),
            self::Reserved => in_array($target, [self::Confirmed, self::Active, self::Cancelled, self::NoShow], strict: true),
            self::Active => $target === self::Completed,
            self::Completed, self::Cancelled, self::NoShow => false,
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
