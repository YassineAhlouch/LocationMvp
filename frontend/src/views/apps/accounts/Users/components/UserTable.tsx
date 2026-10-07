import { useMemo, useState, useCallback } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import DataTable from '@/components/shared/DataTable'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EditUserDrawer from './EditUserDrawer'
import UserTableActionBar from './UserTableActionBar'
import useAccessControlData from '../hooks/useAccessControlData'
import useDataTableState from '@/utils/hooks/useDataTableState'
import { getStatusColor } from '../utils'
import classNames from '@/utils/classNames'
import acronym from '@/utils/acronym'
import sleep from '@/utils/sleep'
import { LiEdit, LiTrash } from '@/icons'
import dayjs from 'dayjs'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { User } from '../types'

const NameColumn = ({ row }: { row: User }) => {
    return (
        <div className="flex items-center gap-2 py-0.25">
            <Avatar
                size={20}
                shape="circle"
                className={classNames('border-0 text-gray-900')}
                src={row.img}
            >
                {acronym(row.name)}
            </Avatar>
            <span className="font-medium heading-text text-nowrap">
                {row.name}
            </span>
        </div>
    )
}

const StatusColumn = ({ row }: { row: User }) => (
    <div className="flex items-center">
        <div className="flex items-center gap-1 font-medium">
            <Badge
                className={classNames(
                    'w-2 h-2 rounded-full',
                    getStatusColor(row.status),
                )}
            />
            <span className="capitalize heading-text">{row.status}</span>
        </div>
    </div>
)

const ActionColumn = ({
    userId,
    onEdit,
    onDelete,
    isLoading,
}: {
    userId: string
    onEdit: (userId: string) => void
    onDelete: (userId: string) => void
    isLoading: boolean
}) => {
    return (
        <div className="flex items-center justify-center gap-1">
            <Button
                size="sm"
                variant="link"
                className={`px-2 hover:text-gray-900 dark:hover:text-gray-100`}
                role="button"
                onClick={() => onEdit(userId)}
                disabled={isLoading}
                title="Edit"
            >
                <LiEdit className="text-base" />
            </Button>
            <Button
                size="sm"
                variant="link"
                className={`px-2 hover:text-error`}
                role="button"
                onClick={() => onDelete(userId)}
                disabled={isLoading}
                title="Delete"
            >
                <LiTrash className="text-base" />
            </Button>
        </div>
    )
}

