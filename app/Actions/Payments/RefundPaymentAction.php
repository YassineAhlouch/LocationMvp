<?php

namespace App\Actions\Payments;

use App\Actions\Payments\Concerns\SyncsReservationPaymentStatus;
use App\Enums\PaymentRecordStatus;
use App\Exceptions\Domain\InvalidPaymentStateException;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RefundPaymentAction
{
    use SyncsReservationPaymentStatus;

    /**
     * paid → refunded: a full reversal of one row, with a mandatory reason.
     * The amount leaves the paid sum immediately and payment_status is
     * re-derived in the same transaction.
     */
    public function handle(Payment $payment, string $reason, User $actor): Payment
    {
        return DB::transaction(function () use ($payment, $reason, $actor) {
            $fresh = $this->lockReservation($payment->reservation_id);
            $row = $this->lockPayment($payment->id);

            if (! $row->status->canTransitionTo(PaymentRecordStatus::Refunded)) {
                throw new InvalidPaymentStateException($row->status, PaymentRecordStatus::Refunded);
            }

            $before = $this->paidTotal($fresh->id);

            $row->status = PaymentRecordStatus::Refunded;
            $row->save();

            $this->settlePaymentEffects($fresh, $before, $actor, $reason);

            $this->logActivity(
                module: 'payments',
                action: 'refunded',
                entity: $row,
                actor: $actor,
                description: 'Payment refunded — '.$reason,
                oldValues: ['status' => PaymentRecordStatus::Paid->value],
                newValues: ['status' => PaymentRecordStatus::Refunded->value],
            );

            return $row;
        });
    }
}
