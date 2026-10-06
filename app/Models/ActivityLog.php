<?php

namespace App\Models;

use App\Models\Concerns\BelongsToAgency;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Append-only activity trail. Writes come from ActivityLogger (queued,
 * after commit) — never from model observers on this model itself.
 */
#[Fillable([
    'agency_id',
    'user_id',
    'module',
    'entity_type',
    'entity_id',
    'action',
    'description',
    'old_values',
    'new_values',
    'ip_address',
    'user_agent',
])]
class ActivityLog extends Model
{
    public const UPDATED_AT = null;

    use BelongsToAgency, HasFactory;

    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
