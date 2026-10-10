<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['reservation_inspection_id', 'area', 'image', 'notes'])]
class ReservationInspectionPhoto extends Model
{
    use HasFactory;

    public function inspection(): BelongsTo
    {
        return $this->belongsTo(ReservationInspection::class, 'reservation_inspection_id');
    }
}
