import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router'
import { OTHERS_PREFIX_PATH } from '@/constants/route.constant'
import { hasAnyPermission, hasPermission } from '@/utils/permission'

type PermissionGuardProps = PropsWithChildren<{
    permissions?: string[]
    required?: string | string[]
}>

const PermissionGuard = (props: PermissionGuardProps) => {
    const { permissions, required, children } = props

    if (!required || permissions === undefined) {
        return <>{children}</>
    }

    const permissionMatched = Array.isArray(required)
        ? hasAnyPermission(permissions, required)
        : hasPermission(permissions, required)

    return (
        <>
            {permissionMatched ? (
                children
            ) : (
                <Navigate to={`${OTHERS_PREFIX_PATH}/access-denied`} />
            )}
        </>
    )
}

export default PermissionGuard
