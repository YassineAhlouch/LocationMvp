import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const authRoute: Routes = [
    {
        key: 'signIn',
        path: `/sign-in`,
        component: lazy(() => import('@/views/auth/SignIn')),
        access: 'auth-only',
        meta: {
            authLayout: 'simple',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'accessDenied',
        path: `/access-denied`,
        component: lazy(() => import('@/views/others/AccessDenied')),
        access: 'public',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
]

export default authRoute
