<?php

namespace App\Actions\Reservations;

use App\Actions\Reservations\Concerns\InteractsWithReservationLifecycle;
use App\Enums\ReservationStatus;
use App\Models\Car;
use App\Models\Reservation;
use App\Models\User;
use App\Services\Reservations\CarLifecycleService;

class NoShowReservationAction
{
    use InteractsWithReservationLifecycle;

    public function __construct(private readonly CarLifecycleService $lifecycle) {}

    /**
     * pending|confirmed|reserved → no_show: the client never picked the car
     * up at the agreed time. The reason is mandatory (audit trail) and the
     * car is released unless another blocking reservation still holds it.
     */
    public function handle(Reservation $reservation, string $reason, User $actor): Reservation
    {
        return $this->performTransition(
            $reservation,
            ReservationStatus::NoShow,
            $actor,
            $reason,
            fn (Car $car, Reservation $fresh) => $this->lifecycle->onCancelled($car, $fresh->id),
        );
    }
}
