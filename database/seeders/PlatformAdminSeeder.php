<?php

namespace Database\Seeders;

use App\Models\PlatformAdmin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PlatformAdminSeeder extends Seeder
{
    /**
     * First platform (parent) administrator. Deliberately not tied to an
     * agency. Credentials can be overridden with SEED_PLATFORM_EMAIL /
     * SEED_PLATFORM_PASSWORD in the environment.
     */
    public function run(): void
    {
        PlatformAdmin::firstOrCreate(
            ['email' => env('SEED_PLATFORM_EMAIL', 'platform@location.ma')],
            [
                'name' => 'Platform Admin',
                'password' => Hash::make(env('SEED_PLATFORM_PASSWORD', 'password')),
                'is_active' => true,
            ],
        );
    }
}
