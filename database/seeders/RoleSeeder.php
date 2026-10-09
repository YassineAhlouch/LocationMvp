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
            'settings.*',
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
     * Presentation metadata per role: how the card reads and looks.
     * Icon keys map to components and color keys to palette entries
     * on the frontend (see views/location/roleMeta.tsx).
     *
     * @var array<string, array{description: string, icon: string, color: string}>
     */
    private const META = [
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

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::GRANTS as $name => $permissions) {
            Role::firstOrCreate(
                ['name' => $name],
                [
                    'permissions' => $permissions,
                    'is_active' => true,
                    ...self::META[$name],
                ],
            );
        }
    }
}
