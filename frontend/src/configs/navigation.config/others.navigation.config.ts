import { OTHERS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const othersNavigationConfig: NavigationTree[] = [
    {
        key: 'others',
        path: '',
        title: 'Others',
        translateKey: 'nav.others.others',
        icon: 'others',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        subMenu: [
            {
                key: 'others.landing',
                path: '/landing',
                title: 'Landing',
                translateKey: 'nav.others.landing',
                icon: 'landing',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.others.landingDesc',
                        label: 'Landing page',
                    },
                },
                subMenu: [],
            },
            {
                key: 'others.accessDenied',
                path: `${OTHERS_PREFIX_PATH}/access-denied`,
                title: 'Access Denied',
                translateKey: 'nav.others.accessDenied',
                icon: 'accessDenied',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.others.accessDeniedDesc',
                        label: 'Access denied page',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default othersNavigationConfig
