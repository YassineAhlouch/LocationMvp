import { useEffect, useMemo, useState } from 'react'
import {
    Button,
    Dialog,
    Form,
    FormItem,
    Input,
    Select,
    Switcher,
    toast,
} from '@/components/ui'
import { Controller, useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    apiCreateAgency,
    apiGetCurrencies,
    apiGetInvoiceTemplates,
    apiGetRoles,
    apiUpdateAgency,
} from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import type {
    AgencyPayload,
    Currency,
    InvoiceTemplate,
    PlatformAgency,
    PlatformRole,
} from '@/@types/platform'

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email').or(z.literal('')).optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    address: z.string().optional(),
    ice: z.string().optional(),
    rc: z.string().optional(),
    daily_mileage_allowance: z.coerce.number().min(0, 'Must be positive'),
    extra_mileage_fee_per_km: z.coerce.number().min(0, 'Must be positive'),
    currency_id: z.number().nullable().optional(),
    invoice_template_id: z.number().nullable().optional(),
    is_active: z.boolean(),
    admin: z
        .object({
            first_name: z.string().optional(),
            last_name: z.string().optional(),
            email: z.string().optional(),
            phone: z.string().optional(),
            password: z.string().optional(),
            role_id: z.number().nullable().optional(),
        })
        .optional(),
})

type AgencyFormSchema = z.infer<typeof schema>

type AgencyFormDialogProps = {
    isOpen: boolean
    agency: PlatformAgency | null
    onClose: () => void
    onSaved: () => void
}

const emptyValues: AgencyFormSchema = {
    name: '',
    email: '',
    phone: '',
    city: '',
    country: 'Morocco',
    address: '',
    ice: '',
    rc: '',
    daily_mileage_allowance: 250,
    extra_mileage_fee_per_km: 1,
    currency_id: null,
    invoice_template_id: null,
    is_active: true,
    admin: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        role_id: null,
    },
}

