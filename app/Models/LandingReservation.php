<?php

namespace App\Models;

use App\Enums\LandingReservationStatus;
use App\Models\Concerns\BelongsToAgency;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'agency_id',
    'car_id',
    'full_name',
    'phone',
    'email',
    'pickup_datetime',
    'expected_return_datetime',
    'message',
    'status',
])]
class LandingReservation extends Model
{
    use BelongsToAgency, HasFactory;

    protected function casts(): array
    {
        return [
            'status' => LandingReservationStatus::class,
            'pickup_datetime' => 'datetime',
            'expected_return_datetime' => 'datetime',
        ];
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}
