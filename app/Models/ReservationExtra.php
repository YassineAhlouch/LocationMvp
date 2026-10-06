<?php

namespace App\Models;

use App\Enums\PricingType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Immutable price snapshot of an extra at booking time. Follows the
 * reservation, never the extras catalog — no updated_at by design.
 */
#[Fillable([
    'reservation_id',
    'name',
    'description',
    'pricing_type',
    'quantity',
    'unit_price',
    'total_price',
])]
class ReservationExtra extends Model
{
    public const UPDATED_AT = null;

    use HasFactory;

    protected function casts(): array
    {
        return [
            'pricing_type' => PricingType::class,
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'total_price' => 'decimal:2',
        ];
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }
}
