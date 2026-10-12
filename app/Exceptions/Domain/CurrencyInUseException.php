<?php

namespace App\Exceptions\Domain;

class CurrencyInUseException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            'This currency cannot be deleted because agencies work in it',
            'currency_in_use',
            409,
        );
    }
}
