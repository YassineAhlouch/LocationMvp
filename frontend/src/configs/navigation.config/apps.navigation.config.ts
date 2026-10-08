import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const appsNavigationConfig: NavigationTree[] = [
    {
        key: 'apps',
        path: '',
        title: 'Apps',
        translateKey: 'nav.apps',
        icon: 'apps',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        meta: {
            horizontalMenu: {
                layout: 'tabs',
                columns: 2,
            },
        },
        subMenu: [
            // ===== DASHBOARD =====
            {
                key: 'gestion.dashboard',
                path: `${APPS_PREFIX_PATH}/dashboard`,
                title: 'Dashboard',
                translateKey: 'nav.gestion.dashboard',
                icon: 'gestionDashboard',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.dashboardDesc',
                        label: 'Car rental dashboard',
                    },
                },
                subMenu: [],
            },
            // ===== RESERVATIONS =====
            {
                key: 'gestion.reservations',
                path: '',
                title: 'Reservations',
                translateKey: 'nav.gestion.reservations',
                icon: 'gestionReservations',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.reservationsDesc',
                        label: 'Reservations management',
                    },
                },
                subMenu: [
                    {
                        key: 'gestion.reservations.nouvelle',
                        path: `${APPS_PREFIX_PATH}/reservations/nouvelle`,
                        title: 'New reservation',
                        translateKey: 'nav.gestion.reservationsNouvelle',
                        icon: 'gestionReservations',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.reservationsNouvelleDesc',
                                label: 'Create a reservation',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'gestion.reservations.liste',
                        path: `${APPS_PREFIX_PATH}/reservations/liste`,
                        title: 'Reservations list',
                        translateKey: 'nav.gestion.reservationsListe',
                        icon: 'gestionReservations',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.reservationsListeDesc',
                                label: 'Listing reservations',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'gestion.reservations.calendrier',
                        path: `${APPS_PREFIX_PATH}/reservations/calendrier`,
                        title: 'Calendar',
                        translateKey: 'nav.gestion.reservationsCalendrier',
                        icon: 'gestionReservations',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.reservationsCalendrierDesc',
                                label: 'Reservations calendar',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            // ===== VEHICULES =====
            {
                key: 'gestion.vehicules',
                path: '',
                title: 'Vehicles',
                translateKey: 'nav.gestion.vehicules',
                icon: 'gestionVehicules',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.vehiculesDesc',
                        label: 'Fleet management',
                    },
                },
                subMenu: [
                    {
                        key: 'gestion.vehicules.ajouter',
                        path: `${APPS_PREFIX_PATH}/vehicules/ajouter`,
                        title: 'Add vehicle',
                        translateKey: 'nav.gestion.vehiculesAjouter',
                        icon: 'gestionVehicules',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.vehiculesAjouterDesc',
                                label: 'Add a vehicle to the fleet',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'gestion.vehicules.liste',
                        path: `${APPS_PREFIX_PATH}/vehicules/liste`,
                        title: 'Vehicles list',
                        translateKey: 'nav.gestion.vehiculesListe',
                        icon: 'gestionVehicules',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.vehiculesListeDesc',
                                label: 'Listing vehicles',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            // ===== CLIENTS =====
            {
                key: 'gestion.clients',
                path: '',
                title: 'Clients',
                translateKey: 'nav.gestion.clients',
                icon: 'gestionClients',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.clientsDesc',
                        label: 'Clients management',
                    },
                },
                subMenu: [
                    {
                        key: 'gestion.clients.ajouter',
                        path: `${APPS_PREFIX_PATH}/clients/ajouter`,
                        title: 'Add client',
                        translateKey: 'nav.gestion.clientsAjouter',
                        icon: 'gestionClients',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.clientsAjouterDesc',
                                label: 'Add a new client',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'gestion.clients.liste',
                        path: `${APPS_PREFIX_PATH}/clients/liste`,
                        title: 'Clients list',
                        translateKey: 'nav.gestion.clientsListe',
                        icon: 'gestionClients',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.gestion.clientsListeDesc',
                                label: 'Listing clients',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            // ===== FINANCES =====
            {
                key: 'gestion.finances',
                path: '',
                title: 'Finances',
                translateKey: 'nav.gestion.finances',
                icon: 'gestionFinances',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.financesDesc',
                        label: 'Finances management',
                    },
                },
                subMenu: [
                    {
                        key: 'gestion.finances.depenses',
                        path: `${APPS_PREFIX_PATH}/finances/depenses`,
                        title: 'Expenses',
                        translateKey: 'nav.gestion.financesDepenses',
                        icon: 'gestionFinances',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.financesDepensesDesc',
                                label: 'Car expenses',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'gestion.finances.paiements',
                        path: `${APPS_PREFIX_PATH}/finances/paiements`,
                        title: 'Payments',
                        translateKey: 'nav.gestion.financesPaiements',
                        icon: 'gestionFinances',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.financesPaiementsDesc',
                                label: 'Customer payments',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            // ===== UTILISATEURS =====
            {
                key: 'gestion.utilisateurs',
                path: '',
                title: 'Users',
                translateKey: 'nav.gestion.utilisateurs',
                icon: 'gestionUtilisateurs',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.utilisateursDesc',
                        label: 'Team management',
                    },
                },
                subMenu: [
                    {
                        key: 'gestion.utilisateurs.ajouter',
                        path: `${APPS_PREFIX_PATH}/utilisateurs/ajouter`,
                        title: 'Add user',
                        translateKey: 'nav.gestion.utilisateursAjouter',
                        icon: 'gestionUtilisateurs',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.utilisateursAjouterDesc',
                                label: 'Add a staff member',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'gestion.utilisateurs.liste',
                        path: `${APPS_PREFIX_PATH}/utilisateurs/liste`,
                        title: 'Users list',
                        translateKey: 'nav.gestion.utilisateursListe',
                        icon: 'gestionUtilisateurs',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.utilisateursListeDesc',
                                label: 'Listing staff members',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default appsNavigationConfig