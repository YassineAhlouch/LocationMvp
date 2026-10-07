import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
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
import { useForm, Controller } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ColumnDef } from '@tanstack/react-table'
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

const expenseSchema = z.object({
    car_id: z.number({ message: 'Car is required' }),
    type: z.string().min(1, 'Type is required'),
    title: z.string().min(1, 'Title is required'),
    amount: z.string().min(1, 'Amount is required'),
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
    const [cars, setCars] = useState<{ value: number; label: string }[]>([])
    const [submitting, setSubmitting] = useState(false)

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(
            expenseSchema,
        ) as unknown as Resolver<ExpenseFormValues>,
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
                        title="Expense updated successfully!"
                    />,
                )
            } else {
                await apiCreateExpense(payload)
                toast.push(
                    <Notification
                        type="success"
                        title="Expense added successfully!"
                    />,
                )
            }
            onSaved()
            onClose()
        } catch {
            toast.push(
                <Notification type="danger" title="Something went wrong" />,
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
                {expense ? 'Edit expense' : 'Add expense'}
            </h5>
            <Form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormItem
                        label="Car"
                        invalid={Boolean(errors.car_id)}
                        errorMessage={errors.car_id?.message}
                    >
                        <Controller
                            name="car_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Select car"
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
                        label="Type"
                        invalid={Boolean(errors.type)}
                        errorMessage={errors.type?.message}
                    >
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Select type"
                                    options={expenseTypeOptions}
                                    value={expenseTypeOptions.find(
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
                        label="Title"
                        invalid={Boolean(errors.title)}
                        errorMessage={errors.title?.message}
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="e.g. Oil change"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Amount (MAD)"
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
                    <FormItem label="Vendor">
                        <Controller
                            name="vendor"
                            control={control}
                            render={({ field }) => (
                                <Input placeholder="Garage name" {...field} />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Status">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={expenseStatusOptions}
                                    value={expenseStatusOptions.find(
                                        (o) => o.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Start date">
                        <Controller
                            name="start_date"
                            control={control}
                            render={({ field }) => (
                                <Input type="date" {...field} />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Due date">
                        <Controller
                            name="due_date"
                            control={control}
                            render={({ field }) => (
                                <Input type="date" {...field} />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Paid date">
                        <Controller
                            name="paid_date"
                            control={control}
                            render={({ field }) => (
                                <Input type="date" {...field} />
                            )}
                        />
                    </FormItem>
                </div>
                <FormItem label="Description" className="mt-4">
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input
                                textArea
                                placeholder="Description"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="mt-6 flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="solid" loading={submitting}>
                        {expense ? 'Save changes' : 'Add expense'}
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

const Expenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

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
    }, [pageIndex, pageSize, q, statusFilter])

    useEffect(() => {
        fetchExpenses()
    }, [fetchExpenses])

    const columns = useMemo<ColumnDef<Expense>[]>(
        () => [
            {
                header: 'Expense',
                accessorKey: 'title',
                cell: (props) => {
                    const expense = props.row.original
                    return (
                        <div className="flex flex-col">
                            <span className="font-semibold capitalize dark:text-gray-100">
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
                header: 'Car',
                accessorKey: 'car.registration_number',
                cell: (props) => (
                    <span className="text-sm dark:text-gray-200">
                        {props.row.original.car?.registration_number ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (props) => (
                    <span className="text-sm capitalize text-gray-600 dark:text-gray-300">
                        {props.row.original.type.replace('_', ' ')}
                    </span>
                ),
            },
            {
                header: 'Amount',
                accessorKey: 'amount',
                cell: (props) => (
                    <span className="font-semibold dark:text-gray-100">
                        {MAD(props.row.original.amount)}
                    </span>
                ),
            },
            {
                header: 'Vendor',
                accessorKey: 'vendor',
                cell: (props) => (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {props.row.original.vendor ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Due',
                accessorKey: 'due_date',
                cell: (props) => (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(props.row.original.due_date)}
                    </span>
                ),
            },
            {
                header: 'Status',
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
                            {status}
                        </Tag>
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: (props) => (
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setEditing(props.row.original)
                                setDialogOpen(true)
                            }}
                        >
                            Edit
                        </Button>
                    </div>
                ),
            },
        ],
        [],
    )

    return (
        <Container className="p-4">
            <Card className="rounded-xl">
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-xl font-bold dark:text-gray-100">
                                Expenses
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {total} expenses
                            </p>
                        </div>
                        <Button
                            variant="solid"
                            onClick={() => {
                                setEditing(null)
                                setDialogOpen(true)
                            }}
                        >
                            Add expense
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <DebouceInput
                            className="w-full sm:w-64"
                            placeholder="Search expense…"
                            onChange={(e) => {
                                setQ(e.target.value)
                                setPageIndex(1)
                            }}
                        />
                        <div className="w-full sm:w-48">
                            <Select
                                options={[
                                    { value: '', label: 'All statuses' },
                                    ...expenseStatusOptions,
                                ]}
                                value={
                                    [
                                        { value: '', label: 'All statuses' },
                                        ...expenseStatusOptions,
                                    ].find((o) => o.value === statusFilter) ??
                                    null
                                }
                                onChange={(option) => {
                                    setStatusFilter(option?.value ?? '')
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                    </div>

                    <DataTable<Expense>
                        columns={columns}
                        data={expenses}
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
            </Card>

            <ExpenseFormDialog
                open={dialogOpen}
                expense={editing}
                onClose={() => setDialogOpen(false)}
                onSaved={fetchExpenses}
            />
        </Container>
    )
}

export default Expenses
