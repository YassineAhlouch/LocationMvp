<?php

namespace App\Actions\Payments;

use App\Actions\Payments\Concerns\SyncsReservationPaymentStatus;
use App\Enums\PaymentRecordStatus;
use App\Exceptions\Domain\PaymentNotDeletableException;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DeletePaymentAction
{
    use SyncsReservationPaymentStatus;

    /**
     * Only pending rows are removable — a draft transfer that never
     * happened. Committed money is immutable history: paid rows are
     * reversed through refunds, never deleted.
     */
    public function handle(Payment $payment, User $actor): void
    {
        DB::transaction(function () use ($payment, $actor) {
            $this->lockReservation($payment->reservation_id);
            $row = $this->lockPayment($payment->id);

            if ($row->status !== PaymentRecordStatus::Pending) {
                throw new PaymentNotDeletableException($row->status);
            }

            $oldValues = [
                'amount' => number_format((float) $row->amount, 2, '.', ''),
                'method' => $row->method->value,
                'status' => $row->status->value,
            ];

            $row->delete();

            $this->logActivity(
                module: 'payments',
                action: 'deleted',
                entity: $row,
                actor: $actor,
                description: 'Pending payment deleted',
                oldValues: $oldValues,
            );
        });
    }
}
