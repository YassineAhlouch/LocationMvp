import { useEffect, useMemo, useState } from 'react'
import {
    Button,
    Dialog,
    Form,
    FormItem,
    Input,
    Notification,
    Select,
    toast,
} from '@/components/ui'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    apiCreateAgencyPayment,
    apiGetAgencies,
    apiGetCurrencies,
    apiUpdateAgencyPayment,
} from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import type { Resolver } from 'react-hook-form'
import type {
    AgencyPayment,
    AgencyPaymentPayload,
    Currency,
    PlatformAgency,
} from '@/@types/platform'

const schema = z.object({
    agency_id: z.number().min(1, 'Agency is required'),
    amount: z.coerce.number().min(0, 'Amount must be positive'),
    currency_id: z.number().nullable().optional(),
    period: z
        .string()
        .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use a YYYY-MM month')
        .or(z.literal(''))
        .optional(),
    due_date: z.string().min(1, 'Due date is required'),
    reference: z.string().max(80, 'Max 80 characters').optional(),
    notes: z.string().max(1000, 'Max 1000 characters').optional(),
})

type PaymentFormSchema = z.infer<typeof schema>

type PaymentFormDialogProps = {
    isOpen: boolean
    payment: AgencyPayment | null
    onClose: () => void
    onSaved: () => void
}

const emptyValues: PaymentFormSchema = {
    agency_id: 0,
    amount: 0,
    currency_id: null,
    period: '',
    due_date: '',
    reference: '',
    notes: '',
}

/**
 * Issue or edit a subscription invoice for one agency. The amount is what the
 * agency owes the platform; marking it paid (from the list) lifts the lock.
 */
const PaymentFormDialog = ({
    isOpen,
    payment,
    onClose,
    onSaved,
}: PaymentFormDialogProps) => {
    const [agencies, setAgencies] = useState<PlatformAgency[]>([])
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<PaymentFormSchema>({
        // zod coerces amount, so input/output types diverge; the form works
        // with the parsed (output) shape, mirroring the other platform forms.
        resolver: zodResolver(schema) as unknown as Resolver<PaymentFormSchema>,
        defaultValues: emptyValues,
    })

    useEffect(() => {
        if (!isOpen) {
            return
        }

        if (payment) {
            reset({
                agency_id: payment.agency?.id ?? 0,
                amount: payment.amount,
                currency_id: payment.currency?.id ?? null,
                period: payment.period ?? '',
                due_date: payment.due_date ?? '',
                reference: payment.reference ?? '',
                notes: payment.notes ?? '',
            })
        } else {
            reset(emptyValues)
        }
    }, [isOpen, payment, reset])

    useEffect(() => {
        if (isOpen) {
            apiGetAgencies({ per_page: 100, is_active: true })
                .then((response) => setAgencies(response.data))
                .catch(() => setAgencies([]))
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            apiGetCurrencies({ per_page: 100, is_active: true })
                .then((response) => setCurrencies(response.data))
                .catch(() => setCurrencies([]))
        }
    }, [isOpen])

    const agencyOptions = useMemo(
        () =>
            agencies.map((agency) => ({
                value: agency.id,
                label: agency.name,
            })),
        [agencies],
    )

    const currencyOptions = useMemo(
        () =>
            currencies.map((currency) => ({
                value: currency.id,
                label: `${currency.code} — ${currency.name} (${currency.symbol})`,
            })),
        [currencies],
    )

    const onSubmit = async (values: PaymentFormSchema) => {
        setIsSubmitting(true)

        const payload: AgencyPaymentPayload = {
            agency_id: values.agency_id,
            amount: values.amount,
            currency_id: values.currency_id ?? null,
            period: values.period ? values.period : null,
            due_date: values.due_date,
            reference: values.reference ? values.reference : null,
            notes: values.notes ? values.notes : null,
        }

        try {
            if (payment) {
                await apiUpdateAgencyPayment(payment.id, payload)
                toast.push(
                    <Notification type="success" title="Invoice updated" />,
                )
            } else {
                await apiCreateAgencyPayment(payload)
                toast.push(
                    <Notification type="success" title="Invoice created" />,
                )
            }
            onSaved()
            onClose()
        } catch (error) {
            toast.push(
                <Notification type="danger">{apiErrorMessage(error)}</Notification>,
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={560}
            closable={!isSubmitting}
            shouldCloseOnOverlayClick={!isSubmitting}
            shouldCloseOnEsc={!isSubmitting}
        >
            <h5 className="mb-6 heading-text">
                {payment ? 'Edit invoice' : 'New subscription invoice'}
            </h5>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormItem
                    label="Agency"
                    asterisk
                    invalid={Boolean(errors.agency_id)}
                    errorMessage={errors.agency_id?.message}
                >
                    <Controller
                        name="agency_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                isSearchable
                                isDisabled={isSubmitting}
                                placeholder="Select agency"
                                options={agencyOptions}
                                value={
                                    agencyOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    ) ?? null
                                }
                                onChange={(option) => {
                                    const agencyId = option?.value ?? 0
                                    field.onChange(agencyId)
                                    // Default the invoice currency to the
                                    // agency's own currency; still overridable.
                                    const agency = agencies.find(
                                        (item) => item.id === agencyId,
                                    )
                                    if (agency?.currency) {
                                        setValue(
                                            'currency_id',
                                            agency.currency.id,
                                        )
                                    }
                                }}
                            />
                        )}
                    />
                </FormItem>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormItem
                        label="Amount"
                        asterisk
                        invalid={Boolean(errors.amount)}
                        errorMessage={errors.amount?.message}
                    >
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Currency">
                        <Controller
                            name="currency_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isSearchable
                                    isDisabled={isSubmitting}
                                    placeholder="Agency currency"
                                    options={currencyOptions}
                                    value={
                                        currencyOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        ) ?? null
                                    }
                                    onChange={(option) =>
                                        field.onChange(option?.value ?? null)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Period"
                        invalid={Boolean(errors.period)}
                        errorMessage={errors.period?.message}
                    >
                        <Controller
                            name="period"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="month"
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Due date"
                        asterisk
                        invalid={Boolean(errors.due_date)}
                        errorMessage={errors.due_date?.message}
                    >
                        <Controller
                            name="due_date"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="date"
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <FormItem
                    label="Reference"
                    invalid={Boolean(errors.reference)}
                    errorMessage={errors.reference?.message}
                >
                    <Controller
                        name="reference"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="e.g. INV-2026-10"
                                disabled={isSubmitting}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Notes"
                    invalid={Boolean(errors.notes)}
                    errorMessage={errors.notes?.message}
                >
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                textArea
                                rows={2}
                                disabled={isSubmitting}
                            />
                        )}
                    />
                </FormItem>
                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        loading={isSubmitting}
                    >
                        {payment ? 'Save changes' : 'Create invoice'}
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

export default PaymentFormDialog
