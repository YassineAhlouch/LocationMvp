<?php

namespace App\Services\Reservations;

use App\Models\Agency;
use App\Models\Reservation;

/**
 * Derives the presentation values printed on a rental contract/invoice from
 * the reservation plus the agency's mileage policy. Kept out of the controller
 * so the arithmetic is unit-testable and agency defaults live in one place.
 */
class ReservationContractService
{
    /**
     * Fallbacks mirror the agencies table defaults so a contract still renders
     * for agencies created before the mileage policy columns existed.
     */
    private const DEFAULT_DAILY_ALLOWANCE_KM = 250;

    private const DEFAULT_FEE_PER_KM = 1.0;

    /**
     * @return array{
     *     distance: int|null,
     *     allowance: int,
     *     excess: int,
     *     extra_fee: float,
     *     daily_allowance: int,
     *     fee_per_km: float,
     * }
     */
    public function mileageSummary(Reservation $reservation, ?Agency $agency): array
    {
        $dailyAllowance = (int) ($agency?->daily_mileage_allowance ?? self::DEFAULT_DAILY_ALLOWANCE_KM);
        $feePerKm = (float) ($agency?->extra_mileage_fee_per_km ?? self::DEFAULT_FEE_PER_KM);

        $distance = $this->distance($reservation);
        $allowance = (int) $reservation->rental_days * $dailyAllowance;
        $excess = $distance !== null ? max(0, $distance - $allowance) : 0;

        return [
            'distance' => $distance,
            'allowance' => $allowance,
            'excess' => $excess,
            'extra_fee' => round($excess * $feePerKm, 2),
            'daily_allowance' => $dailyAllowance,
            'fee_per_km' => $feePerKm,
        ];
    }

    /**
     * Distance actually driven, or null while the car is still out (no
     * return odometer yet) — a contract must never invent that figure.
     */
    private function distance(Reservation $reservation): ?int
    {
        if ($reservation->pickup_mileage === null || $reservation->return_mileage === null) {
            return null;
        }

        return max(0, $reservation->return_mileage - $reservation->pickup_mileage);
    }
}
