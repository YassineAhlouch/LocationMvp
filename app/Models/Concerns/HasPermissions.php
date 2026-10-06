<?php

namespace App\Models\Concerns;

/**
 * Grants come from the related role's `permissions` JSON:
 * an exact grant ('clients.view'), a module wildcard ('reservations.*'),
 * or '*' (admin). Requires the using model to expose a role() relation.
 */
trait HasPermissions
{
    private ?array $cachedPermissions = null;

    /**
     * Raw grants as stored on the role.
     *
     * @return array<int, string>
     */
    public function permissions(): array
    {
        return $this->cachedPermissions ??= $this->role?->permissions ?? [];
    }

    /**
     * Whether the role grants $permission, supporting '*' and 'module.*'.
     */
    public function hasPermission(string $permission): bool
    {
        foreach ($this->permissions() as $granted) {
            if ($granted === '*' || $granted === $permission) {
                return true;
            }

            if (str_ends_with($granted, '.*')
                && str_starts_with($permission, substr($granted, 0, -1))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Flattened grants for Sanctum token abilities: wildcards expanded from
     * the config/permissions.php catalog so $user->tokenCan('reservations.confirm')
     * works as an exact match. Admin keeps literal '*'.
     *
     * @return array<int, string>
     */
    public function expandedPermissions(): array
    {
        $catalog = config('permissions', []);
        $expanded = [];

        foreach ($this->permissions() as $granted) {
            if ($granted === '*') {
                return ['*'];
            }

            if (str_ends_with($granted, '.*')) {
                $module = substr($granted, 0, -2);

                foreach ($catalog[$module] ?? [] as $verb) {
                    $expanded[] = $module.'.'.$verb;
                }

                continue;
            }

            $expanded[] = $granted;
        }

        return array_values(array_unique($expanded));
    }
}
