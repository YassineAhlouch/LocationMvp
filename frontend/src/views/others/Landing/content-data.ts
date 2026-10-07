import type { LandingPageContent } from './types'

export const landingPageContent: LandingPageContent = {
    nav: {
        items: [
            { title: 'Features', value: 'features', anchor: 'features' },
            { title: 'Demos', value: 'demos', anchor: 'demos' },
            { title: 'Components', value: 'components', anchor: 'components' },
            {
                title: 'Documentations',
                value: 'documentations',
                hrefPattern:
                    'https://static.themenate.net/eyris-doc/{framework}/introduction/index.html',
            },
        ],
    },

    hero: {
        headingLines: ['Skip the Boilerplate,', 'Start Building'],
        subtext:
            'Production-ready admin starter — auth, routing, theming, and AI context pre-wired.',
        primaryCta: 'Try it out',
        secondaryCta: {
            label: 'Get this template',
            href: 'https://themeforest.net/item/eyris-tailwind-admin-ui-kit/62526728',
        },
        tabs: [
            {
                value: 'production-apps',
                label: 'Production Apps',
                description: 'not just UI screens.',
            },
            {
                value: 'components-blocks',
                label: 'Components & Blocks',
                description: 'full ui library',
            },
            {
                value: 'ai-ready-mcp',
                label: 'AI-Ready',
                description: 'no hallucinations, no guessing.',
            },
            {
                value: 'versatile-layouts',
                label: 'Versatile Layouts',
                description: 'Switch layouts instantly',
            },
        ],
    },

    bento: {
        heading: {
            primary: 'A Production System, Not Just a Template.',
            secondary:
                'Everything you need to build modern admin apps — faster, smarter, and with confidence.',
        },
        cards: {
            ai: {
                title: 'Your AI knows the codebase',
                description:
                    'Comes with local MCP server and context for every major AI coding agent — ready out of the box.',
            },
            theming: {
                title: 'Theming & Branding',
                description:
                    'Switch brands, colors, layouts, and modes in seconds — no refactors.',
            },
            docs: {
                title: 'Comprehensive Docs',
                description:
                    "Clear guides, examples, and best practices — so you're never stuck.",
                floatingTags: [
                    { label: 'Getting Started' },
                    { label: 'Components Usage' },
                    { label: 'Routing' },
                    { label: 'Authentication' },
                ],
            },
            i18n: {
                title: 'Global-Scale Ready',
                description:
                    'Built-in i18n, RTL support, and accessibility-friendly patterns out of the box.',
                locales: [
                    {
                        flag: '/img/countries/US.png',
                        text: 'Your monthly report is ready.',
                        code: 'US',
                    },
                    {
                        flag: '/img/countries/CN.png',
                        text: '您的月度报告已准备就绪。',
                        code: 'CN',
                    },
                    {
                        flag: '/img/countries/ES.png',
                        text: 'Su informe mensual está listo.',
                        code: 'ES',
                    },
                    {
                        flag: '/img/countries/SA.png',
                        text: 'تقريرك الشهري جاهز.',
                        code: 'SA',
                    },
                ],
            },
            responsive: {
                title: 'Designed for Every Screen',
                description:
                    'From mobile to ultra-wide displays, your app stays beautiful, usable, and performant at every breakpoint.',
            },
        },
    },

    tech: {
        heading: {
            primary: 'Skip the setup. Ship the product.',
            secondary:
                "The stack you'd spend a week assembling — React, TanStack Table, Recharts, Framer Motion, and more — pre-integrated and ready to extend.",
        },
        viteStack: [
            { id: 'react', image: 'react.png', title: 'React' },
            { id: 'typescript', image: 'typescript.png', title: 'TypeScript' },
            { id: 'tailwind', image: 'tailwind.png', title: 'TailwindCSS' },
            { id: 'vite', image: 'vite.png', title: 'Vite' },
            { id: 'zustand', image: 'zustand.png', title: 'Zustand' },
            {
                id: 'react-hook-form',
                image: 'react-hook-form.png',
                title: 'React Hook Form',
            },
            { id: 'tanstack', image: 'tanstack.png', title: 'TanStack Table' },
            { id: 'i18next', image: 'i18next.svg', title: 'React i18next' },
            { id: 'motion', image: 'motion.png', title: 'Motion' },
            {
                id: 'react-router',
                image: 'react-router.svg',
                title: 'React Router',
            },
        ],
        nextStack: [
            { id: 'react', image: 'react.png', title: 'React' },
            { id: 'typescript', image: 'typescript.png', title: 'TypeScript' },
            { id: 'tailwind', image: 'tailwind.png', title: 'TailwindCSS' },
            { id: 'nextjs', image: 'nextjs.png', title: 'Next.js' },
            { id: 'authjs', image: 'authjs.png', title: 'Auth.js' },
            { id: 'zustand', image: 'zustand.png', title: 'Zustand' },
            {
                id: 'react-hook-form',
                image: 'react-hook-form.png',
                title: 'React Hook Form',
            },
            { id: 'tanstack', image: 'tanstack.png', title: 'TanStack Table' },
            { id: 'next-intl', image: 'next-intl.png', title: 'Next intl' },
            { id: 'motion', image: 'motion.png', title: 'Motion' },
        ],
    },

    demos: {
        heading: 'Discover demos',
        subheading:
            'Jumpstart any project with fully built, real-life application scenarios.',
        categories: [
            {
                id: 'dashboard',
                name: 'Dashboard',
                items: [
                    {
                        id: 'salesDashboard',
                        name: 'Sales Dashboard',
                        path: '/apps/sales/dashboard',
                    },
                    {
                        id: 'crmDashboard',
                        name: 'CRM Dashboard',
                        path: '/apps/customers/dashboard',
                    },
                    {
                        id: 'hrmDashboard',
                        name: 'HR Dashboard',
                        path: '/apps/hrm/dashboard',
                    },
                    {
                        id: 'cryptoDashboard',
                        name: 'Crypto Dashboard',
                        path: '/apps/crypto/dashboard',
                    },
                    {
                        id: 'projectDashboard',
                        name: 'Project Dashboard',
                        path: '/apps/projects/dashboard',
                    },
                    {
                        id: 'analyticDashboard',
                        name: 'Analytics Dashboard',
                        path: '/apps/analytics/dashboard',
                    },
                ],
            },
            {
                id: 'sales',
                name: 'Sales',
                items: [
                    {
                        id: 'salesDashboard',
                        name: 'Dashboard',
                        path: '/apps/sales/dashboard',
                    },
                    {
                        id: 'salesProducts',
                        name: 'Products',
                        path: '/apps/sales/products',
                    },
                    {
                        id: 'salesProductDetail',
                        name: 'Product Detail',
                        path: '/apps/sales/products/1',
                    },
                    {
                        id: 'salesNewProduct',
                        name: 'New Product',
                        path: '/apps/sales/product',
                    },
                    {
                        id: 'salesOrderList',
                        name: 'Order List',
                        path: '/apps/sales/orders',
                    },
                    {
                        id: 'salesNewOrder',
                        name: 'New Order',
                        path: '/apps/sales/order',
                    },
                    {
                        id: 'salesEditOrder',
                        name: 'Edit Order',
                        path: '/apps/sales/orders/95954',
                    },
                ],
            },
            {
                id: 'customers',
                name: 'Customers',
                items: [
                    {
                        id: 'crmDashboard',
                        name: 'Dashboard',
                        path: '/apps/customers/dashboard',
                    },
                    {
                        id: 'crmCustomerList',
                        name: 'Customer List',
                        path: '/apps/customers/list',
                    },
                    {
                        id: 'crmCustomerDetails',
                        name: 'Customer Details',
                        path: '/apps/customers/1',
                    },
                    {
                        id: 'crmLeads',
                        name: 'Leads',
                        path: '/apps/customers/leads',
                    },
                    {
                        id: 'crmLeadDetails',
                        name: 'Lead Details',
                        path: '/apps/customers/leads/1',
                    },
                    {
                        id: 'crmHelpdesk',
                        name: 'Helpdesk',
                        path: '/apps/customers/helpdesk',
                    },
                ],
            },
            {
                id: 'project',
                name: 'Project',
                items: [
                    {
                        id: 'projectDashboard',
                        name: 'Dashboard',
                        path: '/apps/projects/dashboard',
                    },
                    {
                        id: 'projectList',
                        name: 'Project List',
                        path: '/apps/projects/list',
                    },
                    {
                        id: 'projectDetails',
                        name: 'Details',
                        path: '/apps/projects/1',
                    },
                    {
                        id: 'projectScrumboard',
                        name: 'Scrumboard',
                        path: '/apps/projects/scrumboard',
                    },
                    {
                        id: 'projectTimeline',
                        name: 'Timeline',
                        path: '/apps/projects/timeline',
                    },
                    {
                        id: 'projectTasks',
                        name: 'Tasks',
                        path: '/apps/projects/tasks',
                    },
                    {
                        id: 'projectSettings',
                        name: 'Settings',
                        path: '/apps/projects/settings',
                    },
                ],
            },
            {
                id: 'analytics',
                name: 'Analytics',
                items: [
                    {
                        id: 'analyticDashboard',
                        name: 'Dashboard',
                        path: '/apps/analytics/dashboard',
                    },
                    {
                        id: 'analyticForecast',
                        name: 'Forecast',
                        path: '/apps/analytics/forecast',
                    },
                    {
                        id: 'analyticRevenue',
                        name: 'Revenue',
                        path: '/apps/analytics/revenue',
                    },
                    {
                        id: 'analyticSubscriptions',
                        name: 'Subscriptions',
                        path: '/apps/analytics/subscriptions',
                    },
                    {
                        id: 'analyticReports',
                        name: 'Reports',
                        path: '/apps/analytics/reports',
                    },
                ],
            },
            {
                id: 'ai',
                name: 'AI',
                items: [
                    { id: 'aiChat', name: 'Chat', path: '/apps/ai/chat' },
                    { id: 'aiImage', name: 'Image', path: '/apps/ai/image' },
                    { id: 'aiWriter', name: 'Writer', path: '/apps/ai/writer' },
                ],
            },
            {
                id: 'crypto',
                name: 'Crypto',
                items: [
                    {
                        id: 'cryptoDashboard',
                        name: 'Dashboard',
                        path: '/apps/crypto/dashboard',
                    },
                    {
                        id: 'cryptoMarket',
                        name: 'Market',
                        path: '/apps/crypto/market',
                    },
                    {
                        id: 'cryptoCoin',
                        name: 'Coin Details',
                        path: '/apps/crypto/coin/bitcoin',
                    },
                    {
                        id: 'cryptoSpot',
                        name: 'Spot',
                        path: '/apps/crypto/spot',
                    },
                    {
                        id: 'cryptoAssets',
                        name: 'Assets',
                        path: '/apps/crypto/assets',
                    },
                    { id: 'cryptoKyc', name: 'KYC', path: '/apps/crypto/kyc' },
                ],
            },
            {
                id: 'hrm',
                name: 'HR Management',
                items: [
                    {
                        id: 'hrmDashboard',
                        name: 'Dashboard',
                        path: '/apps/hrm/dashboard',
                    },
                    {
                        id: 'hrmEmployees',
                        name: 'Employees',
                        path: '/apps/hrm/employees',
                    },
                    {
                        id: 'hrmAttendance',
                        name: 'Attendance',
                        path: '/apps/hrm/attendance',
                    },
                    {
                        id: 'hrmPayroll',
                        name: 'Payroll',
                        path: '/apps/hrm/payroll',
                    },
                    {
                        id: 'hrmLeaves',
                        name: 'Leaves',
                        path: '/apps/hrm/leaves',
                    },
                    {
                        id: 'hrmAnnouncements',
                        name: 'Announcements',
                        path: '/apps/hrm/announcements',
                    },
                ],
            },
            {
                id: 'accounts',
                name: 'Accounts',
                items: [
                    {
                        id: 'accountSettings',
                        name: 'Settings',
                        path: '/apps/accounts/settings',
                    },
                    {
                        id: 'accountActivity',
                        name: 'Activity',
                        path: '/apps/accounts/activity',
                    },
                    {
                        id: 'accountReferrals',
                        name: 'Referrals',
                        path: '/apps/accounts/refferals',
                    },
                    {
                        id: 'accountPricing',
                        name: 'Pricing',
                        path: '/apps/accounts/pricing',
                    },
                    {
                        id: 'accountUsers',
                        name: 'Users',
                        path: '/apps/accounts/users',
                    },
                    {
                        id: 'accountInvoice',
                        name: 'Invoice',
                        path: '/apps/accounts/invoice',
                    },
                ],
            },
            {
                id: 'auth',
                name: 'Authentication',
                items: [
                    {
                        id: 'signInSimple',
                        name: 'Sign In Simple',
                        path: '/auth/sign-in-simple',
                    },
                    {
                        id: 'signInSide',
                        name: 'Sign In Side',
                        path: '/auth/sign-in-side',
                    },
                    {
                        id: 'signInCentred',
                        name: 'Sign In Centred',
                        path: '/auth/sign-in-centred',
                    },
                    {
                        id: 'signUpSimple',
                        name: 'Sign Up Simple',
                        path: '/auth/sign-up-simple',
                    },
                    {
                        id: 'signUpSide',
                        name: 'Sign Up Side',
                        path: '/auth/sign-up-side',
                    },
                    {
                        id: 'signUpCentred',
                        name: 'Sign Up Centred',
                        path: '/auth/sign-up-centred',
                    },
                    {
                        id: 'forgotPasswordSimple',
                        name: 'Forgot Password Simple',
                        path: '/auth/forgot-password-simple',
                    },
                    {
                        id: 'forgotPasswordSide',
                        name: 'Forgot Password Side',
                        path: '/auth/forgot-password-side',
                    },
                    {
                        id: 'forgotPasswordCentred',
                        name: 'Forgot Password Centred',
                        path: '/auth/forgot-password-centred',
                    },
                    {
                        id: 'resetPasswordSimple',
                        name: 'Reset Password Simple',
                        path: '/auth/reset-password-simple',
                    },
                    {
                        id: 'resetPasswordSide',
                        name: 'Reset Password Side',
                        path: '/auth/reset-password-side',
                    },
                    {
                        id: 'resetPasswordCentred',
                        name: 'Reset Password Centred',
                        path: '/auth/reset-password-centred',
                    },
                    {
                        id: 'otpVerificationSimple',
                        name: 'OTP Verification Simple',
                        path: '/auth/otp-verification-simple',
                    },
                    {
                        id: 'otpVerificationSide',
                        name: 'OTP Verification Side',
                        path: '/auth/otp-verification-side',
                    },
                    {
                        id: 'otpVerificationCentred',
                        name: 'OTP Verification Centred',
                        path: '/auth/otp-verification-centred',
                    },
                ],
            },
        ],
    },

    components: {
        heading: 'Foundation UI System',
        subheading:
            'A scalable, themeable core component library designed to support complex design systems and long-term product development.',
    },

    cta: {
        title: 'Design systems & code ',
        subtitle: 'in perfect sync',
        purchaseLabel: 'Purchase',
        purchaseHref:
            'https://themeforest.net/item/eyris-tailwind-admin-ui-kit/62526728',
        logoSrc: '/img/landing/logo-bottom.png',
    },

    footer: {
        copyright: '© 2026 Theme_Nate. All rights reserved.',
        brandText: 'EYRIS',
    },
}
