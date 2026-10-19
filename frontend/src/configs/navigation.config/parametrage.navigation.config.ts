import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

/**
 * Administration section pinned to the bottom of the sidebar. Kept in its own
 * config so it always renders after the operational modules, no matter how the
 * other sections grow, and is spread last by the navigation config index.
 */
const parametrageNavigationConfig: NavigationTree[] = [
    {
        key: 'parametrage',
        path: '',
        title: 'Settings',
        translateKey: 'nav.gestion.parametres',
        icon: 'gestionUtilisateurs',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN],
        meta: {
            description: {
                translateKey: 'nav.gestion.parametresDesc',
                label: 'Application settings',
            },
            horizontalMenu: {
                layout: 'tabs',
                columns: 2,
            },
        },
        subMenu: [
            {
                key: 'gestion.parametres.devise',
                path: `${APPS_PREFIX_PATH}/parametres/devise`,
                title: 'Currency',
                translateKey: 'nav.gestion.parametresDevise',
                icon: 'gestionUtilisateurs',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.parametresDeviseDesc',
                        label: 'Choose the currency amounts are shown in',
                    },
                },
                subMenu: [],
            },
            {
                key: 'gestion.parametres.factures',
                path: `${APPS_PREFIX_PATH}/parametres/factures`,
                title: 'Invoice templates',
                translateKey: 'nav.gestion.parametresFactures',
                icon: 'gestionUtilisateurs',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.parametresFacturesDesc',
                        label: 'Assign a contract layout to each agency',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default parametrageNavigationConfig
