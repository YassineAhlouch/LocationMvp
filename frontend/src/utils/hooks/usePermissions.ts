import { useMemo } from 'react'
import { useSessionUser } from '@/store/authStore'
import { hasAnyPermission, hasPermission } from '@/utils/permission'

/**
 * The signed-in user's permission grants plus the checks pages use to hide
 * actions they cannot perform. The backend remains the authority; this only
 * keeps unavailable controls out of the UI.
 */
const usePermissions = () => {
    const grants = useSessionUser((state) => state.user.role?.permissions)

    return useMemo(() => {
        const permissions = grants ?? []
        // A session persisted before roles shipped has no grants yet; mirror
        // the navigation behaviour and leave controls visible until it refreshes.
        const isLegacySession = grants === undefined

        return {
            permissions,
            can: (permission: string) =>
                isLegacySession || hasPermission(permissions, permission),
            canAny: (required: string[]) =>
                isLegacySession || hasAnyPermission(permissions, required),
        }
    }, [grants])
}

export default usePermissions
