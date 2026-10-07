import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const uiComponentNavigationConfig: NavigationTree[] = [
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
            {
                key: 'apps.sales',
                path: '',
                title: 'Sales',
                translateKey: 'nav.appsSales.sales',
                icon: 'sales',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.appsSales.salesDesc',
                        label: 'Sales management',
                    },
                },
                subMenu: [
                    {
                        key: 'apps.sales.dashboard',
                        path: `${APPS_PREFIX_PATH}/sales/dashboard`,
                        title: 'Dashboard',
                        translateKey: 'nav.appsSales.dashboard',
                        icon: 'salesDashboard',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsSales.dashboardDesc',
                                label: 'Sales dashboard',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.sales.productList',
                        path: `${APPS_PREFIX_PATH}/sales/products`,
                        title: 'Product List',
                        translateKey: 'nav.appsSales.productList',
                        icon: 'salesProductList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsSales.productListDesc',
                                label: 'Product listing',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.sales.editProduct',
                        path: `${APPS_PREFIX_PATH}/sales/products/1`,
                        title: 'Product Details',
                        translateKey: 'nav.appsSales.editProduct',
                        icon: 'salesProductDetails',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsSales.editProductDesc',
                                label: 'Product details',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.sales.newProduct',
                        path: `${APPS_PREFIX_PATH}/sales/product`,
                        title: 'New Product',
                        translateKey: 'nav.appsSales.newProduct',
                        icon: 'salesNewProduct',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsSales.newProductDesc',
                                label: 'Add new product',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.sales.orderList',
                        path: `${APPS_PREFIX_PATH}/sales/orders`,
                        title: 'Order List',
                        translateKey: 'nav.appsSales.orderList',
                        icon: 'salesOrderList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsSales.ordersDesc',
                                label: 'Orders list',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.sales.newOrder',
                        path: `${APPS_PREFIX_PATH}/sales/order`,
                        title: 'New Order',
                        translateKey: 'nav.appsSales.newOrder',
                        icon: 'salesNewOrder',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsSales.newOrderDesc',
                                label: 'Add new order',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.sales.editOrder',
                        path: `${APPS_PREFIX_PATH}/sales/orders/95954`,
                        title: 'Edit Order',
                        translateKey: 'nav.appsSales.editOrder',
                        icon: 'saleseditOrder',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsSales.editOrderDesc',
                                label: 'Edit order details',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'apps.customers',
                path: '',
                title: 'Customers',
                translateKey: 'nav.appsCustomers.customers',
                icon: 'customers',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.appsCustomers.customersDesc',
                        label: 'Customers management',
                    },
                },
                subMenu: [
                    {
                        key: 'apps.customers.dashboard',
                        path: `${APPS_PREFIX_PATH}/customers/dashboard`,
                        title: 'Dashboard',
                        translateKey: 'nav.appsCustomers.dashboard',
                        icon: 'customersDashboard',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsCustomers.dashboardDesc',
                                label: 'Customers dashboard',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.customers.customerList',
                        path: `${APPS_PREFIX_PATH}/customers/list`,
                        title: 'Customers List',
                        translateKey: 'nav.appsCustomers.customersList',
                        icon: 'customersList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.appsCustomers.customersListDesc',
                                label: 'Listing customers',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.customers.customerDetails',
                        path: `${APPS_PREFIX_PATH}/customers/1/overview`,
                        title: 'Customer Details',
                        translateKey: 'nav.appsCustomers.details',
                        icon: 'customersDetails',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsCustomers.detailsDesc',
                                label: 'Customer details',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.customers.leads',
                        path: `${APPS_PREFIX_PATH}/customers/leads`,
                        title: 'Leads',
                        translateKey: 'nav.appsCustomers.leads',
                        icon: 'customersLeads',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsCustomers.leadsDesc',
                                label: 'Leads management',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.customers.leadDetails',
                        path: `${APPS_PREFIX_PATH}/customers/leads/1/overview`,
                        title: 'Lead Details',
                        translateKey: 'nav.appsCustomers.leadDetails',
                        icon: 'customersLeadDetails',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.appsCustomers.leadDetailsDesc',
                                label: 'Lead details',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.customers.helpdesk',
                        path: `${APPS_PREFIX_PATH}/customers/helpdesk`,
                        title: 'Helpdesk',
                        translateKey: 'nav.appsCustomers.helpdesk',
                        icon: 'customersHelpdesk',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsCustomers.helpdeskDesc',
                                label: 'Helpdesk management',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'apps.projects',
                path: '',
                title: 'Projects',
                translateKey: 'nav.appsProjects.projects',
                icon: 'projects',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.appsProjects.projectsDesc',
                        label: 'Projects management',
                    },
                },
                subMenu: [
                    {
                        key: 'apps.projects.dashboard',
                        path: `${APPS_PREFIX_PATH}/projects/dashboard`,
                        title: 'Dashboard',
                        translateKey: 'nav.appsProjects.dashboard',
                        icon: 'projectsDashboard',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsProjects.dashboardDesc',
                                label: 'Projects dashboard',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.projects.projectList',
                        path: `${APPS_PREFIX_PATH}/projects/list`,
                        title: 'Projects List',
                        translateKey: 'nav.appsProjects.projectsList',
                        icon: 'projectsList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.appsProjects.projectsListDesc',
                                label: 'Listing projects',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.projects.projectDetails',
                        path: `${APPS_PREFIX_PATH}/projects/proj-007`,
                        title: 'Project Details',
                        translateKey: 'nav.appsProjects.projectDetails',
                        icon: 'projectsDetails',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.appsProjects.projectDetailsDesc',
                                label: 'Project details',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.projects.scrumboard',
                        path: `${APPS_PREFIX_PATH}/projects/scrumboard`,
                        title: 'Scrumboard',
                        translateKey: 'nav.appsProjects.scrumboard',
                        icon: 'projectsScrumboard',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsProjects.scrumboardDesc',
                                label: 'Scrumboard management',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.projects.timeline',
                        path: `${APPS_PREFIX_PATH}/projects/timeline`,
                        title: 'Timeline',
                        translateKey: 'nav.appsProjects.timeline',
                        icon: 'projectsTimeline',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsProjects.timelineDesc',
                                label: 'Timeline management',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.projects.tasks',
                        path: `${APPS_PREFIX_PATH}/projects/tasks`,
                        title: 'Tasks',
                        translateKey: 'nav.appsProjects.tasks',
                        icon: 'projectsTasks',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsProjects.tasksDesc',
                                label: 'Tasks list',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.projects.settings',
                        path: `${APPS_PREFIX_PATH}/projects/settings/general`,
                        title: 'Settings',
                        translateKey: 'nav.appsProjects.settings',
                        icon: 'projectsSettings',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsProjects.settingsDesc',
                                label: 'Project settings',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'apps.analytics',
                path: '',
                title: 'Analytics',
                translateKey: 'nav.appsAnalytics.analytics',
                icon: 'analytics',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.appsAnalytics.analyticsDesc',
                        label: 'Analytics management',
                    },
                },
                subMenu: [
                    {
                        key: 'apps.analytics.dashboard',
                        path: `${APPS_PREFIX_PATH}/analytics/dashboard`,
                        title: 'Dashboard',
                        translateKey: 'nav.appsAnalytics.dashboard',
                        icon: 'analyticsDashboard',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAnalytics.dashboardDesc',
                                label: 'Dashboard',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.analytics.forecast',
                        path: `${APPS_PREFIX_PATH}/analytics/forecast`,
                        title: 'Forecast',
                        translateKey: 'nav.appsAnalytics.forecast',
                        icon: 'analyticsForecast',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAnalytics.forecastDesc',
                                label: 'Forecast & planning',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.analytics.revenue',
                        path: `${APPS_PREFIX_PATH}/analytics/revenue`,
                        title: 'Revenue',
                        translateKey: 'nav.appsAnalytics.revenue',
                        icon: 'analyticsRevenue',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAnalytics.revenueDesc',
                                label: 'Revenue monitoring',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.analytics.subscriptions',
                        path: `${APPS_PREFIX_PATH}/analytics/subscriptions`,
                        title: 'Subscriptions',
                        translateKey: 'nav.appsAnalytics.subscriptions',
                        icon: 'analyticsSubscriptions',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.appsAnalytics.subscriptionsDesc',
                                label: 'Subscriptions monitoring',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.analytics.reports',
                        path: `${APPS_PREFIX_PATH}/analytics/reports`,
                        title: 'Reports',
                        translateKey: 'nav.appsAnalytics.reports',
                        icon: 'analyticsReports',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAnalytics.reportsDesc',
                                label: 'Reports and statistics',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'apps.ai',
                path: '',
                title: 'AI',
                translateKey: 'nav.appsAi.ai',
                icon: 'ai',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.appsAi.aiDesc',
                        label: 'AI applications',
                    },
                },
                subMenu: [
                    {
                        key: 'apps.ai.chat',
                        path: `${APPS_PREFIX_PATH}/ai/chat`,
                        title: 'Chat',
                        translateKey: 'nav.appsAiChat.chat',
                        icon: 'aiChat',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAiChat.chatDesc',
                                label: 'AI chat applications',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.ai.image',
                        path: `${APPS_PREFIX_PATH}/ai/image`,
                        title: 'Image',
                        translateKey: 'nav.appsAiImage.image',
                        icon: 'aiImage',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAiImage.imageDesc',
                                label: 'Genarate images with AI',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.ai.writer',
                        path: `${APPS_PREFIX_PATH}/ai/writer`,
                        title: 'Writer',
                        translateKey: 'nav.appsAiWriter.writer',
                        icon: 'aiWriter',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAiWriter.writerDesc',
                                label: 'AI Writer applications',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'apps.crypto',
                path: '',
                title: 'Crypto',
                translateKey: 'nav.appsCrypto.crypto',
                icon: 'crypto',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.appsCryptos.cryptoDesc',
                        label: 'Crypto',
                    },
                },
                subMenu: [
                    {
                        key: 'apps.crypto.dashboard',
                        path: `${APPS_PREFIX_PATH}/crypto/dashboard`,
                        title: 'Dashboard',
                        translateKey: 'nav.appsCrypto.dashboard',
                        icon: 'cryptoDashboard',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsCrypto.dashboardDesc',
                                label: 'Dashboard',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.crypto.market',
                        path: `${APPS_PREFIX_PATH}/crypto/market`,
                        title: 'Market',
                        translateKey: 'nav.appsCrypto.market',
                        icon: 'cryptoMarket',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsCrypto.marketDesc',
                                label: 'Market',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.crypto.coin',
                        path: `${APPS_PREFIX_PATH}/crypto/coin/btc`,
                        title: 'Coin',
                        translateKey: 'nav.appsCrypto.coin',
                        icon: 'cryptoCoin',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsCrypto.coinDesc',
                                label: 'Coin details',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.crypto.spot',
                        path: `${APPS_PREFIX_PATH}/crypto/spot`,
                        title: 'Spot',
                        translateKey: 'nav.appsCrypto.spot',
                        icon: 'cryptoSpot',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsCrypto.spotDesc',
                                label: 'Spot',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.crypto.assets',
                        path: `${APPS_PREFIX_PATH}/crypto/assets`,
                        title: 'Assets',
                        translateKey: 'nav.appsCrypto.assets',
                        icon: 'cryptoAssets',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsCrypto.assetsDesc',
                                label: 'assets',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.crypto.kyc',
                        path: `${APPS_PREFIX_PATH}/crypto/kyc`,
                        title: 'KYC',
                        translateKey: 'nav.appsCrypto.kyc',
                        icon: 'cryptoKyc',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsCrypto.kycDesc',
                                label: 'KYC',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'apps.hrm',
                path: '',
                title: 'HR Management',
                translateKey: 'nav.appsHrm.hrm',
                icon: 'hrm',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.appsHrm.hrmDesc',
                        label: 'Human Resource Management',
                    },
                },
                subMenu: [
                    {
                        key: 'apps.hrm.dashboard',
                        path: `${APPS_PREFIX_PATH}/hrm/dashboard`,
                        title: 'Dashboard',
                        translateKey: 'nav.appsHrm.dashboard',
                        icon: 'hrmDashboard',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsHrm.dashboardDesc',
                                label: 'Dashboard',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.hrm.employees',
                        path: `${APPS_PREFIX_PATH}/hrm/employees`,
                        title: 'Employees',
                        translateKey: 'nav.appsHrm.employees',
                        icon: 'hrmEmployees',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsHrm.employeesDesc',
                                label: 'Employees management',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.hrm.attendance',
                        path: `${APPS_PREFIX_PATH}/hrm/attendance`,
                        title: 'Attendance',
                        translateKey: 'nav.appsHrm.attendance',
                        icon: 'hrmAttendance',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsHrm.attendanceDesc',
                                label: 'Attendance management',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.hrm.payroll',
                        path: `${APPS_PREFIX_PATH}/hrm/payroll`,
                        title: 'Payroll',
                        translateKey: 'nav.appsHrm.payroll',
                        icon: 'hrmPayroll',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsHrm.payrollDesc',
                                label: 'Payroll management',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.hrm.leaves',
                        path: `${APPS_PREFIX_PATH}/hrm/leaves`,
                        title: 'Leaves',
                        translateKey: 'nav.appsHrm.leaves',
                        icon: 'hrmLeaves',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsHrm.leavesDesc',
                                label: 'Leaves management',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.hrm.announcements',
                        path: `${APPS_PREFIX_PATH}/hrm/announcements`,
                        title: 'Announcements',
                        translateKey: 'nav.appsHrm.announcements',
                        icon: 'hrmAnnouncements',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsHrm.announcementsDesc',
                                label: 'Announcements management',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'apps.accounts',
                path: '',
                title: 'Accounts',
                translateKey: 'nav.appsAccounts.accounts',
                icon: 'accounts',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.appsAccounts.accountsDesc',
                        label: 'Accounts management',
                    },
                },
                subMenu: [
                    {
                        key: 'apps.accounts.settings',
                        path: `${APPS_PREFIX_PATH}/accounts/settings/profile`,
                        title: 'Settings',
                        translateKey: 'nav.appsAccounts.settings',
                        icon: 'accountsSettings',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAccounts.settingsDesc',
                                label: 'Account settings',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.accounts.activity',
                        path: `${APPS_PREFIX_PATH}/accounts/activity`,
                        title: 'Activity',
                        translateKey: 'nav.appsAccounts.activity',
                        icon: 'accountsActivity',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAccounts.activityDesc',
                                label: 'Account activity',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.accounts.refferals',
                        path: `${APPS_PREFIX_PATH}/accounts/refferals`,
                        title: 'Refferals',
                        translateKey: 'nav.appsAccounts.refferals',
                        icon: 'accountsRefferals',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAccounts.refferalsDesc',
                                label: 'Refferals list',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.accounts.pricing',
                        path: `${APPS_PREFIX_PATH}/accounts/pricing`,
                        title: 'Pricing',
                        translateKey: 'nav.appsAccounts.pricing',
                        icon: 'accountsPricing',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAccounts.pricingDesc',
                                label: 'Pricing plans',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.accounts.invoice',
                        path: `${APPS_PREFIX_PATH}/accounts/invoice`,
                        title: 'Invoice',
                        translateKey: 'nav.appsAccounts.invoice',
                        icon: 'accountsInvoice',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAccounts.invoicesDesc',
                                label: 'Invoices list',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'apps.accounts.users',
                        path: `${APPS_PREFIX_PATH}/accounts/users`,
                        title: 'Users',
                        translateKey: 'nav.appsAccounts.users',
                        icon: 'accountsUsers',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.appsAccounts.usersDesc',
                                label: 'User management',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default uiComponentNavigationConfig
