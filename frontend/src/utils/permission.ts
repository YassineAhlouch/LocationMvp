/**
 * Permission helpers shared by navigation and page actions.
 *
 * The API stores grants as exact `module.verb` entries, a module wildcard
 * (`module.*`), or `*` for the master role.
 */
export const hasPermission = (
    permissions: string[],
    required: string,
): boolean => {
    if (permissions.includes('*') || permissions.includes(required)) {
        return true
    }

    const module = required.split('.')[0]

    return permissions.includes(`${module}.*`)
}

export const hasAnyPermission = (
    permissions: string[],
    required: string[],
): boolean =>
    required.length === 0 ||
    required.some((permission) => hasPermission(permissions, permission))

export const hasEveryPermission = (
    permissions: string[],
    required: string[],
): boolean =>
    required.every((permission) => hasPermission(permissions, permission))
