import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import Container from '@/components/shared/Container'
import OverflowTabs from '@/components/shared/OverflowTabs'
import { useForm, Controller } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ColumnDef } from '@tanstack/react-table'
import {
    LuCircleCheck,
    LuClock,
    LuSearch,
    LuTriangleAlert,
    LuWallet,
} from 'react-icons/lu'
import {
    apiGetExpenses,
    apiCreateExpense,
    apiUpdateExpense,
    apiGetCars,
} from '@/services/LocationService'
import type { Expense, ExpensePayload, ExpenseType } from '@/@types/location'
import {
    MAD,
    expenseStatusTone,
    expenseTypeOptions,
    expenseStatusOptions,
    tagToneClass,
    formatDate,
} from './shared'
import type { Translator } from './shared'
import { LiEdit } from '@/icons'
import useTranslation from '@/utils/hooks/useTranslation'

type ExpenseFormValues = {
    car_id?: number
    type?: ExpenseType
    title: string
    description?: string
    amount: string
    vendor?: string
    start_date?: string
    due_date?: string
    paid_date?: string
    status?: 'pending' | 'paid'
}

const expenseSchema = (t: Translator) =>
    z.object({
        car_id: z.number({
            message: t('expenses.validation.carRequired', 'Car is required'),
        }),
        type: z
            .string()
            .min(1, t('expenses.validation.typeRequired', 'Type is required')),
        title: z
            .string()
            .min(1, t('expenses.validation.titleRequired', 'Title is required')),
        amount: z
            .string()
            .min(
                1,
                t('expenses.validation.amountRequired', 'Amount is required'),
            ),
        description: z.string().optional(),
        vendor: z.string().optional(),
        start_date: z.string().optional(),
        due_date: z.string().optional(),
        paid_date: z.string().optional(),
        status: z.string().optional(),
    })

const defaultFormValues = (expense?: Expense | null): ExpenseFormValues => ({
    car_id: expense?.car?.id,
    type: expense?.type,
    title: expense?.title ?? '',
    description: expense?.description ?? '',
    amount: expense?.amount ? String(expense.amount) : '',
    vendor: expense?.vendor ?? '',
    start_date: expense?.start_date?.slice(0, 10) ?? '',
    due_date: expense?.due_date?.slice(0, 10) ?? '',
    paid_date: expense?.paid_date?.slice(0, 10) ?? '',
    status: expense?.status === 'paid' ? 'paid' : 'pending',
})

const buildPayload = (values: ExpenseFormValues): ExpensePayload => ({
    car_id: values.car_id as number,
    type: values.type as ExpenseType,
    title: values.title.trim(),
    description: values.description?.trim() || null,
    amount: Number(values.amount),
    vendor: values.vendor?.trim() || null,
    start_date: values.start_date || null,
    due_date: values.due_date || null,
    paid_date: values.paid_date || null,
    status: values.status ?? 'pending',
})

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

type ExpenseFormDialogProps = {
    open: boolean
    expense: Expense | null
    onClose: () => void
    onSaved: () => void
}

