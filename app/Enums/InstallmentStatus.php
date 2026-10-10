<?php

namespace App\Enums;

/**
 * State of a car-financing installment.
 *
 * Lifecycle: a scheduled installment is pending; the sweep flips it to
 * overdue once its due date passes unpaid; marking it paid settles it.
 * 'overdue' is also derived on read (pending + due date in the past) so the
 * UI never depends on the sweep having run.
 */
enum InstallmentStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Overdue = 'overdue';

    public function isPaid(): bool
    {
        return $this === self::Paid;
    }
}
