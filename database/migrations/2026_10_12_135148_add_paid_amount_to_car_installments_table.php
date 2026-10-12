<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('car_installments', function (Blueprint $table) {
            // The real cash handed over, which may differ from the scheduled
            // `amount` (partial or negotiated payments). Null while unsettled.
            $table->decimal('paid_amount', 10, 2)->nullable()->after('amount');
        });

        // Existing settled rows were paid in full, so seed the new column from
        // the scheduled amount to keep the money totals unchanged.
        DB::table('car_installments')
            ->where('status', 'paid')
            ->update(['paid_amount' => DB::raw('amount')]);
    }

    /**
     * Reverse the migrations. Dropping the column discards recorded paid
     * amounts, so this is a lossy rollback.
     */
    public function down(): void
    {
        Schema::table('car_installments', function (Blueprint $table) {
            $table->dropColumn('paid_amount');
        });
    }
};
