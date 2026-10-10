<?php

namespace App\Models;

use App\Enums\InstallmentStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Purchase financing for one car: the cash advance paid up front plus the
 * monthly "traites" that pay off the rest. Child of Car (like car_images),
 * so it carries no agency_id of its own — it is always reached through the
 * agency-scoped car.
 */
#[Fillable([
    'car_id',
    'purchase_date',
    'purchase_price',
    'down_payment',
    'financed_amount',
    'installment_amount',
    'installments_count',
    'first_due_date',
    'lender',
    'notes',
])]
class CarFinancing extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        // A financing without its installment schedule is meaningless, so the
        // rows are generated the moment the financing row exists.
        static::created(function (self $financing): void {
            $financing->generateInstallments();
        });
    }

    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'first_due_date' => 'date',
            'purchase_price' => 'decimal:2',
            'down_payment' => 'decimal:2',
            'financed_amount' => 'decimal:2',
            'installment_amount' => 'decimal:2',
            'installments_count' => 'integer',
        ];
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function installments(): HasMany
    {
        return $this->hasMany(CarInstallment::class, 'financing_id')
            ->orderBy('installment_number');
    }

    /**
     * Materialise the full schedule from the financing terms. Due dates step
     * one month from the first due date; the last row absorbs any rounding
     * remainder so the schedule sums exactly to the financed amount.
     */
    public function generateInstallments(): void
    {
        $count = max(1, (int) $this->installments_count);
        $installment = round((float) $this->installment_amount, 2);
        $financed = round((float) $this->financed_amount, 2);
        $firstDue = $this->first_due_date->copy();

        $rows = [];
        $allocated = 0.0;

        for ($number = 1; $number <= $count; $number++) {
            $amount = $number === $count
                ? round($financed - $allocated, 2)
                : $installment;

            // Guard a mis-entered schedule (financed < count × amount): keep
            // the regular amount rather than emitting a negative final row.
            if ($amount <= 0) {
                $amount = $installment;
            }

            $allocated = round($allocated + $amount, 2);

            $rows[] = [
                'car_id' => $this->car_id,
                'installment_number' => $number,
                'due_date' => $firstDue->copy()->addMonthsNoOverflow($number - 1)->toDateString(),
                'amount' => $amount,
                'status' => InstallmentStatus::Pending,
            ];
        }

        $this->installments()->createMany($rows);
    }
}
