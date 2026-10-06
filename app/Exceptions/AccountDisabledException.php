<?php

namespace App\Exceptions;

use Exception;

class AccountDisabledException extends Exception
{
    public function __construct()
    {
        parent::__construct('This account has been deactivated. Contact your administrator.');
    }
}
