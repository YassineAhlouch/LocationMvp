import { lazy } from 'react'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    // +++++++++ NEW LINKS
    // ===== DASHBOARD =====
    {
        key: 'gestion.dashboard',
        path: `${APPS_PREFIX_PATH}/dashboard`,
        component: lazy(() => import('@/views/location/LocationDashboard')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            // 'default' | 'gutterless' | 'contained'
            pageContainerType: 'default',
            footer: false,
        },
    },

    // ===== RESERVATIONS =====
    {
        key: 'gestion.reservations.nouvelle',
        path: `${APPS_PREFIX_PATH}/reservations/nouvelle`,
        component: lazy(() => import('@/views/location/NouvelleReservation')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'gestion.reservations.modifier',
        path: `${APPS_PREFIX_PATH}/reservations/:id/modifier`,
        component: lazy(() => import('@/views/location/EditReservation')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'gestion.reservations.facture',
        path: `${APPS_PREFIX_PATH}/reservations/:id/facture`,
        component: lazy(() => import('@/views/location/ReservationInvoice')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'gestion.reservations.liste',
        path: `${APPS_PREFIX_PATH}/reservations/liste`,
        component: lazy(() => import('@/views/location/Reservations')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'contained',
            footer: false,
        },
    },
    {
        key: 'gestion.reservations.calendrier',
        path: `${APPS_PREFIX_PATH}/reservations/calendrier`,
        component: lazy(() => import('@/views/location/ReservationCalendar')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'contained',
            footer: false,
        },
    },

    // ===== VEHICULES =====
    {
        key: 'gestion.vehicules.ajouter',
        path: `${APPS_PREFIX_PATH}/vehicules/ajouter`,
        component: lazy(() => import('@/views/location/AjouterVehicule')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'gestion.vehicules.liste',
        path: `${APPS_PREFIX_PATH}/vehicules/liste`,
        component: lazy(() => import('@/views/location/Cars')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'contained',
            footer: false,
        },
    },
    {
        key: 'gestion.vehicules.details',
        path: `${APPS_PREFIX_PATH}/vehicules/:id/*`,
        component: lazy(() => import('@/views/location/CarDetails')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'contained',
            footer: false,
        },
    },

    // ===== CLIENTS =====
    {
        key: 'gestion.clients.ajouter',
        path: `${APPS_PREFIX_PATH}/clients/ajouter`,
        component: lazy(() => import('@/views/location/AjouterClient')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'gestion.clients.liste',
        path: `${APPS_PREFIX_PATH}/clients/liste`,
        component: lazy(() => import('@/views/location/Clients')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },

    // ===== FINANCES =====
    {
        key: 'gestion.finances.depenses',
        path: `${APPS_PREFIX_PATH}/finances/depenses`,
        component: lazy(() => import('@/views/location/Expenses')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'gestion.finances.paiements',
        path: `${APPS_PREFIX_PATH}/finances/paiements`,
        component: lazy(() => import('@/views/location/Payments')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'default',
            footer: false,
        },
    },

    // ===== UTILISATEURS =====
    {
        key: 'gestion.utilisateurs.ajouter',
        path: `${APPS_PREFIX_PATH}/utilisateurs/ajouter`,
        component: lazy(() => import('@/views/location/AjouterUtilisateur')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'gestion.utilisateurs.liste',
        path: `${APPS_PREFIX_PATH}/utilisateurs/liste`,
        component: lazy(() => import('@/views/location/ListeUtilisateurs')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },

    // ===== RAPPORTS ===== (planned: vehicules / clients / reservations / financiers)
    // ===== OPERATIONS ===== (planned: maintenance / accidents)
    // +++++ End NEW Links
    {
        key: 'apps.ai.chat',
        path: `${APPS_PREFIX_PATH}/ai/chat`,
        component: lazy(() => import('@/views/apps/ai/AiChat')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.ai.image',
        path: `${APPS_PREFIX_PATH}/ai/image`,
        component: lazy(() => import('@/views/apps/ai/AiImage')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.ai.writer',
        path: `${APPS_PREFIX_PATH}/ai/writer`,
        component: lazy(() => import('@/views/apps/ai/AiWriter')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.customers.dashboard',
        path: `${APPS_PREFIX_PATH}/customers/dashboard`,
        component: lazy(() => import('@/views/apps/customers/CrmDashboard')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.customers.customerList',
        path: `${APPS_PREFIX_PATH}/customers/list`,
        component: lazy(() => import('@/views/apps/customers/CustomerList')),
        authority: [ADMIN, USER],
        access: 'protected',
    },
    {
        key: 'apps.customers.customerDetails',
        path: `${APPS_PREFIX_PATH}/customers/:customerId/*`,
        component: lazy(() => import('@/views/apps/customers/CustomerDetails')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'apps.customers.leads',
        path: `${APPS_PREFIX_PATH}/customers/leads`,
        component: lazy(() => import('@/views/apps/customers/Leads')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.customers.leadDetails',
        path: `${APPS_PREFIX_PATH}/customers/leads/:leadId/*`,
        component: lazy(() => import('@/views/apps/customers/LeadDetails')),
        authority: [ADMIN, USER],
        access: 'protected',
    },
    {
        key: 'apps.customers.helpdesk',
        path: `${APPS_PREFIX_PATH}/customers/helpdesk/`,
        component: lazy(() => import('@/views/apps/customers/Helpdesk')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.customers.helpdesk',
        path: `${APPS_PREFIX_PATH}/customers/helpdesk/:ticketId`,
        component: lazy(() => import('@/views/apps/customers/Helpdesk')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.projects.dashboard',
        path: `${APPS_PREFIX_PATH}/projects/dashboard`,
        component: lazy(() => import('@/views/apps/projects/ProjectDashboard')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.projects.projectList',
        path: `${APPS_PREFIX_PATH}/projects/list`,
        component: lazy(() => import('@/views/apps/projects/ProjectList')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.projects.projectDetails',
        path: `${APPS_PREFIX_PATH}/projects/:projectId`,
        component: lazy(() => import('@/views/apps/projects/ProjectDetails')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.projects.scrumboard',
        path: `${APPS_PREFIX_PATH}/projects/scrumboard`,
        component: lazy(() => import('@/views/apps/projects/Scrumboard')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.projects.timeline',
        path: `${APPS_PREFIX_PATH}/projects/timeline`,
        component: lazy(() => import('@/views/apps/projects/Timeline')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.projects.tasks',
        path: `${APPS_PREFIX_PATH}/projects/tasks`,
        component: lazy(() => import('@/views/apps/projects/Tasks')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.projects.settings',
        path: `${APPS_PREFIX_PATH}/projects/settings/*`,
        component: lazy(() => import('@/views/apps/projects/Settings')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.sales.dashboard',
        path: `${APPS_PREFIX_PATH}/sales/dashboard`,
        component: lazy(() => import('@/views/apps/sales/SalesDashboard')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.sales.productList',
        path: `${APPS_PREFIX_PATH}/sales/products`,
        component: lazy(() => import('@/views/apps/sales/ProductList')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.sales.editProduct',
        path: `${APPS_PREFIX_PATH}/sales/products/:productId`,
        component: lazy(() => import('@/views/apps/sales/ProductDetails')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.sales.newProduct',
        path: `${APPS_PREFIX_PATH}/sales/product`,
        component: lazy(() => import('@/views/apps/sales/ProductDetails')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.sales.orderList',
        path: `${APPS_PREFIX_PATH}/sales/orders`,
        component: lazy(() => import('@/views/apps/sales/OrderList')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'contained',
            footer: false,
        },
    },
    {
        key: 'apps.sales.newOrder',
        path: `${APPS_PREFIX_PATH}/sales/order`,
        component: lazy(() => import('@/views/apps/sales/OrderDetails')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.sales.editOrder',
        path: `${APPS_PREFIX_PATH}/sales/orders/:orderId`,
        component: lazy(() => import('@/views/apps/sales/OrderDetails')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.analytics.dashboard',
        path: `${APPS_PREFIX_PATH}/analytics/dashboard`,
        component: lazy(
            () => import('@/views/apps/analytics/AnalyticDashboard'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.analytics.forecast',
        path: `${APPS_PREFIX_PATH}/analytics/forecast`,
        component: lazy(() => import('@/views/apps/analytics/Forecast')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.analytics.revenue',
        path: `${APPS_PREFIX_PATH}/analytics/revenue`,
        component: lazy(() => import('@/views/apps/analytics/Revenue')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.analytics.subscriptions',
        path: `${APPS_PREFIX_PATH}/analytics/subscriptions`,
        component: lazy(() => import('@/views/apps/analytics/Subscriptions')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {},
    },
    {
        key: 'apps.analytics.reports',
        path: `${APPS_PREFIX_PATH}/analytics/reports`,
        component: lazy(() => import('@/views/apps/analytics/Reports')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.crypto.dashboard',
        path: `${APPS_PREFIX_PATH}/crypto/dashboard`,
        component: lazy(() => import('@/views/apps/crypto/CryptoDashboard')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.crypto.market',
        path: `${APPS_PREFIX_PATH}/crypto/market`,
        component: lazy(() => import('@/views/apps/crypto/Market')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.crypto.coin',
        path: `${APPS_PREFIX_PATH}/crypto/coin/:coinId`,
        component: lazy(() => import('@/views/apps/crypto/Coin')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.crypto.spot',
        path: `${APPS_PREFIX_PATH}/crypto/spot`,
        component: lazy(() => import('@/views/apps/crypto/Spot')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.crypto.assets',
        path: `${APPS_PREFIX_PATH}/crypto/assets`,
        component: lazy(() => import('@/views/apps/crypto/Assets')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.crypto.kyc',
        path: `${APPS_PREFIX_PATH}/crypto/kyc`,
        component: lazy(() => import('@/views/apps/crypto/KYC')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.hrm.employees',
        path: `${APPS_PREFIX_PATH}/hrm/employees`,
        component: lazy(() => import('@/views/apps/hr-management/Employees')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.hrm.attendance',
        path: `${APPS_PREFIX_PATH}/hrm/attendance`,
        component: lazy(() => import('@/views/apps/hr-management/Attendance')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.hrm.payroll',
        path: `${APPS_PREFIX_PATH}/hrm/payroll`,
        component: lazy(() => import('@/views/apps/hr-management/Payroll')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.hrm.dashboard',
        path: `${APPS_PREFIX_PATH}/hrm/dashboard`,
        component: lazy(
            () => import('@/views/apps/hr-management/HrmDashboard'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            footer: false,
        },
    },
    {
        key: 'apps.hrm.leaves',
        path: `${APPS_PREFIX_PATH}/hrm/leaves`,
        component: lazy(() => import('@/views/apps/hr-management/Leaves')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.hrm.announcements',
        path: `${APPS_PREFIX_PATH}/hrm/announcements`,
        component: lazy(
            () => import('@/views/apps/hr-management/Announcements'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'contained',
            footer: false,
        },
    },
    {
        key: 'apps.accounts.settings',
        path: `${APPS_PREFIX_PATH}/accounts/settings/*`,
        component: lazy(() => import('@/views/apps/accounts/Settings')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.accounts.activity',
        path: `${APPS_PREFIX_PATH}/accounts/activity`,
        component: lazy(() => import('@/views/apps/accounts/Activity')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.accounts.refferals',
        path: `${APPS_PREFIX_PATH}/accounts/refferals`,
        component: lazy(() => import('@/views/apps/accounts/Referrals')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'apps.accounts.pricing',
        path: `${APPS_PREFIX_PATH}/accounts/pricing`,
        component: lazy(() => import('@/views/apps/accounts/Pricing')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'contained',
            footer: false,
        },
    },
    {
        key: 'apps.accounts.users',
        path: `${APPS_PREFIX_PATH}/accounts/users`,
        component: lazy(() => import('@/views/apps/accounts/Users')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'apps.accounts.invoice',
        path: `${APPS_PREFIX_PATH}/accounts/invoice`,
        component: lazy(() => import('@/views/apps/accounts/Invoice')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
]

export default appsRoute
