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
        Schema::create('landing_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->restrictOnDelete();

            // Kept nullable: deleting the advertised car must not lose the
            // incoming request, staff still see the lead.
            $table->foreignId('car_id')->nullable()->constrained('cars')->nullOnDelete();

            // Contact the visitor left on the public landing form.
            $table->string('full_name');
            $table->string('phone');
            $table->string('email')->nullable();

            // Intent picked on the landing, refined with the client later.
            $table->dateTime('pickup_datetime')->nullable();
            $table->dateTime('expected_return_datetime')->nullable();

            $table->text('message')->nullable();

            // App\Enums\LandingReservationStatus — new/contacted/converted/rejected.
            $table->string('status')->default('new');

            $table->timestamps();

            $table->index(['agency_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_reservations');
    }
};
