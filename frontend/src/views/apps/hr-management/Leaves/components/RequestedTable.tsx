import { useMemo, useState, useCallback } from 'react'
import { Avatar, Button, Tag, Badge } from '@/components/ui'
import DataTable from '@/components/shared/DataTable'
import Loading from '@/components/shared/Loading'
import { LiCrossCircle, LiTickCircle, LiSearch } from '@/icons'
import { apiGetLeaveRequests } from '@/services/HrmService'
import { getEventColors, getEventText } from '../utils'
import toast from '@/components/ui/toast'
import { Notification } from '@/components/ui'
import dayjs from 'dayjs'
import useSWR from 'swr'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import type { ColumnDef } from '@tanstack/react-table'
import type { LeaveRequest } from '../types'

type GetLeaveRequestsResponse = {
    list: LeaveRequest[]
    total: number
}

type TableQueries = {
    pageIndex: number
    pageSize: number
    query: string
    sortOrder: string
    sortKey: string
    status?: string
    type?: string
}

const RequestedTable = () => {
    const [actionLoading, setActionLoading] = useState<{
        id: string
        action: 'approve' | 'reject'
    } | null>(null)

    const tableQueries: TableQueries = useMemo(
        () => ({
            pageIndex: 1,
            pageSize: 50,
            query: '',
            sortOrder: 'desc',
            sortKey: 'appliedAt',
        }),
        [],
    )

    const {
        data: leaveRequestsData,
        error: requestsError,
        isLoading: requestsLoading,
        mutate,
    } = useSWR<GetLeaveRequestsResponse>(
        ['hrm-leave-requests', tableQueries],
        () =>
            apiGetLeaveRequests<GetLeaveRequestsResponse, TableQueries>(
                tableQueries,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    const requestedData = useMemo(() => {
        if (!leaveRequestsData?.list) return []
        return leaveRequestsData.list.filter(
            (request) => request.status === 'pending',
        )
    }, [leaveRequestsData])

    const handleApprove = useCallback(
        async (id: string) => {
            setActionLoading({ id, action: 'approve' })
            await sleep(500)
            try {
                if (leaveRequestsData?.list) {
                    const updatedList = leaveRequestsData.list.map((request) =>
                        request.id === id
                            ? { ...request, status: 'approved' as const }
                            : request,
                    )

                    mutate(
                        {
                            list: updatedList,
                            total: leaveRequestsData.total,
                        },
                        false,
                    )
                }

                toast.push(
                    <Notification type="success" title="Success">
                        Leave request approved successfully
                    </Notification>,
                )
            } catch {
                toast.push(
                    <Notification type="danger" title="Error">
                        Failed to approve leave request
                    </Notification>,
                )
            } finally {
                setActionLoading(null)
            }
        },
        [leaveRequestsData, mutate],
    )

    const handleReject = useCallback(
        async (id: string) => {
            setActionLoading({ id, action: 'reject' })
            await sleep(500)
            try {
                if (leaveRequestsData?.list) {
                    const updatedList = leaveRequestsData.list.map((request) =>
                        request.id === id
                            ? { ...request, status: 'rejected' as const }
                            : request,
                    )

                    mutate(
                        {
                            list: updatedList,
                            total: leaveRequestsData.total,
                        },
                        false,
                    )
                }

                toast.push(
                    <Notification type="success" title="Success">
                        Leave request rejected successfully
                    </Notification>,
                )
            } catch {
                toast.push(
                    <Notification type="danger" title="Error">
                        Failed to reject leave request
                    </Notification>,
                )
            } finally {
                setActionLoading(null)
            }
        },
        [leaveRequestsData, mutate],
    )

    const columns: ColumnDef<LeaveRequest>[] = useMemo(
        () => [
            {
                accessorKey: 'employee',
                header: 'Employee',
                cell: ({ row }) => {
                    const employee = row.original.employee
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar
                                size={25}
                                shape="circle"
                                src={employee.avatar}
                                alt={employee.name}
                            />
                            <div className="text-nowrap">
                                <p className="font-medium heading-text">
                                    {employee.name}
                                </p>
                                <p>{employee.title}</p>
                            </div>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'type',
                header: 'Type',
                cell: ({ row }) => (
                    <Tag className="gap-1 bg-white dark:bg-gray-800">
                        <Badge
                            className={classNames(
                                getEventColors(row.original.type),
                                'h-2.5 w-2.5',
                            )}
                        />
                        {getEventText(row.original.type)}
                    </Tag>
                ),
            },
            {
                accessorKey: 'dates',
                header: 'Dates',
                cell: ({ row }) => {
                    const { startDate, endDate } = row.original
                    const start = dayjs(startDate).format('MMM DD')
                    const end = dayjs(endDate).format('MMM DD')

                    return (
                        <div>
                            <p className="font-medium">{start}</p>
                            {startDate !== endDate && <p>to {end}</p>}
                        </div>
                    )
                },
            },
            {
                accessorKey: 'duration',
                header: 'Duration',
                cell: ({ row }) => (
                    <span className="font-medium">{row.original.duration}</span>
                ),
            },
            {
                accessorKey: 'reason',
                header: 'Reason',
                cell: ({ row }) => (
                    <div className="max-w-xs">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {row.original.reason || 'No reason provided'}
                        </p>
                    </div>
                ),
            },
            {
                id: 'actions',
                header: 'Action',
                cell: ({ row }) => {
                    const isLoading = actionLoading?.id === row.original.id
                    const currentAction = actionLoading?.action

                    return (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleReject(row.original.id)}
                                loading={
                                    isLoading && currentAction === 'reject'
                                }
                                disabled={isLoading}
                                icon={<LiCrossCircle />}
                            >
                                Reject
                            </Button>
                            <Button
                                size="sm"
                                variant="solid"
                                onClick={() => handleApprove(row.original.id)}
                                loading={
                                    isLoading && currentAction === 'approve'
                                }
                                disabled={isLoading}
                                icon={<LiTickCircle />}
                            >
                                Approve
                            </Button>
                        </div>
                    )
                },
            },
        ],
        [actionLoading, handleApprove, handleReject],
    )

    if (requestsError) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">Error loading leave requests</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Loading loading={requestsLoading} type="cover">
                <DataTable
                    columns={columns}
                    data={requestedData}
                    loading={requestsLoading}
                    skeletonAvatarColumns={[0]}
                    customNoDataIcon={
                        <div className="text-center py-8">
                            <LiSearch
                                size={48}
                                className="text-gray-300 dark:text-gray-600 mx-auto mb-3"
                            />
                            <p className="text-gray-500">
                                No pending leave requests
                            </p>
                        </div>
                    }
                />
            </Loading>
        </div>
    )
}

export default RequestedTable
