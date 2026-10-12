import authRoute from './authRoute'
import platformRoute from './platformRoute'
import type { Routes, RouteAccessType } from '@/@types/routes'

export const routes: Routes = [...authRoute, ...platformRoute]

export const getRoutesByAccess = (accessType: RouteAccessType) =>
    routes.filter((route) => route.access === accessType)

export const getProtectedRoutes = () => getRoutesByAccess('protected')
export const getAuthOnlyRoutes = () => getRoutesByAccess('auth-only')
export const getPublicRoutes = () => getRoutesByAccess('public')

export const publicRoutes: Routes = getAuthOnlyRoutes()
export const protectedRoutes: Routes = getProtectedRoutes()
