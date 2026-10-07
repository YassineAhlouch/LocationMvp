import { createContext } from 'react'
import type {
    GetUserListResponse,
    GetRoleListResponse,
    GetPermissionListResponse,
    GetPendingUsersResponse,
} from '../types'
import type { TableQueries } from '@/@types/common'

type DataContextProps = {
    users: GetUserListResponse | null
    roles: GetRoleListResponse | null
    permissions: GetPermissionListResponse | null
    pendingUsers: GetPendingUsersResponse | null
    pagingState: TableQueries
    filterState: Record<string, string | undefined>
    isUsersLoading: boolean
    isRolesLoading: boolean
    isPendingUsersLoading: boolean
    setQueryParams: (params: Record<string, unknown>) => void
    setUsersData: (
        callback: (data: GetUserListResponse) => GetUserListResponse,
    ) => void
    setRolesData: (
        callback: (data: GetRoleListResponse) => GetRoleListResponse,
    ) => void
    setPendingUsersData: (
        callback: (data: GetPendingUsersResponse) => GetPendingUsersResponse,
    ) => void
}

const DataContext = createContext<DataContextProps>({
    users: null,
    roles: null,
    permissions: null,
    pendingUsers: null,
    isUsersLoading: false,
    isRolesLoading: false,
    isPendingUsersLoading: false,
    pagingState: {
        pageIndex: 1,
        pageSize: 20,
        query: '',
        sortOrder: '',
        sortKey: '',
    },
    filterState: {},
    setQueryParams: () => {},
    setUsersData: () => {},
    setRolesData: () => {},
    setPendingUsersData: () => {},
})

export default DataContext
