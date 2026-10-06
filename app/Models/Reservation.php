<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use App\Enums\ReservationStatus;
use App\Models\Concerns\BelongsToAgency;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'agency_id',
    'car_id',
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
    'actual_return_datetime',
    'pickup_mileage',
    'return_mileage',
    'pickup_fuel_level',
    'return_fuel_level',
    'daily_rate',
    'discount_amount',
    'discount_reason',
    'deposit_amount',
    'remarks',
    'reported_issues',
    'created_by',
])]
class Reservation extends Model
{
    use BelongsToAgency, HasFactory;

    /**
     * Computed by the pricing engine and the state machine — never mass assigned.
     * Deliberately absent from $fillable: reservation_number, rental_days,
     * subtotal, tax_amount, total_amount, status, payment_status, approved_by.
     */
    protected function casts(): array
    {
        return [
            'status' => ReservationStatus::class,
            'payment_status' => PaymentStatus::class,
            'pickup_datetime' => 'datetime',
            'expected_return_datetime' => 'datetime',
            'actual_return_datetime' => 'datetime',
            'pickup_mileage' => 'integer',
            'return_mileage' => 'integer',
            'pickup_fuel_level' => 'integer',
            'return_fuel_level' => 'integer',
            'rental_days' => 'integer',
            'daily_rate' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
        ];
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function primaryClient(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'primary_client_id');
    }

    public function secondaryClient(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'secondary_client_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function extras(): HasMany
    {
        return $this->hasMany(ReservationExtra::class);
    }

    public function changes(): HasMany
    {
        return $this->hasMany(ReservationChange::class)
            ->orderByDesc('created_at')
            ->orderByDesc('id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Reservations that block $carId for the given time window.
     *
     * Used by the availability engine inside a locked transaction — see
     * AvailabilityService in the reservation engine step.
     *
     * @param  CarbonInterface  $pickup  requested pickup datetime
     * @param  CarbonInterface  $return  requested return datetime
     */
    public function scopeOverlapping(
        Builder $query,
        int $carId,
        CarbonInterface $pickup,
        CarbonInterface $return,
        ?int $exceptReservationId = null,
    ): Builder {
        return $query
            ->where('car_id', $carId)
            ->whereIn('status', ReservationStatus::blocking())
            ->where('pickup_datetime', '<', $return)
            ->where('expected_return_datetime', '>', $pickup)
            ->when($exceptReservationId !== null, function (Builder $builder) use ($exceptReservationId) {
                $builder->whereKeyNot($exceptReservationId);
            });
    }

    public function scopeStatus(Builder $query, ReservationStatus $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', ReservationStatus::Active);
    }

    public function isTerminal(): bool
    {
        return $this->status->isTerminal();
    }
}
