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
        Schema::create('extras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->restrictOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('pricing_type')->default('fixed');
            $table->decimal('default_price', 10, 2);
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['agency_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('extras');
    }
};
