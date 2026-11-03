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
        Schema::create('landing_contacts', function (Blueprint $table) {
            $table->id();

            // Agency lead captured on the public landing home: the visitor
            // asks for an account; staff reach out and create it.
            $table->string('full_name');
            $table->string('agency_name')->nullable();
            $table->string('phone');
            $table->string('email')->nullable();
            $table->text('message')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_contacts');
    }
};
