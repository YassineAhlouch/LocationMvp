import { lazy } from 'react'
import { PLATFORM_PREFIX_PATH } from '@/constants/route.constant'
import type { Routes } from '@/@types/routes'

/**
 * Platform (parent) dashboard pages. Root-level paths, all behind the
 * 'platform' authority so only PlatformAdmin sessions resolve them.
 */
const platformRoute: Routes = [
    {
        key: 'platform.agencies',
        path: `${PLATFORM_PREFIX_PATH}/agencies`,
        component: lazy(() => import('@/views/platform/Agencies')),
        access: 'protected',
        authority: ['platform'],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'platform.users',
        path: `${PLATFORM_PREFIX_PATH}/users`,
        component: lazy(() => import('@/views/platform/Users')),
        access: 'protected',
        authority: ['platform'],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'platform.brands',
        path: `${PLATFORM_PREFIX_PATH}/fleet/brands`,
        component: lazy(() => import('@/views/platform/Brands')),
        access: 'protected',
        authority: ['platform'],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'platform.models',
        path: `${PLATFORM_PREFIX_PATH}/fleet/models`,
        component: lazy(() => import('@/views/platform/CarModels')),
        access: 'protected',
        authority: ['platform'],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'platform.categories',
        path: `${PLATFORM_PREFIX_PATH}/fleet/categories`,
        component: lazy(() => import('@/views/platform/CarCategories')),
        access: 'protected',
        authority: ['platform'],
        meta: {
            pageContainerType: 'contained',
        },
    },
]

export default platformRoute
