<?php

namespace App\Exceptions\Domain;

use App\Enums\CarStatus;

class CarNotRentableException extends DomainException
{
    public function __construct(private readonly CarStatus $carStatus)
    {
        parent::__construct(
            "The selected car cannot be rented while its status is [{$carStatus->value}].",
            'car_not_rentable',
            422,
        );
    }

    public function context(): array
    {
        return ['car_status' => $this->carStatus->value];
    }
}
