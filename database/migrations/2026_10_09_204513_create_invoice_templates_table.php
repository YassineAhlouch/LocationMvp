<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Catalog of rental contract/invoice layouts. The slug is the stable key
     * the frontend maps to a renderer, so it must never change; the two
     * built-in designs ship with the application. Each agency is linked to
     * exactly one of these rows.
     */
    public function up(): void
    {
        Schema::create('invoice_templates', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        $now = now();

        DB::table('invoice_templates')->insert([
            ['slug' => 'classic', 'name' => 'Classic (letterhead)', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['slug' => 'atlas', 'name' => 'Atlas (bilingual FR/AR)', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_templates');
    }
};
