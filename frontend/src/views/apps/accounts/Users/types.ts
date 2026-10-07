export type Filter = {
    customerLabel: string[]
    status: string
    dateRange: [string, string]
}

export type User = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img: string
    role: string[]
    lastOnline: string
    status: string
}

export type GetUserListResponse = {
    list: User[]
    total: number
}

export type GetRoleListResponse = Role[]

export type GetPermissionListResponse = PermissionGroup[]

export type PendingUser = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img?: string
    requestedRole: string[]
    requestDate: string
    invitedBy: string
    status: 'pending' | 'approved' | 'rejected'
    notes?: string
}

export type GetPendingUsersResponse = {
    list: PendingUser[]
    total: number
}

// RBAC Types
export type Role = {
    id: string
    name: string
    description: string
    icon: string
    color: string
    memberCount: number
    members: RBACUser[]
    permissions: string[]
    isDefault: boolean
    createdAt: string
    updatedAt: string
}

export type PermissionGroup = {
    id: string
    name: string
    description: string
    icon: string
    permissions: Permission[]
}

export type Permission = {
    id: string
    name: string
    description: string
    actions: PermissionAction[]
}

export type PermissionAction = {
    id: string
    name: 'create' | 'read' | 'update' | 'delete' | string
    label: string
    enabled: boolean
}

export type RBACUser = {
    id: string
    name: string
    email: string
    img?: string
}

export type RBACState = {
    // Role Management
    roles: Role[]
    selectedRole: Role | null
    isRoleModalOpen: boolean
    isDeleteModalOpen: boolean
    roleModalMode: 'create' | 'edit'

    // Permission Management
    permissions: PermissionGroup[]
    permissionSearch: string
    selectedPermissions: string[]

    // UI State
    loading: boolean
    error: string | null
}
