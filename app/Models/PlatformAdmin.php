<?php

namespace App\Models;

use Database\Factories\PlatformAdminFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

/**
 * A platform-level administrator with full control across every agency.
 *
 * Kept apart from App\Models\User on purpose: staff are always bound to one
 * agency and shielded by the BelongsToAgency global scope, while platform
 * admins sit above tenancy. Tokens are issued the wildcard ability by the
 * platform login flow.
 */
#[Fillable([
    'name',
    'email',
    'password',
    'is_active',
    'last_login_at',
])]
#[Hidden(['password'])]
class PlatformAdmin extends Authenticatable
{
    /** @use HasFactory<PlatformAdminFactory> */
    use HasApiTokens, HasFactory;

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }
}
