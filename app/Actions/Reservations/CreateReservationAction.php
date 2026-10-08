<?php

namespace App\Actions\Reservations;

use App\Actions\Payments\Concerns\SyncsReservationPaymentStatus;
use App\Actions\Reservations\Concerns\InteractsWithReservationLifecycle;
use App\Actions\Reservations\Concerns\StoresExtrasSnapshots;
use App\Enums\CarStatus;
use App\Enums\PaymentRecordStatus;
use App\Enums\PaymentStatus;
use App\Enums\ReservationChangeType;
use App\Enums\ReservationStatus;
use App\Exceptions\Domain\CarNotRentableException;
use App\Models\Car;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use App\Services\Pricing\PricingService;
use App\Services\Reservations\AvailabilityService;
use App\Services\Reservations\CarLifecycleService;
use App\Services\Reservations\ReservationNumberGenerator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CreateReservationAction
{
    use InteractsWithReservationLifecycle, StoresExtrasSnapshots, SyncsReservationPaymentStatus;

    public function __construct(
        private readonly AvailabilityService $availability,
        private readonly PricingService $pricing,
        private readonly ReservationNumberGenerator $numbers,
        private readonly CarLifecycleService $lifecycle,
    ) {}

    /**
     * Create a pending reservation with a full pricing snapshot.
     * Owns the transaction: car lock → window check → pricing → inserts.
     *
     * @param  array<string, mixed>  $data  validated StoreReservationRequest payload
     */
    public function handle(array $data, User $actor): Reservation
    {
        return DB::transaction(function () use ($data, $actor) {
            // First statement of the transaction: serializes concurrent
            // bookings for this car and pins the snapshot after any commit.
            $car = Car::query()->whereKey($data['car_id'])->lockForUpdate()->firstOrFail();

            if (in_array($car->status, [CarStatus::Maintenance, CarStatus::Inactive], strict: true)) {
                throw new CarNotRentableException($car->status);
            }

            $client = Client::query()->whereKey($data['primary_client_id'])->firstOrFail();

            $pickup = Carbon::parse($data['pickup_datetime']);
            $return = Carbon::parse($data['expected_return_datetime']);
            $this->assertValidWindow($pickup, $return);

            $this->availability->assertAvailable($car, $pickup, $return);

            $extras = $this->resolveExtras($data['extras'] ?? []);
            $dailyRate = isset($data['daily_rate']) ? (float) $data['daily_rate'] : (float) $car->daily_price;
            $quote = $this->pricing->quote($pickup, $return, $dailyRate, $extras, (float) ($data['discount_amount'] ?? 0), (int) $car->agency_id);

            $reservation = new Reservation;
            $reservation->fill([
                'agency_id' => $car->agency_id,
                'car_id' => $car->id,
                'primary_client_id' => $client->id,
                'secondary_client_id' => $data['secondary_client_id'] ?? null,
                'primary_driver_name' => $data['primary_driver_name'] ?? $client->full_name,
                'primary_driver_phone' => $data['primary_driver_phone'] ?? $client->phone,
                'primary_driver_cin' => $data['primary_driver_cin'] ?? $client->cin,
                'primary_driver_passport' => $data['primary_driver_passport'] ?? null,
                'primary_driver_license' => $data['primary_driver_license'] ?? $client->driving_license_number,
                'secondary_driver_name' => $data['secondary_driver_name'] ?? null,
                'secondary_driver_phone' => $data['secondary_driver_phone'] ?? null,
                'secondary_driver_cin' => $data['secondary_driver_cin'] ?? null,
                'secondary_driver_passport' => $data['secondary_driver_passport'] ?? null,
                'secondary_driver_license' => $data['secondary_driver_license'] ?? null,
                'pickup_location' => $data['pickup_location'] ?? null,
                'return_location' => $data['return_location'] ?? null,
                'pickup_datetime' => $pickup,
                'expected_return_datetime' => $return,
                'daily_rate' => $dailyRate,
                'discount_amount' => $quote['discount_amount'],
                'discount_reason' => $data['discount_reason'] ?? null,
                'deposit_amount' => $data['deposit_amount'] ?? 0,
                'remarks' => $data['remarks'] ?? null,
                'created_by' => $actor->id,
            ]);

            // System/computed fields are outside $fillable by design — the
            // engine owns them, so they are assigned directly, never mass filled.
            $reservation->reservation_number = $this->numbers->generate();
            $reservation->rental_days = $quote['rental_days'];
            $reservation->subtotal = $quote['subtotal'];
            $reservation->tax_amount = $quote['tax_amount'];
            $reservation->total_amount = $quote['total_amount'];
            $reservation->payment_status = PaymentStatus::Unpaid;
            $reservation->status = ReservationStatus::Pending;

            $reservation->save();

            $this->snapshotExtras($reservation, $extras, $quote['rental_days'], $this->pricing);

            $status = ReservationStatus::tryFrom($data['status'] ?? null) ?? ReservationStatus::Pending;

            $this->recordChange(
                $reservation,
                'status',
                ReservationChangeType::Creation,
                null,
                $status->value,
                null,
                $actor,
            );

            if (in_array($status, [ReservationStatus::Confirmed, ReservationStatus::Reserved], strict: true)) {
                $reservation->status = $status;
                $reservation->save();

                // Same lifecycle step as ConfirmReservationAction: the car
                // becomes reserved while this transaction holds its lock.
                $this->lifecycle->onConfirmed($car);

                $this->recordChange(
                    $reservation,
                    'status',
                    ReservationChangeType::StatusChange,
                    ReservationStatus::Pending->value,
                    $status->value,
                    null,
                    $actor,
                );
            }

            // Optional initial payments: each is recorded as a real ledger
            // row, and the reservation's payment_status (unpaid/partial/paid)
            // derives from the paid sum versus total — never from this payload.
            $paymentLines = isset($data['payment'])
                ? [$data['payment']]
                : ($data['payments'] ?? []);

            $paymentRecorded = false;
            foreach ($paymentLines as $i => $line) {
                if (! isset($line['amount'])) {
                    continue;
                }

                $payment = Payment::create([
                    'agency_id' => $reservation->agency_id,
                    'reservation_id' => $reservation->id,
                    'payment_date' => $line['payment_date'] ?? now(),
                    'amount' => $line['amount'],
                    'method' => $line['method'],
                    'reference' => $line['reference'] ?? null,
                    'status' => $line['status'] ?? PaymentRecordStatus::Paid,
                    'notes' => $line['notes'] ?? null,
                    'created_by' => $actor->id,
                ]);

                $this->logActivity(
                    module: 'payments',
                    action: 'recorded',
                    entity: $payment,
                    actor: $actor,
                    description: sprintf(
                        '%s payment of %s recorded via %s',
                        $i === 0 ? 'Initial' : 'Additional',
                        number_format((float) $payment->amount, 2, '.', ''),
                        $payment->method->value,
                    ),
                    newValues: [
                        'amount' => number_format((float) $payment->amount, 2, '.', ''),
                        'method' => $payment->method->value,
                        'status' => $payment->status->value,
                    ],
                );

                $paymentRecorded = true;
            }

            if ($paymentRecorded) {
                $this->settlePaymentEffects($reservation, 0.0, $actor, 'Initial payment at booking');
            }

            $this->logActivity(
                module: 'reservations',
                action: 'created',
                entity: $reservation,
                actor: $actor,
                description: "Reservation {$reservation->reservation_number} created"
                    .($paymentRecorded ? ' with initial payment' : ''),
                newValues: [
                    'status' => $reservation->status->value,
                    'payment_status' => $reservation->payment_status?->value,
                    'total_amount' => number_format((float) $reservation->total_amount, 2, '.', ''),
                    'pickup_datetime' => $pickup->toDateTimeString(),
                    'expected_return_datetime' => $return->toDateTimeString(),
                ],
            );

            return $reservation->load(['car', 'primaryClient', 'secondaryClient', 'extras', 'createdBy']);
        });
    }
}
