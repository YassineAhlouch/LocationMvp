import { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import useSWR from 'swr'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { apiGetPeriodAttendanceData } from '@/services/HrmService'
import { getAttendanceStatusConfig } from '../utils'
import useAttendanceData from '../hooks/useAttendanceData'
import classNames from '@/utils/classNames'
import type { PeriodAttendanceRecord, AttendanceStatus } from '../types'
import type { ColumnDef } from '@tanstack/react-table'
import type { OnSortParam } from '@/components/shared/DataTable'

// Transform period data to work with DataTable
type TransformedAttendanceRow = {
    employee: PeriodAttendanceRecord['employee']
    presentPercentage: number
    attendance: Record<string, AttendanceStatus>
}

const AttendancePeriodView = () => {
    const { selectedDate, pagingState, filterState } = useAttendanceData()
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' })
    const [tableState, setTableState] = useState({
        pageIndex: 1,
        pageSize: 10,
        sortKey: '',
        sortOrder: '',
    })

    useEffect(() => {
        setTableState({
            pageIndex: 1,
            pageSize: 10,
            sortKey: '',
            sortOrder: '',
        })
    }, [])

    useEffect(() => {
        const date = new Date(selectedDate)
        const dayOfWeek = date.getDay()
        const startOfWeek = new Date(date)
        startOfWeek.setDate(date.getDate() - dayOfWeek)

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)

        setDateRange({
            startDate: dayjs(startOfWeek).format('YYYY-MM-DD'),
            endDate: dayjs(endOfWeek).format('YYYY-MM-DD'),
        })
    }, [selectedDate])

    const { data: periodResponse, isLoading } = useSWR(
        dateRange.startDate && dateRange.endDate
            ? [
                  '/api/hrm/attendance/period',
                  {
                      ...dateRange,
                      ...tableState,
                      query: pagingState.query,
                      status: filterState.status,
                  },
              ]
            : null,
        ([, params]) =>
            apiGetPeriodAttendanceData<{
                data: PeriodAttendanceRecord[]
                total: number
            }>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const generateDateHeaders = () => {
        if (!dateRange.startDate) return []

        const dates = []
        const current = new Date(dateRange.startDate)
        const end = new Date(dateRange.endDate)

        while (current <= end) {
            dates.push({
                date: dayjs(current).format('YYYY-MM-DD'),
                day: current.getDate(),
                dayName: current.toLocaleDateString('en-US', {
                    weekday: 'short',
                }),
            })
            current.setDate(current.getDate() + 1)
        }

        return dates
    }

    const dateHeaders = generateDateHeaders()

    const transformedData: TransformedAttendanceRow[] = useMemo(() => {
        return periodResponse?.data || []
    }, [periodResponse?.data])

    const columns: ColumnDef<TransformedAttendanceRow>[] = useMemo(() => {
        const baseColumns: ColumnDef<TransformedAttendanceRow>[] = [
            {
                id: 'employee',
                header: 'Employee',
                size: 200,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Avatar
                            size={24}
                            shape="circle"
                            src={row.original.employee.avatar}
                            alt={row.original.employee.name}
                        >
                            {row.original.employee.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </Avatar>
                        <div>
                            <div className="font-medium heading-text">
                                {row.original.employee.name}
                            </div>
                            <div className="text-xs">
                                {row.original.employee.department}
                            </div>
                        </div>
                    </div>
                ),
            },
        ]

        const dateColumns: ColumnDef<TransformedAttendanceRow>[] =
            dateHeaders.map((header) => ({
                id: header.date,
                header: () => (
                    <div className="text-center">
                        <div className="font-medium">
                            {header.dayName} - {header.day}
                        </div>
                    </div>
                ),
                cell: ({ row }) => {
                    const status =
                        row.original.attendance[header.date] || 'absent'
                    const config = getAttendanceStatusConfig(status)
                    const Icon = config.icon
                    return (
                        <div className="flex justify-center">
                            <Tooltip title={config.label} placement="top">
                                <div
                                    className={classNames(
                                        config.className,
                                        'border-0 rounded-md h-5 w-5 flex items-center justify-center',
                                    )}
                                >
                                    <Icon />
                                </div>
                            </Tooltip>
                        </div>
                    )
                },
            }))

        const rateColumn: ColumnDef<TransformedAttendanceRow> = {
            id: 'rate',
            header: () => <div className="text-center">Rate</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="text-sm font-medium">
                        {row.original.presentPercentage}%
                    </span>
                </div>
            ),
        }

        return [...baseColumns, ...dateColumns, rateColumn]
    }, [dateHeaders])

    const handlePaginationChange = (page: number) => {
        setTableState((prev) => ({ ...prev, pageIndex: page }))
    }

    const handlePageSizeChange = (pageSize: number) => {
        setTableState((prev) => ({ ...prev, pageSize, pageIndex: 1 }))
    }

    const handleSort = (sort: OnSortParam) => {
        setTableState((prev) => ({
            ...prev,
            sortKey: String(sort.sortKey),
            sortOrder: sort.sortOrder,
            pageIndex: 1,
        }))
    }

    return (
        <div className="space-y-4">
            <div>
                <DataTable
                    verticalDivider={{
                        body: true,
                    }}
                    className='border-b border-gray-200 dark:border-gray-800"'
                    columns={columns}
                    data={transformedData}
                    loading={isLoading}
                    noData={!transformedData || transformedData.length === 0}
                    onPaginationChange={handlePaginationChange}
                    onPageSizeChange={handlePageSizeChange}
                    onSort={handleSort}
                    pagingData={{
                        total: periodResponse?.total || 0,
                        pageIndex: tableState.pageIndex,
                        pageSize: tableState.pageSize,
                    }}
                />
            </div>
        </div>
    )
}

export default AttendancePeriodView
