import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import Loading from '@/components/shared/Loading'
import { apiGetLeaveRequests } from '@/services/HrmService'
import { getEventColors, getEventText } from '../utils'
import useSWR from 'swr'
import type { ColumnDef } from '@tanstack/react-table'
import type { LeaveRequest } from '../types'
import classNames from '@/utils/classNames'

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

const LeavesTable = () => {
    const tableQueries: TableQueries = useMemo(
        () => ({
            pageIndex: 1,
            pageSize: 100,
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
    } = useSWR<GetLeaveRequestsResponse>(
        ['hrm-leave-requests-all', tableQueries],
        () =>
            apiGetLeaveRequests<GetLeaveRequestsResponse, TableQueries>(
                tableQueries,
            ),
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // 1 minute
        },
    )

    const leavesData = useMemo(() => {
        if (!leaveRequestsData?.list) return []
        return leaveRequestsData.list.filter(
            (request) =>
                request.status === 'approved' || request.status === 'rejected',
        )
    }, [leaveRequestsData])

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
                    const start = new Date(startDate).toLocaleDateString(
                        'en-US',
                        {
                            month: 'short',
                            day: 'numeric',
                        },
                    )
                    const end = new Date(endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    })

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
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status =
                        row.original.status === 'approved'
                            ? {
                                  badgeColor: 'bg-success',
                                  textColor: 'text-success',
                                  text: 'Approved',
                              }
                            : {
                                  badgeColor: 'bg-error',
                                  textColor: 'text-error',
                                  text: 'Rejected',
                              }

                    return (
                        <span
                            className={classNames(
                                'flex items-center gap-1',
                                status.textColor,
                            )}
                        >
                            <Badge
                                className={classNames(
                                    status.badgeColor,
                                    'h-2.5 w-2.5',
                                )}
                            />
                            <span className="font-medium">{status.text}</span>
                        </span>
                    )
                },
            },
        ],
        [],
    )

    if (requestsError) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">Error loading leave data</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Loading loading={requestsLoading} type="cover">
                <DataTable
                    columns={columns}
                    data={leavesData}
                    loading={requestsLoading}
                    skeletonAvatarColumns={[0]}
                    customNoDataIcon={
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                No approved or rejected leaves found
                            </p>
                        </div>
                    }
                />
            </Loading>
        </div>
    )
}

export default LeavesTable
