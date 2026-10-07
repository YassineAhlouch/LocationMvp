import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { apiCreateClient, apiUpdateClient } from '@/services/LocationService'
import type {
    Client,
    ClientPayload,
    ClientStatus,
    ClientSource,
} from '@/@types/location'
import { clientStatusOptions, clientSourceOptions } from '../shared'

type ClientFormValues = {
    first_name: string
    last_name: string
    phone: string
    secondary_phone?: string
    email?: string
    cin?: string
    passport_number?: string
    driving_license_number?: string
    driving_license_expiry?: string
    birth_date?: string
    birth_place?: string
    nationality?: string
    address?: string
    city?: string
    country?: string
    notes?: string
    source?: ClientSource
    status?: ClientStatus
    is_active: boolean
}

const clientSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    phone: z.string().min(1, 'Phone is required'),
    is_active: z.boolean(),
    secondary_phone: z.string().optional(),
    email: z.string().optional(),
    cin: z.string().optional(),
    passport_number: z.string().optional(),
    driving_license_number: z.string().optional(),
    driving_license_expiry: z.string().optional(),
    birth_date: z.string().optional(),
    birth_place: z.string().optional(),
    nationality: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    notes: z.string().optional(),
    source: z.string().optional(),
    status: z.string().optional(),
})

const toDateSlice = (value?: string | null) =>
    value ? value.slice(0, 10) : ''

const defaultFormValues = (client?: Client | null): ClientFormValues => ({
    first_name: client?.first_name ?? '',
    last_name: client?.last_name ?? '',
    phone: client?.phone ?? '',
    secondary_phone: client?.secondary_phone ?? '',
    email: client?.email ?? '',
    cin: client?.cin ?? '',
    passport_number: client?.passport_number ?? '',
    driving_license_number: client?.driving_license_number ?? '',
    driving_license_expiry: toDateSlice(client?.driving_license_expiry),
    birth_date: toDateSlice(client?.birth_date),
    birth_place: client?.birth_place ?? '',
    nationality: client?.nationality ?? '',
    address: client?.address ?? '',
    city: client?.city ?? '',
    country: client?.country ?? '',
    notes: client?.notes ?? '',
    source: client?.source ?? undefined,
    status: client?.status ?? 'normal',
    is_active: client?.is_active ?? true,
})

const buildPayload = (values: ClientFormValues): ClientPayload => ({
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim(),
    phone: values.phone.trim(),
    secondary_phone: values.secondary_phone?.trim() || null,
    email: values.email?.trim() || null,
    cin: values.cin?.trim() || null,
    passport_number: values.passport_number?.trim() || null,
    driving_license_number: values.driving_license_number?.trim() || null,
    driving_license_expiry: values.driving_license_expiry || null,
    birth_date: values.birth_date || null,
    birth_place: values.birth_place?.trim() || null,
    nationality: values.nationality?.trim() || null,
    address: values.address?.trim() || null,
    city: values.city?.trim() || null,
    country: values.country?.trim() || null,
    notes: values.notes?.trim() || null,
    source: (values.source as ClientSource) || null,
    status: (values.status as ClientStatus) || 'normal',
    is_active: values.is_active,
})

type ClientFormProps = {
    client: Client | null
    /** Used by dialogs to reset on each open. */
    isOpen?: boolean
    onCancel: () => void
    onSaved: () => void
}

const ClientForm = ({
    client,
    isOpen = true,
    onCancel,
    onSaved,
}: ClientFormProps) => {
    const [submitting, setSubmitting] = useState(false)

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema) as unknown as Resolver<ClientFormValues>,
        defaultValues: defaultFormValues(client),
    })

    useEffect(() => {
        reset(defaultFormValues(client))
    }, [client, isOpen, reset])

    const onSubmit = handleSubmit(async (values) => {
        setSubmitting(true)
        const payload = buildPayload(values)
        try {
            if (client) {
                await apiUpdateClient(client.id, payload)
                toast.push(
                    <Notification
                        type="success"
                        title="Client updated successfully!"
                    />,
                )
            } else {
                await apiCreateClient(payload)
                toast.push(
                    <Notification
                        type="success"
                        title="Client added successfully!"
                    />,
                )
            }
            onSaved()
            onCancel()
        } catch {
            toast.push(
                <Notification type="danger" title="Something went wrong" />,
            )
        } finally {
            setSubmitting(false)
        }
    })

    return (
        <Form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormItem
                    label="First name"
                    invalid={Boolean(errors.first_name)}
                    errorMessage={errors.first_name?.message}
                >
                    <Controller
                        name="first_name"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Youssef" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Last name"
                    invalid={Boolean(errors.last_name)}
                    errorMessage={errors.last_name?.message}
                >
                    <Controller
                        name="last_name"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="El Amrani" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Phone"
                    invalid={Boolean(errors.phone)}
                    errorMessage={errors.phone?.message}
                >
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="+212 6 00 00 00 00"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Secondary phone">
                    <Controller
                        name="secondary_phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="+212 6 00 00 00 00"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Email">
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder="client@email.com"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="CIN">
                    <Controller
                        name="cin"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="AB123456" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Passport number">
                    <Controller
                        name="passport_number"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Passport no." {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Driving license number">
                    <Controller
                        name="driving_license_number"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="License no." {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Driving license expiry">
                    <Controller
                        name="driving_license_expiry"
                        control={control}
                        render={({ field }) => (
                            <Input type="date" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Birth date">
                    <Controller
                        name="birth_date"
                        control={control}
                        render={({ field }) => (
                            <Input type="date" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Birth place">
                    <Controller
                        name="birth_place"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Marrakech" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Nationality">
                    <Controller
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Moroccan" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="City">
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Marrakech" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Country">
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Morocco" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Source">
                    <Controller
                        name="source"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select source"
                                options={clientSourceOptions}
                                value={clientSourceOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Status">
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={clientStatusOptions}
                                value={clientStatusOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
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
            </div>
            <FormItem label="Address" className="mt-4">
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <Input
                            textArea
                            placeholder="Full address"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem label="Notes" className="mt-2">
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <Input
                            textArea
                            placeholder="Additional notes"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="solid" loading={submitting}>
                    {client ? 'Save changes' : 'Add client'}
                </Button>
            </div>
        </Form>
    )
}

export default ClientForm