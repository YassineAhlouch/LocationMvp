<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Subscription invoices the platform issues to each agency. Kept apart
     * from the reservations `payments` ledger: those record money an agency
     * receives from its own customers, while these record money the agency
     * owes the platform. An unpaid invoice past its due date locks the
     * agency workspace (see EnsureAgencyCanWrite).
     */
    public function up(): void
    {
        Schema::create('agency_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->foreignId('currency_id')->nullable()->constrained('currencies')->nullOnDelete();

            $table->decimal('amount', 10, 2);
            $table->string('period', 7)->nullable(); // YYYY-MM
            $table->date('due_date');
            $table->timestamp('paid_at')->nullable();
            $table->string('reference')->nullable();
            $table->text('notes')->nullable();

            $table->foreignId('recorded_by')->nullable()->constrained('platform_admins')->nullOnDelete();
            $table->timestamps();

            $table->index(['agency_id', 'due_date']);
            $table->index('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agency_payments');
    }
};
