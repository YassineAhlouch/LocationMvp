import { useMemo } from 'react'
import navigationConfig from '@/configs/navigation.config'
import navigationPermissions from '@/configs/navigation.config/permissions'
import { useSessionUser } from '@/store/authStore'
import { hasAnyPermission, hasPermission } from '@/utils/permission'
import type { NavigationTree } from '@/@types/navigation'

/**
 * The navigation tree filtered to the entries the signed-in user may see.
 * Every staff member carries the 'user' authority, so shared entries always
 * show; entries scoped to 'admin' (for example the settings screen) only show
 * for administrators. An empty authority — e.g. a session persisted before
 * roles were returned by the API — shows everything rather than locking the
 * user out of the app.
 */
const canAccess = (authority: string[], userAuthority: string[]) =>
    authority.length === 0 ||
    authority.some((role) => userAuthority.includes(role))

const canAccessPermission = (key: string, permissions: string[]) => {
    const required = navigationPermissions[key]

    if (!required) {
        return true
    }

    return Array.isArray(required)
        ? hasAnyPermission(permissions, required)
        : hasPermission(permissions, required)
}

const filterTree = (
    tree: NavigationTree[],
    userAuthority: string[],
    permissions: string[] | undefined,
): NavigationTree[] =>
    tree.reduce<NavigationTree[]>((visible, nav) => {
        if (!canAccess(nav.authority, userAuthority)) {
            return visible
        }

        // A persisted session from before roles shipped has no grants yet;
        // leave its menu intact rather than hiding the whole application.
        if (
            permissions !== undefined &&
            !canAccessPermission(nav.key, permissions)
        ) {
            return visible
        }

        if (nav.subMenu && nav.subMenu.length > 0) {
            const subMenu = filterTree(nav.subMenu, userAuthority, permissions)

            if (subMenu.length > 0) {
                visible.push({ ...nav, subMenu })
            }
        } else {
            visible.push(nav)
        }

        return visible
    }, [])

const useNavigationConfig = (): NavigationTree[] => {
    const userAuthority = useSessionUser((state) => state.user.authority)
    const permissions = useSessionUser((state) => state.user.role?.permissions)

    return useMemo(() => {
        if (!userAuthority || userAuthority.length === 0) {
            return navigationConfig
        }

        return filterTree(navigationConfig, userAuthority, permissions)
    }, [permissions, userAuthority])
}

export default useNavigationConfig
