<?php

namespace App\Exceptions\Domain;

class SelfDeactivationException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            'You cannot deactivate your own account',
            'self_deactivation',
            409,
        );
    }
}
