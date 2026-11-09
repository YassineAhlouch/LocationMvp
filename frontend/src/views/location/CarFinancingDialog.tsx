import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useTranslation from '@/utils/hooks/useTranslation'
import {
    apiCreateCarFinancing,
    apiUpdateCarFinancing,
} from '@/services/LocationService'
import { apiErrorMessage, money, currencyCode } from './shared'
import type { CarFinancing, CarFinancingPayload } from '@/@types/location'

type CarFinancingDialogProps = {
    carId: number
    financing: CarFinancing | null
    isOpen: boolean
    onClose: () => void
    onSaved: () => void
}

type CarFinancingFormValues = {
    purchase_date: string
    purchase_price: string
    down_payment: string
    financed_amount?: string
    installment_amount: string
    installments_count: string
    first_due_date: string
    lender?: string
    notes?: string
}

/** Number-field validation; messages are supplied by the caller (localized). */
const numberString = (
    requiredMessage: string,
    invalidMessage: string,
) =>
    z
        .string()
        .min(1, requiredMessage)
        .refine((value) => Number.isFinite(Number(value)), {
            message: invalidMessage,
        })

/** Builders that resolve at render time so labels follow the active locale. */
const makeFinancingSchema = (
    t: (key: string, fallback?: string, options?: Record<string, unknown>) => string,
) => {
    const required = (key: string, fallbackText: string) =>
        `${t(key, fallbackText)} ${t('cars.overview.financing.isRequired', 'is required')}`
    const invalidNumber = t('cars.overview.financing.invalidNumber', 'Enter a valid number')

    return z.object({
        purchase_date: z
            .string()
            .min(
                1,
                required('activity.field.purchase_date', 'Purchase date'),
            ),
        purchase_price: numberString(
            required('activity.field.purchase_price', 'Purchase price'),
            invalidNumber,
        ),
        down_payment: numberString(
            required('activity.field.down_payment', 'Down payment'),
            invalidNumber,
        ),
        financed_amount: z.string().optional(),
        installment_amount: numberString(
            required('activity.field.installment_amount', 'Installment amount'),
            invalidNumber,
        ),
        installments_count: numberString(
            required(
                'cars.overview.financing.installmentsCountLabel',
                'Number of installments',
            ),
            invalidNumber,
        ),
        first_due_date: z
            .string()
            .min(
                1,
                required('activity.field.first_due_date', 'First due date'),
            ),
        lender: z.string().optional(),
        notes: z.string().optional(),
    })
}

const toDateInput = (value?: string | null) => (value ? value.slice(0, 10) : '')

const defaultFormValues = (
    financing: CarFinancing | null,
): CarFinancingFormValues => ({
    purchase_date: toDateInput(financing?.purchase_date),
    purchase_price: financing ? String(financing.purchase_price) : '',
    down_payment: financing ? String(financing.down_payment) : '',
    financed_amount: '',
    installment_amount: financing ? String(financing.installment_amount) : '',
    installments_count: financing ? String(financing.installments_count) : '',
    first_due_date: toDateInput(financing?.first_due_date),
    lender: financing?.lender ?? '',
    notes: financing?.notes ?? '',
})

const buildPayload = (
    values: CarFinancingFormValues,
): CarFinancingPayload => {
    const financed = values.financed_amount?.trim()
    return {
        purchase_date: values.purchase_date,
        purchase_price: Number(values.purchase_price),
        down_payment: Number(values.down_payment),
        financed_amount: financed ? Number(financed) : undefined,
        installment_amount: Number(values.installment_amount),
        installments_count: Number(values.installments_count),
        first_due_date: values.first_due_date,
        lender: values.lender?.trim() || null,
        notes: values.notes?.trim() || null,
    }
}

