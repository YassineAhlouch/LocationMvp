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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->restrictOnDelete();
            $table->foreignId('brand_id')->constrained('brands')->restrictOnDelete();
            $table->foreignId('model_id')->constrained('car_models')->restrictOnDelete();
            $table->foreignId('category_id')->constrained('car_categories')->restrictOnDelete();

            $table->string('registration_number')->unique();
            $table->string('vin')->nullable()->unique();

            $table->unsignedSmallInteger('year')->nullable();
            $table->string('color')->nullable();
            $table->unsignedTinyInteger('seats_count')->nullable();
            $table->unsignedTinyInteger('doors_count')->nullable();

            $table->string('transmission_type')->nullable();
            $table->string('fuel_type')->nullable();

            $table->decimal('daily_price', 10, 2);
            $table->decimal('purchase_price', 10, 2)->nullable();

            $table->unsignedInteger('initial_mileage')->default(0);
            $table->unsignedInteger('current_mileage')->default(0);
            $table->unsignedTinyInteger('current_fuel_level')->default(100);

            $table->string('insurance_company')->nullable();
            $table->string('insurance_policy_number')->nullable();
            $table->date('insurance_expiry_date')->nullable();
            $table->date('technical_inspection_expiry')->nullable();

            $table->unsignedInteger('next_service_mileage')->nullable();
            $table->date('last_maintenance_at')->nullable();

            $table->string('status')->default('available');
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['agency_id', 'status']);
            $table->index(['agency_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
