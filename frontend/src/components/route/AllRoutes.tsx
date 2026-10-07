import ProtectedRoute from './ProtectedRoute'
import AuthOnlyRoute from './AuthOnlyRoute'
import RouteRenderer from './RouteRenderer'
import {
    getProtectedRoutes,
    getAuthOnlyRoutes,
    getPublicRoutes,
} from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import { useAuth } from '@/auth'
import { Routes, Route, Navigate } from 'react-router'
import type { LayoutType } from '@/@types/theme'
import type { Route as RouteType } from '@/@types/routes'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
    const { user, authenticated } = useAuth()

    const renderRoute = (route: RouteType) => (
        <Route
            key={route.key}
            path={route.path}
            element={
                <RouteRenderer
                    route={route}
                    user={user}
                    authenticated={authenticated}
                    {...props}
                />
            }
        />
    )

    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate replace to={authenticatedEntryPath} />}
            />

            <Route element={<ProtectedRoute authenticated={authenticated} />}>
                {getProtectedRoutes().map(renderRoute)}
            </Route>
            <Route element={<AuthOnlyRoute authenticated={authenticated} />}>
                {getAuthOnlyRoutes().map(renderRoute)}
            </Route>
            {getPublicRoutes().map(renderRoute)}
            <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
    )
}

export default AllRoutes
