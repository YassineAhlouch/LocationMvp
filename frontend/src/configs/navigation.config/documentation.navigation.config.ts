import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

/**
 * Documentation entry pinned to the very bottom of the sidebar, after the
 * operational modules and the administration section. Kept in its own config
 * and spread last by the navigation config index so it always renders as the
 * final link, no matter how the other sections grow.
 */
const documentationNavigationConfig: NavigationTree[] = [
    {
        key: 'documentation',
        path: '',
        title: 'Documentation',
        translateKey: 'nav.gestion.documentation',
        icon: 'documentation',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        meta: {
            description: {
                translateKey: 'nav.gestion.documentationDesc',
                label: 'How the car system works',
            },
        },
        subMenu: [
            {
                key: 'documentation.guide',
                path: `${APPS_PREFIX_PATH}/documentation`,
                title: 'Documentation',
                translateKey: 'nav.gestion.documentation',
                icon: 'documentation',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.documentationDesc',
                        label: 'How the car system works',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default documentationNavigationConfig
