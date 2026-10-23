import AuthorityGuard from './AuthorityGuard'
import PermissionGuard from './PermissionGuard'
import AppRoute from './AppRoute'
import PageContainer from '@/components/template/PageContainer'
import routePermissions from '@/configs/routes.config/permissions'
import type { Route } from '@/@types/routes'
import type { LayoutType } from '@/@types/theme'
import type { User } from '@/@types/auth'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

interface RouteRendererProps extends ViewsProps {
    route: Route
    user: User
    authenticated: boolean
}

const RouteRenderer = ({
    route,
    user,
    authenticated,
    ...props
}: RouteRendererProps) => {
    const shouldCheckAuthority =
        authenticated && route.authority && route.access !== 'public'
    const requiredPermission =
        authenticated && route.access !== 'public'
            ? routePermissions[route.key]
            : undefined

    const page = (
        <PermissionGuard
            required={requiredPermission}
            permissions={user.role?.permissions}
        >
            <PageContainer {...props} {...route.meta}>
                <AppRoute
                    routeKey={route.key}
                    component={route.component}
                    {...route.meta}
                />
            </PageContainer>
        </PermissionGuard>
    )

    if (shouldCheckAuthority) {
        return (
            <AuthorityGuard
                userAuthority={user.authority}
                authority={route.authority!}
            >
                {page}
            </AuthorityGuard>
        )
    }

    return page
}

export default RouteRenderer
