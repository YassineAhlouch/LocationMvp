<?php

namespace Database\Seeders;

use App\Models\Agency;
use Illuminate\Database\Seeder;

class AgencySeeder extends Seeder
{
    /**
     * First (and currently only) agency. Multi-agency support later just
     * adds rows here — every scoped table already points at agencies.id.
     */
    public function run(): void
    {
        Agency::firstOrCreate(
            ['name' => 'Location Marrakech'],
            [
                'email' => 'contact@location-marrakech.ma',
                'phone' => '+212 5 24 00 00 00',
                'address' => 'Guéliz, Marrakech',
                'city' => 'Marrakech',
                'country' => 'Morocco',
                'is_active' => true,
            ],
        );
    }
}
