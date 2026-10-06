<?php

namespace App\Exceptions\Domain;

use App\Enums\PaymentRecordStatus;

class PaymentNotDeletableException extends DomainException
{
    public function __construct(private readonly PaymentRecordStatus $status)
    {
        parent::__construct(
            "A payment in status [{$status->value}] cannot be deleted — only pending payments can; committed money is reversed through refunds.",
            'payment_not_deletable',
            422,
        );
    }

    public function context(): array
    {
        return ['status' => $this->status->value];
    }
}
