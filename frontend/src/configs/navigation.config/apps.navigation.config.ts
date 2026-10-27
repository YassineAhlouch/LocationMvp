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
            // ===== TASKS =====
            {
                key: 'gestion.tasksGroup',
                path: '',
                title: 'Tasks',
                translateKey: 'nav.gestion.tasksGroup',
                icon: 'gestionTasks',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.tasksGroupDesc',
                        label: 'Task management',
                    },
                },
                subMenu: [
                    {
                        key: 'gestion.tasks',
                        path: `${APPS_PREFIX_PATH}/tasks`,
                        title: 'Task list',
                        translateKey: 'nav.gestion.tasksList',
                        icon: 'gestionTaskList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.gestion.tasksDesc',
                                label: 'Manage tasks',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'gestion.scrumboard',
                        path: `${APPS_PREFIX_PATH}/scrumboard`,
                        title: 'Kanban Board',
                        translateKey: 'nav.gestion.scrumboard',
                        icon: 'gestionKanban',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.gestion.scrumboardDesc',
                                label: 'Drag and drop task board',
                            },
                        },
                        subMenu: [],
                    },
                ],
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
            // ===== QR CODES =====
            {
                key: 'gestion.qr',
                path: '',
                title: 'QR codes',
                translateKey: 'nav.gestion.qr',
                icon: 'gestionQrCodes',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.qrDesc',
                        label: 'QR posters for the public landing',
                    },
                },
                subMenu: [
                    {
                        key: 'gestion.qr.create',
                        path: `${APPS_PREFIX_PATH}/qr/create`,
                        title: 'New QR',
                        translateKey: 'nav.gestion.qrCreate',
                        icon: 'gestionQrCodes',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.gestion.qrCreateDesc',
                                label: 'Create a QR poster',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'gestion.qr.liste',
                        path: `${APPS_PREFIX_PATH}/qr`,
                        title: 'QR codes list',
                        translateKey: 'nav.gestion.qrListe',
                        icon: 'gestionQrCodes',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.gestion.qrListeDesc',
                                label: 'Listing QR posters',
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
    // ===== STATISTIQUES =====
    {
        key: 'statistiques',
        path: '',
        title: 'Statistics',
        translateKey: 'nav.statistiques',
        icon: 'statistiques',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        meta: {
            horizontalMenu: {
                layout: 'tabs',
                columns: 1,
            },
        },
        subMenu: [
            {
                key: 'gestion.rapports',
                path: '',
                title: 'Reports',
                translateKey: 'nav.gestion.rapports',
                icon: 'gestionRapports',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.rapportsDesc',
                        label: 'Performance reports',
                    },
                },
                subMenu: [
                    {
                        key: 'gestion.rapports.clients',
                        path: `${APPS_PREFIX_PATH}/statistiques/rapports/performance-clients`,
                        title: 'Client performance',
                        translateKey: 'nav.gestion.rapportsClients',
                        icon: 'gestionRapports',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.rapportsClientsDesc',
                                label: 'Top clients by revenue',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'gestion.rapports.vehicules',
                        path: `${APPS_PREFIX_PATH}/statistiques/rapports/performance-vehicules`,
                        title: 'Vehicle performance',
                        translateKey: 'nav.gestion.rapportsVehicules',
                        icon: 'gestionRapports',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.rapportsVehiculesDesc',
                                label: 'Fleet profitability',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'gestion.rapports.encaissement',
                        path: `${APPS_PREFIX_PATH}/statistiques/rapports/performance-encaissement`,
                        title: 'Collection performance',
                        translateKey: 'nav.gestion.rapportsEncaissement',
                        icon: 'gestionRapports',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.gestion.rapportsEncaissementDesc',
                                label: 'Cash collection performance',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
        ],
    },
    // ===== ACTIVITE =====
    {
        key: 'activite',
        path: '',
        title: 'Activity',
        translateKey: 'nav.activite',
        icon: 'activite',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        meta: {
            horizontalMenu: {
                layout: 'tabs',
                columns: 1,
            },
        },
        subMenu: [
            {
                key: 'gestion.activite.journal',
                path: `${APPS_PREFIX_PATH}/journal-activite`,
                title: 'Activity log',
                translateKey: 'nav.gestion.activiteJournal',
                icon: 'activite',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.activiteJournalDesc',
                        label: 'Audit trail of staff actions',
                    },
                },
                subMenu: [],
            },
            {
                key: 'gestion.activite.notifications',
                path: `${APPS_PREFIX_PATH}/notifications`,
                title: 'Notifications',
                translateKey: 'nav.gestion.notifications',
                icon: 'gestionNotifications',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.gestion.notificationsDesc',
                        label: 'Announcements and alerts for you',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default appsNavigationConfig