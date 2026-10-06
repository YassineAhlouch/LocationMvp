<?php

namespace App\Services\Reservations;

use App\Models\Reservation;
use Illuminate\Support\Str;

/**
 * Human-friendly unique booking references: RES-20261006-7K3DQ.
 * reservation_number is globally unique, so collisions are pre-checked
 * and the suffix is wide (31^5) — realistic collision odds are nil.
 */
class ReservationNumberGenerator
{
    public function generate(): string
    {
        do {
            $number = 'RES-'.now()->format('Ymd').'-'.strtoupper(Str::random(5));
        } while (Reservation::query()->where('reservation_number', $number)->exists());

        return $number;
    }
}
