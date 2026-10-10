<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservation_inspection_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_inspection_id')
                ->constrained('reservation_inspections')
                ->cascadeOnDelete();
            $table->string('area');
            $table->string('image');
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_inspection_photos');
    }
};
