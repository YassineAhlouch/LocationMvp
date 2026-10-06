<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Coverage gaps found in the STEP 8 read-path audit:
     *
     * - reservation_changes carried only FK indexes, but the per-reservation
     *   history and the global feed query by (reservation, created_at) and
     *   (change_type, created_at).
     * - activity_logs could be filtered by entity but had no entity index.
     */
    public function up(): void
    {
        Schema::table('reservation_changes', function (Blueprint $table) {
            $table->index(['reservation_id', 'created_at'], 'reservation_changes_reservation_created_index');
            $table->index(['change_type', 'created_at'], 'reservation_changes_type_created_index');
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->index(['entity_type', 'entity_id'], 'activity_logs_entity_index');
        });
    }

    public function down(): void
    {
        Schema::table('reservation_changes', function (Blueprint $table) {
            $table->dropIndex('reservation_changes_reservation_created_index');
            $table->dropIndex('reservation_changes_type_created_index');
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex('activity_logs_entity_index');
        });
    }
};
