<?php

namespace App\Models;

use App\Enums\InstallmentStatus;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One monthly "traite" of a car financing. Child of CarFinancing and Car, so
 * it carries no agency_id of its own.
 */
#[Fillable([
    'financing_id',
    'car_id',
    'installment_number',
    'due_date',
    'amount',
    'paid_amount',
    'paid_date',
    'status',
    'reference',
])]
class CarInstallment extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'paid_date' => 'date',
            'amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'installment_number' => 'integer',
            'status' => InstallmentStatus::class,
        ];
    }

    public function financing(): BelongsTo
    {
        return $this->belongsTo(CarFinancing::class, 'financing_id');
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('status', InstallmentStatus::Pending)
            ->whereDate('due_date', '<', today());
    }

    /**
     * Derived overdue flag: stored status is authoritative, but a pending row
     * whose due date has passed reads as overdue even before the sweep runs.
     */
    public function isOverdue(): bool
    {
        return $this->status !== InstallmentStatus::Paid
            && $this->due_date !== null
            && $this->due_date->isBefore(today());
    }

    /**
     * Record a payment against the installment. The cash actually handed over
     * may differ from the scheduled `amount` (a partial or negotiated payment),
     * so it is stored separately. Calling again corrects the entry instead of
     * being ignored.
     */
    public function markPaid(
        ?CarbonInterface $paidDate = null,
        ?string $reference = null,
        ?float $paidAmount = null,
    ): void {
        $this->forceFill([
            'status' => InstallmentStatus::Paid,
            'paid_date' => $paidDate ?? $this->paid_date ?? today(),
            'reference' => $reference,
            'paid_amount' => $paidAmount ?? $this->paid_amount ?? (float) $this->amount,
        ])->save();
    }
}
