export const apiPrefix = '/api'

/**
 * Platform (parent) dashboard endpoints. Everything lives under the
 * dedicated /v1/platform area, authenticated with a PlatformAdmin token.
 */
const endpointConfig = {
    signIn: '/v1/platform/auth/login',
    signOut: '/v1/platform/auth/logout',
    me: '/v1/platform/auth/me',

    agencies: '/v1/platform/agencies',
    users: '/v1/platform/users',
    roles: '/v1/platform/roles',

    dashboardStats: '/v1/platform/dashboard/stats',
    invoices: '/v1/platform/invoices',
    invoiceTemplates: '/v1/platform/invoice-templates',

    brands: '/v1/platform/fleet/brands',
    models: '/v1/platform/fleet/models',
    categories: '/v1/platform/fleet/categories',
    currencies: '/v1/platform/fleet/currencies',
}

export default endpointConfig
