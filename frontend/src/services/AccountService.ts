import ApiService from './ApiService'
import type {
    ProfilePasswordPayload,
    ProfileUpdatePayload,
    User,
} from '@/@types/auth'

/**
 * The signed-in staff member's own account. These hit the real
 * /api/v1/profile endpoints: self-service, no permission gate, and the actor
 * can only ever touch the record behind their own token.
 */
export async function apiGetProfile() {
    return ApiService.fetchDataWithAxios<User>({
        url: '/v1/profile',
        method: 'get',
    })
}

export async function apiUpdateProfile(data: ProfileUpdatePayload) {
    return ApiService.fetchDataWithAxios<User, ProfileUpdatePayload>({
        url: '/v1/profile',
        method: 'patch',
        data,
    })
}

export async function apiUpdateProfilePassword(data: ProfilePasswordPayload) {
    return ApiService.fetchDataWithAxios<
        { message: string },
        ProfilePasswordPayload
    >({
        url: '/v1/profile/password',
        method: 'patch',
        data,
    })
}

/** Upload a new avatar; the API stores it and returns the updated user. */
export async function apiUploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return ApiService.fetchDataWithAxios<User, FormData>({
        url: '/v1/profile/avatar',
        method: 'post',
        data: formData,
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
