import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import dayjs from 'dayjs'
import sleep from '@/utils/sleep'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import DataTable from '@/components/shared/DataTable'
import DebouceInput from '@/components/shared/DebouceInput'
import classNames from '@/utils/classNames'
import formatCurrency from '@/utils/formatCurrency'
import { colors } from '@/constants/colors.constant'
import { usePayrollStore } from '../store/payrollStore'
import { apiGetPayrollData } from '@/services/HrmService'
import useResponsive from '@/utils/hooks/useResponsive'
import { LiUser, LiImport, LiAdd, LiTickCircle, LiCrossCircle } from '@/icons'
import { LuEllipsis, LuSearch } from 'react-icons/lu'
import useSWR from 'swr'
import { CSVLink } from 'react-csv'
import type { ColumnDef } from '@tanstack/react-table'
import type { GetPayrollResponse, PayrollRecord, PayrollStatus } from '../types'

type PayrollTableProps = {
    onAddPayroll: () => void
}

const PayrollTable = ({ onAddPayroll }: PayrollTableProps) => {
    const navigate = useNavigate()
    const { selectedMonth } = usePayrollStore()
    const [pagingState, setPagingState] = useState({
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sortKey: '',
        sortOrder: '',
    })

    const setQueryParams = (params: Partial<typeof pagingState>) => {
        setPagingState((prev) => ({ ...prev, ...params }))
    }

    const { larger } = useResponsive()

    const { data, isLoading, mutate } = useSWR(
        ['/api/hrm/payroll', { month: selectedMonth, ...pagingState }],
        ([, params]) => apiGetPayrollData<GetPayrollResponse>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const handleSearch = (query: string) => {
        setQueryParams({ query, pageIndex: 1 })
    }

    const handleSort = (sort: {
        sortKey: string | number
        sortOrder: string
    }) => {
        setQueryParams({
            sortKey: String(sort.sortKey),
            sortOrder: sort.sortOrder,
        })
    }

    const handlePaginationChange = (page: number) => {
        setQueryParams({ pageIndex: page })
    }

    const handlePageSizeChange = (pageSize: number) => {
        setQueryParams({ pageSize, pageIndex: 1 })
    }

    const handleRowAction = useCallback(
        async (action: string, record: PayrollRecord) => {
            try {
                switch (action) {
                    case 'approve':
                        await sleep(500)
                        mutate((currentData) => {
                            if (!currentData) return currentData
                            const updatedRecords = currentData.records.map(
                                (r) =>
                                    r.id === record.id
                                        ? {
                                              ...r,
                                              status: 'paid' as PayrollStatus,
                                              processedAt:
                                                  dayjs().toISOString(),
                                          }
                                        : r,
                            )
                            return {
                                ...currentData,
                                records: updatedRecords,
                            }
                        }, false)
                        break

                    case 'decline':
                        await sleep(500)
                        mutate((currentData) => {
                            if (!currentData) return currentData
                            const updatedRecords = currentData.records.map(
                                (r) =>
                                    r.id === record.id
                                        ? {
                                              ...r,
                                              status: 'failed' as PayrollStatus,
                                          }
                                        : r,
                            )
                            return {
                                ...currentData,
                                records: updatedRecords,
                            }
                        }, false)
                        break

                    case 'viewProfile':
                        navigate(`/apps/hrm/employees?id=${record.employee.id}`)
                        break

                    default:
                        console.warn(`Unknown action: ${action}`)
                }
            } catch (error) {
                console.error('Action failed:', error)
            }
        },
        [mutate, navigate],
    )

    const getStatusBadge = useCallback((status: PayrollStatus) => {
        const statusConfig = {
            paid: {
                className: `${colors.emerald.iconBg} ${colors.emerald.iconText}`,
                label: 'Paid',
            },
            pending: {
                className:
                    `${colors.yellow.iconBg} ${colors.yellow.iconText}` as const,
                label: 'Pending',
            },
            processing: {
                className:
                    `${colors.blue.iconBg} ${colors.blue.iconText}` as const,
                label: 'Processing',
            },
            failed: {
                className:
                    `${colors.red.iconBg} ${colors.red.iconText}` as const,
                label: 'Declined',
            },
        }
        const config = statusConfig[status]
        return (
            <Tag className={classNames(config.className, 'border-0')}>
                {config.label}
            </Tag>
        )
    }, [])

    const getActionDropdown = useCallback(
        (record: PayrollRecord) => {
            const dropdownItems = [
                {
                    key: 'viewProfile',
                    label: 'View Profile',
                    icon: <LiUser />,
                    onClick: () => handleRowAction('viewProfile', record),
                },
                {
                    key: 'approve',
                    label: 'Approve',
                    icon: <LiTickCircle />,
                    onClick: () => handleRowAction('approve', record),
                    disabled: record.status !== 'pending',
                },
                {
                    key: 'decline',
                    label: 'Decline',
                    icon: <LiCrossCircle />,
                    onClick: () => handleRowAction('decline', record),
                    disabled: record.status !== 'pending',
                },
            ]

            return (
                <div className="inline-flex">
                    <Dropdown
                        placement="bottom-end"
                        renderTitle={
                            <Button
                                size="sm"
                                variant="ghost"
                                shape="circle"
                                icon={<LuEllipsis />}
                            />
                        }
                    >
                        {dropdownItems.map((item) => (
                            <Dropdown.Item
                                key={item.key}
                                eventKey={item.key}
                                onClick={
                                    item.disabled ? undefined : item.onClick
                                }
                                disabled={item.disabled}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>
            )
        },
        [handleRowAction],
    )

    const columns: ColumnDef<PayrollRecord>[] = useMemo(
        () => [
            {
                accessorKey: 'employee',
                header: 'Employee',
                cell: ({ row }) => {
                    const employee = row.original.employee
                    return (
                        <div className="flex items-center gap-2">
                            <Avatar
                                size={25}
                                shape="circle"
                                src={employee.avatar}
                                alt={employee.name}
                            >
                                {employee.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </Avatar>
                            <div className="font-medium heading-text text-nowrap">
                                {employee.name}
                            </div>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'department',
                header: 'Department',
                cell: ({ row }) => row.original.employee.department,
            },
            {
                accessorKey: 'basicSalary',
                header: 'Basic Salary',
                cell: ({ row }) => formatCurrency(row.original.basicSalary),
            },
            {
                accessorKey: 'allowances',
                header: 'Allowances',
                cell: ({ row }) => formatCurrency(row.original.allowances),
            },
            {
                accessorKey: 'deductions',
                header: 'Deductions',
                cell: ({ row }) => formatCurrency(row.original.deductions),
            },
            {
                accessorKey: 'netPay',
                header: 'Net Pay',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {formatCurrency(row.original.netPay)}
                    </span>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => getStatusBadge(row.original.status),
            },
            {
                id: 'actions',
                header: 'Action',
                cell: ({ row }) => getActionDropdown(row.original),
            },
        ],
        [getStatusBadge, getActionDropdown],
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                    <DebouceInput
                        className="lg:max-w-[250px]"
                        prefix={<LuSearch className="text-base heading-text" />}
                        placeholder="Search employees..."
                        wait={300}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleSearch(e.target.value)
                        }
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button icon={<LiAdd />} onClick={onAddPayroll}>
                        {larger.sm && 'Add Payroll Record'}
                    </Button>
                    <CSVLink data={data?.records || []} filename="payroll.csv">
                        <Button icon={<LiImport />}>
                            {larger.sm && 'Export'}
                        </Button>
                    </CSVLink>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={data?.records || []}
                loading={isLoading}
                pagingData={{
                    total: data?.total || 0,
                    pageIndex: pagingState.pageIndex,
                    pageSize: pagingState.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onPageSizeChange={handlePageSizeChange}
                onSort={handleSort}
                pageSizes={[10, 20, 50]}
            />
        </div>
    )
}

export default PayrollTable
