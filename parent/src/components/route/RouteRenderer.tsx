import AuthorityGuard from './AuthorityGuard'
import AppRoute from './AppRoute'
import PageContainer from '@/components/template/PageContainer'
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

    if (shouldCheckAuthority) {
        return (
            <AuthorityGuard
                userAuthority={user.authority}
                authority={route.authority!}
            >
                <PageContainer {...props} {...route.meta}>
                    <AppRoute
                        routeKey={route.key}
                        component={route.component}
                        {...route.meta}
                    />
                </PageContainer>
            </AuthorityGuard>
        )
    }

    return (
        <PageContainer {...props} {...route.meta}>
            <AppRoute
                routeKey={route.key}
                component={route.component}
                {...route.meta}
            />
        </PageContainer>
    )
}

export default RouteRenderer
