<?php

namespace App\Models;

use App\Enums\ReservationInspectionType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * The optional car condition snapshot captured at handover (pickup) or on
 * return. Scoped through its reservation, so it carries no agency_id.
 */
#[Fillable([
    'reservation_id',
    'type',
    'mileage',
    'fuel_level',
    'condition_notes',
    'areas',
    'inspected_by',
    'inspected_at',
])]
class ReservationInspection extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'type' => ReservationInspectionType::class,
            'mileage' => 'integer',
            'fuel_level' => 'integer',
            'areas' => 'array',
            'inspected_at' => 'datetime',
        ];
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(ReservationInspectionPhoto::class);
    }

    public function inspector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspected_by');
    }
}
