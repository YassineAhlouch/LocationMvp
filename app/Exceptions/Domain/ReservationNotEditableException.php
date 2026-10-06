<?php

namespace App\Exceptions\Domain;

use App\Enums\ReservationStatus;

class ReservationNotEditableException extends DomainException
{
    public function __construct(private readonly ReservationStatus $status)
    {
        parent::__construct(
            "A reservation in status [{$status->value}] is frozen and cannot be edited.",
            'reservation_not_editable',
            422,
        );
    }

    public function context(): array
    {
        return ['status' => $this->status->value];
    }
}
