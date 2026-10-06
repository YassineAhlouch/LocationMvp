<?php

namespace App\Actions\Reservations;

use App\Actions\Reservations\Concerns\InteractsWithReservationLifecycle;
use App\Actions\Reservations\Concerns\StoresExtrasSnapshots;
use App\Enums\CarStatus;
use App\Enums\ReservationChangeType;
use App\Enums\ReservationStatus;
use App\Exceptions\Domain\CarNotRentableException;
use App\Exceptions\Domain\ReservationNotEditableException;
use App\Models\Car;
use App\Models\Extra;
use App\Models\Reservation;
use App\Models\ReservationExtra;
use App\Models\User;
use App\Services\Pricing\PricingService;
use App\Services\Reservations\AvailabilityService;
use App\Services\Reservations\CarLifecycleService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class UpdateReservationAction
{
    use InteractsWithReservationLifecycle, StoresExtrasSnapshots;

    private const EDITABLE_FIELDS = [
        'primary_client_id',
        'secondary_client_id',
        'primary_driver_name',
        'primary_driver_phone',
        'primary_driver_cin',
        'primary_driver_passport',
        'primary_driver_license',
        'secondary_driver_name',
        'secondary_driver_phone',
        'secondary_driver_cin',
        'secondary_driver_passport',
        'secondary_driver_license',
        'pickup_location',
        'return_location',
        'pickup_datetime',
        'expected_return_datetime',
        'daily_rate',
        'discount_amount',
        'discount_reason',
        'deposit_amount',
        'remarks',
    ];

    public function __construct(
        private readonly AvailabilityService $availability,
        private readonly PricingService $pricing,
        private readonly CarLifecycleService $lifecycle,
    ) {}

    /**
     * Edit a non-terminal reservation: re-checks availability on date or car
     * changes, recomputes pricing, and records one change row per field.
     *
     * @param  array<string, mixed>  $data  validated UpdateReservationRequest payload
     */
    public function handle(Reservation $reservation, array $data, User $actor): Reservation
    {
        return DB::transaction(function () use ($reservation, $data, $actor) {
            [$car, $fresh] = $this->lockCarAndReservation($reservation->car_id, $reservation->id);

            if ($fresh->isTerminal()) {
                throw new ReservationNotEditableException($fresh->status);
            }

            $pickup = Carbon::parse($data['pickup_datetime'] ?? $fresh->pickup_datetime);
            $return = Carbon::parse($data['expected_return_datetime'] ?? $fresh->expected_return_datetime);
            $this->assertValidWindow($pickup, $return);

            $datesChanged = ! $pickup->equalTo($fresh->pickup_datetime)
                || ! $return->equalTo($fresh->expected_return_datetime);

            if ($datesChanged) {
                $this->availability->assertAvailable($car, $pickup, $return, $fresh->id);
            }

            $extrasChanged = array_key_exists('extras', $data);
            $extras = $extrasChanged
                ? $this->resolveExtras($data['extras'])
                : $fresh->extras->map(fn (ReservationExtra $extra) => [
                    'pricing_type' => $extra->pricing_type,
                    'unit_price' => $extra->unit_price,
                    'quantity' => $extra->quantity,
                ])->all();

            $pricingChanged = $datesChanged || $extrasChanged
                || array_key_exists('daily_rate', $data)
                || array_key_exists('discount_amount', $data);

            $dailyRate = (float) ($data['daily_rate'] ?? $fresh->daily_rate);
            $discount = (float) ($data['discount_amount'] ?? $fresh->discount_amount);
            $quote = $this->pricing->quote($pickup, $return, $dailyRate, $extras, $discount, (int) $fresh->agency_id);

            // Aggregated for a single activity entry: one "edited" event with
            // every moved field beats N entries the auditor must reassemble.
            $oldValues = [];
            $newValues = [];

            foreach (self::EDITABLE_FIELDS as $field) {
                if (! array_key_exists($field, $data)) {
                    continue;
                }

                $old = $fresh->getAttribute($field);
                $new = $data[$field];

                if ($this->normalizeChangeValue($old) === $this->normalizeChangeValue($new)) {
                    continue;
                }

                $this->recordChange(
                    $fresh,
                    $field,
                    match ($field) {
                        'discount_amount', 'discount_reason' => ReservationChangeType::Discount,
                        'pickup_datetime', 'expected_return_datetime' => ReservationChangeType::DateChange,
                        default => ReservationChangeType::ManualEdit,
                    },
                    $old,
                    $new,
                    null,
                    $actor,
                );

                $oldValues[$field] = $this->normalizeChangeValue($old);
                $newValues[$field] = $this->normalizeChangeValue($new);

                $fresh->setAttribute($field, $new);
            }

            if ($extrasChanged) {
                $this->replaceExtras($fresh, $extras, $actor);
            }

            $carChanged = array_key_exists('car_id', $data) && (int) $data['car_id'] !== $fresh->car_id;

            if ($carChanged) {
                $newCar = Car::query()->whereKey($data['car_id'])->lockForUpdate()->firstOrFail();

                if (in_array($newCar->status, [CarStatus::Maintenance, CarStatus::Inactive], strict: true)) {
                    throw new CarNotRentableException($newCar->status);
                }

                // Re-run availability against the replacement car.
                $this->availability->assertAvailable($newCar, $pickup, $return, $fresh->id);

                $this->recordChange(
                    $fresh,
                    'car_id',
                    ReservationChangeType::ManualEdit,
                    $fresh->car_id,
                    $newCar->id,
                    null,
                    $actor,
                );

                $oldValues['car_id'] = (string) $fresh->car_id;
                $newValues['car_id'] = (string) $newCar->id;

                $oldCar = $car;
                $fresh->car_id = $newCar->id;
                $car = $newCar;

                // The old car may have been held only by this reservation.
                $this->lifecycle->onCancelled($oldCar, $fresh->id);

                if ($fresh->status === ReservationStatus::Confirmed) {
                    $this->lifecycle->onConfirmed($car);
                }
            }

            if ($pricingChanged) {
                $oldTotal = (float) $fresh->total_amount;

                $fresh->daily_rate = $dailyRate;
                $fresh->discount_amount = $quote['discount_amount'];
                $fresh->rental_days = $quote['rental_days'];
                $fresh->subtotal = $quote['subtotal'];
                $fresh->tax_amount = $quote['tax_amount'];
                $fresh->total_amount = $quote['total_amount'];

                if ((float) $fresh->total_amount !== $oldTotal) {
                    $this->recordChange(
                        $fresh,
                        'total_amount',
                        ReservationChangeType::PricingUpdate,
                        number_format($oldTotal, 2, '.', ''),
                        number_format((float) $fresh->total_amount, 2, '.', ''),
                        null,
                        $actor,
                    );

                    $oldValues['total_amount'] = number_format($oldTotal, 2, '.', '');
                    $newValues['total_amount'] = number_format((float) $fresh->total_amount, 2, '.', '');
                }

                $this->refreshDailyExtras($fresh, $this->pricing, $quote['rental_days']);
            }

            $fresh->save();

            if ($oldValues !== []) {
                $this->logActivity(
                    module: 'reservations',
                    action: 'updated',
                    entity: $fresh,
                    actor: $actor,
                    description: 'Reservation edited',
                    oldValues: $oldValues,
                    newValues: $newValues,
                );
            }

            return $fresh->load(['car', 'primaryClient', 'extras', 'createdBy', 'changes']);
        });
    }

    /**
     * Swap snapshot rows for the new extras list, recording old → new names.
     *
     * @param  array<int, array{extra: Extra, quantity: int}>  $extras
     */
    private function replaceExtras(Reservation $fresh, array $extras, User $actor): void
    {
        $oldNames = $fresh->extras->pluck('name')->implode(', ');
        $fresh->extras()->delete();

        $this->snapshotExtras($fresh, $extras, $fresh->rental_days, $this->pricing);

        $newNames = collect($extras)->pluck('extra.name')->implode(', ');

        if ($oldNames !== $newNames) {
            $this->recordChange($fresh, 'extras', ReservationChangeType::ManualEdit, $oldNames, $newNames, null, $actor);
        }
    }
}
