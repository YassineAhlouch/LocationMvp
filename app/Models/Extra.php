<?php

namespace App\Models;

use App\Enums\PricingType;
use App\Models\Concerns\BelongsToAgency;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Master catalog of rentable extras (insurance, baby seat, GPS, ...).
 * Reservations snapshot them into reservation_extras — there is deliberately
 * no foreign key between the snapshot and this table.
 */
#[Fillable([
    'agency_id',
    'name',
    'description',
    'pricing_type',
    'default_price',
    'is_active',
    'sort_order',
])]
class Extra extends Model
{
    use BelongsToAgency, HasFactory;

    protected function casts(): array
    {
        return [
            'pricing_type' => PricingType::class,
            'default_price' => 'decimal:2',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
