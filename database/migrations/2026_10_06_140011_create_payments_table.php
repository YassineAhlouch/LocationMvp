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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->restrictOnDelete();
            $table->foreignId('reservation_id')->constrained('reservations')->restrictOnDelete();

            $table->timestamp('payment_date')->useCurrent();
            $table->decimal('amount', 10, 2);
            $table->string('method');
            $table->string('reference')->nullable();
            $table->string('status')->default('paid');
            $table->text('notes')->nullable();

            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->index(['agency_id', 'payment_date']);
            $table->index(['agency_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
