import { GUIDE_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const guideNavigationConfig: NavigationTree[] = [
    {
        key: 'guide',
        path: '',
        title: 'Guide',
        translateKey: 'nav.guide.guide',
        icon: 'guide',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        subMenu: [
            {
                key: 'guide.documentation',
                path: 'https://static.themenate.net/eyris-doc/vite/introduction/index.html',
                title: 'Documentation',
                translateKey: 'nav.guide.documentation',
                icon: 'documentation',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.guide.documentationDesc',
                        label: 'General template guide',
                    },
                },
                isExternalLink: true,
                subMenu: [],
            },
            {
                key: 'guide.sharedComponentDoc',
                path: `${GUIDE_PREFIX_PATH}/shared-component-doc/action-link`,
                title: 'Shared Component',
                translateKey: 'nav.guide.sharedComponentDoc',
                icon: 'sharedComponentDoc',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.guide.sharedComponentDocDesc',
                        label: 'Shared component usage',
                    },
                },
                subMenu: [],
            },
            {
                key: 'guide.utilsDoc',
                path: `${GUIDE_PREFIX_PATH}/utils-doc/use-auth`,
                title: 'Utilities',
                translateKey: 'nav.guide.utilsDoc',
                icon: 'utilsDoc',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.guide.utilsDocDesc',
                        label: 'Docs about utilities function',
                    },
                },
                subMenu: [],
            },
            {
                key: 'guide.changelog',
                path: `${GUIDE_PREFIX_PATH}/changelog`,
                title: 'Changelog',
                translateKey: 'nav.guide.changeLog',
                icon: 'changeLog',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.guide.changeLogDesc',
                        label: 'All the version records',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default guideNavigationConfig
