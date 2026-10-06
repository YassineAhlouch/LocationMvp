<?php

namespace App\Actions\Reservations\Concerns;

use App\Enums\PricingType;
use App\Enums\ReservationChangeType;
use App\Enums\ReservationStatus;
use App\Exceptions\Domain\InvalidReservationDatesException;
use App\Exceptions\Domain\InvalidReservationTransitionException;
use App\Models\Car;
use App\Models\Reservation;
use App\Models\User;
use App\Services\Activity\LogsActivity;
use App\Services\Pricing\PricingService;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

/**
 * Shared discipline for every reservation mutation:
 *
 * 1. Lock order is always car → reservation (never reversed) so concurrent
 *    actions on one fleet row serialize instead of deadlocking.
 * 2. Under REPEATABLE READ the car lock is the transaction's first statement,
 *    pinning the consistent snapshot after any blocker's commit — the later
 *    overlap SELECT therefore sees concurrently inserted reservations.
 * 3. Every business-meaningful write lands in reservation_changes.
 * 4. Every status transition also lands in the activity trail.
 */
trait InteractsWithReservationLifecycle
{
    use LogsActivity, RecordsReservationChanges;

    /**
     * @return array{0: Car, 1: Reservation}
     */
    protected function lockCarAndReservation(int $carId, int $reservationId): array
    {
        $car = Car::query()->whereKey($carId)->lockForUpdate()->firstOrFail();
        $reservation = Reservation::query()->whereKey($reservationId)->lockForUpdate()->firstOrFail();

        return [$car, $reservation];
    }

    protected function assertValidWindow(CarbonInterface $pickup, CarbonInterface $return): void
    {
        if (! $return->greaterThan($pickup)) {
            throw new InvalidReservationDatesException('The return datetime must be after the pickup datetime.');
        }
    }

    /**
     * Execute a status transition with the state machine enforced under lock.
     * The whole check → mutate → audit sequence runs in one transaction, so
     * concurrent transitions on the same reservation serialize instead of
     * both passing the state check on a stale read.
     *
     * @param  (callable(Car, Reservation): void)|null  $afterStatusChange
     */
    protected function performTransition(
        Reservation $reservation,
        ReservationStatus $to,
        User $actor,
        ?string $reason,
        ?callable $afterStatusChange = null,
    ): Reservation {
        return DB::transaction(function () use ($reservation, $to, $actor, $reason, $afterStatusChange) {
            [$car, $fresh] = $this->lockCarAndReservation($reservation->car_id, $reservation->id);

            if (! $fresh->status->canTransitionTo($to)) {
                throw new InvalidReservationTransitionException($fresh->status, $to);
            }

            $from = $fresh->status;
            $fresh->status = $to;

            if ($afterStatusChange !== null) {
                $afterStatusChange($car, $fresh);
            }

            $fresh->save();

            $this->recordChange(
                $fresh,
                'status',
                ReservationChangeType::StatusChange,
                $from->value,
                $to->value,
                $reason,
                $actor,
            );

            $this->logActivity(
                module: 'reservations',
                action: match ($to) {
                    ReservationStatus::Active => 'activated',
                    default => $to->value,
                },
                entity: $fresh,
                actor: $actor,
                description: trim(
                    "Status {$from->value} → {$to->value}".($reason !== null ? " — {$reason}" : '')
                ),
                oldValues: ['status' => $from->value],
                newValues: ['status' => $to->value],
            );

            return $fresh->load(['car', 'primaryClient', 'extras', 'createdBy', 'changes']);
        });
    }

    /**
     * Daily extras grow/shrink with the rental period; keep their line totals
     * consistent with the quoted rental_days so Σ lines + rate − duration
     * discount always equals the stored subtotal.
     */
    protected function refreshDailyExtras(Reservation $reservation, PricingService $pricing, int $rentalDays): void
    {
        foreach ($reservation->extras as $extra) {
            if ($extra->pricing_type === PricingType::Daily) {
                $extra->total_price = round(
                    $pricing->lineTotal($extra->pricing_type, $extra->unit_price, $extra->quantity, $rentalDays),
                    2,
                );

                $extra->save();
            }
        }
    }
}
