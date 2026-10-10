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
        Schema::create('car_installments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('financing_id')->constrained('car_financings')->cascadeOnDelete();
            $table->foreignId('car_id')->constrained('cars')->cascadeOnDelete();

            $table->unsignedSmallInteger('installment_number');
            $table->date('due_date');
            $table->decimal('amount', 10, 2);
            $table->date('paid_date')->nullable();
            $table->string('status')->default('pending');
            $table->string('reference')->nullable();

            $table->timestamps();

            // Primary access path of the statistics endpoint: one car's
            // schedule filtered by settlement state and ordered by due date.
            $table->index(['car_id', 'status', 'due_date']);
            $table->unique(['financing_id', 'installment_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_installments');
    }
};
