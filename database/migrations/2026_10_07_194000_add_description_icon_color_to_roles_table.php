<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Role presentation metadata for the role cards. Grants stay in
     * permissions; these three only drive how a role looks and reads.
     */
    public function up(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->string('description', 500)->nullable()->after('name');
            $table->string('icon', 50)->nullable()->after('description');
            $table->string('color', 50)->nullable()->after('icon');
        });

        $catalog = [
            'admin' => [
                'description' => 'Full access to every module and setting',
                'icon' => 'shield',
                'color' => 'blue',
            ],
            'manager' => [
                'description' => 'Oversight of fleet, pricing, staff and reports',
                'icon' => 'briefcase',
                'color' => 'purple',
            ],
            'agent' => [
                'description' => 'Day-to-day reservations, clients and fleet',
                'icon' => 'userGroup',
                'color' => 'emerald',
            ],
            'finance' => [
                'description' => 'Payments, expenses and financial reporting',
                'icon' => 'coin',
                'color' => 'orange',
            ],
        ];

        foreach ($catalog as $name => $attributes) {
            DB::table('roles')->where('name', $name)->update($attributes);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn(['description', 'icon', 'color']);
        });
    }
};
