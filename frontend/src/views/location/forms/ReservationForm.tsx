import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    apiCreateReservation,
    apiUpdateReservation,
    apiGetCars,
    apiGetClients,
} from '@/services/LocationService'
import type { Reservation, ReservationPayload } from '@/@types/location'

type ReservationFormValues = {
    car_id?: number
    primary_client_id?: number
    pickup_location?: string
    return_location?: string
    pickup_datetime: string
    expected_return_datetime: string
    daily_rate?: string
    discount_amount?: string
    deposit_amount?: string
    remarks?: string
}

const reservationSchema = z.object({
    car_id: z.number({ message: 'Car is required' }),
    primary_client_id: z.number({
        message: 'Primary client is required',
    }),
    pickup_datetime: z.string().min(1, 'Pickup datetime is required'),
    expected_return_datetime: z
        .string()
        .min(1, 'Expected return datetime is required'),
    pickup_location: z.string().optional(),
    return_location: z.string().optional(),
    daily_rate: z.string().optional(),
    discount_amount: z.string().optional(),
    deposit_amount: z.string().optional(),
    remarks: z.string().optional(),
})

const toDateTimeLocal = (value?: string | null) =>
    value ? dayjs(value).format('YYYY-MM-DDTHH:mm') : ''

const buildPayload = (
    values: ReservationFormValues,
): ReservationPayload => {
    const payload: ReservationPayload = {
        car_id: values.car_id as number,
        primary_client_id: values.primary_client_id as number,
        pickup_location: values.pickup_location?.trim() || null,
        return_location: values.return_location?.trim() || null,
        pickup_datetime: values.pickup_datetime.replace('T', ' '),
        expected_return_datetime: values.expected_return_datetime.replace(
            'T',
            ' ',
        ),
        remarks: values.remarks?.trim() || null,
    }
    const rate = values.daily_rate?.trim()
    if (rate) {
        payload.daily_rate = Number(rate)
    }
    const discount = values.discount_amount?.trim()
    if (discount) {
        payload.discount_amount = Number(discount)
    }
    const deposit = values.deposit_amount?.trim()
    if (deposit) {
        payload.deposit_amount = Number(deposit)
    }
    return payload
}

const defaultsFor = (reservation?: Reservation | null): ReservationFormValues => ({
    car_id: reservation?.car?.id,
    primary_client_id: reservation?.primary_client?.id,
    pickup_location: reservation?.pickup_location ?? '',
    return_location: reservation?.return_location ?? '',
    pickup_datetime: toDateTimeLocal(reservation?.pickup_datetime),
    expected_return_datetime: toDateTimeLocal(
        reservation?.expected_return_datetime,
    ),
    daily_rate: reservation?.daily_rate
        ? String(reservation.daily_rate)
        : '',
    discount_amount: reservation?.discount_amount
        ? String(reservation.discount_amount)
        : '',
    deposit_amount: reservation?.deposit_amount
        ? String(reservation.deposit_amount)
        : '',
    remarks: reservation?.remarks ?? '',
})

type ReservationFormProps = {
    reservation: Reservation | null
    /** Used by dialogs to (re)fetch options and reset on each open. */
    isOpen?: boolean
    onCancel: () => void
    onSaved: () => void
}

const ReservationForm = ({
    reservation,
    isOpen = true,
    onCancel,
    onSaved,
}: ReservationFormProps) => {
    const [cars, setCars] = useState<{ value: number; label: string }[]>([])
    const [clients, setClients] = useState<{ value: number; label: string }[]>(
        [],
    )
    const [submitting, setSubmitting] = useState(false)

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ReservationFormValues>({
        resolver: zodResolver(
            reservationSchema,
        ) as unknown as Resolver<ReservationFormValues>,
        defaultValues: defaultsFor(reservation),
    })

    useEffect(() => {
        reset(defaultsFor(reservation))
    }, [reservation, isOpen, reset])

    useEffect(() => {
        if (!isOpen) {
            return
        }
        apiGetCars({ per_page: 100, sort_by: 'registration_number' })
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
        apiGetClients({ per_page: 100 })
            .then((res) =>
                setClients(
                    res.data.map((client) => ({
                        value: client.id,
                        label: `${client.full_name} · ${client.phone}`,
                    })),
                ),
            )
            .catch(() => setClients([]))
    }, [isOpen])

    const onSubmit = handleSubmit(async (values) => {
        setSubmitting(true)
        const payload = buildPayload(values)
        try {
            if (reservation) {
                await apiUpdateReservation(reservation.id, payload)
                toast.push(
                    <Notification
                        type="success"
                        title="Reservation updated successfully!"
                    />,
                )
            } else {
                await apiCreateReservation(payload)
                toast.push(
                    <Notification
                        type="success"
                        title="Reservation created successfully!"
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
                    label="Primary client"
                    invalid={Boolean(errors.primary_client_id)}
                    errorMessage={errors.primary_client_id?.message}
                >
                    <Controller
                        name="primary_client_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select client"
                                options={clients}
                                value={clients.find(
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
                    label="Pickup datetime"
                    invalid={Boolean(errors.pickup_datetime)}
                    errorMessage={errors.pickup_datetime?.message}
                >
                    <Controller
                        name="pickup_datetime"
                        control={control}
                        render={({ field }) => (
                            <Input type="datetime-local" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Expected return datetime"
                    invalid={Boolean(errors.expected_return_datetime)}
                    errorMessage={errors.expected_return_datetime?.message}
                >
                    <Controller
                        name="expected_return_datetime"
                        control={control}
                        render={({ field }) => (
                            <Input type="datetime-local" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Pickup location">
                    <Controller
                        name="pickup_location"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="e.g. Marrakech Menara Airport"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Return location">
                    <Controller
                        name="return_location"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="e.g. 12 Rue Gueliz, Marrakech"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Daily rate (MAD)">
                    <Controller
                        name="daily_rate"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="Leave empty to use car price"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Discount (MAD)">
                    <Controller
                        name="discount_amount"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Deposit (MAD)">
                    <Controller
                        name="deposit_amount"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <FormItem label="Remarks" className="mt-4">
                <Controller
                    name="remarks"
                    control={control}
                    render={({ field }) => (
                        <Input
                            textArea
                            placeholder="Any remarks"
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
                    {reservation ? 'Save changes' : 'Create reservation'}
                </Button>
            </div>
        </Form>
    )
}

export default ReservationForm