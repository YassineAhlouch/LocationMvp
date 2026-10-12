<?php

namespace App\Exceptions\Domain;

class AgencyPaymentRequiredException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            "This agency's subscription is unpaid. The workspace is read-only until the balance is settled.",
            'payment_required',
            402,
        );
    }
}
