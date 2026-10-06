<?php

namespace App\Exceptions\Domain;

use App\Enums\PaymentRecordStatus;

class InvalidPaymentStateException extends DomainException
{
    public function __construct(
        private readonly PaymentRecordStatus $from,
        private readonly PaymentRecordStatus $to,
    ) {
        parent::__construct(
            "A payment in status [{$from->value}] cannot move to [{$to->value}].",
            'invalid_payment_state',
            422,
        );
    }

    public function context(): array
    {
        return [
            'from' => $this->from->value,
            'to' => $this->to->value,
        ];
    }
}
