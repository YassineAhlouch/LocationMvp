<?php

namespace App\Exceptions\Domain;

class BrandInUseException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            'This brand cannot be deleted because cars are attached to it',
            'brand_in_use',
            409,
        );
    }
}
