import { useEffect, useMemo, useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { apiCreateExpense, apiUpdateExpense, apiGetCars } from '@/services/LocationService'
import type { Expense, ExpensePayload, ExpenseType } from '@/@types/location'
import { currencyCode, expenseStatusOptions, expenseTypeOptions } from './shared'
import type { Translator } from './shared'
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

/** Pre-fills (and locks) the car when the dialog is opened for one car. */
export type DefaultExpenseCar = {
    id: number
    label: string
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

const defaultFormValues = (
    expense?: Expense | null,
    defaultCar?: DefaultExpenseCar | null,
): ExpenseFormValues => ({
    car_id: expense?.car?.id ?? defaultCar?.id,
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
    /** When set, the dialog creates the expense for this car and locks it. */
    defaultCar?: DefaultExpenseCar | null
}

/**
 * The shared create/edit expense dialog — used by the global Expenses page
 * and by a car's dossier expense tab. Recording an insurance or inspection
 * renewal here syncs the car's document dates (see CarDocumentSyncService),
 * which is why the due-date hint matters.
 */
const ExpenseFormDialog = ({
    open,
    expense,
    onClose,
    onSaved,
    defaultCar = null,
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

    const carLocked = Boolean(defaultCar) && !expense

    const {
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(schema) as unknown as Resolver<ExpenseFormValues>,
        defaultValues: defaultFormValues(expense, defaultCar),
    })

    const selectedType = watch('type')

    useEffect(() => {
        reset(defaultFormValues(expense, defaultCar))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expense, open, reset])

    useEffect(() => {
        if (!open) {
            return
        }
        if (carLocked && defaultCar) {
            setCars([{ value: defaultCar.id, label: defaultCar.label }])
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
    }, [open, carLocked, defaultCar])

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
                                    isDisabled={carLocked}
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
                        label={`${t('expenses.form.amount', 'Amount')} (${currencyCode()})`}
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
                        {selectedType === 'insurance' ? (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {t(
                                    'expenses.form.dueDateInsuranceHint',
                                    "For an insurance expense, the due date becomes the car's insurance expiry date.",
                                )}
                            </p>
                        ) : null}
                        {selectedType === 'inspection' ? (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {t(
                                    'expenses.form.dueDateInspectionHint',
                                    "For an inspection expense, the due date becomes the car's next technical inspection date.",
                                )}
                            </p>
                        ) : null}
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

export default ExpenseFormDialog
