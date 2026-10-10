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
import {
    apiCreateCarFinancing,
    apiUpdateCarFinancing,
} from '@/services/LocationService'
import { apiErrorMessage, MAD } from './shared'
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

const numberString = (message: string) =>
    z
        .string()
        .min(1, message)
        .refine((value) => Number.isFinite(Number(value)), {
            message: 'Enter a valid number',
        })

const financingSchema = z.object({
    purchase_date: z.string().min(1, 'Purchase date is required'),
    purchase_price: numberString('Purchase price is required'),
    down_payment: numberString('Down payment is required'),
    financed_amount: z.string().optional(),
    installment_amount: numberString('Installment amount is required'),
    installments_count: numberString('Number of installments is required'),
    first_due_date: z.string().min(1, 'First due date is required'),
    lender: z.string().optional(),
    notes: z.string().optional(),
})

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
    const [submitting, setSubmitting] = useState(false)

    const {
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm<CarFinancingFormValues>({
        resolver: zodResolver(financingSchema) as unknown as Resolver<
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
                        title="Financing updated successfully!"
                    />,
                )
            } else {
                await apiCreateCarFinancing(carId, payload)
                toast.push(
                    <Notification
                        type="success"
                        title="Financing added successfully!"
                    />,
                )
            }
            onSaved()
            onClose()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(error, 'Something went wrong')}
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
                    label="Purchase date"
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
                    label="Purchase price (MAD)"
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
                    label="Down payment (MAD)"
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
                    label="Financed amount (MAD)"
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
                        Leave blank to finance {MAD(derivedFinanced)}
                    </p>
                </FormItem>
                <FormItem
                    label="Installment amount (MAD)"
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
                    label="Number of installments"
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
                    label="First due date"
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
                <FormItem label="Lender">
                    <Controller
                        name="lender"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Bank or lender" {...field} />
                        )}
                    />
                </FormItem>
            </div>

            <FormItem label="Notes" className="mt-4">
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <Input
                            textArea
                            rows={3}
                            placeholder="Optional notes about this financing"
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
                    {financing ? 'Save changes' : 'Add financing'}
                </Button>
            </div>
        </Form>
    )
}

export default CarFinancingDialog
