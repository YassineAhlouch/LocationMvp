import ApiService from './ApiService'
import type {
    Role,
    PermissionGroup,
    Permission,
} from '../views/apps/accounts/Users/types'

// Request/Response Types
export type GetRolesResponse = {
    roles: Role[]
    total: number
}

export type GetRoleResponse = {
    role: Role
}

export type CreateRoleRequest = {
    name: string
    description: string
    icon: string
    color: string
    permissions?: string[]
}

export type CreateRoleResponse = {
    role: Role
}

export type UpdateRoleRequest = Partial<CreateRoleRequest>

export type UpdateRoleResponse = {
    role: Role
}

export type CloneRoleRequest = {
    name: string
    description?: string
    icon?: string
    color?: string
}

export type CloneRoleResponse = {
    role: Role
}

export type ReassignMembersRequest = {
    memberReassignments: Record<string, string> // userId -> newRoleId
}

export type ReassignMembersResponse = {
    success: boolean
    reassignedCount: number
}

export type GetPermissionGroupsResponse = {
    permissionGroups: PermissionGroup[]
}

export type GetPermissionsResponse = {
    permissions: Permission[]
}

export type UpdateRolePermissionsRequest = {
    permissions: string[]
}

export type UpdateRolePermissionsResponse = {
    role: Role
    updatedPermissions: string[]
}

export type GetRolePermissionsResponse = {
    roleId: string
    permissions: string[]
}

export type BulkUpdatePermissionsRequest = {
    roleId: string
    permissionUpdates: Array<{
        permissionId: string
        action: string
        enabled: boolean
    }>
}

export type BulkUpdatePermissionsResponse = {
    role: Role
    updatedPermissions: string[]
}

// Role Management Service Methods
export async function getRoles() {
    return ApiService.fetchDataWithAxios<GetRolesResponse>({
        url: '/rbac/roles',
        method: 'get',
    })
}

export async function getRole(roleId: string) {
    return ApiService.fetchDataWithAxios<GetRoleResponse>({
        url: `/rbac/roles/${roleId}`,
        method: 'get',
    })
}

export async function createRole(data: CreateRoleRequest) {
    return ApiService.fetchDataWithAxios<CreateRoleResponse>({
        url: '/rbac/roles',
        method: 'post',
        data,
    })
}

export async function updateRole(roleId: string, data: UpdateRoleRequest) {
    return ApiService.fetchDataWithAxios<UpdateRoleResponse>({
        url: `/rbac/roles/${roleId}`,
        method: 'put',
        data,
    })
}

export async function deleteRole(roleId: string) {
    return ApiService.fetchDataWithAxios<{ success: boolean }>({
        url: `/rbac/roles/${roleId}`,
        method: 'delete',
    })
}

export async function cloneRole(roleId: string, data: CloneRoleRequest) {
    return ApiService.fetchDataWithAxios<CloneRoleResponse>({
        url: `/rbac/roles/${roleId}/clone`,
        method: 'post',
        data,
    })
}

export async function reassignRoleMembers(
    roleId: string,
    data: ReassignMembersRequest,
) {
    return ApiService.fetchDataWithAxios<ReassignMembersResponse>({
        url: `/rbac/roles/${roleId}/reassign-members`,
        method: 'post',
        data,
    })
}

// Permission Management Service Methods
export async function getPermissionGroups() {
    return ApiService.fetchDataWithAxios<GetPermissionGroupsResponse>({
        url: '/rbac/permission-groups',
        method: 'get',
    })
}

export async function getPermissions() {
    return ApiService.fetchDataWithAxios<GetPermissionsResponse>({
        url: '/rbac/permissions',
        method: 'get',
    })
}

export async function updateRolePermissions(
    roleId: string,
    data: UpdateRolePermissionsRequest,
) {
    return ApiService.fetchDataWithAxios<UpdateRolePermissionsResponse>({
        url: `/rbac/roles/${roleId}/permissions`,
        method: 'put',
        data,
    })
}

export async function getRolePermissions(roleId: string) {
    return ApiService.fetchDataWithAxios<GetRolePermissionsResponse>({
        url: `/rbac/roles/${roleId}/permissions`,
        method: 'get',
    })
}

export async function bulkUpdatePermissions(
    data: BulkUpdatePermissionsRequest,
) {
    return ApiService.fetchDataWithAxios<BulkUpdatePermissionsResponse>({
        url: '/rbac/permissions/bulk-update',
        method: 'post',
        data,
    })
}

// Utility method for searching roles
export async function searchRoles(query: string) {
    return ApiService.fetchDataWithAxios<GetRolesResponse>({
        url: '/rbac/roles/search',
        method: 'get',
        params: { q: query },
    })
}

// Utility method for getting available icons
export async function getAvailableIcons() {
    return ApiService.fetchDataWithAxios<{ icons: string[] }>({
        url: '/rbac/icons',
        method: 'get',
    })
}

// Utility method for getting available colors
export async function getAvailableColors() {
    return ApiService.fetchDataWithAxios<{ colors: string[] }>({
        url: '/rbac/colors',
        method: 'get',
    })
}
