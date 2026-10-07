import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import dayjs from 'dayjs'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import ActionBar from '@/components/ui/ActionBar'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import OverflowTabs from '@/components/shared/OverflowTabs'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { LuSearch } from 'react-icons/lu'
import type { ColumnDef, Row } from '@/components/shared/DataTable'
import {
    apiGetUsers,
    apiGetRoles,
    apiUpdateUser,
} from '@/services/LocationService'
import type { Role, StaffUser } from '@/@types/location'
import UserEditDrawer from './UserEditDrawer'
import RolesTab from './RolesTab'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { LiEdit, LiTrash, LiUser, LiShieldCircle } from '@/icons'
import useRandomColor from '@/utils/hooks/useRandomColor'
import classNames from '@/utils/classNames'
import acronym from '@/utils/acronym'

const tabList = [
    {
        value: 'users',
        label: (
            <span className="flex items-center gap-2">
                <LiUser className="text-lg" />
                <span>Users</span>
            </span>
        ),
    },
    {
        value: 'roles',
        label: (
            <span className="flex items-center gap-2">
                <LiShieldCircle className="text-lg" />
                <span>Role & Permissions</span>
            </span>
        ),
    },
]

const UserName = ({ row }: { row: StaffUser }) => {
    const generateRandomColor = useRandomColor()

    return (
        <div className="flex items-center gap-2 py-0.25">
            <Avatar
                size={20}
                shape="circle"
                className={classNames(
                    'border-0 text-gray-900',
                    generateRandomColor(row.full_name).background,
                )}
            >
                {acronym(row.full_name)}
            </Avatar>
            <span className="heading-text text-nowrap font-medium">
                {row.full_name}
            </span>
        </div>
    )
}

const UserStatus = ({ active }: { active: boolean }) => (
    <div className="flex items-center">
        <div className="flex items-center gap-1 font-medium">
            <Badge
                className={classNames(
                    'h-2 w-2 rounded-full',
                    active ? 'bg-success' : 'bg-warning',
                )}
            />
            <span className="heading-text capitalize">
                {active ? 'Active' : 'Inactive'}
            </span>
        </div>
    </div>
)

