<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The currency an agency prices and invoices in. Nullable so existing
     * tenants stay untouched; the platform assigns it when it makes sense.
     */
    public function up(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->foreignId('currency_id')
                ->nullable()
                ->after('invoice_template_id')
                ->constrained('currencies')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->dropConstrainedForeignId('currency_id');
        });
    }
};
