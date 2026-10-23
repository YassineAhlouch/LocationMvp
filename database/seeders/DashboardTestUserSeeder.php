<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Local-only accounts for checking how the dashboard behaves under different
 * permission sets. Every account uses the password "password".
 *
 * The standard manager/agent/finance roles already exist; the extra roles
 * cover the two dashboard extremes: view-only and no dashboard at all.
 */
class DashboardTestUserSeeder extends Seeder
{
    private const PASSWORD = 'password';

    /**
     * @var array<string, array{description: string, icon: string, color: string, permissions: array<int, string>}>
     */
    private const ROLES = [
        'dashboard_only' => [
            'description' => 'Read-only dashboard access',
            'icon' => 'desktop',
            'color' => 'cyan',
            'permissions' => ['dashboard.view'],
        ],
        'reports_only' => [
            'description' => 'Dashboard and reports access',
            'icon' => 'chart',
            'color' => 'purple',
            'permissions' => ['dashboard.view', 'reports.view'],
        ],
        'no_dashboard' => [
            'description' => 'Fleet and clients access without the dashboard',
            'icon' => 'eye',
            'color' => 'gray',
            'permissions' => ['fleet.view', 'clients.view'],
        ],
    ];

    /**
     * @var array<int, array{email: string, first_name: string, last_name: string, role: string}>
     */
    private const USERS = [
        [
            'email' => 'test.manager@location.ma',
            'first_name' => 'Test',
            'last_name' => 'Manager',
            'role' => 'manager',
        ],
        [
            'email' => 'test.agent@location.ma',
            'first_name' => 'Test',
            'last_name' => 'Agent',
            'role' => 'agent',
        ],
        [
            'email' => 'test.finance@location.ma',
            'first_name' => 'Test',
            'last_name' => 'Finance',
            'role' => 'finance',
        ],
        [
            'email' => 'test.dashboard@location.ma',
            'first_name' => 'Test',
            'last_name' => 'Dashboard Only',
            'role' => 'dashboard_only',
        ],
        [
            'email' => 'test.reports@location.ma',
            'first_name' => 'Test',
            'last_name' => 'Reports Only',
            'role' => 'reports_only',
        ],
        [
            'email' => 'test.nodashboard@location.ma',
            'first_name' => 'Test',
            'last_name' => 'No Dashboard',
            'role' => 'no_dashboard',
        ],
    ];

    public function run(): void
    {
        if (app()->environment('production')) {
            $this->command?->warn('DashboardTestUserSeeder is disabled in production.');

            return;
        }

        $agency = Agency::query()->firstOrFail();

        $this->call(RoleSeeder::class);

        foreach (self::ROLES as $name => $attributes) {
            Role::updateOrCreate(
                ['name' => $name],
                [...$attributes, 'is_active' => true],
            );
        }

        foreach (self::USERS as $account) {
            $role = Role::query()->where('name', $account['role'])->firstOrFail();

            User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'agency_id' => $agency->id,
                    'role_id' => $role->id,
                    'first_name' => $account['first_name'],
                    'last_name' => $account['last_name'],
                    'phone' => null,
                    'password' => Hash::make(self::PASSWORD),
                    'is_active' => true,
                ],
            );
        }
    }
}
