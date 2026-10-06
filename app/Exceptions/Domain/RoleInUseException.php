<?php

namespace App\Exceptions\Domain;

class RoleInUseException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            'Reassign or deactivate the users who hold this role before deactivating it',
            'role_in_use',
            409,
        );
    }
}
