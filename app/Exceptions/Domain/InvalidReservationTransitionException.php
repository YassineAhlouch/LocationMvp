<?php

namespace App\Exceptions\Domain;

use App\Enums\ReservationStatus;

class InvalidReservationTransitionException extends DomainException
{
    public function __construct(
        private readonly ReservationStatus $from,
        private readonly ReservationStatus $to,
    ) {
        parent::__construct(
            "A reservation in status [{$from->value}] cannot move to [{$to->value}].",
            'invalid_transition',
            422,
        );
    }

    public function context(): array
    {
        return [
            'from' => $this->from->value,
            'to' => $this->to->value,
        ];
    }
}
