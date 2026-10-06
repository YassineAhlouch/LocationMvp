<?php

namespace App\Models;

use App\Enums\ReservationChangeType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Append-only audit of business-meaningful reservation edits
 * (extension, discount, date change, ...). No updated_at by design.
 */
#[Fillable([
    'reservation_id',
    'field_name',
    'change_type',
    'old_value',
    'new_value',
    'reason',
    'created_by',
])]
class ReservationChange extends Model
{
    public const UPDATED_AT = null;

    use HasFactory;

    protected function casts(): array
    {
        return [
            'change_type' => ReservationChangeType::class,
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
