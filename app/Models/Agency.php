<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'email',
    'phone',
    'address',
    'city',
    'country',
    'ice',
    'rc',
    'logo_path',
    'daily_mileage_allowance',
    'extra_mileage_fee_per_km',
    'invoice_template_id',
    'currency_id',
    'is_active',
])]
class Agency extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'daily_mileage_allowance' => 'integer',
            'extra_mileage_fee_per_km' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * The single contract/invoice layout this agency prints. Assigned by an
     * administrator; agencies cannot switch it themselves.
     */
    public function invoiceTemplate(): BelongsTo
    {
        return $this->belongsTo(InvoiceTemplate::class);
    }

    /**
     * The currency this agency prices and invoices in. Assigned by the
     * platform; an agency without one falls back to the platform default.
     */
    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    public function cars(): HasMany
    {
        return $this->hasMany(Car::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function extras(): HasMany
    {
        return $this->hasMany(Extra::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Subscription invoices the platform issues this agency (money the agency
     * owes the platform — not the customer payments above).
     */
    public function agencyPayments(): HasMany
    {
        return $this->hasMany(AgencyPayment::class);
    }

    /**
     * Whether the agency owes money past its due date. This is the trigger for
     * the read-only lock enforced by EnsureAgencyCanWrite.
     */
    public function hasOverduePayment(): bool
    {
        return $this->agencyPayments()->overdue()->exists();
    }

    /**
     * Total of every unpaid invoice (overdue or not), in the agency's currency.
     */
    public function outstandingAmount(): float
    {
        return (float) $this->agencyPayments()->unpaid()->sum('amount');
    }

    /**
     * The soonest unpaid due date, or null when nothing is outstanding.
     */
    public function nextDueDate(): ?string
    {
        return $this->agencyPayments()
            ->unpaid()
            ->orderBy('due_date')
            ->first()
            ?->due_date
            ?->toDateString();
    }

    /**
     * Billing snapshot for the platform agency list/detail. Prefers aggregate
     * attributes loaded on the query (withSum/withExists/withMin) so listing
     * pages stay a single query, and falls back to direct queries otherwise.
     *
     * @return array{outstanding_amount: float, has_overdue_payment: bool, next_due_date: string|null}
     */
    public function billingSummary(): array
    {
        return [
            'outstanding_amount' => (float) ($this->outstanding_amount ?? $this->outstandingAmount()),
            'has_overdue_payment' => (bool) ($this->has_overdue_payment ?? $this->hasOverduePayment()),
            'next_due_date' => $this->next_due_date ?? $this->nextDueDate(),
        ];
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(CarExpense::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }
}
