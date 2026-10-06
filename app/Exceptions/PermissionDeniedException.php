<?php

namespace App\Exceptions;

use Exception;

class PermissionDeniedException extends Exception
{
    public function __construct(public readonly string $permission)
    {
        parent::__construct("This action requires the [{$permission}] permission.");
    }
}
