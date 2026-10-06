<?php

namespace App\Models;

use App\Enums\ClientSource;
use App\Enums\ClientStatus;
use App\Models\Concerns\BelongsToAgency;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'agency_id',
    'first_name',
    'last_name',
    'phone',
    'secondary_phone',
    'email',
    'cin',
    'passport_number',
    'driving_license_number',
    'driving_license_expiry',
    'birth_date',
    'birth_place',
    'nationality',
    'address',
    'city',
    'country',
    'notes',
    'source',
    'status',
    'is_active',
])]
class Client extends Model
{
    use BelongsToAgency, HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'driving_license_expiry' => 'date',
            'last_reservation_at' => 'datetime',
            'status' => ClientStatus::class,
            'source' => ClientSource::class,
            'is_active' => 'boolean',
        ];
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'primary_client_id');
    }

    public function secondaryReservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'secondary_client_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeStatus(Builder $query, ClientStatus $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeSearch(Builder $query, string $term): Builder
    {
        $like = '%'.trim($term).'%';

        return $query->where(function (Builder $builder) use ($like) {
            $builder->where('first_name', 'like', $like)
                ->orWhere('last_name', 'like', $like)
                ->orWhere('phone', 'like', $like)
                ->orWhere('secondary_phone', 'like', $like)
                ->orWhere('email', 'like', $like)
                ->orWhere('cin', 'like', $like)
                ->orWhere('driving_license_number', 'like', $like);
        });
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }
}
