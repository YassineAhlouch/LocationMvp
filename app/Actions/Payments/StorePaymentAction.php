<?php

namespace App\Actions\Payments;

use App\Actions\Payments\Concerns\SyncsReservationPaymentStatus;
use App\Enums\PaymentRecordStatus;
use App\Enums\ReservationStatus;
use App\Exceptions\Domain\ReservationNotEditableException;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StorePaymentAction
{
    use SyncsReservationPaymentStatus;

    /**
     * Record money received against a reservation. Cancelled reservations
     * are frozen (prior money is handled by refunds); completed ones still
     * settle — clients often pay at dropoff.
     *
     * @param  array{amount: int|float, method: string, status?: string, payment_date?: string, reference?: ?string, notes?: ?string}  $data
     */
    public function handle(Reservation $reservation, array $data, User $actor): Payment
    {
        return DB::transaction(function () use ($reservation, $data, $actor) {
            $fresh = $this->lockReservation($reservation->id);

            if ($fresh->status === ReservationStatus::Cancelled) {
                throw new ReservationNotEditableException($fresh->status);
            }

            $before = $this->paidTotal($fresh->id);

            $payment = Payment::create([
                'agency_id' => $fresh->agency_id,
                'reservation_id' => $fresh->id,
                'payment_date' => $data['payment_date'] ?? now(),
                'amount' => $data['amount'],
                'method' => $data['method'],
                'reference' => $data['reference'] ?? null,
                'status' => $data['status'] ?? PaymentRecordStatus::Paid,
                'notes' => $data['notes'] ?? null,
                'created_by' => $actor->id,
            ]);

            $this->settlePaymentEffects($fresh, $before, $actor, sprintf(
                'Payment of %s recorded (%s)',
                number_format((float) $payment->amount, 2, '.', ''),
                $payment->method->value,
            ));

            $this->logActivity(
                module: 'payments',
                action: 'recorded',
                entity: $payment,
                actor: $actor,
                description: sprintf(
                    'Payment of %s recorded via %s',
                    number_format((float) $payment->amount, 2, '.', ''),
                    $payment->method->value,
                ),
                newValues: [
                    'amount' => number_format((float) $payment->amount, 2, '.', ''),
                    'method' => $payment->method->value,
                    'status' => $payment->status->value,
                ],
            );

            return $payment;
        });
    }
}
