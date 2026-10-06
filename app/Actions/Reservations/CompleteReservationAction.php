<?php

namespace App\Actions\Reservations;

use App\Actions\Reservations\Concerns\InteractsWithReservationLifecycle;
use App\Enums\PricingType;
use App\Enums\ReservationChangeType;
use App\Enums\ReservationStatus;
use App\Models\Car;
use App\Models\Reservation;
use App\Models\ReservationExtra;
use App\Models\User;
use App\Services\Pricing\PricingService;
use App\Services\Reservations\CarLifecycleService;
use Illuminate\Support\Carbon;

class CompleteReservationAction
{
    use InteractsWithReservationLifecycle;

    private const LATE_RETURN_REASON = 'Returned after the grace period — extra calendar days charged.';

    public function __construct(
        private readonly CarLifecycleService $lifecycle,
        private readonly PricingService $pricing,
    ) {}

    /**
     * active → completed; the car becomes available, or maintenance when the
     * return mileage reaches its next-service threshold. A return later than
     * expected + pricing.late_grace_minutes is recharged for every extra
     * calendar day held, through the same engine as extend/update.
     *
     * @param  array{return_mileage?: int, return_fuel_level?: int, actual_return_datetime?: string, reported_issues?: string, reason?: string}  $data
     */
    public function handle(Reservation $reservation, User $actor, array $data = []): Reservation
    {
        return $this->performTransition(
            $reservation,
            ReservationStatus::Completed,
            $actor,
            $data['reason'] ?? null,
            function (Car $car, Reservation $fresh) use ($data, $actor) {
                if (isset($data['return_mileage'])) {
                    $fresh->return_mileage = (int) $data['return_mileage'];
                }

                if (isset($data['return_fuel_level'])) {
                    $fresh->return_fuel_level = (int) $data['return_fuel_level'];
                }

                $fresh->actual_return_datetime = isset($data['actual_return_datetime'])
                    ? Carbon::parse($data['actual_return_datetime'])
                    : ($fresh->actual_return_datetime ?? now());

                if (! empty($data['reported_issues'])) {
                    $fresh->reported_issues = $data['reported_issues'];
                }

                $this->repriceLateReturn($fresh, $actor);

                $this->lifecycle->onCompleted($car, $fresh);
            },
        );
    }

    /**
     * Calendar-day model with a configurable grace window: past
     * expected + grace every extra day held is charged at the current
     * rules. Early returns are never re-priced here — no automatic
     * refunds; adjustments go through Update before completion.
     */
    private function repriceLateReturn(Reservation $fresh, User $actor): void
    {
        $deadline = $fresh->expected_return_datetime->copy()
            ->addMinutes((int) config('pricing.late_grace_minutes', 0));

        if (! $fresh->actual_return_datetime->greaterThan($deadline)) {
            return;
        }

        $chargedDays = max(
            (int) $fresh->rental_days,
            $this->pricing->rentalDays($fresh->pickup_datetime, $fresh->actual_return_datetime),
        );

        if ($chargedDays <= (int) $fresh->rental_days) {
            return;
        }

        /** @var array<int, array{pricing_type: PricingType, unit_price: string, quantity: int}> $extras */
        $extras = $fresh->extras->map(fn (ReservationExtra $extra) => [
            'pricing_type' => $extra->pricing_type,
            'unit_price' => $extra->unit_price,
            'quantity' => $extra->quantity,
        ])->all();

        $oldDays = (int) $fresh->rental_days;
        $oldTotal = (float) $fresh->total_amount;

        $quote = $this->pricing->quote(
            $fresh->pickup_datetime,
            $fresh->actual_return_datetime,
            $fresh->daily_rate,
            $extras,
            $fresh->discount_amount,
            (int) $fresh->agency_id,
        );

        $fresh->rental_days = $quote['rental_days'];
        $fresh->subtotal = $quote['subtotal'];
        $fresh->discount_amount = $quote['discount_amount'];
        $fresh->tax_amount = $quote['tax_amount'];
        $fresh->total_amount = $quote['total_amount'];

        $this->recordChange(
            $fresh,
            'rental_days',
            ReservationChangeType::PricingUpdate,
            $oldDays,
            $quote['rental_days'],
            self::LATE_RETURN_REASON,
            $actor,
        );

        $this->recordChange(
            $fresh,
            'total_amount',
            ReservationChangeType::PricingUpdate,
            number_format($oldTotal, 2, '.', ''),
            number_format($quote['total_amount'], 2, '.', ''),
            self::LATE_RETURN_REASON,
            $actor,
        );

        $this->refreshDailyExtras($fresh, $this->pricing, $quote['rental_days']);
    }
}
