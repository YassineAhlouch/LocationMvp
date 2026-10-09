<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Per-agency rental contract/invoice layout. The column stores the value
     * of App\Enums\InvoiceTemplate; existing agencies default to the classic
     * letterhead design so nothing changes until they pick another one.
     */
    public function up(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->string('invoice_template')->default('classic')->after('extra_mileage_fee_per_km');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->dropColumn('invoice_template');
        });
    }
};
