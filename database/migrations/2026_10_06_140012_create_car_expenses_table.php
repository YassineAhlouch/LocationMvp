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
        Schema::create('car_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->restrictOnDelete();
            $table->foreignId('car_id')->constrained('cars')->cascadeOnDelete();

            $table->string('type');
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('vendor')->nullable();

            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->date('paid_date')->nullable();
            $table->string('attachment')->nullable();

            $table->string('status')->default('pending');

            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->index(['agency_id', 'status']);
            $table->index(['agency_id', 'due_date']);
            $table->index(['car_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_expenses');
    }
};
