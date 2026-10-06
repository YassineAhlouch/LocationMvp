<?php

namespace App\Services\Reservations;

use App\Enums\CarStatus;
use App\Models\Car;
use App\Models\Reservation;

/**
 * The car's status is derived state of its reservation lifecycle:
 *
 *   confirmed → car reserved      activated → car rented
 *   completed → car available (or maintenance when the service mileage
 *               threshold is reached)
 *   cancelled → car available unless another blocking reservation holds it
 *
 * All methods run inside the reservation transaction with the car row
 * already locked — they never open their own transactions.
 */
class CarLifecycleService
{
    public function __construct(private readonly AvailabilityService $availability) {}

    public function onConfirmed(Car $car): void
    {
        if ($car->status === CarStatus::Available) {
            $car->update(['status' => CarStatus::Reserved]);
        }
    }

    public function onActivated(Car $car): void
    {
        // Defensive: legacy rows may never have been marked reserved.
        if (in_array($car->status, [CarStatus::Available, CarStatus::Reserved], strict: true)) {
            $car->update(['status' => CarStatus::Rented]);
        }
    }

    public function onCompleted(Car $car, Reservation $reservation): void
    {
        $attributes = [];

        if ($reservation->return_mileage !== null) {
            $attributes['current_mileage'] = $reservation->return_mileage;
        }

        if ($reservation->return_fuel_level !== null) {
            $attributes['current_fuel_level'] = $reservation->return_fuel_level;
        }

        // Service due: send the car to maintenance instead of the yard.
        $serviceDue = $car->next_service_mileage !== null
            && $reservation->return_mileage !== null
            && $reservation->return_mileage >= $car->next_service_mileage;

        $attributes['status'] = $serviceDue ? CarStatus::Maintenance : CarStatus::Available;

        $car->update($attributes);
    }

    public function onCancelled(Car $car, int $cancelledReservationId): void
    {
        if ($car->status !== CarStatus::Reserved) {
            return;
        }

        // Another blocking booking still holds this car → keep it reserved.
        $stillHeld = $this->availability
            ->conflicts($car, now(), now()->addYear(), $cancelledReservationId)
            ->isNotEmpty();

        if (! $stillHeld) {
            $car->update(['status' => CarStatus::Available]);
        }
    }
}
