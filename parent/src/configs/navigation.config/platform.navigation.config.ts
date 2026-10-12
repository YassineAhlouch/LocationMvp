import { PLATFORM_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const PLATFORM = 'platform'

/**
 * Parent dashboard navigation. Every entry is gated on the 'platform'
 * authority, which every signed-in platform admin carries.
 */
const platformNavigationConfig: NavigationTree[] = [
    {
        key: 'platform',
        path: '',
        title: 'Platform',
        translateKey: 'nav.platform',
        icon: 'platformAgencies',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [PLATFORM],
        subMenu: [
            {
                key: 'platform.dashboard',
                path: `${PLATFORM_PREFIX_PATH}/`,
                title: 'Dashboard',
                translateKey: 'nav.platform.dashboard',
                icon: 'platformDashboard',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [PLATFORM],
                subMenu: [],
            },
            {
                key: 'platform.agencies',
                path: `${PLATFORM_PREFIX_PATH}/agencies`,
                title: 'Agencies',
                translateKey: 'nav.platform.agencies',
                icon: 'platformAgencies',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [PLATFORM],
                subMenu: [],
            },
            {
                key: 'platform.users',
                path: `${PLATFORM_PREFIX_PATH}/users`,
                title: 'Users',
                translateKey: 'nav.platform.users',
                icon: 'platformUsers',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [PLATFORM],
                subMenu: [],
            },
            {
                key: 'platform.invoices',
                path: `${PLATFORM_PREFIX_PATH}/invoices`,
                title: 'Invoices',
                translateKey: 'nav.platform.invoices',
                icon: 'platformInvoices',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [PLATFORM],
                subMenu: [],
            },
            {
                key: 'platform.payments',
                path: `${PLATFORM_PREFIX_PATH}/payments`,
                title: 'Payments',
                translateKey: 'nav.platform.payments',
                icon: 'platformPayments',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [PLATFORM],
                subMenu: [],
            },
            {
                key: 'platform.fleet',
                path: '',
                title: 'Fleet catalog',
                translateKey: 'nav.platform.fleet',
                icon: 'platformFleet',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [PLATFORM],
                subMenu: [
                    {
                        key: 'platform.brands',
                        path: `${PLATFORM_PREFIX_PATH}/fleet/brands`,
                        title: 'Brands',
                        translateKey: 'nav.platform.brands',
                        icon: 'platformBrands',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [PLATFORM],
                        subMenu: [],
                    },
                    {
                        key: 'platform.models',
                        path: `${PLATFORM_PREFIX_PATH}/fleet/models`,
                        title: 'Models',
                        translateKey: 'nav.platform.models',
                        icon: 'platformModels',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [PLATFORM],
                        subMenu: [],
                    },
                    {
                        key: 'platform.categories',
                        path: `${PLATFORM_PREFIX_PATH}/fleet/categories`,
                        title: 'Categories',
                        translateKey: 'nav.platform.categories',
                        icon: 'platformCategories',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [PLATFORM],
                        subMenu: [],
                    },
                    {
                        key: 'platform.currencies',
                        path: `${PLATFORM_PREFIX_PATH}/fleet/currencies`,
                        title: 'Currencies',
                        translateKey: 'nav.platform.currencies',
                        icon: 'platformCurrencies',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [PLATFORM],
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default platformNavigationConfig
