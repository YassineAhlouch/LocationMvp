<?php

namespace App\Actions\Payments\Concerns;

use App\Actions\Reservations\Concerns\RecordsReservationChanges;
use App\Enums\PaymentRecordStatus;
use App\Enums\PaymentStatus;
use App\Enums\ReservationChangeType;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use App\Services\Activity\LogsActivity;

/**
 * Money-side discipline for every payment action:
 *
 * 1. The reservation row is locked first (payments never touch fleet state,
 *    so there is no car lock; taking reservation-only locks can never cycle
 *    with the car → reservation order used elsewhere).
 * 2. payment_status is derived, never hand-set: it is the paid sum versus
 *    total_amount — deposits are ordinary ledger rows in this model.
 * 3. Every movement of the paid sum lands in reservation_changes, and every
 *    payment_status transition lands beside it.
 * 4. Every money event (recorded, confirmed, refunded, deleted) lands in the
 *    activity trail with its actor.
 */
trait SyncsReservationPaymentStatus
{
    use LogsActivity, RecordsReservationChanges;

    protected function lockReservation(int $reservationId): Reservation
    {
        return Reservation::query()->whereKey($reservationId)->lockForUpdate()->firstOrFail();
    }

    protected function lockPayment(int $paymentId): Payment
    {
        return Payment::query()->whereKey($paymentId)->lockForUpdate()->firstOrFail();
    }

    /**
     * Sum of paid rows — pending and refunded money never counts.
     */
    protected function paidTotal(int $reservationId): float
    {
        return round((float) Payment::query()
            ->where('reservation_id', $reservationId)
            ->where('status', PaymentRecordStatus::Paid)
            ->sum('amount'), 2);
    }

    /**
     * Recompute derived state after a payment row was written, under the
     * reservation lock. Writes only what actually moved: an unchanged paid
     * sum or status produces no rows.
     */
    protected function settlePaymentEffects(Reservation $fresh, float $before, User $actor, ?string $reason): void
    {
        $after = $this->paidTotal($fresh->id);

        if ($after !== $before) {
            $this->recordChange(
                $fresh,
                'total_paid',
                ReservationChangeType::Payment,
                number_format($before, 2, '.', ''),
                number_format($after, 2, '.', ''),
                $reason,
                $actor,
            );
        }

        $newStatus = $this->derivePaymentStatus($after, (float) $fresh->total_amount);

        if ($fresh->payment_status !== $newStatus) {
            $oldStatus = $fresh->payment_status;
            $fresh->payment_status = $newStatus;
            $fresh->save();

            $this->recordChange(
                $fresh,
                'payment_status',
                ReservationChangeType::Payment,
                $oldStatus?->value,
                $newStatus->value,
                $reason,
                $actor,
            );
        }
    }

    private function derivePaymentStatus(float $paid, float $total): PaymentStatus
    {
        return match (true) {
            $total <= 0 => PaymentStatus::Paid,
            $paid <= 0 => PaymentStatus::Unpaid,
            $paid < $total => PaymentStatus::Partial,
            default => PaymentStatus::Paid,
        };
    }
}
