<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Link every agency to exactly one invoice template. The column is NOT
     * NULL and defaults to the classic design, so an agency can never be
     * without a layout. The legacy string column (invoice_template) is mapped
     * onto the catalog rows and then dropped.
     */
    public function up(): void
    {
        $classicId = DB::table('invoice_templates')->where('slug', 'classic')->value('id');
        $atlasId = DB::table('invoice_templates')->where('slug', 'atlas')->value('id');

        Schema::table('agencies', function (Blueprint $table) use ($classicId) {
            $table->foreignId('invoice_template_id')
                ->after('extra_mileage_fee_per_km')
                ->default($classicId)
                ->constrained('invoice_templates')
                ->restrictOnDelete();
        });

        if (Schema::hasColumn('agencies', 'invoice_template')) {
            DB::table('agencies')
                ->where('invoice_template', 'atlas')
                ->update(['invoice_template_id' => $atlasId]);

            Schema::table('agencies', function (Blueprint $table) {
                $table->dropColumn('invoice_template');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->string('invoice_template')->default('classic')->after('extra_mileage_fee_per_km');
            $table->dropConstrainedForeignId('invoice_template_id');
        });
    }
};
