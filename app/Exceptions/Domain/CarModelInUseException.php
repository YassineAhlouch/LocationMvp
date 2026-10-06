<?php

namespace App\Exceptions\Domain;

class CarModelInUseException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            'This model cannot be deleted because cars are attached to it',
            'car_model_in_use',
            409,
        );
    }
}
