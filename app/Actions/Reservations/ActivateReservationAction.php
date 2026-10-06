<?php

namespace App\Actions\Reservations;

use App\Actions\Reservations\Concerns\InteractsWithReservationLifecycle;
use App\Enums\ReservationStatus;
use App\Models\Car;
use App\Models\Reservation;
use App\Models\User;
use App\Services\Reservations\CarLifecycleService;

class ActivateReservationAction
{
    use InteractsWithReservationLifecycle;

    public function __construct(private readonly CarLifecycleService $lifecycle) {}

    /**
     * confirmed → active (car picked up); the car becomes rented.
     * Mileage and fuel are recorded as the pickup snapshot when provided.
     */
    public function handle(
        Reservation $reservation,
        User $actor,
        ?int $pickupMileage = null,
        ?int $pickupFuelLevel = null,
    ): Reservation {
        return $this->performTransition(
            $reservation,
            ReservationStatus::Active,
            $actor,
            null,
            function (Car $car, Reservation $fresh) use ($pickupMileage, $pickupFuelLevel) {
                if ($pickupMileage !== null) {
                    $fresh->pickup_mileage = $pickupMileage;
                    $car->current_mileage = $pickupMileage;
                }

                if ($pickupFuelLevel !== null) {
                    $fresh->pickup_fuel_level = $pickupFuelLevel;
                }

                $this->lifecycle->onActivated($car);
            },
        );
    }
}
