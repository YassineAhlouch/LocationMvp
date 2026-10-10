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
     * Settle the installment. Committed money is immutable, so a second
     * settlement is a no-op.
     */
    public function markPaid(?CarbonInterface $paidDate = null, ?string $reference = null): void
    {
        if ($this->status === InstallmentStatus::Paid) {
            return;
        }

        $this->forceFill([
            'status' => InstallmentStatus::Paid,
            'paid_date' => $paidDate ?? today(),
            'reference' => $reference ?? $this->reference,
        ])->save();
    }
}
