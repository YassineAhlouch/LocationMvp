import DataContext from '../context/DataContext'
import {
    apiGetUsersList,
    apiGetRoles,
    apiGetPermissions,
    apiGetPendingUsers,
} from '@/services/AccountService'
import useQueryParamPagingState from '@/utils/hooks/useQueryParamPagingState'
import useSWR from 'swr'
import type {
    GetUserListResponse,
    GetRoleListResponse,
    GetPermissionListResponse,
    GetPendingUsersResponse,
} from '../types'
import type { ReactNode } from 'react'

type AccessControlContextProps = {
    children: ReactNode
}

const AccessControlContext = ({ children }: AccessControlContextProps) => {
    const { pagingState, filterState, setQueryParams } =
        useQueryParamPagingState({
            pageIndex: 1,
            pageSize: 25,
        })

    const {
        data: users,
        isLoading: isUsersLoading,
        mutate: userMutate,
    } = useSWR(
        ['/api/rbac/users', { ...pagingState, ...filterState }],
        ([, params]) =>
            apiGetUsersList<GetUserListResponse, Record<string, unknown>>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    const {
        data: roles,
        isLoading: isRolesLoading,
        mutate: roleMutate,
    } = useSWR(
        ['/api/rbac/roles', { ...pagingState, ...filterState }],
        ([, params]) =>
            apiGetRoles<GetRoleListResponse, Record<string, unknown>>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const { data: permissions } = useSWR(
        ['/api/rbac/permissions'],
        () => apiGetPermissions<GetPermissionListResponse>(),
        {
            revalidateOnFocus: false,
        },
    )

    const {
        data: pendingUsers,
        isLoading: isPendingUsersLoading,
        mutate: pendingUsersMutate,
    } = useSWR(
        ['/api/rbac/pending-users', { ...pagingState, ...filterState }],
        ([, params]) =>
            apiGetPendingUsers<
                GetPendingUsersResponse,
                Record<string, unknown>
            >(params),
        {
            revalidateOnFocus: false,
        },
    )

    const setUsersData = (
        updater: (draft: GetUserListResponse) => GetUserListResponse,
    ) => {
        userMutate(
            (prev) => {
                if (!prev) return prev
                const next = structuredClone(prev)
                return updater(next)
            },
            { revalidate: false },
        )
    }

    const setRolesData = (
        updater: (draft: GetRoleListResponse) => GetRoleListResponse,
    ) => {
        if (!roles) return
        roleMutate(
            (prev) => {
                if (!prev) return prev
                const next = structuredClone(prev)
                return updater(next)
            },
            { revalidate: false },
        )
    }

    const setPendingUsersData = (
        updater: (draft: GetPendingUsersResponse) => GetPendingUsersResponse,
    ) => {
        if (!pendingUsers) return
        pendingUsersMutate(
            (prev) => {
                if (!prev) return prev
                const next = structuredClone(prev)
                return updater(next)
            },
            { revalidate: false },
        )
    }

    return (
        <DataContext.Provider
            value={{
                users: users || null,
                roles: roles || null,
                permissions: permissions || null,
                pendingUsers: pendingUsers || null,
                isUsersLoading,
                isRolesLoading,
                isPendingUsersLoading,
                setUsersData,
                setRolesData,
                setPendingUsersData,
                setQueryParams,
                pagingState,
                filterState,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default AccessControlContext