const ListeUtilisateurs = () => {
    const navigate = useNavigate()

    const [currentTab, setCurrentTab] = useState('users')

    const [users, setUsers] = useState<StaffUser[]>([])
    const [roles, setRoles] = useState<{ value: number; label: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [q, setQ] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [selectedRows, setSelectedRows] = useState<StaffUser[]>([])

    const [editDrawerOpen, setEditDrawerOpen] = useState(false)
    const [editing, setEditing] = useState<StaffUser | null>(null)
    const [deactivating, setDeactivating] = useState<StaffUser | null>(null)
    const [bulkDeactivateOpen, setBulkDeactivateOpen] = useState(false)

    useEffect(() => {
        apiGetRoles({ per_page: 100 })
            .then((res) =>
                setRoles(
                    res.data.map((role: Role) => ({
                        value: role.id,
                        label: role.name,
                    })),
                ),
            )
            .catch(() => setRoles([]))
    }, [])

    const fetchUsers = useCallback(() => {
        setLoading(true)
        const params: Record<string, unknown> = {
            page: pageIndex,
            per_page: pageSize,
        }
        if (q.trim()) {
            params.q = q.trim()
        }
        if (roleFilter) {
            params.role_id = roleFilter
        }
        apiGetUsers(params)
            .then((res) => {
                setUsers(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setUsers([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [pageIndex, pageSize, q, roleFilter])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handlePageChange = (page: number) => {
        setSelectedRows([])
        setPageIndex(page)
    }

    const handlePageSizeChange = (size: number) => {
        setSelectedRows([])
        setPageSize(size)
        setPageIndex(1)
    }

    const handleRowSelect = (checked: boolean, row: StaffUser) => {
        setSelectedRows((prev) =>
            checked
                ? [...prev.filter((s) => s.id !== row.id), row]
                : prev.filter((s) => s.id !== row.id),
        )
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<StaffUser>[]) => {
        setSelectedRows(checked ? rows.map((r) => r.original) : [])
    }

    const handleEdit = (user: StaffUser) => {
        setEditing(user)
        setEditDrawerOpen(true)
    }

    const handleDeactivate = async () => {
        if (!deactivating) {
            return
        }
        try {
            await apiUpdateUser(deactivating.id, { is_active: false })
            toast.push(
                <Notification
                    type="success"
                    title="User deactivated successfully!"
                />,
            )
            setDeactivating(null)
            fetchUsers()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title="Could not deactivate user"
                />,
            )
        }
    }

    const handleBulkDeactivate = async () => {
        const ids = selectedRows.map((user) => user.id)
        try {
            const results = await Promise.allSettled(
                ids.map((id) => apiUpdateUser(id, { is_active: false })),
            )
            const failed = results.filter(
                (result) => result.status === 'rejected',
            ).length
            toast.push(
                <Notification
                    type="success"
                    title={`${ids.length - failed} user(s) deactivated!`}
                />,
            )
            if (failed > 0) {
                toast.push(
                    <Notification
                        type="danger"
                        title={`${failed} update(s) failed`}
                    />,
                )
            }
            setSelectedRows([])
            setBulkDeactivateOpen(false)
            fetchUsers()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title="Could not deactivate users"
                />,
            )
            setBulkDeactivateOpen(false)
        }
    }

    const columns = useMemo<ColumnDef<StaffUser>[]>(
        () => [
            {
                header: 'Name',
                accessorKey: 'full_name',
                cell: (props) => <UserName row={props.row.original} />,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => (
                    <span className="heading-text">
                        {props.row.original.email}
                    </span>
                ),
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
                cell: (props) => (
                    <span className="heading-text text-nowrap">
                        {props.row.original.phone ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Role',
                accessorKey: 'role.name',
                cell: (props) => (
                    <Tag className="capitalize">
                        {props.row.original.role?.name ?? '—'}
                    </Tag>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
                cell: (props) => (
                    <UserStatus active={props.row.original.is_active} />
                ),
            },
            {
                header: 'Last login',
                accessorKey: 'last_login_at',
                cell: (props) => (
                    <span className="heading-text text-nowrap">
                        {props.row.original.last_login_at
                            ? dayjs(props.row.original.last_login_at).format(
                                  'DD MMM YYYY',
                              )
                            : '—'}
                    </span>
                ),
            },
            {
                header: '',
                id: 'action',
                maxSize: 80,
                cell: (props) => (
                    <div className="flex items-center justify-center gap-1">
                        <Button
                            size="sm"
                            variant="link"
                            className="px-2 hover:text-gray-900 dark:hover:text-gray-100"
                            role="button"
                            title="Edit"
                            onClick={() => handleEdit(props.row.original)}
                        >
                            <LiEdit className="text-base" />
                        </Button>
                        <Button
                            size="sm"
                            variant="link"
                            className="px-2 hover:text-error"
                            role="button"
                            title="Deactivate"
                            onClick={() => setDeactivating(props.row.original)}
                        >
                            <LiTrash className="text-base" />
                        </Button>
                    </div>
                ),
            },
        ],
        [handleEdit],
    )

    return (
        <div>
            <div className="px-4 py-2">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h4>Users</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {total} staff members
                        </p>
                    </div>
                </div>
            </div>

            <OverflowTabs
                tabList={tabList}
                value={currentTab}
                onChange={setCurrentTab}
                tabListClass="px-4"
            />

            {currentTab === 'users' && (
                <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 p-4">
                        <div>
                            <DebouceInput
                                placeholder="Search users…"
                                prefix={<LuSearch className="text-lg" />}
                                onChange={(e) => {
                                    setQ(e.target.value)
                                    setSelectedRows([])
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-48">
                                <Select
                                    options={[
                                        { value: '', label: 'All roles' },
                                        ...roles,
                                    ]}
                                    value={
                                        [
                                            {
                                                value: '',
                                                label: 'All roles',
                                            },
                                            ...roles,
                                        ].find((o) => o.value === roleFilter) ??
                                        null
                                    }
                                    onChange={(option) => {
                                        setRoleFilter(
                                            String(option?.value ?? ''),
                                        )
                                        setSelectedRows([])
                                        setPageIndex(1)
                                    }}
                                />
                            </div>
                            <Button
                                variant="solid"
                                onClick={() =>
                                    navigate(
                                        `${APPS_PREFIX_PATH}/utilisateurs/ajouter`,
                                    )
                                }
                            >
                                Add user
                            </Button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <DataTable<StaffUser>
                            compact
                            selectable
                            verticalDivider={{
                                head: true,
                                body: true,
                            }}
                            className="border-t border-b border-gray-200 dark:border-gray-700"
                            columns={columns}
                            data={users}
                            noData={!loading && users.length === 0}
                            skeletonAvatarColumns={[1]}
                            skeletonAvatarProps={{ width: 28, height: 28 }}
                            loading={loading}
                            checkboxChecked={(row) =>
                                selectedRows.some(
                                    (selected) => selected.id === row.id,
                                )
                            }
                            pagingData={{
                                total,
                                pageIndex,
                                pageSize,
                            }}
                            onPaginationChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            onRowSelect={handleRowSelect}
                            onAllRowSelect={handleAllRowSelect}
                        />
                    </div>

                    <ActionBar open={selectedRows.length > 0}>
                        <div className="flex items-center justify-between">
                            <span className="font-medium">
                                <span className="heading-text font-semibold">
                                    {selectedRows.length} Items
                                </span>{' '}
                                selected
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    className={() =>
                                        'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                                    }
                                    onClick={() => setBulkDeactivateOpen(true)}
                                >
                                    Deactivate
                                </Button>
                            </div>
                        </div>
                    </ActionBar>
                </div>
            )}

            {currentTab === 'roles' && <RolesTab />}

            <UserEditDrawer
                isOpen={editDrawerOpen}
                user={editing}
                onClose={() => {
                    setEditDrawerOpen(false)
                    setEditing(null)
                }}
                onSaved={fetchUsers}
            />

            <ConfirmDialog
                isOpen={Boolean(deactivating)}
                type="danger"
                title="Deactivate user"
                onClose={() => setDeactivating(null)}
                onCancel={() => setDeactivating(null)}
                onConfirm={handleDeactivate}
                confirmText="Deactivate"
                cancelText="Cancel"
                confirmButtonProps={{ children: 'Deactivate' }}
            >
                <p>
                    Deactivate {deactivating?.full_name}? They will no longer be
                    able to sign in to this agency.
                </p>
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={bulkDeactivateOpen}
                type="danger"
                title="Deactivate users"
                onClose={() => setBulkDeactivateOpen(false)}
                onCancel={() => setBulkDeactivateOpen(false)}
                onConfirm={handleBulkDeactivate}
                confirmText="Deactivate"
                cancelText="Cancel"
                confirmButtonProps={{ children: 'Deactivate' }}
            >
                <p>
                    Are you sure you want to deactivate {selectedRows.length}{' '}
                    user(s)? They will no longer be able to sign in to this
                    agency.
                </p>
            </ConfirmDialog>
        </div>
    )
}

export default ListeUtilisateurs