const CarFinancingDialog = ({
    carId,
    financing,
    isOpen,
    onClose,
    onSaved,
}: CarFinancingDialogProps) => {
    const { t } = useTranslation()
    const [submitting, setSubmitting] = useState(false)

    const {
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm<CarFinancingFormValues>({
        resolver: zodResolver(
            makeFinancingSchema(t),
        ) as unknown as Resolver<
            CarFinancingFormValues
        >,
        defaultValues: defaultFormValues(financing),
    })

    useEffect(() => {
        if (isOpen) {
            reset(defaultFormValues(financing))
        }
    }, [financing, isOpen, reset])

    const purchasePrice = Number(watch('purchase_price') || 0)
    const downPayment = Number(watch('down_payment') || 0)
    const derivedFinanced = Math.max(0, purchasePrice - downPayment)

    const onSubmit = handleSubmit(async (values) => {
        setSubmitting(true)
        const payload = buildPayload(values)
        try {
            if (financing) {
                await apiUpdateCarFinancing(carId, payload)
                toast.push(
                    <Notification
                        type="success"
                        title={t(
                            'cars.overview.statistics.financingUpdated',
                            'Financing updated successfully!',
                        )}
                    />,
                )
            } else {
                await apiCreateCarFinancing(carId, payload)
                toast.push(
                    <Notification
                        type="success"
                        title={t(
                            'cars.overview.statistics.financingAdded',
                            'Financing added successfully!',
                        )}
                    />,
                )
            }
            onSaved()
            onClose()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(
                        error,
                        t(
                            'cars.overview.statistics.genericError',
                            'Something went wrong',
                        ),
                    )}
                />,
            )
        } finally {
            setSubmitting(false)
        }
    })

    return (
        <Form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormItem
                    label={`${t('activity.field.purchase_date', 'Purchase date')}`}
                    invalid={Boolean(errors.purchase_date)}
                    errorMessage={errors.purchase_date?.message}
                >
                    <Controller
                        name="purchase_date"
                        control={control}
                        render={({ field }) => (
                            <Input type="date" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={`${t('activity.field.purchase_price', 'Purchase price')} (${currencyCode()})`}
                    invalid={Boolean(errors.purchase_price)}
                    errorMessage={errors.purchase_price?.message}
                >
                    <Controller
                        name="purchase_price"
                        control={control}
                        render={({ field }) => (
                            <Input type="number" step="0.01" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={`${t('activity.field.down_payment', 'Down payment')} (${currencyCode()})`}
                    invalid={Boolean(errors.down_payment)}
                    errorMessage={errors.down_payment?.message}
                >
                    <Controller
                        name="down_payment"
                        control={control}
                        render={({ field }) => (
                            <Input type="number" step="0.01" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={`${t('activity.field.financed_amount', 'Financed amount')} (${currencyCode()})`}
                    invalid={Boolean(errors.financed_amount)}
                    errorMessage={errors.financed_amount?.message}
                >
                    <Controller
                        name="financed_amount"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                step="0.01"
                                placeholder={String(derivedFinanced)}
                                {...field}
                            />
                        )}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {t('cars.overview.financing.leaveBlank', 'Leave blank to finance')}{' '}
                        {money(derivedFinanced)}
                    </p>
                </FormItem>
                <FormItem
                    label={`${t('activity.field.installment_amount', 'Installment amount')} (${currencyCode()})`}
                    invalid={Boolean(errors.installment_amount)}
                    errorMessage={errors.installment_amount?.message}
                >
                    <Controller
                        name="installment_amount"
                        control={control}
                        render={({ field }) => (
                            <Input type="number" step="0.01" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t(
                        'cars.overview.financing.installmentsCountLabel',
                        'Number of installments',
                    )}
                    invalid={Boolean(errors.installments_count)}
                    errorMessage={errors.installments_count?.message}
                >
                    <Controller
                        name="installments_count"
                        control={control}
                        render={({ field }) => (
                            <Input type="number" step="1" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('activity.field.first_due_date', 'First due date')}
                    invalid={Boolean(errors.first_due_date)}
                    errorMessage={errors.first_due_date?.message}
                >
                    <Controller
                        name="first_due_date"
                        control={control}
                        render={({ field }) => (
                            <Input type="date" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label={t('activity.field.lender', 'Lender')}>
                    <Controller
                        name="lender"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t(
                                    'cars.overview.financing.lenderPlaceholder',
                                    'Bank or lender',
                                )}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <FormItem label={t('activity.field.notes', 'Notes')} className="mt-4">
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <Input
                            textArea
                            rows={3}
                            placeholder={t(
                                'cars.overview.financing.notesPlaceholder',
                                'Optional notes about this financing',
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
                    {financing
                        ? t(
                              'cars.overview.financing.saveChanges',
                              'Save changes',
                          )
                        : t(
                              'cars.overview.statistics.addFinancing',
                              'Add financing',
                          )}
                </Button>
            </div>
        </Form>
    )
}

export default CarFinancingDialog
