import { create } from 'zustand'
import { Role, PermissionGroup } from '../types'

export type AccessControlState = {
    currentTab: string
    selectedRole: Role | null
    permissionDialogOpen: boolean
    isRoleModalOpen: boolean
    isDeleteModalOpen: boolean
    roleModalMode: 'create' | 'edit'
    permissions: PermissionGroup[]
    permissionSearch: string
    selectedPermissions: string[]
    loading: boolean
    error: string | null
}

type AccessControlAction = {
    setCurrentTab: (tab: string) => void
    setSelectedRole: (role: Role | null) => void
    openRoleModal: (mode: 'create' | 'edit', role?: Role) => void
    closeRoleModal: () => void
    openDeleteModal: (role: Role) => void
    closeDeleteModal: () => void
    setPermissionDialogOpen: (isOpen: boolean) => void
    setPermissions: (permissions: PermissionGroup[]) => void
    setPermissionSearch: (search: string) => void
    setSelectedPermissions: (permissions: string[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    clearError: () => void
}

const initialState: AccessControlState = {
    currentTab: 'user',

    selectedRole: null,
    isRoleModalOpen: false,
    isDeleteModalOpen: false,
    roleModalMode: 'create',
    permissionDialogOpen: false,
    permissions: [],
    permissionSearch: '',
    selectedPermissions: [],
    loading: false,
    error: null,
}

export const useAccessControlStore = create<
    AccessControlState & AccessControlAction
>((set) => ({
    ...initialState,
    setCurrentTab: (tab) => set(() => ({ currentTab: tab })),
    setPermissionDialogOpen: (isOpen) =>
        set(() => ({ permissionDialogOpen: isOpen })),
    setSelectedRole: (role) => set(() => ({ selectedRole: role })),
    openRoleModal: (mode, role) =>
        set(() => ({
            isRoleModalOpen: true,
            roleModalMode: mode,
            selectedRole: role || null,
        })),
    closeRoleModal: () =>
        set(() => ({
            isRoleModalOpen: false,
            roleModalMode: 'create',
        })),
    openDeleteModal: (role) =>
        set(() => ({
            isDeleteModalOpen: true,
            selectedRole: role,
        })),
    closeDeleteModal: () =>
        set(() => ({
            isDeleteModalOpen: false,
        })),
    setPermissions: (permissions) => set(() => ({ permissions })),
    setPermissionSearch: (search) => set(() => ({ permissionSearch: search })),
    setSelectedPermissions: (permissions) =>
        set(() => ({ selectedPermissions: permissions })),
    setLoading: (loading) => set(() => ({ loading })),
    setError: (error) => set(() => ({ error })),
    clearError: () => set(() => ({ error: null })),
}))
