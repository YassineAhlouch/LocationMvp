import { useMemo, useCallback, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import Button from '@/components/ui/Button'
import DataTable from '@/components/shared/DataTable'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useAccessControlData from '../hooks/useAccessControlData'
import useDataTableState from '@/utils/hooks/useDataTableState'
import PendingUsersTableActionBar from './PendingUsersTableActionBar'
import { getStatusColor } from '../utils'
import classNames from '@/utils/classNames'
import acronym from '@/utils/acronym'
import sleep from '@/utils/sleep'
import { TbCircleCheckFilled, TbCircleX } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { PendingUser } from '../types'

const NameColumn = ({ row }: { row: PendingUser }) => {
    return (
        <div className="flex items-center gap-2 py-0.25">
            <Avatar
                size={20}
                shape="circle"
                className="heading-text"
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

const StatusColumn = ({ row }: { row: PendingUser }) => (
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
    onApprove,
    onReject,
    isLoading,
}: {
    userId: string
    onApprove: (userId: string) => void
    onReject: (userId: string) => void
    isLoading: boolean
}) => {
    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                size="sm"
                className="text-error hover:bg-error-subtle hover:border-error"
                icon={<TbCircleX />}
                onClick={() => onReject(userId)}
                loading={isLoading}
                disabled={isLoading}
            >
                Reject
            </Button>
            <Button
                size="sm"
                className="text-success  hover:bg-success-subtle hover:border-success"
                icon={<TbCircleCheckFilled />}
                onClick={() => onApprove(userId)}
                loading={isLoading}
                disabled={isLoading}
            >
                Approve
            </Button>
        </div>
    )
}

const PendingUsersTable = () => {
    const {
        pendingUsers,
        isPendingUsersLoading,
        pagingState,
        setQueryParams,
        setPendingUsersData,
    } = useAccessControlData()
    const [selectedRows, setSelectedRows] = useState<PendingUser[]>([])

    const pagingStateHandler = useDataTableState<PendingUser>({
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

    const isLoading = isPendingUsersLoading

    const handleApprove = useCallback(
        async (userId: string) => {
            try {
                await sleep(100)

                setPendingUsersData((prev) => ({
                    ...prev,
                    list: prev.list.filter((user) => user.id !== userId),
                    total: prev.total - 1,
                }))

                toast.push(
                    <Notification type="success" title="User Approved">
                        User has been successfully approved and granted access.
                    </Notification>,
                    {
                        placement: 'top-center',
                    },
                )
            } catch {
                toast.push(
                    <Notification type="danger" title="Approval Failed">
                        Failed to approve user. Please try again.
                    </Notification>,
                )
            }
        },
        [setPendingUsersData],
    )

    const handleReject = useCallback(
        async (userId: string) => {
            try {
                await sleep(100)

                setPendingUsersData((prev) => ({
                    ...prev,
                    list: prev.list.filter((user) => user.id !== userId),
                    total: prev.total - 1,
                }))

                toast.push(
                    <Notification type="warning" title="User Rejected">
                        User access request has been rejected.
                    </Notification>,
                    {
                        placement: 'top-center',
                    },
                )
            } catch (error) {
                console.error('Failed to reject user:', error)
                toast.push(
                    <Notification type="danger" title="Rejection Failed">
                        Failed to reject user. Please try again.
                    </Notification>,
                )
            }
        },
        [setPendingUsersData],
    )

    const handleBulkApprove = useCallback(
        async (userIds: string[]) => {
            try {
                await sleep(500) // Simulate API call

                setPendingUsersData((prev) => ({
                    ...prev,
                    list: prev.list.filter(
                        (user) => !userIds.includes(user.id),
                    ),
                    total: prev.total - userIds.length,
                }))
            } catch (error) {
                console.error('Failed to bulk approve users:', error)
                throw error
            }
        },
        [setPendingUsersData],
    )

    const handleBulkReject = useCallback(
        async (userIds: string[]) => {
            try {
                await sleep(500) // Simulate API call

                setPendingUsersData((prev) => ({
                    ...prev,
                    list: prev.list.filter(
                        (user) => !userIds.includes(user.id),
                    ),
                    total: prev.total - userIds.length,
                }))
            } catch (error) {
                console.error('Failed to bulk reject users:', error)
                throw error
            }
        },
        [setPendingUsersData],
    )

    const handleClearSelection = useCallback(() => {
        setSelectedRows([])
    }, [])

    const columns: ColumnDef<PendingUser>[] = useMemo(
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
                    <span className="heading-text text-nowrap">
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
                header: 'Request Date',
                accessorKey: 'requestDate',
                cell: (props) => {
                    return (
                        <span className="heading-text text-nowrap">
                            {dayjs(props.row.original.requestDate).format(
                                'DD MMM YYYY',
                            )}
                        </span>
                    )
                },
            },
            {
                header: 'Requested Role',
                accessorKey: 'requestedRole',
                cell: (props) => (
                    <div className="flex gap-2">
                        {props.row.original.requestedRole.map((role) => (
                            <Tag className="capitalize" key={role}>
                                {role}
                            </Tag>
                        ))}
                    </div>
                ),
            },
            {
                header: 'Invited By',
                accessorKey: 'invitedBy',
                cell: (props) => (
                    <span className="heading-text  text-nowrap">
                        {props.row.original.invitedBy}
                    </span>
                ),
            },
            {
                header: 'Notes',
                accessorKey: 'notes',
                maxSize: 100,
                cell: (props) => {
                    const notes = props.row.original.notes
                    return notes ? (
                        <Tooltip title={notes}>
                            <span className="truncate block">{notes}</span>
                        </Tooltip>
                    ) : (
                        <span>-</span>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        userId={props.row.original.id}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        isLoading={isLoading}
                    />
                ),
            },
        ],
        [handleApprove, handleReject, isLoading],
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
                data={pendingUsers?.list || []}
                noData={!isLoading && pendingUsers?.list?.length === 0}
                skeletonAvatarColumns={[1]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: pendingUsers?.total || 0,
                    pageIndex: pagingState.pageIndex as number,
                    pageSize: pagingState.pageSize as number,
                }}
                {...pagingStateHandler}
            />
            <PendingUsersTableActionBar
                selectedRows={selectedRows}
                onClearSelection={handleClearSelection}
                onBulkApprove={handleBulkApprove}
                onBulkReject={handleBulkReject}
                loading={isLoading}
            />
        </div>
    )
}

export default PendingUsersTable
