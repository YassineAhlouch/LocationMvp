<?php

namespace App\Enums;

/**
 * State of a single payment record (row in `payments`).
 *
 * Ledger lifecycle: a pending transfer is confirmed (→ paid) when the money
 * lands; paid money is only ever reversed through a refund (→ refunded).
 * Deletion is reserved for pending rows — committed money is immutable.
 */
enum PaymentRecordStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Refunded = 'refunded';

    public function canTransitionTo(self $to): bool
    {
        return match ($this) {
            self::Pending => $to === self::Paid,
            self::Paid => $to === self::Refunded,
            self::Refunded => false,
        };
    }
}
