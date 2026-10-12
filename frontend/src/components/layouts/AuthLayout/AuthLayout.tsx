import { lazy } from 'react'
import { matchPath, useLocation } from 'react-router'
import { getAuthOnlyRoutes } from '@/configs/routes.config'
import type { CommonProps } from '@/@types/common'
import type { AuthLayoutType } from '@/@types/theme'
import type { LazyExoticComponent, JSX } from 'react'

type Layouts = Record<
    AuthLayoutType,
    LazyExoticComponent<<T extends CommonProps>(props: T) => JSX.Element>
>

const defaultLayoutType: AuthLayoutType = 'centred'

const layouts: Layouts = {
    simple: lazy(() => import('./Simple')),
    centred: lazy(() => import('./Centred')),
    side: lazy(() => import('./Side')),
}

/**
 * Picks the wrapper for the current auth route from its `meta.authLayout`.
 * Routes that do not opt in fall back to the centred layout.
 */
const AuthLayout = ({ children }: CommonProps) => {
    const { pathname } = useLocation()

    const layoutType =
        getAuthOnlyRoutes().find((route) => matchPath(route.path, pathname))
            ?.meta?.authLayout ?? defaultLayoutType

    const Layout = layouts[layoutType]

    return <Layout>{children}</Layout>
}

export default AuthLayout
