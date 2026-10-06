<?php

namespace App\Exceptions\Domain;

class CarCategoryInUseException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            'This category cannot be deleted because cars are attached to it',
            'car_category_in_use',
            409,
        );
    }
}
