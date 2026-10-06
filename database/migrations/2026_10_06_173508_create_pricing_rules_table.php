<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->cascadeOnDelete();
            $table->string('name');

            // season = date window required; day_of_week = ISO weekdays
            // (1=Mon..7=Sun). Either type may additionally narrow with the
            // other's filter — the resolver ANDs window and weekdays.
            $table->string('rule_type', 20);
            $table->date('starts_on')->nullable();
            $table->date('ends_on')->nullable();
            $table->json('days_of_week')->nullable();

            // percent points (additive across matching rules) or a fixed
            // amount added per rental day.
            $table->string('adjustment_type', 20);
            $table->decimal('adjustment_value', 10, 2);

            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['agency_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_rules');
    }
};
