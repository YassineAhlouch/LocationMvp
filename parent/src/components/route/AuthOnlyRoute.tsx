import { Navigate, Outlet } from 'react-router'
import AuthLayout from '../layouts/AuthLayout'
import appConfig from '@/configs/app.config'

const { authenticatedEntryPath } = appConfig

export interface AuthOnlyRouteProps {
    authenticated: boolean
}

const AuthOnlyRoute = ({ authenticated }: AuthOnlyRouteProps) => {
    if (authenticated) {
        return <Navigate to={authenticatedEntryPath} replace />
    }

    return (
        <AuthLayout>
            <Outlet />
        </AuthLayout>
    )
}

export default AuthOnlyRoute
