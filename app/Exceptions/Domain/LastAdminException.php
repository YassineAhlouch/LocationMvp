<?php

namespace App\Exceptions\Domain;

class LastAdminException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            'This change would leave the agency without an administrator',
            'last_admin',
            409,
        );
    }
}
