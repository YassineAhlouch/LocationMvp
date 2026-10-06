<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * The four CRM roles. Grants are module wildcards or exact
     * module.verb entries from config/permissions.php; admin holds '*'.
     *
     * @var array<string, array<int, string>>
     */
    private const GRANTS = [
        'admin' => [
            '*',
        ],
        'manager' => [
            'dashboard.*',
            'reservations.*',
            'clients.*',
            'fleet.*',
            'extras.*',
            'pricing.*',
            'payments.*',
            'expenses.*',
            'reports.*',
            'activity_logs.*',
            'notifications.*',
            'users.view',
        ],
        'agent' => [
            'dashboard.view',
            'reservations.view',
            'reservations.create',
            'reservations.update',
            'reservations.confirm',
            'reservations.activate',
            'reservations.complete',
            'reservations.cancel',
            'clients.view',
            'clients.create',
            'clients.update',
            'fleet.view',
            'extras.view',
            'payments.view',
            'notifications.view',
        ],
        'finance' => [
            'dashboard.view',
            'reservations.view',
            'clients.view',
            'payments.view',
            'payments.create',
            'payments.refund',
            'expenses.view',
            'expenses.create',
            'expenses.update',
            'reports.view',
            'activity_logs.view',
            'notifications.view',
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::GRANTS as $name => $permissions) {
            Role::firstOrCreate(
                ['name' => $name],
                ['permissions' => $permissions, 'is_active' => true],
            );
        }
    }
}
