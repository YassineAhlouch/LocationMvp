import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Select from '@/components/ui/Select'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import Container from '@/components/shared/Container'
import OverflowTabs from '@/components/shared/OverflowTabs'
import { apiGetExpenses } from '@/services/LocationService'
import type { Expense } from '@/@types/location'
import type { ColumnDef } from '@tanstack/react-table'
import {
    LuCircleCheck,
    LuClock,
    LuSearch,
    LuTriangleAlert,
    LuWallet,
} from 'react-icons/lu'
import {
    money,
    expenseStatusTone,
    expenseTypeOptions,
    tagToneClass,
    formatDate,
} from './shared'
import type { Translator } from './shared'
import ExpenseFormDialog from './ExpenseFormDialog'
import { LiEdit } from '@/icons'
import useTranslation from '@/utils/hooks/useTranslation'
import usePermissions from '@/utils/hooks/usePermissions'

const statusTabList = (t: Translator) => [
    {
        label: (
            <span className="flex items-center gap-2">
                <LuWallet className="text-lg" />
                <span>{t('expenses.tabs.all', 'All Expenses')}</span>
            </span>
        ),
        value: '',
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <LuClock className="text-lg" />
                <span>{t('expenses.status.pending', 'Pending')}</span>
            </span>
        ),
        value: 'pending',
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <LuCircleCheck className="text-lg" />
                <span>{t('expenses.status.paid', 'Paid')}</span>
            </span>
        ),
        value: 'paid',
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <LuTriangleAlert className="text-lg" />
                <span>{t('expenses.status.overdue', 'Overdue')}</span>
            </span>
        ),
        value: 'overdue',
    },
]

const Expenses = () => {
    const { t } = useTranslation()
    const { can } = usePermissions()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Expense | null>(null)

    const fetchExpenses = useCallback(() => {
        setLoading(true)
        const params: Record<string, unknown> = {
            page: pageIndex,
            per_page: pageSize,
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
                setExpenses(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setExpenses([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [pageIndex, pageSize, q, statusFilter, typeFilter])

    useEffect(() => {
        fetchExpenses()
    }, [fetchExpenses])

    const tabs = useMemo(() => statusTabList(t), [t])

    const typeFilterOptions = useMemo(
        () => [
            { value: '', label: t('expenses.allTypes', 'All types') },
            ...expenseTypeOptions.map((option) => ({
                ...option,
                label: t(`expenses.type.${option.value}`, option.label),
            })),
        ],
        [t],
    )

    const columns = useMemo<ColumnDef<Expense>[]>(
        () => [
            {
                header: t('expenses.columns.expense', 'Expense'),
                accessorKey: 'title',
                cell: (props) => {
                    const expense = props.row.original
                    return (
                        <div className="flex flex-col">
                            <span className="font-semibold capitalize text-gray-900 dark:text-gray-100">
                                {expense.title}
                            </span>
                            <span className="text-xs text-gray-400">
                                {expense.description ?? '—'}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: t('expenses.columns.car', 'Car'),
                accessorKey: 'car.registration_number',
                cell: (props) => (
                    <span className="text-nowrap text-gray-600 dark:text-gray-300">
                        {props.row.original.car?.registration_number ?? '—'}
                    </span>
                ),
            },
            {
                header: t('expenses.columns.type', 'Type'),
                accessorKey: 'type',
                cell: (props) => (
                    <Tag className="bg-white font-medium shadow dark:bg-gray-800">
                        <span className="capitalize">
                            {t(
                                `expenses.type.${props.row.original.type}`,
                                props.row.original.type,
                            )}
                        </span>
                    </Tag>
                ),
            },
            {
                header: t('expenses.columns.amount', 'Amount'),
                accessorKey: 'amount',
                cell: (props) => (
                    <span className="font-semibold dark:text-gray-100">
                        {money(props.row.original.amount)}
                    </span>
                ),
            },
            {
                header: t('expenses.columns.vendor', 'Vendor'),
                accessorKey: 'vendor',
                cell: (props) => (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {props.row.original.vendor ?? '—'}
                    </span>
                ),
            },
            {
                header: t('expenses.columns.due', 'Due'),
                accessorKey: 'due_date',
                cell: (props) => (
                    <span className="text-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(props.row.original.due_date)}
                    </span>
                ),
            },
            {
                header: t('expenses.columns.status', 'Status'),
                accessorKey: 'status',
                cell: (props) => {
                    const expense = props.row.original
                    const status = expense.is_overdue
                        ? 'overdue'
                        : expense.status
                    return (
                        <Tag
                            className={`capitalize ${tagToneClass[expenseStatusTone[status]]}`}
                        >
                            {t(`expenses.status.${status}`, status)}
                        </Tag>
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: (props) =>
                    can('expenses.update') ? (
                        <div className="flex items-center justify-center gap-1">
                            <Button
                                size="sm"
                                variant="link"
                                className="px-2 hover:text-gray-900 dark:hover:text-gray-100"
                                role="button"
                                title={t('expenses.actions.edit', 'Edit')}
                                onClick={() => {
                                    setEditing(props.row.original)
                                    setDialogOpen(true)
                                }}
                            >
                                <LiEdit className="text-base" />
                            </Button>
                        </div>
                    ) : null,
            },
        ],
        [can, t],
    )

    return (
        <div>
            <Container className="">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h4>{t('expenses.title', 'Expenses')}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('expenses.count', '{{n}} expenses', {
                                        n: total,
                                    })}
                                </p>
                            </div>
                            {can('expenses.create') && (
                                <Button
                                    variant="solid"
                                    onClick={() => {
                                        setEditing(null)
                                        setDialogOpen(true)
                                    }}
                                >
                                    {t('expenses.addExpense', 'Add expense')}
                                </Button>
                            )}
                        </div>
                    </div>

                    <OverflowTabs
                        tabList={tabs}
                        value={statusFilter}
                        onChange={(value) => {
                            setStatusFilter(value)
                            setPageIndex(1)
                        }}
                        tabListClass="dark:border-gray-800"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <DebouceInput
                                placeholder={t(
                                    'expenses.search',
                                    'Search expenses…',
                                )}
                                prefix={<LuSearch className="text-lg" />}
                                onChange={(e) => {
                                    setQ(e.target.value)
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                        <div className="w-48">
                            <Select
                                options={typeFilterOptions}
                                value={
                                    typeFilterOptions.find(
                                        (o) => o.value === typeFilter,
                                    ) ?? null
                                }
                                onChange={(option) => {
                                    setTypeFilter(option?.value ?? '')
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <DataTable<Expense>
                            compact
                            verticalDivider={{
                                head: true,
                                body: true,
                            }}
                            className="border-t border-b border-gray-200 dark:border-gray-700"
                            columns={columns}
                            data={expenses}
                            noData={!loading && expenses.length === 0}
                            loading={loading}
                            pagingData={{
                                total,
                                pageIndex,
                                pageSize,
                            }}
                            onPaginationChange={(page) => setPageIndex(page)}
                            onPageSizeChange={(size) => {
                                setPageSize(size)
                                setPageIndex(1)
                            }}
                        />
                    </div>
                </div>
            </Container>

            <ExpenseFormDialog
                open={dialogOpen}
                expense={editing}
                onClose={() => setDialogOpen(false)}
                onSaved={fetchExpenses}
            />
        </div>
    )
}

export default Expenses
