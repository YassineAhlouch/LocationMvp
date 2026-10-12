import { Navigate, Outlet } from 'react-router'
import appConfig from '@/configs/app.config'

const { authenticatedEntryPath } = appConfig

const PublicRoute = ({ authenticated }: { authenticated: boolean }) => {
    return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default PublicRoute
