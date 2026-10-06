<?php

namespace Database\Seeders;

use App\Enums\CarStatus;
use App\Enums\ClientSource;
use App\Enums\FuelType;
use App\Enums\PricingType;
use App\Enums\TransmissionType;
use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarCategory;
use App\Models\CarModel;
use App\Models\Client;
use App\Models\Extra;
use Illuminate\Database\Seeder;

/**
 * Optional starter catalog for the agency, so the API has real-looking data
 * the moment it is seeded (brands, models, categories, extras, cars and a
 * few clients). Every row is idempotent (keyed on its business identity) and
 * belongs to the seeded agency. Delete this seeder from DatabaseSeeder when
 * you want a clean slate.
 */
class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $agency = Agency::query()->firstOrFail();

        $brands = collect([
            'Dacia' => ['Duster', 'Logan', 'Sandero'],
            'Renault' => ['Clio', 'Megane'],
            'Volkswagen' => ['Golf', 'Polo'],
        ]);

        foreach ($brands as $brandName => $models) {
            $brand = Brand::firstOrCreate(['name' => $brandName]);

            foreach ($models as $modelName) {
                CarModel::firstOrCreate(
                    ['brand_id' => $brand->id, 'name' => $modelName],
                );
            }
        }

        $economy = CarCategory::firstOrCreate(
            ['name' => 'Economy'],
            ['description' => 'Compact cars, best price for city driving.'],
        );
        $suv = CarCategory::firstOrCreate(
            ['name' => 'SUV'],
            ['description' => 'Comfortable SUVs for the Atlas and the desert roads.'],
        );

        $cars = [
            [
                'brand' => 'Dacia', 'model' => 'Logan', 'category' => $economy,
                'registration_number' => '12345-A-10', 'year' => 2022,
                'color' => 'White', 'seats_count' => 5,
                'transmission_type' => TransmissionType::Manual, 'fuel_type' => FuelType::Diesel,
                'daily_price' => 250.00, 'purchase_price' => 145000.00,
            ],
            [
                'brand' => 'Dacia', 'model' => 'Sandero', 'category' => $economy,
                'registration_number' => '23456-B-2', 'year' => 2023,
                'color' => 'Silver', 'seats_count' => 5,
                'transmission_type' => TransmissionType::Manual, 'fuel_type' => FuelType::Petrol,
                'daily_price' => 280.00, 'purchase_price' => 154000.00,
            ],
            [
                'brand' => 'Renault', 'model' => 'Clio', 'category' => $economy,
                'registration_number' => '34567-C-28', 'year' => 2024,
                'color' => 'Black', 'seats_count' => 5,
                'transmission_type' => TransmissionType::Automatic, 'fuel_type' => FuelType::Petrol,
                'daily_price' => 320.00, 'purchase_price' => 178000.00,
            ],
            [
                'brand' => 'Volkswagen', 'model' => 'Golf', 'category' => $suv,
                'registration_number' => '45678-D-7', 'year' => 2021,
                'color' => 'Blue', 'seats_count' => 5,
                'transmission_type' => TransmissionType::Automatic, 'fuel_type' => FuelType::Diesel,
                'daily_price' => 550.00, 'purchase_price' => 265000.00,
            ],
        ];

        foreach ($cars as $car) {
            $brand = Brand::where('name', $car['brand'])->firstOrFail();
            $model = CarModel::where('brand_id', $brand->id)->where('name', $car['model'])->firstOrFail();

            Car::firstOrCreate(
                ['agency_id' => $agency->id, 'registration_number' => $car['registration_number']],
                [
                    'agency_id' => $agency->id,
                    'brand_id' => $brand->id,
                    'model_id' => $model->id,
                    'category_id' => $car['category']->id,
                    'vin' => null,
                    'year' => $car['year'],
                    'color' => $car['color'],
                    'seats_count' => $car['seats_count'],
                    'doors_count' => 4,
                    'transmission_type' => $car['transmission_type'],
                    'fuel_type' => $car['fuel_type'],
                    'daily_price' => $car['daily_price'],
                    'purchase_price' => $car['purchase_price'],
                    'initial_mileage' => 25000,
                    'current_mileage' => 25000,
                    'current_fuel_level' => 100,
                    'status' => CarStatus::Available,
                    'is_active' => true,
                ],
            );
        }

        $extras = [
            ['name' => 'GPS navigation', 'default_price' => 30.00, 'pricing_type' => PricingType::Daily],
            ['name' => 'Baby seat', 'default_price' => 25.00, 'pricing_type' => PricingType::Daily],
            ['name' => 'Additional driver', 'default_price' => 40.00, 'pricing_type' => PricingType::Daily],
            ['name' => 'Full insurance', 'default_price' => 150.00, 'pricing_type' => PricingType::Daily],
        ];

        foreach ($extras as $extra) {
            Extra::firstOrCreate(
                ['agency_id' => $agency->id, 'name' => $extra['name']],
                [
                    'agency_id' => $agency->id,
                    'name' => $extra['name'],
                    'default_price' => $extra['default_price'],
                    'pricing_type' => $extra['pricing_type'],
                    'is_active' => true,
                ],
            );
        }

        $clients = [
            [
                'first_name' => 'Youssef', 'last_name' => 'El Amrani', 'phone' => '+212 661 111 111',
                'email' => 'youssef.elamrani@example.ma', 'nationality' => 'Marocaine',
                'driving_license_number' => 'DL-88412', 'source' => ClientSource::Whatsapp,
            ],
            [
                'first_name' => 'Sophie', 'last_name' => 'Martin', 'phone' => '+33 6 12 34 56 78',
                'email' => 'sophie.martin@example.fr', 'nationality' => 'Française',
                'driving_license_number' => 'F-567890', 'source' => ClientSource::Facebook,
            ],
            [
                'first_name' => 'Karim', 'last_name' => 'Bennani', 'phone' => '+212 662 222 222',
                'email' => 'karim.bennani@example.ma', 'nationality' => 'Marocaine',
                'driving_license_number' => 'DL-91230', 'source' => ClientSource::Referral,
            ],
        ];

        foreach ($clients as $client) {
            Client::firstOrCreate(
                ['agency_id' => $agency->id, 'phone' => $client['phone']],
                [
                    'agency_id' => $agency->id,
                    'first_name' => $client['first_name'],
                    'last_name' => $client['last_name'],
                    'phone' => $client['phone'],
                    'email' => $client['email'],
                    'nationality' => $client['nationality'],
                    'driving_license_number' => $client['driving_license_number'],
                    'source' => $client['source'],
                    'is_active' => true,
                ],
            );
        }
    }
}