const AgencyFormDialog = ({
    isOpen,
    agency,
    onClose,
    onSaved,
}: AgencyFormDialogProps) => {
    const isCreate = !agency
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [roles, setRoles] = useState<PlatformRole[]>([])
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [templates, setTemplates] = useState<InvoiceTemplate[]>([])

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AgencyFormSchema>({
        // Numbers are coerced by zod, so the schema's input and output types
        // differ; the form works with the parsed (output) shape.
        resolver: zodResolver(schema) as unknown as Resolver<AgencyFormSchema>,
        defaultValues: emptyValues,
    })

    useEffect(() => {
        if (!isOpen) {
            return
        }

        if (agency) {
            reset({
                name: agency.name,
                email: agency.email ?? '',
                phone: agency.phone ?? '',
                city: agency.city ?? '',
                country: agency.country ?? 'Morocco',
                address: agency.address ?? '',
                ice: agency.ice ?? '',
                rc: agency.rc ?? '',
                daily_mileage_allowance: agency.daily_mileage_allowance,
                extra_mileage_fee_per_km: agency.extra_mileage_fee_per_km,
                currency_id: agency.currency?.id ?? null,
                invoice_template_id: agency.invoice_template?.id ?? null,
                is_active: agency.is_active,
            })
        } else {
            reset(emptyValues)
        }
    }, [isOpen, agency, reset])

    useEffect(() => {
        if (isOpen && isCreate) {
            apiGetRoles()
                .then((response) => setRoles(response))
                .catch(() => setRoles([]))
        }
    }, [isOpen, isCreate])

    useEffect(() => {
        if (isOpen) {
            apiGetCurrencies({ per_page: 100, is_active: true })
                .then((response) => setCurrencies(response.data))
                .catch(() => setCurrencies([]))
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            apiGetInvoiceTemplates()
                .then(setTemplates)
                .catch(() => setTemplates([]))
        }
    }, [isOpen])

    const roleOptions = useMemo(
        () =>
            roles
                .filter((role) => role.is_active)
                .map((role) => ({ value: role.id, label: role.name })),
        [roles],
    )

    const currencyOptions = useMemo(
        () =>
            currencies.map((currency) => ({
                value: currency.id,
                label: `${currency.code} — ${currency.name} (${currency.symbol})`,
            })),
        [currencies],
    )

    const templateOptions = useMemo(
        () =>
            templates
                .filter((template) => template.is_active)
                .map((template) => ({
                    value: template.id,
                    label: template.name,
                })),
        [templates],
    )

    const onSubmit = async (values: AgencyFormSchema) => {
        setIsSubmitting(true)

        const payload: AgencyPayload = {
            name: values.name,
            email: values.email || null,
            phone: values.phone || null,
            city: values.city || null,
            country: values.country || null,
            address: values.address || null,
            ice: values.ice || null,
            rc: values.rc || null,
            daily_mileage_allowance: values.daily_mileage_allowance,
            extra_mileage_fee_per_km: values.extra_mileage_fee_per_km,
            currency_id: values.currency_id ?? null,
            invoice_template_id: values.invoice_template_id ?? null,
            is_active: values.is_active,
        }

        const admin = values.admin
        if (isCreate && admin?.first_name && admin.email && admin.password) {
            payload.admin = {
                first_name: admin.first_name,
                last_name: admin.last_name || '',
                email: admin.email,
                password: admin.password,
                phone: admin.phone || null,
                role_id: admin.role_id ?? undefined,
            }
        }

        try {
            if (agency) {
                await apiUpdateAgency(agency.id, payload)
                toast.push(
                    <div className="text-emerald-600 font-medium">
                        Agency updated
                    </div>,
                )
            } else {
                await apiCreateAgency(payload)
                toast.push(
                    <div className="text-emerald-600 font-medium">
                        Agency created
                    </div>,
                )
            }
            onSaved()
            onClose()
        } catch (error) {
            toast.push(
                <div className="text-red-600 font-medium">
                    {apiErrorMessage(error)}
                </div>,
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={720}
            closable={!isSubmitting}
            shouldCloseOnOverlayClick={!isSubmitting}
            shouldCloseOnEsc={!isSubmitting}
        >
            <div className="max-h-[80vh] overflow-y-auto pr-1">
                <h5 className="mb-6 heading-text">
                    {isCreate ? 'Create agency' : `Edit ${agency?.name}`}
                </h5>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormItem
                            label="Name"
                            asterisk
                            invalid={Boolean(errors.name)}
                            errorMessage={errors.name?.message}
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Agency name"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Email"
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="contact@agency.ma"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Phone">
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="+212 ..."
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="City">
                            <Controller
                                name="city"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Casablanca"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Country">
                            <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="ICE">
                            <Controller
                                name="ice"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Legal identifier"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="RC">
                            <Controller
                                name="rc"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Registre de commerce"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Daily mileage allowance (km)">
                            <Controller
                                name="daily_mileage_allowance"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        disabled={isSubmitting}
                                        invalid={Boolean(
                                            errors.daily_mileage_allowance,
                                        )}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Extra mileage fee / km">
                            <Controller
                                name="extra_mileage_fee_per_km"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        disabled={isSubmitting}
                                        invalid={Boolean(
                                            errors.extra_mileage_fee_per_km,
                                        )}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Currency"
                            extra="The unit this agency prices and invoices in."
                        >
                            <Controller
                                name="currency_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isSearchable
                                        isDisabled={isSubmitting}
                                        placeholder="Select currency"
                                        options={currencyOptions}
                                        value={
                                            currencyOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) ?? null
                                        }
                                        onChange={(option) =>
                                            field.onChange(
                                                option?.value ?? null,
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Invoice template"
                            extra="Contract layout used for this agency's invoices."
                        >
                            <Controller
                                name="invoice_template_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isSearchable
                                        isDisabled={isSubmitting}
                                        placeholder="Select template"
                                        options={templateOptions}
                                        value={
                                            templateOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) ?? null
                                        }
                                        onChange={(option) =>
                                            field.onChange(
                                                option?.value ?? null,
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <FormItem label="Address">
                        <Controller
                            name="address"
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
                    <FormItem label="Active">
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field }) => (
                                <Switcher
                                    checked={field.value}
                                    onChange={(checked) =>
                                        field.onChange(checked)
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    {isCreate && (
                        <div className="mt-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                            <h6 className="mb-1 heading-text">
                                First administrator
                            </h6>
                            <p className="mb-4 text-sm">
                                Optional — create the agency&apos;s first staff
                                account so it is ready to use immediately.
                            </p>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormItem label="First name">
                                    <Controller
                                        name="admin.first_name"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Last name">
                                    <Controller
                                        name="admin.last_name"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Email">
                                    <Controller
                                        name="admin.email"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Password">
                                    <Controller
                                        name="admin.password"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="text"
                                                autoComplete="new-password"
                                                disabled={isSubmitting}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Role">
                                    <Controller
                                        name="admin.role_id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                isSearchable
                                                isDisabled={isSubmitting}
                                                placeholder="Default: admin"
                                                options={roleOptions}
                                                value={
                                                    roleOptions.find(
                                                        (option) =>
                                                            option.value ===
                                                            field.value,
                                                    ) ?? null
                                                }
                                                onChange={(option) =>
                                                    field.onChange(
                                                        option?.value ?? null,
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                        </div>
                    )}

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
                            {isCreate ? 'Create agency' : 'Save changes'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default AgencyFormDialog
