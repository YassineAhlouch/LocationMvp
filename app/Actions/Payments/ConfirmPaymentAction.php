<?php

namespace App\Actions\Payments;

use App\Actions\Payments\Concerns\SyncsReservationPaymentStatus;
use App\Enums\PaymentRecordStatus;
use App\Exceptions\Domain\InvalidPaymentStateException;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ConfirmPaymentAction
{
    use SyncsReservationPaymentStatus;

    /**
     * pending → paid: the transfer landed. Only pending rows confirm, and
     * confirming is what makes the money count toward payment_status.
     */
    public function handle(Payment $payment, User $actor): Payment
    {
        return DB::transaction(function () use ($payment, $actor) {
            $fresh = $this->lockReservation($payment->reservation_id);
            $row = $this->lockPayment($payment->id);

            if (! $row->status->canTransitionTo(PaymentRecordStatus::Paid)) {
                throw new InvalidPaymentStateException($row->status, PaymentRecordStatus::Paid);
            }

            $before = $this->paidTotal($fresh->id);

            $row->status = PaymentRecordStatus::Paid;
            $row->save();

            $this->settlePaymentEffects($fresh, $before, $actor, sprintf(
                'Pending payment of %s confirmed',
                number_format((float) $row->amount, 2, '.', ''),
            ));

            $this->logActivity(
                module: 'payments',
                action: 'confirmed',
                entity: $row,
                actor: $actor,
                description: sprintf(
                    'Pending payment of %s confirmed',
                    number_format((float) $row->amount, 2, '.', ''),
                ),
                oldValues: ['status' => PaymentRecordStatus::Pending->value],
                newValues: ['status' => PaymentRecordStatus::Paid->value],
            );

            return $row;
        });
    }
}
