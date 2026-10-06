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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->restrictOnDelete();

            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->index();
            $table->string('secondary_phone')->nullable();
            $table->string('email')->nullable();

            $table->string('cin')->nullable();
            $table->string('passport_number')->nullable();
            $table->string('driving_license_number')->nullable();
            $table->date('driving_license_expiry')->nullable();

            $table->date('birth_date')->nullable();
            $table->string('birth_place')->nullable();
            $table->string('nationality')->nullable();

            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->default('Morocco');

            $table->text('notes')->nullable();
            $table->string('source')->nullable();
            $table->string('status')->default('normal');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_reservation_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['agency_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
