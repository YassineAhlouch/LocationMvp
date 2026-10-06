<?php

namespace App\Models;

use App\Models\Concerns\BelongsToAgency;
use App\Models\Concerns\HasPermissions;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'agency_id',
    'role_id',
    'first_name',
    'last_name',
    'email',
    'phone',
    'password',
    'address',
    'avatar',
    'is_active',
])]
#[Hidden(['password'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use BelongsToAgency, HasApiTokens, HasFactory, HasPermissions, Notifiable, SoftDeletes;

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function createdReservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'created_by');
    }

    public function approvedReservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'approved_by');
    }

    public function recordedPayments(): HasMany
    {
        return $this->hasMany(Payment::class, 'created_by');
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    /**
     * Full display name of the staff member.
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }
}
