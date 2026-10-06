<?php

namespace App\Enums;

/**
 * Reservation-level payment state, derived from the sum of its payments.
 */
enum PaymentStatus: string
{
    case Unpaid = 'unpaid';
    case Partial = 'partial';
    case Paid = 'paid';
}
