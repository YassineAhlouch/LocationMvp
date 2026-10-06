<?php

namespace App\Actions\Reservations;

use App\Actions\Reservations\Concerns\InteractsWithReservationLifecycle;
use App\Enums\ReservationStatus;
use App\Models\Car;
use App\Models\Reservation;
use App\Models\User;
use App\Services\Reservations\CarLifecycleService;

class CancelReservationAction
{
    use InteractsWithReservationLifecycle;

    public function __construct(private readonly CarLifecycleService $lifecycle) {}

    /**
     * pending|confirmed → cancelled; the reason is mandatory (audit trail).
     * The car is released unless another blocking reservation still holds it.
     */
    public function handle(Reservation $reservation, string $reason, User $actor): Reservation
    {
        return $this->performTransition(
            $reservation,
            ReservationStatus::Cancelled,
            $actor,
            $reason,
            fn (Car $car, Reservation $fresh) => $this->lifecycle->onCancelled($car, $fresh->id),
        );
    }
}
