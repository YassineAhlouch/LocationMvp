import { lazy } from 'react'
import { OTHERS_PREFIX_PATH } from '@/constants/route.constant'
import type { Routes } from '@/@types/routes'

const othersRoute: Routes = [
    {
        key: 'landing',
        path: '/landing',
        component: lazy(() => import('@/views/others/Landing/Landing')),
        access: 'public',
        meta: {
            pageContainerType: 'gutterless',
            layout: 'blank',
        },
    },
    {
        key: 'accessDenied',
        path: `${OTHERS_PREFIX_PATH}/access-denied`,
        component: lazy(() => import('@/views/others/AccessDenied')),
        authority: [],
        access: 'protected',
    },
]

export default othersRoute
