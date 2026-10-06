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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->restrictOnDelete();
            $table->string('reservation_number')->unique();

            $table->foreignId('car_id')->constrained('cars')->restrictOnDelete();
            $table->foreignId('primary_client_id')->constrained('clients')->restrictOnDelete();
            $table->foreignId('secondary_client_id')->nullable()->constrained('clients')->nullOnDelete();

            // Driver snapshots: frozen at booking time, they never follow client edits.
            $table->string('primary_driver_name')->nullable();
            $table->string('primary_driver_phone')->nullable();
            $table->string('primary_driver_cin')->nullable();
            $table->string('primary_driver_passport')->nullable();
            $table->string('primary_driver_license')->nullable();
            $table->string('secondary_driver_name')->nullable();
            $table->string('secondary_driver_phone')->nullable();
            $table->string('secondary_driver_cin')->nullable();
            $table->string('secondary_driver_passport')->nullable();
            $table->string('secondary_driver_license')->nullable();

            $table->string('pickup_location')->nullable();
            $table->string('return_location')->nullable();

            $table->dateTime('pickup_datetime');
            $table->dateTime('expected_return_datetime');
            $table->dateTime('actual_return_datetime')->nullable();

            $table->unsignedInteger('pickup_mileage')->nullable();
            $table->unsignedInteger('return_mileage')->nullable();
            $table->unsignedTinyInteger('pickup_fuel_level')->nullable();
            $table->unsignedTinyInteger('return_fuel_level')->nullable();

            $table->decimal('daily_rate', 10, 2);
            $table->unsignedInteger('rental_days');

            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('discount_reason')->nullable();
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('deposit_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);

            $table->string('payment_status')->default('unpaid');
            $table->string('status')->default('pending');

            $table->text('remarks')->nullable();
            $table->text('reported_issues')->nullable();

            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            // Overlap query: WHERE car_id = ? AND status IN (...) AND pickup < ? AND return > ?
            $table->index(
                ['car_id', 'status', 'pickup_datetime', 'expected_return_datetime'],
                'reservations_overlap_index'
            );
            $table->index(['agency_id', 'status']);
            $table->index(['agency_id', 'pickup_datetime']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
