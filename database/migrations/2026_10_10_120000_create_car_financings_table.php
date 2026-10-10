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
        Schema::create('car_financings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->unique()->constrained('cars')->cascadeOnDelete();

            $table->date('purchase_date');
            $table->decimal('purchase_price', 10, 2);
            $table->decimal('down_payment', 10, 2)->default(0);
            $table->decimal('financed_amount', 10, 2);
            $table->decimal('installment_amount', 10, 2);
            $table->unsignedSmallInteger('installments_count');
            $table->date('first_due_date');

            $table->string('lender')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_financings');
    }
};
