<?php

namespace App\Actions\Reservations;

use App\Actions\Reservations\Concerns\InteractsWithReservationLifecycle;
use App\Enums\ReservationStatus;
use App\Models\Car;
use App\Models\Reservation;
use App\Models\User;
use App\Services\Reservations\CarLifecycleService;

class ConfirmReservationAction
{
    use InteractsWithReservationLifecycle;

    public function __construct(private readonly CarLifecycleService $lifecycle) {}

    /**
     * pending → confirmed; the car becomes reserved.
     */
    public function handle(Reservation $reservation, ?string $reason, User $actor): Reservation
    {
        return $this->performTransition(
            $reservation,
            ReservationStatus::Confirmed,
            $actor,
            $reason,
            fn (Car $car, Reservation $fresh) => $this->lifecycle->onConfirmed($car),
        );
    }
}
