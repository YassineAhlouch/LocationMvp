<?php

namespace App\Services\Reservations;

use App\Enums\ReservationStatus;
use App\Exceptions\Domain\CarUnavailableException;
use App\Models\Car;
use App\Models\Reservation;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

/**
 * Overlap checks for a car's booking window. Intervals are half-open
 * [pickup, return): a return at 10:00 and the next pickup at 10:00 on the
 * same car do NOT collide — back-to-back rentals are legal.
 *
 * Race safety: callers must invoke this inside a transaction that has
 * already locked the car row (lockForUpdate), so two concurrent bookings
 * for the same car serialize and the second sees the first's reservation.
 */
class AvailabilityService
{
    /**
     * Blocking reservations overlapping the window, excluding $exceptId.
     *
     * @return Collection<int, Reservation>
     */
    public function conflicts(
        Car $car,
        CarbonInterface $pickup,
        CarbonInterface $return,
        ?int $exceptReservationId = null,
    ): Collection {
        return Reservation::query()
            ->overlapping($car->id, $pickup, $return, $exceptReservationId)
            ->get();
    }

    /**
     * @throws CarUnavailableException
     */
    public function assertAvailable(
        Car $car,
        CarbonInterface $pickup,
        CarbonInterface $return,
        ?int $exceptReservationId = null,
    ): void {
        $conflicts = $this->conflicts($car, $pickup, $return, $exceptReservationId);

        if ($conflicts->isNotEmpty()) {
            throw new CarUnavailableException($this->present($conflicts));
        }
    }

    /**
     * One conflict payload shape for both the 409 body and the
     * availability-check endpoint.
     *
     * @param  Collection<int, Reservation>  $conflicts
     * @return array<int, array{reservation_number: string, status: string, pickup_datetime: ?string, expected_return_datetime: ?string}>
     */
    public function present(Collection $conflicts): array
    {
        return $conflicts->map(fn (Reservation $reservation) => [
            'reservation_number' => $reservation->reservation_number,
            'status' => $reservation->status instanceof ReservationStatus
                ? $reservation->status->value
                : (string) $reservation->status,
            'pickup_datetime' => $reservation->pickup_datetime?->toIso8601String(),
            'expected_return_datetime' => $reservation->expected_return_datetime?->toIso8601String(),
        ])->all();
    }
}
