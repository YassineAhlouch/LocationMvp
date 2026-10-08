import { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Select from '@/components/ui/Select'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import { LuSearch } from 'react-icons/lu'
import { apiGetExpenses } from '@/services/LocationService'
import {
    MAD,
    expenseStatusTone,
    expenseTypeOptions,
    formatDate,
    tagToneClass,
} from './shared'
import type { Expense, SelectOption } from '@/@types/location'
import type { ColumnDef } from '@tanstack/react-table'

type CarExpensesProps = {
    carId: number
}

const statusOptions: SelectOption<string>[] = [
    { value: '', label: 'All statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
]

const typeOptions: SelectOption<string>[] = [
    { value: '', label: 'All types' },
    ...expenseTypeOptions,
]

const CarExpenses = ({ carId }: CarExpensesProps) => {
    const [rows, setRows] = useState<Expense[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')

    const fetchData = useCallback(() => {
        setLoading(true)
        const params: Record<string, unknown> = {
            car_id: carId,
            page: pageIndex,
            per_page: pageSize,
            sort_by: 'created_at',
            sort_dir: 'desc',
        }
        if (q.trim()) {
            params.q = q.trim()
        }
        if (statusFilter) {
            params.status = statusFilter
        }
        if (typeFilter) {
            params.type = typeFilter
        }
        apiGetExpenses(params)
            .then((res) => {
                setRows(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setRows([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [carId, pageIndex, pageSize, q, statusFilter, typeFilter])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const columns = useMemo<ColumnDef<Expense>[]>(
        () => [
            {
                header: 'Expense',
                accessorKey: 'title',
                cell: (props) => (
                    <div className="flex flex-col">
                        <span className="font-semibold heading-text">
                            {props.row.original.title}
                        </span>
                        {props.row.original.vendor && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {props.row.original.vendor}
                            </span>
                        )}
                    </div>
                ),
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (props) => (
                    <span className="capitalize text-gray-700 dark:text-gray-200">
                        {props.row.original.type.replace('_', ' ')}
                    </span>
                ),
            },
            {
                header: 'Due date',
                accessorKey: 'due_date',
                cell: (props) => (
                    <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(props.row.original.due_date)}
                    </span>
                ),
            },
            {
                header: 'Paid date',
                accessorKey: 'paid_date',
                cell: (props) => (
                    <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(props.row.original.paid_date)}
                    </span>
                ),
            },
            {
                header: 'Status',
                id: 'status',
                cell: (props) => {
                    const status = props.row.original.is_overdue
                        ? 'overdue'
                        : props.row.original.status
                    return (
                        <Tag
                            className={`capitalize ${tagToneClass[expenseStatusTone[status]]}`}
                        >
                            {status}
                        </Tag>
                    )
                },
            },
            {
                header: 'Amount',
                accessorKey: 'amount',
                cell: (props) => (
                    <span className="whitespace-nowrap font-semibold dark:text-gray-100">
                        {MAD(props.row.original.amount)}
                    </span>
                ),
            },
        ],
        [],
    )

    return (
        <Card bodyClass="p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                    <h6>Expenses</h6>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {total} expense{total === 1 ? '' : 's'} booked to this
                        vehicle
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <DebouceInput
                        placeholder="Search title, vendor…"
                        prefix={<LuSearch className="text-lg" />}
                        onChange={(e) => {
                            setQ(e.target.value)
                            setPageIndex(1)
                        }}
                    />
                    <div className="w-40">
                        <Select
                            options={typeOptions}
                            value={
                                typeOptions.find(
                                    (option) => option.value === typeFilter,
                                ) ?? null
                            }
                            onChange={(option) => {
                                setTypeFilter(option?.value ?? '')
                                setPageIndex(1)
                            }}
                        />
                    </div>
                    <div className="w-40">
                        <Select
                            options={statusOptions}
                            value={
                                statusOptions.find(
                                    (option) => option.value === statusFilter,
                                ) ?? null
                            }
                            onChange={(option) => {
                                setStatusFilter(option?.value ?? '')
                                setPageIndex(1)
                            }}
                        />
                    </div>
                </div>
            </div>
            <DataTable<Expense>
                compact
                verticalDivider={{ head: true, body: true }}
                className="border-t border-b border-gray-200 dark:border-gray-700"
                columns={columns}
                data={rows}
                noData={!loading && rows.length === 0}
                loading={loading}
                pagingData={{ total, pageIndex, pageSize }}
                onPaginationChange={(page) => setPageIndex(page)}
                onPageSizeChange={(size) => {
                    setPageSize(size)
                    setPageIndex(1)
                }}
            />
        </Card>
    )
}

export default CarExpenses
