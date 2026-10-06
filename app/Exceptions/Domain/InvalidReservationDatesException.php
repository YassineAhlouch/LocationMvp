<?php

namespace App\Exceptions\Domain;

class InvalidReservationDatesException extends DomainException
{
    public function __construct(string $message)
    {
        parent::__construct($message, 'invalid_reservation_dates', 422);
    }
}
