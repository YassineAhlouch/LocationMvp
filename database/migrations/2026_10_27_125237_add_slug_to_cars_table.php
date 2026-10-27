<?php

use App\Models\Car;
use App\Support\Slugs\UniqueSlug;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Public QR links are built from vehicle slugs instead of ids, so every
     * existing car gets one derived from its plate before the unique index
     * lands. Slugs are written once here and by the Car creating hook —
     * regenerating them later would break posters already on the street.
     */
    public function up(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('registration_number');
        });

        Car::query()
            ->withTrashed()
            ->whereNull('slug')
            ->orderBy('id')
            ->get()
            ->each(fn (Car $car) => $car->forceFill([
                'slug' => UniqueSlug::make($car, (string) $car->registration_number, (int) $car->getKey()),
            ])->saveQuietly());

        Schema::table('cars', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    public function down(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
