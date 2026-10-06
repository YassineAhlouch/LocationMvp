<?php

namespace App\Exceptions\Domain;

class CarHasReservationsException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            'This car cannot be deleted because reservations reference it; mark it inactive to retire it',
            'car_has_reservations',
            409,
        );
    }
}
