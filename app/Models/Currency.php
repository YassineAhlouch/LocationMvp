<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A currency agencies price and invoice in (MAD, USD, EUR, ...).
 * Shared platform master data, like brands — not agency-scoped.
 */
#[Fillable([
    'code',
    'name',
    'symbol',
    'decimals',
    'is_active',
])]
class Currency extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'decimals' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function agencies(): HasMany
    {
        return $this->hasMany(Agency::class);
    }
}
