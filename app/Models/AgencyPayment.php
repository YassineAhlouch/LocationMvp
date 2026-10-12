<?php

namespace App\Models;

use Database\Factories\AgencyPaymentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A subscription invoice the platform bills an agency. Status is derived from
 * `paid_at` and `due_date` rather than stored, so it can never drift: paid
 * once a timestamp is set, otherwise overdue once the due date has passed.
 */
#[Fillable([
    'agency_id',
    'currency_id',
    'amount',
    'period',
    'due_date',
    'paid_at',
    'reference',
    'notes',
    'recorded_by',
])]
class AgencyPayment extends Model
{
    /** @use HasFactory<AgencyPaymentFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'due_date' => 'date',
            'paid_at' => 'datetime',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    /**
     * The platform admin who confirmed the payment was received.
     */
    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(PlatformAdmin::class, 'recorded_by');
    }

    public function isPaid(): bool
    {
        return $this->paid_at !== null;
    }

    /**
     * Past its due date and still unpaid. `due_date` is a whole day, so the
     * agency is only locked once the due date has actually passed.
     */
    public function isOverdue(): bool
    {
        return ! $this->isPaid() && $this->due_date->lt(today());
    }

    public function status(): string
    {
        if ($this->isPaid()) {
            return 'paid';
        }

        return $this->isOverdue() ? 'overdue' : 'pending';
    }

    public function scopeUnpaid(Builder $query): Builder
    {
        return $query->whereNull('paid_at');
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->whereNull('paid_at')->whereDate('due_date', '<', today());
    }
}
