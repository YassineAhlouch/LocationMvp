<?php

namespace App\Actions\Reservations;

use App\Actions\Reservations\Concerns\InteractsWithReservationLifecycle;
use App\Enums\PricingType;
use App\Enums\ReservationChangeType;
use App\Enums\ReservationStatus;
use App\Exceptions\Domain\InvalidReservationDatesException;
use App\Exceptions\Domain\ReservationNotEditableException;
use App\Models\Reservation;
use App\Models\ReservationExtra;
use App\Models\User;
use App\Services\Pricing\PricingService;
use App\Services\Reservations\AvailabilityService;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

class ExtendReservationAction
{
    use InteractsWithReservationLifecycle;

    public function __construct(
        private readonly AvailabilityService $availability,
        private readonly PricingService $pricing,
    ) {}

    /**
     * Push the expected return date further out. The status never changes;
     * pricing is recomputed at the original snapshot rates and the audit
     * trail gains an extension row plus a pricing update when totals move.
     */
    public function handle(Reservation $reservation, CarbonInterface $newReturn, ?string $reason, User $actor): Reservation
    {
        return DB::transaction(function () use ($reservation, $newReturn, $reason, $actor) {
            [$car, $fresh] = $this->lockCarAndReservation($reservation->car_id, $reservation->id);

            if ($fresh->isTerminal()) {
                throw new ReservationNotEditableException($fresh->status);
            }

            if (! $newReturn->greaterThan($fresh->expected_return_datetime)) {
                throw new InvalidReservationDatesException('The new return datetime must be after the current one.');
            }

            if ($fresh->status === ReservationStatus::Active && ! $newReturn->greaterThan(now())) {
                throw new InvalidReservationDatesException('An active rental can only be extended into the future.');
            }

            $this->availability->assertAvailable($car, $fresh->pickup_datetime, $newReturn, $fresh->id);

            /** @var Collection<int, array{pricing_type: PricingType, unit_price: string, quantity: int}> $extras */
            $extras = $fresh->extras->map(fn (ReservationExtra $extra) => [
                'pricing_type' => $extra->pricing_type,
                'unit_price' => $extra->unit_price,
                'quantity' => $extra->quantity,
            ])->all();

            $oldReturn = $fresh->expected_return_datetime;
            $oldDays = $fresh->rental_days;
            $oldTotal = (float) $fresh->total_amount;

            $quote = $this->pricing->quote(
                $fresh->pickup_datetime,
                $newReturn,
                $fresh->daily_rate,
                $extras,
                $fresh->discount_amount,
                (int) $fresh->agency_id,
            );

            $fresh->expected_return_datetime = $newReturn;
            $fresh->rental_days = $quote['rental_days'];
            $fresh->subtotal = $quote['subtotal'];
            $fresh->discount_amount = $quote['discount_amount'];
            $fresh->tax_amount = $quote['tax_amount'];
            $fresh->total_amount = $quote['total_amount'];
            $fresh->save();

            $this->recordChange(
                $fresh,
                'expected_return_datetime',
                ReservationChangeType::Extension,
                $oldReturn,
                $newReturn,
                $reason,
                $actor,
            );

            if ($quote['rental_days'] !== $oldDays || (float) $fresh->total_amount !== $oldTotal) {
                $this->recordChange(
                    $fresh,
                    'total_amount',
                    ReservationChangeType::PricingUpdate,
                    number_format($oldTotal, 2, '.', ''),
                    number_format((float) $fresh->total_amount, 2, '.', ''),
                    $reason,
                    $actor,
                );
            }

            $this->logActivity(
                module: 'reservations',
                action: 'extended',
                entity: $fresh,
                actor: $actor,
                description: trim(
                    'Return pushed to '.$newReturn->toDateTimeString().($reason !== null ? " — {$reason}" : '')
                ),
                oldValues: [
                    'expected_return_datetime' => $oldReturn->toDateTimeString(),
                    'total_amount' => number_format($oldTotal, 2, '.', ''),
                ],
                newValues: [
                    'expected_return_datetime' => $newReturn->toDateTimeString(),
                    'total_amount' => number_format((float) $fresh->total_amount, 2, '.', ''),
                ],
            );

            $this->refreshDailyExtras($fresh, $this->pricing, $quote['rental_days']);

            return $fresh->load(['car', 'primaryClient', 'extras', 'createdBy', 'changes']);
        });
    }
}
