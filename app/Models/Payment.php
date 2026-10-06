<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PaymentRecordStatus;
use App\Models\Concerns\BelongsToAgency;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'agency_id',
    'reservation_id',
    'payment_date',
    'amount',
    'method',
    'reference',
    'status',
    'notes',
    'created_by',
])]
class Payment extends Model
{
    use BelongsToAgency, HasFactory;

    protected function casts(): array
    {
        return [
            'payment_date' => 'datetime',
            'amount' => 'decimal:2',
            'method' => PaymentMethod::class,
            'status' => PaymentRecordStatus::class,
        ];
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
