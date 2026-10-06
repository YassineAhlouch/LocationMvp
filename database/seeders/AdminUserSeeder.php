<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * First administrator account. Credentials can be overridden with
     * SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in the environment.
     */
    public function run(): void
    {
        $agency = Agency::query()->firstOrFail();
        $role = Role::query()->where('name', 'admin')->firstOrFail();

        User::firstOrCreate(
            ['email' => env('SEED_ADMIN_EMAIL', 'admin@location.ma')],
            [
                'agency_id' => $agency->id,
                'role_id' => $role->id,
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'phone' => '+212 600 000 000',
                'password' => Hash::make(env('SEED_ADMIN_PASSWORD', 'password')),
                'is_active' => true,
            ],
        );
    }
}
