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
        Agency::updateOrCreate(
            ['name' => 'Location Marrakech'],
            [
                'email' => 'contact@location-marrakech.ma',
                'phone' => '+212 5 24 00 00 00',
                'address' => 'Guéliz, Marrakech',
                'city' => 'Marrakech',
                'country' => 'Morocco',
                'ice' => '001234567000045',
                'rc' => 'RC/MARRAKECH/2019/12345',
                'daily_mileage_allowance' => 250,
                'extra_mileage_fee_per_km' => 1,
                'is_active' => true,
            ],
        );
    }
}
