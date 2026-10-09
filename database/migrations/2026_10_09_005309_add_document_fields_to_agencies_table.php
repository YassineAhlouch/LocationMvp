<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Document/billing fields printed on rental contracts and invoices:
     * legal identifiers (ICE, registre de commerce), a logo, plus the mileage
     * policy used to compute excess-distance fees.
     */
    public function up(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->string('ice')->nullable()->after('phone');
            $table->string('rc')->nullable()->after('ice');
            $table->string('logo_path')->nullable()->after('rc');
            $table->unsignedSmallInteger('daily_mileage_allowance')->default(250)->after('logo_path');
            $table->decimal('extra_mileage_fee_per_km', 8, 2)->default(1)->after('daily_mileage_allowance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->dropColumn([
                'ice',
                'rc',
                'logo_path',
                'daily_mileage_allowance',
                'extra_mileage_fee_per_km',
            ]);
        });
    }
};
