<?php

namespace App\Actions\Reservations;

use App\Actions\Reservations\Concerns\InteractsWithReservationLifecycle;
use App\Enums\ReservationInspectionType;
use App\Enums\ReservationStatus;
use App\Models\Car;
use App\Models\Reservation;
use App\Models\User;
use App\Services\Reservations\CarLifecycleService;
use App\Services\Reservations\ReservationInspectionService;

class ActivateReservationAction
{
    use InteractsWithReservationLifecycle;

    public function __construct(
        private readonly CarLifecycleService $lifecycle,
        private readonly ReservationInspectionService $inspections,
    ) {}

    /**
     * confirmed → active (car picked up); the car becomes rented.
     * Mileage and fuel are recorded as the pickup snapshot when provided,
     * and the optional handover inspection is stored in the same transaction.
     *
     * @param  array<string, mixed>  $inspection
     */
    public function handle(
        Reservation $reservation,
        User $actor,
        ?int $pickupMileage = null,
        ?int $pickupFuelLevel = null,
        array $inspection = [],
    ): Reservation {
        return $this->performTransition(
            $reservation,
            ReservationStatus::Active,
            $actor,
            null,
            function (Car $car, Reservation $fresh) use ($pickupMileage, $pickupFuelLevel, $inspection, $actor) {
                if ($pickupMileage !== null) {
                    $fresh->pickup_mileage = $pickupMileage;
                    $car->current_mileage = $pickupMileage;
                }

                if ($pickupFuelLevel !== null) {
                    $fresh->pickup_fuel_level = $pickupFuelLevel;
                }

                $this->lifecycle->onActivated($car);

                $this->inspections->record($fresh, ReservationInspectionType::Pickup, $inspection, $actor);
            },
        );
    }
}
