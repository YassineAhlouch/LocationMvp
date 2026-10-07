import ApiService from './ApiService'

export async function apiGetUserProfile<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/settings/profile',
        method: 'get',
    })
}

export async function apiGetAccountSecuritySettings<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/settings/security',
        method: 'get',
    })
}

export async function apiGetAccountIntegrationSettings<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/settings/integration',
        method: 'get',
    })
}

export async function apiGetAccountNotificationSettings<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/settings/notification',
        method: 'get',
    })
}

export async function apiGetAccountBillingSettings<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/settings/billing',
        method: 'get',
    })
}

export async function apiGetActivityLogs<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/activity-logs',
        method: 'get',
        params,
    })
}

export async function apiGetReferralData<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/referrals',
        method: 'get',
    })
}

export async function apiSendInvitation<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/referrals/invite',
        method: 'post',
        data,
    })
}

export async function apiGetPricingPlans<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/pricing',
        method: 'get',
    })
}

export async function apiGetUsersList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/rbac/users',
        method: 'get',
        params,
    })
}

// RBAC Role Management API Methods
export async function apiGetRoles<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/rbac/roles',
        method: 'get',
        params,
    })
}

export async function apiGetRole<T>(roleId: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/rbac/roles/${roleId}`,
        method: 'get',
    })
}

export async function apiGetPermissions<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/rbac/permissions',
        method: 'get',
    })
}

export async function apiGetRolePermissions<T>(roleId: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/rbac/roles/${roleId}/permissions`,
        method: 'get',
    })
}

export async function apiGetPendingUsers<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/rbac/pending-users',
        method: 'get',
        params,
    })
}