const ExpenseFormDialog = ({
    open,
    expense,
    onClose,
    onSaved,
}: ExpenseFormDialogProps) => {
    const { t } = useTranslation()
    const [cars, setCars] = useState<{ value: number; label: string }[]>([])
    const [submitting, setSubmitting] = useState(false)

    const schema = useMemo(() => expenseSchema(t), [t])
    const typeOptions = useMemo(
        () =>
            expenseTypeOptions.map((option) => ({
                ...option,
                label: t(`expenses.type.${option.value}`, option.label),
            })),
        [t],
    )
    const statusOptions = useMemo(
        () =>
            expenseStatusOptions.map((option) => ({
                ...option,
                label: t(`expenses.status.${option.value}`, option.label),
            })),
        [t],
    )

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(schema) as unknown as Resolver<ExpenseFormValues>,
        defaultValues: defaultFormValues(expense),
    })

    useEffect(() => {
        reset(defaultFormValues(expense))
    }, [expense, open, reset])

    useEffect(() => {
        if (!open) {
            return
        }
        apiGetCars({ per_page: 100 })
            .then((res) =>
                setCars(
                    res.data.map((car) => ({
                        value: car.id,
                        label: `${car.registration_number} · ${car.brand?.name ?? ''} ${
                            car.model?.name ?? ''
                        }`,
                    })),
                ),
            )
            .catch(() => setCars([]))
    }, [open])

    const onSubmit = handleSubmit(async (values) => {
        setSubmitting(true)
        const payload = buildPayload(values)
        try {
            if (expense) {
                await apiUpdateExpense(expense.id, payload)
                toast.push(
                    <Notification
                        type="success"
                        title={t(
                            'expenses.toast.updated',
                            'Expense updated successfully!',
                        )}
                    />,
                )
            } else {
                await apiCreateExpense(payload)
                toast.push(
                    <Notification
                        type="success"
                        title={t(
                            'expenses.toast.created',
                            'Expense added successfully!',
                        )}
                    />,
                )
            }
            onSaved()
            onClose()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title={t('expenses.toast.error', 'Something went wrong')}
                />,
            )
        } finally {
            setSubmitting(false)
        }
    })

    return (
        <Dialog
            isOpen={open}
            onClose={onClose}
            width={680}
            className="max-h-[90vh] overflow-y-auto"
        >
            <h5 className="mb-6 text-base font-bold dark:text-gray-100">
                {expense
                    ? t('expenses.form.editTitle', 'Edit expense')
                    : t('expenses.form.addTitle', 'Add expense')}
            </h5>
            <Form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormItem
                        label={t('expenses.form.car', 'Car')}
                        invalid={Boolean(errors.car_id)}
                        errorMessage={errors.car_id?.message}
                    >
                        <Controller
                            name="car_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder={t(
                                        'expenses.form.placeholderCar',
                                        'Select car',
                                    )}
                                    options={cars}
                                    value={cars.find(
                                        (o) => o.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t('expenses.form.type', 'Type')}
                        invalid={Boolean(errors.type)}
                        errorMessage={errors.type?.message}
                    >
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder={t(
                                        'expenses.form.placeholderType',
                                        'Select type',
                                    )}
                                    options={typeOptions}
                                    value={typeOptions.find(
                                        (o) => o.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t('expenses.form.title', 'Title')}
                        invalid={Boolean(errors.title)}
                        errorMessage={errors.title?.message}
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder={t(
                                        'expenses.form.placeholderTitle',
                                        'e.g. Oil change',
                                    )}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t('expenses.form.amount', 'Amount (MAD)')}
                        invalid={Boolean(errors.amount)}
                        errorMessage={errors.amount?.message}
                    >
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="500"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label={t('expenses.form.vendor', 'Vendor')}>
                        <Controller
                            name="vendor"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder={t(
                                        'expenses.form.placeholderVendor',
                                        'Garage name',
                                    )}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label={t('expenses.form.status', 'Status')}>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={statusOptions}
                                    value={statusOptions.find(
                                        (o) => o.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label={t('expenses.form.startDate', 'Start date')}>
                        <Controller
                            name="start_date"
                            control={control}
                            render={({ field }) => (
                                <Input type="date" {...field} />
                            )}
                        />
                    </FormItem>
                    <FormItem label={t('expenses.form.dueDate', 'Due date')}>
                        <Controller
                            name="due_date"
                            control={control}
                            render={({ field }) => (
                                <Input type="date" {...field} />
                            )}
                        />
                    </FormItem>
                    <FormItem label={t('expenses.form.paidDate', 'Paid date')}>
                        <Controller
                            name="paid_date"
                            control={control}
                            render={({ field }) => (
                                <Input type="date" {...field} />
                            )}
                        />
                    </FormItem>
                </div>
                <FormItem
                    label={t('expenses.form.description', 'Description')}
                    className="mt-4"
                >
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input
                                textArea
                                placeholder={t(
                                    'expenses.form.placeholderDescription',
                                    'Description',
                                )}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="mt-6 flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button type="submit" variant="solid" loading={submitting}>
                        {expense
                            ? t('expenses.form.saveChanges', 'Save changes')
                            : t('expenses.form.addExpense', 'Add expense')}
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

const Expenses = () => {
    const { t } = useTranslation()
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
                        {MAD(props.row.original.amount)}
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
                cell: (props) => (
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
                ),
            },
        ],
        [t],
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
                            <Button
                                variant="solid"
                                onClick={() => {
                                    setEditing(null)
                                    setDialogOpen(true)
                                }}
                            >
                                {t('expenses.addExpense', 'Add expense')}
                            </Button>
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