const UserTable = () => {
    const [editDrawerOpen, setEditDrawerOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [selectedRows, setSelectedRows] = useState<User[]>([])

    const { users, isUsersLoading, pagingState, setQueryParams, setUsersData } =
        useAccessControlData()

    const pagingStateHandler = useDataTableState({
        pagingState,
        selectedRows,
        onPagingChange: (data) => {
            setQueryParams(data)
        },
        onRowSelectionChange: (checked, row) => {
            if (checked) {
                setSelectedRows((prev) => [...prev, row])
            } else {
                setSelectedRows((prev) =>
                    prev.filter((item) => item.id !== row.id),
                )
            }
        },
        onAllRowSelectChange: (rows) => {
            setSelectedRows(rows)
        },
    })

    const handleEdit = useCallback(
        (userId: string) => {
            const user = users?.list.find((u) => u.id === userId)
            if (user) {
                setSelectedUser(user)
                setEditDrawerOpen(true)
            }
        },
        [users?.list],
    )

    const handleDelete = useCallback(
        (userId: string) => {
            const user = users?.list.find((u) => u.id === userId)
            if (user) {
                setSelectedUser(user)
                setDeleteDialogOpen(true)
            }
        },
        [users?.list],
    )

    const handleUpdateUser = async (userId: string, data: Partial<User>) => {
        try {
            setIsUpdating(true)
            setUsersData((prev) => ({
                ...prev,
                list: prev.list.map((user) =>
                    user.id === userId ? { ...user, ...data } : user,
                ),
            }))

            toast.push(
                <Notification type="success" title="User Updated">
                    User information has been successfully updated.
                </Notification>,
            )
            setIsUpdating(false)
        } catch (error) {
            console.error('Failed to update user:', error)
            toast.push(
                <Notification type="danger" title="Update Failed">
                    Failed to update user. Please try again.
                </Notification>,
            )
            throw error
        }
    }

    const handleConfirmDelete = async () => {
        if (!selectedUser) return

        try {
            setUsersData((prev) => ({
                ...prev,
                list: prev.list.filter((user) => user.id !== selectedUser.id),
                total: prev.total - 1,
            }))

            toast.push(
                <Notification type="success" title="User Deleted">
                    User has been successfully deleted.
                </Notification>,
            )

            setDeleteDialogOpen(false)
            setDeleteDialogOpen(false)
            setIsDeleting(false)
            setDeleteDialogOpen(false)
            setIsDeleting(false)
            setSelectedUser(null)
        } catch (error) {
            console.error('Failed to delete user:', error)
            toast.push(
                <Notification type="danger" title="Delete Failed">
                    Failed to delete user. Please try again.
                </Notification>,
            )
        }
    }

    const handleBulkDelete = async (userIds: string[]) => {
        try {
            await sleep(500)
            setUsersData((prev) => ({
                ...prev,
                list: prev.list.filter((user) => !userIds.includes(user.id)),
                total: prev.total - userIds.length,
            }))
        } catch (error) {
            console.error('Failed to bulk delete users:', error)
            throw error
        }
    }

    const handleClearSelection = () => {
        setSelectedRows([])
    }

    const handleBulkUpdate = async (data: Partial<User>) => {
        try {
            await sleep(500)
            const selectedUserIds = selectedRows.map((user) => user.id)
            setUsersData((prev) => ({
                ...prev,
                list: prev.list.map((user) =>
                    selectedUserIds.includes(user.id)
                        ? { ...user, ...data }
                        : user,
                ),
            }))

            setSelectedRows([])
        } catch (error) {
            console.error('Failed to bulk update users:', error)
            throw error
        }
    }

    const handleCloseEditDrawer = () => {
        setEditDrawerOpen(false)
        setSelectedUser(null)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setSelectedUser(null)
    }

    const isLoading = isUsersLoading

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => <NameColumn row={props.row.original} />,
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
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => <StatusColumn row={props.row.original} />,
            },
            {
                header: 'Last online',
                accessorKey: 'lastOnline',
                cell: (props) => {
                    return (
                        <span className="heading-text text-nowrap">
                            {dayjs(props.row.original.lastOnline).format(
                                'DD MMM YYYY',
                            )}
                        </span>
                    )
                },
            },
            {
                header: 'Role',
                accessorKey: 'role',
                cell: (props) => (
                    <div className="flex gap-2">
                        {props.row.original.role.map((role) => (
                            <Tag className="capitalize" key={role}>
                                {role}
                            </Tag>
                        ))}
                    </div>
                ),
            },
            {
                header: '',
                id: 'action',
                maxSize: 80,
                cell: (props) => (
                    <ActionColumn
                        userId={props.row.original.id}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isLoading={isLoading}
                    />
                ),
            },
        ],
        [handleEdit, handleDelete, isLoading],
    )

    return (
        <div>
            <DataTable
                compact
                selectable
                verticalDivider={{
                    head: true,
                    body: true,
                }}
                className="border-t border-b border-gray-200 dark:border-gray-700"
                columns={columns}
                data={users?.list || []}
                noData={!isLoading && users?.list?.length === 0}
                skeletonAvatarColumns={[1]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: users?.total || 0,
                    pageIndex: pagingState.pageIndex as number,
                    pageSize: pagingState.pageSize as number,
                }}
                {...pagingStateHandler}
            />

            <UserTableActionBar
                selectedRows={selectedRows}
                onClearSelection={handleClearSelection}
                onBulkDelete={handleBulkDelete}
                onBulkUpdate={handleBulkUpdate}
                loading={isLoading}
            />

            <EditUserDrawer
                isOpen={editDrawerOpen}
                onClose={handleCloseEditDrawer}
                user={selectedUser}
                onSave={handleUpdateUser}
                loading={isUpdating}
            />

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteDialog}
                type="danger"
                title="Delete User"
                confirmText="Delete"
                cancelText="Cancel"
                confirmButtonProps={{
                    loading: isDeleting,
                    disabled: isDeleting,
                }}
            >
                <p>
                    Are you sure you want to delete{' '}
                    <span className="font-medium heading-text">
                        {selectedUser?.name}
                    </span>
                    ? This action cannot be undone.
                </p>
            </ConfirmDialog>
        </div>
    )
}

export default UserTable
