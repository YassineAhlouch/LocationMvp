import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import type { FieldErrors, Resolver } from 'react-hook-form'
import { useNavigate } from 'react-router'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import { Form, FormItem } from '@/components/ui/Form'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CustomOption, SingleOption } from '@/components/ui/Select/types'
import Container from '@/components/shared/Container'
import IconFrame from '@/components/shared/IconFrame'
import OverflowTabs from '@/components/shared/OverflowTabs'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { LiAdd, LiBank, LiCalendar, LiCar, LiPrinter } from '@/icons'
import {
    apiCreateReservation,
    apiUpdateReservation,
    apiGetCars,
    apiGetClients,
    apiGetPayments,
    apiCreatePayment,
    apiQuoteReservation,
} from '@/services/LocationService'
import type {
    Client,
    Payment,
    PaymentMethod,
    PaymentRecordStatus,
    PaymentStatus,
    PricingQuote,
    Reservation,
    ReservationPayload,
    ReservationStatus,
} from '@/@types/location'
import ClientForm from './ClientForm'
import {
    MAD,
    formatDateTime,
    apiErrorMessage,
    reservationStatusTone,
    paymentStatusTone,
    tagToneClass,
} from '../shared'
import type { TagTone } from '../shared'

type ExtraRow = {
    name: string
    description?: string
    pricing_type: 'fixed' | 'daily'
    quantity: string
    unit_price: string
}

type PaymentRow = {
    payment_date: string
    amount: string
    method: PaymentMethod
    status: PaymentRecordStatus
    reference?: string
}

type AddPaymentValues = {
    payment_date: string
    amount: string
    method?: PaymentMethod
    status: PaymentRecordStatus
    reference?: string
    notes?: string
}

type ReservationFormValues = {
    car_id?: number
    primary_client_id?: number
    secondary_client_id?: number
    pickup_location?: string
    return_location?: string
    pickup_datetime: string
    expected_return_datetime: string
    daily_rate?: string
    discount_amount?: string
    deposit_amount?: string
    /** Lifecycle status; create shows startup choices only, edit allows moves. */
    status?: ReservationStatus
    /** Reason captured when moving to cancelled from the edit form. */
    status_reason?: string
    extras: ExtraRow[]
    /** Optional initial payments — several instalments allowed. */
    payments: PaymentRow[]
    remarks?: string
}

/**
 * The full reservation status flow, shown in the create-form dropdown so the
 * team sees how a reservation moves. Only the startup statuses are
 * selectable at creation; the rest are disabled guide entries reached from
 * the reservation list (lifecycle actions).
 */
type StatusFlowOption = { hint?: string }

const startupStatusOptions: SingleOption<StatusFlowOption>[] = [
    { value: 'pending', label: 'Pending', hint: 'Created' },
    { value: 'confirmed', label: 'Confirmed', hint: 'Talked to client' },
    { value: 'reserved', label: 'Reserved', hint: 'Phone hold' },
    {
        value: 'active',
        label: 'Active',
        hint: 'Client signed the contract',
        disabled: true,
    },
    {
        value: 'completed',
        label: 'Completed',
        hint: 'Car returned',
        disabled: true,
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
        hint: 'Trip cancelled',
        disabled: true,
    },
    {
        value: 'extended',
        label: 'Extended',
        hint: 'More days added — status stays',
        disabled: true,
    },
]

/**
 * Edit-mode status choices: the current status plus every legal next step in
 * the state machine. Targets the backend would reject — and No show, which is
 * always driven from the list with a mandatory reason — stay disabled.
 */
const editStatusTargets: Record<ReservationStatus, ReservationStatus[]> = {
    pending: ['confirmed', 'reserved', 'cancelled'],
    confirmed: ['active', 'cancelled'],
    reserved: ['confirmed', 'active', 'cancelled'],
    active: ['completed'],
    completed: [],
    cancelled: [],
    no_show: [],
}

const editStatusLabels: Record<ReservationStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    reserved: 'Reserved',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No show',
}

const editStatusHints: Record<ReservationStatus, string> = {
    pending: 'Created',
    confirmed: 'Talked to client',
    reserved: 'Phone hold',
    active: 'Contract signed',
    completed: 'Car returned',
    cancelled: 'Trip cancelled',
    no_show: 'Client never showed',
}

const editStatusFlowOptions = (
    current: ReservationStatus,
): SingleOption<StatusFlowOption>[] => {
    const targets = editStatusTargets[current] ?? []
    const order: ReservationStatus[] = [
        'pending',
        'confirmed',
        'reserved',
        'active',
        'completed',
        'cancelled',
    ]

    return order.map((value) => ({
        value,
        label: editStatusLabels[value],
        hint: value === current ? 'Current status' : editStatusHints[value],
        disabled: value !== current && !targets.includes(value),
    }))
}

/**
 * Sectioned layout (mirrors apps/sales ProductDetails): a tabbed header
 * switches between Basic info / Trip / Pricing / Payment sections.
 */
const reservationFormSectionList: {
    label: string
    value: string
    fields: (keyof ReservationFormValues)[]
}[] = [
    {
        label: 'Basic info',
        value: 'basicInfo',
        fields: [
            'car_id',
            'primary_client_id',
            'secondary_client_id',
            'status',
        ],
    },
    {
        label: 'Trip',
        value: 'trip',
        fields: ['pickup_datetime', 'expected_return_datetime'],
    },
    {
        label: 'Pricing',
        value: 'pricing',
        fields: [
            'daily_rate',
            'discount_amount',
            'deposit_amount',
            'extras',
        ],
    },
    { label: 'Payment', value: 'payment', fields: ['payments'] },
]

const SectionContainer = ({
    show,
    children,
}: {
    show: boolean
    children: ReactNode
}) => {
    return <div className={show ? '' : 'hidden'}>{children}</div>
}

type FormSectionCardProps = {
    title: string
    description?: string
    children: ReactNode
}

const FormSectionCard = ({
    title,
    description,
    children,
}: FormSectionCardProps) => {
    return (
        <div className="border-gray-200 px-2 dark:border-gray-700">
            <div className="mb-6 flex items-center justify-between gap-2">
                <div>
                    <h5 className="dark:text-gray-100">{title}</h5>
                    {description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {children}
        </div>
    )
}

const paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'transfer', label: 'Transfer' },
] as const

const paymentRecordStatusOptions = [
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
] as const

const extrasPricingTypeOptions = [
    { value: 'fixed', label: 'Fixed' },
    { value: 'daily', label: 'Daily' },
] as const

const reservationSchema = z
    .object({
        car_id: z.number({ message: 'Car is required' }),
        primary_client_id: z.number({
            message: 'Primary client is required',
        }),
        secondary_client_id: z.number().optional(),
        pickup_datetime: z.string().min(1, 'Pickup datetime is required'),
        expected_return_datetime: z
            .string()
            .min(1, 'Expected return datetime is required'),
        pickup_location: z.string().optional(),
        return_location: z.string().optional(),
        daily_rate: z.string().optional(),
        discount_amount: z.string().optional(),
        deposit_amount: z.string().optional(),
        status: z.enum(['pending', 'confirmed', 'reserved']).optional(),
        extras: z
            .array(
                z.object({
                    name: z.string().min(1, 'Name is required'),
                    description: z.string().optional(),
                    pricing_type: z.enum(['fixed', 'daily']),
                    quantity: z
                        .string()
                        .regex(/^\d+$/, 'Quantity is required')
                        .refine((value) => Number(value) >= 1, 'At least 1'),
                    unit_price: z
                        .string()
                        .regex(/^\d+(\.\d+)?$/, 'Unit price is required')
                        .refine((value) => Number(value) >= 0, 'Not negative'),
                }),
            )
            .optional(),
        payments: z
            .array(
                z.object({
                    payment_date: z.string().optional(),
                    amount: z
                        .string()
                        .regex(/^\d+(\.\d+)?$/, 'Amount is required')
                        .refine(
                            (value) => Number(value) > 0,
                            'Amount must be greater than 0',
                        ),
                    method: z.enum(['cash', 'card', 'transfer']),
                    status: z.enum(['paid', 'pending']),
                    reference: z.string().optional(),
                }),
            )
            .optional(),
        remarks: z.string().optional(),
    })

/**
 * Edit-mode schema: the status field accepts every lifecycle value the STATE
 * MACHINE permits (the backend still rejects illegal moves) and a reason can
 * ride along with a cancellation.
 */
const editReservationSchema = reservationSchema.extend({
    status: z
        .enum([
            'pending',
            'confirmed',
            'reserved',
            'active',
            'completed',
            'cancelled',
            'no_show',
        ])
        .optional(),
    status_reason: z.string().max(500).optional(),
})

const addPaymentSchema = z.object({
    payment_date: z.string().optional(),
    amount: z
        .string()
        .regex(/^\d+(\.\d+)?$/, 'Amount is required')
        .refine((value) => Number(value) > 0, 'Amount must be greater than 0'),
    method: z.enum(['cash', 'card', 'transfer']),
    status: z.enum(['paid', 'pending']),
    reference: z.string().optional(),
    notes: z.string().optional(),
})

const toDateTimeLocal = (value?: string | null) =>
    value ? dayjs(value).format('YYYY-MM-DDTHH:mm') : ''

// ---- Coloured status choices -----------------------------------------------

const paymentRecordStatusTone: Record<PaymentRecordStatus, TagTone> = {
    paid: 'success',
    pending: 'warning',
    refunded: 'error',
}

const reservationChoiceTone = (value: string): TagTone =>
    reservationStatusTone[value as ReservationStatus] ?? 'default'

const paymentRecordChoiceTone = (value: string): TagTone =>
    paymentRecordStatusTone[value as PaymentRecordStatus] ?? 'default'

const statusChipClass: Record<TagTone, string> = {
    success: 'bg-success-subtle text-success',
    error: 'bg-error-subtle text-error',
    warning: 'bg-warning-subtle text-warning',
    primary: 'bg-primary-subtle text-primary',
    purple: 'bg-[#44238e17] text-[#44238e] dark:bg-[#44238e91] dark:text-[#c2b0eb]',
    neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    default: 'bg-gray-100 text-gray-500',
}

const makeStatusOptionRenderer =
    (toneFor: (value: string) => TagTone): CustomOption<object> =>
    ({ option, selected, CheckIcon }) => {
        const tone = toneFor(String(option.value))
        return (
            <div className="flex w-full items-center justify-between">
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusChipClass[tone]}`}
                >
                    {option.label}
                </span>
                {selected && CheckIcon}
            </div>
        )
    }

const makeStatusInputDisplay =
    (toneFor: (value: string) => TagTone) =>
    (selectedItem: SingleOption<object> | null) => {
        const tone = selectedItem
            ? toneFor(String(selectedItem.value))
            : 'default'
        return (
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusChipClass[tone]}`}
            >
                {selectedItem?.label}
            </span>
        )
    }

/**
 * Dropdown row for the status flow: a tone chip plus a short hint of where
 * the status sits in the lifecycle. Disabled entries fade so it's obvious
 * they are reached later from the reservation list.
 */
const makeStatusFlowOptionRenderer =
    (toneFor: (value: string) => TagTone): CustomOption<StatusFlowOption> =>
    ({ option, selected, CheckIcon }) => {
        const tone = toneFor(String(option.value))
        return (
            <div className="flex w-full items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                    <span
                        className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusChipClass[tone]} ${option.disabled ? 'opacity-50' : ''}`}
                    >
                        {option.label}
                    </span>
                    {option.hint && (
                        <span className="truncate text-xs text-gray-400 dark:text-gray-500">
                            {option.hint}
                        </span>
                    )}
                </span>
                {selected && CheckIcon}
            </div>
        )
    }

// ---- Payload building ------------------------------------------------------

const buildPayload = (
    values: ReservationFormValues,
    reservation?: Reservation | null,
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

    if (values.secondary_client_id) {
        payload.secondary_client_id = values.secondary_client_id
    }

    // Send a status only when it actually moves: on create the default
    // "pending" is implicit, on edit the untouched status must not be
    // re-submitted (the backend would reject a no-op transition).
    const initialStatus = reservation?.status ?? 'pending'
    if (values.status && values.status !== initialStatus) {
        payload.status = values.status
        if (values.status_reason?.trim()) {
            payload.status_reason = values.status_reason.trim()
        }
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

    const extras = (values.extras ?? []).filter(
        (row) => row.name?.trim() !== '',
    )
    // On create, send whatever was typed. On edit, the extras are editable
    // too, so send them only when they actually moved (including clearing the
    // list) — an untouched list must not churn the snapshot rows.
    const extrasDiffer =
        reservation != null
            ? extras.length !== (reservation.extras?.length ?? 0) ||
              extras.some((row, index) => {
                  const snapshot = reservation.extras?.[index]

                  return (
                      !snapshot ||
                      row.name.trim() !== snapshot.name ||
                      row.pricing_type !== snapshot.pricing_type ||
                      Number(row.quantity) !== snapshot.quantity ||
                      Number(row.unit_price) !== Number(snapshot.unit_price)
                  )
              })
            : extras.length > 0

    if (extrasDiffer) {
        payload.extras = extras.map((row) => ({
            name: row.name.trim(),
            description: row.description?.trim() || null,
            pricing_type: row.pricing_type,
            quantity: Number(row.quantity),
            unit_price: Number(row.unit_price),
        }))
    }

    const payments = (values.payments ?? []).filter(
        (row) => row.amount?.trim() !== '',
    )
    if (payments.length > 0) {
        payload.payments = payments.map((row) => ({
            amount: Number(row.amount),
            method: row.method,
            status: row.status,
            payment_date: row.payment_date
                ? row.payment_date.replace('T', ' ')
                : undefined,
            reference: row.reference?.trim() || null,
        }))
    }

    return payload
}

const defaultsFor = (
    reservation?: Reservation | null,
    initialDate?: Date | null,
): ReservationFormValues => {
    // Create-only: seed the schedule from a calendar day click (09:00 to
    // 09:00 next day). Ignored in edit mode, where the record wins.
    const seedPickup =
        !reservation && initialDate
            ? dayjs(initialDate).hour(9).minute(0).second(0)
            : null
    const seedReturn = seedPickup ? seedPickup.add(1, 'day') : null

    return {
        car_id: reservation?.car?.id,
        primary_client_id: reservation?.primary_client?.id,
        secondary_client_id: reservation?.secondary_client?.id,
        pickup_location: reservation?.pickup_location ?? '',
        return_location: reservation?.return_location ?? '',
        pickup_datetime: reservation
            ? toDateTimeLocal(reservation.pickup_datetime)
            : seedPickup
              ? seedPickup.format('YYYY-MM-DDTHH:mm')
              : '',
        expected_return_datetime: reservation
            ? toDateTimeLocal(reservation.expected_return_datetime)
            : seedReturn
              ? seedReturn.format('YYYY-MM-DDTHH:mm')
              : '',
        daily_rate: reservation?.daily_rate
            ? String(reservation.daily_rate)
            : '',
        discount_amount: reservation?.discount_amount
            ? String(reservation.discount_amount)
            : '',
        deposit_amount: reservation?.deposit_amount
            ? String(reservation.deposit_amount)
            : '',
        status: reservation?.status ?? 'pending',
        status_reason: '',
        extras: (reservation?.extras ?? []).map((extra) => ({
            name: extra.name,
            description: '',
            pricing_type: extra.pricing_type,
            quantity: String(extra.quantity),
            unit_price: String(extra.unit_price),
        })),
        payments: [],
        remarks: reservation?.remarks ?? '',
    }
}

const addPaymentDefaults = (): AddPaymentValues => ({
    payment_date: dayjs().format('YYYY-MM-DDTHH:mm'),
    amount: '',
    method: 'cash',
    status: 'paid',
    reference: '',
    notes: '',
})

type ReservationFormProps = {
    reservation: Reservation | null
    /** Used by dialogs to (re)fetch options and reset on each open. */
    isOpen?: boolean
    /**
     * Create-only: a calendar day (or any date) used to seed the pickup and
     * return schedule when the form opens from the calendar.
     */
    initialDate?: Date | null
    onCancel: () => void
    onSaved: () => void
    /** Optional left column rendered next to the sections (e.g. change history). */
    sidebar?: ReactNode
}

const ReservationForm = ({
    reservation,
    isOpen = true,
    initialDate = null,
    onCancel,
    onSaved,
    sidebar,
}: ReservationFormProps) => {
    const isEditing = reservation !== null
    const navigate = useNavigate()
    const [selectedSection, setSelectedSection] = useState('basicInfo')
    const [invalidFields, setInvalidFields] = useState<string[]>([])
    const [cars, setCars] = useState<{ value: number; label: string }[]>([])
    const [clients, setClients] = useState<{ value: number; label: string }[]>(
        [],
    )
    const [clientsLoading, setClientsLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [clientDialogTarget, setClientDialogTarget] = useState<
        'primary' | 'secondary' | null
    >(null)

    // Edit mode: the reservation's ledger plus the add-payment form.
    const [payments, setPayments] = useState<Payment[]>([])
    const [paymentsLoading, setPaymentsLoading] = useState(false)
    const [showAddPayment, setShowAddPayment] = useState(false)
    const [paymentSubmitting, setPaymentSubmitting] = useState(false)

    // Create mode: the live quote (exact backend engine) that drives the
    // generated payment status at the bottom of the payment section.
    const [quote, setQuote] = useState<PricingQuote | null>(null)
    const [quoteFetching, setQuoteFetching] = useState(false)
    const quoteTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const quoteSeq = useRef(0)

    // Car default prices, used only as the fallback estimate while a quote
    // is not resolved (the quote itself is authoritative).
    const carPrices = useRef(new Map<number, number>())

    // Every fetched client is remembered by id so a selected option keeps a
    // label even when the current search page does not include it.
    const clientLabels = useRef(new Map<number, string>())
    const clientSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const clientRequestSeq = useRef(0)

    const reservationResolver = useMemo(
        () =>
            zodResolver(
                isEditing ? editReservationSchema : reservationSchema,
            ) as unknown as Resolver<ReservationFormValues>,
        [isEditing],
    )

    const formMethods = useForm<ReservationFormValues>({
        resolver: reservationResolver,
        defaultValues: defaultsFor(reservation, initialDate),
    })

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = formMethods

    const {
        handleSubmit: handleAddPaymentSubmit,
        control: addPaymentControl,
        reset: resetAddPayment,
        formState: { errors: addPaymentErrors },
    } = useForm<AddPaymentValues>({
        resolver: zodResolver(
            addPaymentSchema,
        ) as unknown as Resolver<AddPaymentValues>,
        defaultValues: addPaymentDefaults(),
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'extras',
    })

    const {
        fields: paymentFields,
        append: appendPayment,
        remove: removePayment,
    } = useFieldArray({
        control,
        name: 'payments',
    })

    const tripValues = watch()
    const rentalDays = useMemo(() => {
        if (
            !tripValues.pickup_datetime ||
            !tripValues.expected_return_datetime
        ) {
            return 0
        }
        return Math.max(
            1,
            dayjs(tripValues.expected_return_datetime)
                .startOf('day')
                .diff(dayjs(tripValues.pickup_datetime).startOf('day'), 'day'),
        )
    }, [tripValues.pickup_datetime, tripValues.expected_return_datetime])

    const extrasTotalFor = (row: ExtraRow | undefined): number | null => {
        if (!row) {
            return null
        }
        const unit = Number(row.unit_price)
        const qty = Number(row.quantity)
        if (!Number.isFinite(unit) || unit < 0) {
            return null
        }
        if (!Number.isFinite(qty) || qty < 1) {
            return null
        }
        const line = unit * Math.floor(qty)
        return row.pricing_type === 'daily' && rentalDays > 0
            ? line * rentalDays
            : line
    }

    const loadClients = useCallback((query = '') => {
        const seq = ++clientRequestSeq.current
        setClientsLoading(true)
        return apiGetClients({ per_page: 100, q: query.trim() || undefined })
            .then((res) => {
                if (seq !== clientRequestSeq.current) {
                    return
                }
                const next = res.data.map((client) => ({
                    value: client.id,
                    label: `${client.full_name} · ${client.phone}`,
                }))
                next.forEach((item) =>
                    clientLabels.current.set(item.value, item.label),
                )
                setClients(next)
            })
            .catch(() => {
                if (seq === clientRequestSeq.current) {
                    setClients([])
                }
            })
            .finally(() => {
                if (seq === clientRequestSeq.current) {
                    setClientsLoading(false)
                }
            })
    }, [])

    const onClientSearch = useCallback(
        (query: string) => {
            if (clientSearchTimer.current) {
                clearTimeout(clientSearchTimer.current)
            }
            clientSearchTimer.current = setTimeout(
                () => loadClients(query),
                400,
            )
        },
        [loadClients],
    )

    const clientOptionFor = useCallback(
        (id?: number) => {
            if (!id) {
                return undefined
            }
            const found = clients.find((item) => item.value === id)
            if (found) {
                return found
            }
            const label = clientLabels.current.get(id)
            return label ? { value: id, label } : undefined
        },
        [clients],
    )

    useEffect(() => {
        reset(defaultsFor(reservation, initialDate))
    }, [reservation, isOpen, initialDate, reset])

    useEffect(() => {
        setSelectedSection('basicInfo')
        setInvalidFields([])
    }, [isOpen, reservation])

    useEffect(() => {
        if (!isOpen || !isEditing) {
            return
        }
        setPaymentsLoading(true)
        apiGetPayments(reservation.id)
            .then(setPayments)
            .catch(() => setPayments([]))
            .finally(() => setPaymentsLoading(false))
    }, [isOpen, isEditing, reservation?.id])

    useEffect(() => {
        if (!isOpen) {
            return
        }
        apiGetCars({ per_page: 100, sort_by: 'registration_number' })
            .then((res) => {
                res.data.forEach((car) =>
                    carPrices.current.set(car.id, Number(car.daily_price)),
                )
                setCars(
                    res.data.map((car) => ({
                        value: car.id,
                        label: `${car.registration_number} · ${car.brand?.name ?? ''} ${
                            car.model?.name ?? ''
                        }`,
                    })),
                )
            })
            .catch(() => setCars([]))
        loadClients()
    }, [isOpen, loadClients])

    // Live quote: re-run the exact backend pricing engine whenever the
    // pricing inputs settle, so the generated payment status below matches
    // what CreateReservationAction will persist.
    useEffect(() => {
        if (!isOpen) {
            return
        }
        const carId = tripValues.car_id
        if (
            !carId ||
            !tripValues.pickup_datetime ||
            !tripValues.expected_return_datetime
        ) {
            setQuote(null)
            setQuoteFetching(false)
            return
        }
        if (quoteTimer.current) {
            clearTimeout(quoteTimer.current)
        }
        const seq = ++quoteSeq.current
        quoteTimer.current = setTimeout(() => {
            setQuoteFetching(true)
            const dailyRate = tripValues.daily_rate?.trim()
            const discount = tripValues.discount_amount?.trim()
            apiQuoteReservation({
                car_id: carId,
                pickup_datetime: tripValues.pickup_datetime.replace('T', ' '),
                expected_return_datetime: tripValues.expected_return_datetime.replace(
                    'T',
                    ' ',
                ),
                daily_rate: dailyRate ? Number(dailyRate) : undefined,
                discount_amount: discount ? Number(discount) : undefined,
            })
                .then((res) => {
                    if (seq === quoteSeq.current) {
                        setQuote(res)
                    }
                })
                .catch(() => {
                    if (seq === quoteSeq.current) {
                        setQuote(null)
                    }
                })
                .finally(() => {
                    if (seq === quoteSeq.current) {
                        setQuoteFetching(false)
                    }
                })
        }, 400)
        return () => {
            if (quoteTimer.current) {
                clearTimeout(quoteTimer.current)
            }
        }
    }, [
        isOpen,
        tripValues.car_id,
        tripValues.pickup_datetime,
        tripValues.expected_return_datetime,
        tripValues.daily_rate,
        tripValues.discount_amount,
    ])

    const refreshPayments = useCallback(async () => {
        if (!isEditing) {
            return
        }
        try {
            const list = await apiGetPayments(reservation.id)
            setPayments(list)
        } catch {
            setPayments([])
        }
    }, [isEditing, reservation?.id])

    const submitAddPayment = handleAddPaymentSubmit(async (values) => {
        if (!isEditing) {
            return
        }
        setPaymentSubmitting(true)
        try {
            await apiCreatePayment(reservation.id, {
                amount: Number(values.amount),
                method: values.method as PaymentMethod,
                status: values.status,
                payment_date: values.payment_date
                    ? values.payment_date.replace('T', ' ')
                    : undefined,
                reference: values.reference?.trim() || null,
                notes: values.notes?.trim() || null,
            })
            toast.push(
                <Notification
                    type="success"
                    title="Payment recorded successfully!"
                />,
            )
            resetAddPayment(addPaymentDefaults())
            setShowAddPayment(false)
            await refreshPayments()
        } catch (error) {
            const status = (
                error as { response?: { status?: number } }
            )?.response?.status
            toast.push(
                <Notification
                    type="danger"
                    title={
                        status === 403
                            ? "You don't have permission to record payments"
                            : apiErrorMessage(
                                  error,
                                  'Payment could not be recorded',
                              )
                    }
                />,
            )
        } finally {
            setPaymentSubmitting(false)
        }
    })

    const handleClientCreated = async (client: Client) => {
        const target = clientDialogTarget
        setClientDialogTarget(null)
        const label = `${client.full_name} · ${client.phone}`
        clientLabels.current.set(client.id, label)
        setClients((prev) => [
            ...prev.filter((item) => item.value !== client.id),
            { value: client.id, label },
        ])
        await loadClients()
        if (target === 'secondary') {
            setValue('secondary_client_id', client.id)
        } else {
            setValue('primary_client_id', client.id)
        }
    }

    const handleValidSubmit = async (values: ReservationFormValues) => {
        setSubmitting(true)
        const payload = buildPayload(values, reservation)
        try {
            if (isEditing) {
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
    }

    // Failed validation: mark the offending fields and jump to the first
    // section that has an error (mirrors apps/sales ProductDetails).
    const handleInvalidSubmit = (
        formErrors: FieldErrors<ReservationFormValues>,
    ) => {
        const keys = Object.keys(formErrors)
        setInvalidFields(keys)
        const section = reservationFormSectionList.find((item) =>
            item.fields.some((field) => keys.includes(field)),
        )
        if (section) {
            setSelectedSection(section.value)
        }
        toast.push(
            <Notification
                type="danger"
                title="Please fill in all the required fields"
            />,
        )
    }

    const onSubmit = handleSubmit(handleValidSubmit, handleInvalidSubmit)

    // "Next" walks the form section by section (Basic info → Trip → Pricing →
    // Payment). It validates the current section's fields first so required
    // fields can't be skipped.
    const handleNextSection = async () => {
        const currentIndex = reservationFormSectionList.findIndex(
            (section) => section.value === selectedSection,
        )
        const next =
            currentIndex >= 0
                ? reservationFormSectionList[currentIndex + 1]
                : undefined
        if (!next) {
            return
        }
        const current = reservationFormSectionList[currentIndex]
        const valid = await trigger(current.fields)
        if (!valid) {
            setInvalidFields(Object.keys(formMethods.formState.errors))
            return
        }
        setInvalidFields([])
        setSelectedSection(next.value)
    }

    const sectionIndex = reservationFormSectionList.findIndex(
        (section) => section.value === selectedSection,
    )
    const hasNextSection =
        sectionIndex >= 0 &&
        sectionIndex < reservationFormSectionList.length - 1

    const paidSum = payments
        .filter((payment) => payment.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0)

    // Live derived payment status — mirrors the backend derivation exactly
    // (total <= 0 → paid, paid <= 0 → unpaid, paid < total → partial,
    // otherwise paid). The quote comes from the real pricing engine; the
    // fallback estimate only applies while it resolves.
    const extrasTotal = (tripValues.extras ?? []).reduce<number>(
        (sum, row) => {
            const line = extrasTotalFor(row)
            return line === null ? sum : sum + line
        },
        0,
    )

    const createPaidSum =
        Math.round(
            (tripValues.payments ?? [])
                .filter(
                    (row) =>
                        row.status === 'paid' && row.amount?.trim() !== '',
                )
                .reduce<number>(
                    (sum, row) => sum + Number(row.amount),
                    0,
                ) * 100,
        ) / 100

    const effectiveDailyRate = (): number => {
        const carPrice = carPrices.current.get(tripValues.car_id ?? 0)
        return (
            (tripValues.daily_rate?.trim()
                ? Number(tripValues.daily_rate)
                : carPrice) || 0
        )
    }

    // Fallback estimate while the engine quote resolves: mirrors the backend
    // formula (duration discount brackets + 20% tax).
    const estimateSubtotal = (): number => {
        const days = rentalDays
        if (days <= 0) {
            return 0
        }
        const rateSubtotal = effectiveDailyRate() * days
        const durationRate = days >= 28 ? 0.1 : days >= 7 ? 0.05 : 0
        const discount = Number(tripValues.discount_amount) || 0
        return Math.max(
            rateSubtotal * (1 - durationRate) + extrasTotal - discount,
            0,
        )
    }

    const estimateTotal = (): number => estimateSubtotal() * 1.2

    const effectiveTotal = quote
        ? quote.total_amount + extrasTotal * (1 + quote.tax_rate)
        : estimateTotal()

    // Ex-tax subtotal of the current form (quote + form extras) and the tax
    // on it — used by the Pricing summary card.
    const effectiveSubtotal = quote
        ? quote.total_amount / (1 + quote.tax_rate) + extrasTotal
        : estimateSubtotal()
    const effectiveTax = Math.max(effectiveTotal - effectiveSubtotal, 0)

    const derivedPaymentStatus: PaymentStatus | null =
        effectiveTotal > 0
            ? createPaidSum >= effectiveTotal
                ? 'paid'
                : createPaidSum > 0
                  ? 'partial'
                  : 'unpaid'
            : null

    // Live total on the edit form: reflects pricing/extras/date edits before
    // saving, falling back to the stored total when the form is incomplete.
    const editTotal =
        effectiveTotal > 0 ? effectiveTotal : (reservation?.total_amount ?? 0)

    const editDerivedStatus: PaymentStatus =
        editTotal > 0
            ? paidSum >= editTotal
                ? 'paid'
                : paidSum > 0
                  ? 'partial'
                  : 'unpaid'
            : 'paid'

    return (
        <>
            {/* Header with section tabs — mirrors apps/sales ProductDetails */}
            <div className="border-b border-gray-200 px-4 pt-4 dark:border-gray-800">
                <Container size="md" className="md:px-4">
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                        <div className="flex items-center gap-4">
                            <IconFrame variant="layered">
                                <LiCar className="heading-text text-xl" />
                            </IconFrame>
                            <div>
                                <h5 className="font-semibold dark:text-gray-100">
                                    {isEditing
                                        ? 'Edit reservation'
                                        : 'New reservation'}
                                </h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {isEditing && reservation
                                        ? `${reservation.reservation_number} — trip, pricing and payments below.`
                                        : 'Book a car for a client — details live in the tabs below.'}
                                </span>
                            </div>
                        </div>
                        {isEditing && reservation && (
                            <div className="flex items-center gap-2">
                                <Tag
                                    className={`capitalize ${tagToneClass[
                                        reservationStatusTone[reservation.status]
                                    ]}`}
                                >
                                    {reservation.status}
                                </Tag>
                                <Tag
                                    className={`capitalize ${tagToneClass[
                                        paymentStatusTone[
                                            reservation.payment_status
                                        ]
                                    ]}`}
                                >
                                    {reservation.payment_status}
                                </Tag>
                                <Button
                                    size="sm"
                                    variant="subtle"
                                    icon={<LiPrinter />}
                                    onClick={() =>
                                        navigate(
                                            `${APPS_PREFIX_PATH}/reservations/${reservation.id}/facture`,
                                        )
                                    }
                                >
                                    Invoice
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <OverflowTabs
                            value={selectedSection}
                            onChange={setSelectedSection}
                            className="flex items-center justify-between"
                            tabListClass="border-0"
                            tabNavClass="min-w-[100px] text-center"
                            tabList={reservationFormSectionList.map((item) =>
                                item.fields.some((field) =>
                                    invalidFields.includes(field),
                                )
                                    ? {
                                          ...item,
                                          label: (
                                              <span>
                                                  {item.label}{' '}
                                                  <span className="text-red-500">
                                                      *
                                                  </span>
                                              </span>
                                          ),
                                      }
                                    : item,
                            )}
                        />
                    </div>
                </Container>
            </div>

            <div className={sidebar ? 'flex flex-col-reverse lg:flex-row md:px-4' : ''}>
                {sidebar && (
                    <aside className="w-full shrink-0 border-t border-gray-200 px-4 py-6 dark:border-gray-800 lg:w-80 lg:border-r lg:border-t-0">
                        {sidebar}
                    </aside>
                )}
            <Container
                size={sidebar ? 'lg' : 'md'}
                className={
                    sidebar ? 'min-w-0 flex-1 py-4 md:px-4' : 'py-4 md:px-4'
                }
            >
                <Form id="reservation-form" onSubmit={onSubmit}>
                    <SectionContainer show={selectedSection === 'basicInfo'}>
                        <FormSectionCard
                            title="Car & clients"
                            description="Which car is booked and who is renting it."
                        >
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
                                isSearchable
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
                            <div className="flex items-center gap-2">
                                <Select
                                    isSearchable
                                    isLoading={clientsLoading}
                                    placeholder="Select client"
                                    searchInputProps={{
                                        placeholder: 'Search clients…',
                                    }}
                                    options={clients}
                                    className="min-w-0 flex-1"
                                    value={clientOptionFor(field.value)}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    onInputChange={onClientSearch}
                                    filter={({ options }) => options}
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="subtle"
                                    onClick={() =>
                                        setClientDialogTarget('primary')
                                    }
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                    />
                </FormItem>
                <FormItem label="Secondary client">
                    <Controller
                        name="secondary_client_id"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Select
                                    isSearchable
                                    isLoading={clientsLoading}
                                    placeholder="Select optional client"
                                    searchInputProps={{
                                        placeholder: 'Search clients…',
                                    }}
                                    options={clients}
                                    className="min-w-0 flex-1"
                                    value={clientOptionFor(field.value)}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    onInputChange={onClientSearch}
                                    filter={({ options }) => options}
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="subtle"
                                    onClick={() =>
                                        setClientDialogTarget('secondary')
                                    }
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                    />
                </FormItem>
                {isEditing ? (
                    <div className="space-y-3">
                        <h6 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Status & payment
                        </h6>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                Payment
                            </span>
                            <Tag
                                className={`capitalize ${tagToneClass[
                                    paymentStatusTone[
                                        reservation.payment_status
                                    ]
                                ]}`}
                            >
                                {reservation.payment_status}
                            </Tag>
                        </div>
                        <FormItem
                            label="Status"
                            invalid={Boolean(errors.status)}
                            errorMessage={errors.status?.message}
                        >
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={editStatusFlowOptions(
                                            reservation.status,
                                        )}
                                        value={editStatusFlowOptions(
                                            reservation.status,
                                        ).find(
                                            (o) => o.value === field.value,
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                        customOption={makeStatusFlowOptionRenderer(
                                            reservationChoiceTone,
                                        )}
                                        customInputDisplay={makeStatusInputDisplay(
                                            reservationChoiceTone,
                                        )}
                                    />
                                )}
                            />
                        </FormItem>
                        {tripValues.status === 'cancelled' &&
                            tripValues.status !== reservation.status && (
                                <FormItem
                                    label="Cancellation reason"
                                    invalid={Boolean(errors.status_reason)}
                                    errorMessage={
                                        errors.status_reason?.message
                                    }
                                >
                                    <Controller
                                        name="status_reason"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                placeholder="Why is this reservation being cancelled?"
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>
                            )}
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Only legal moves are enabled. Moving the status
                            updates the car (reserved, rented, released).
                        </p>
                    </div>
                ) : (
                    <FormItem
                        label="Status"
                        invalid={Boolean(errors.status)}
                        errorMessage={errors.status?.message}
                    >
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={startupStatusOptions}
                                    value={startupStatusOptions.find(
                                        (o) => o.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    customOption={makeStatusFlowOptionRenderer(
                                        reservationChoiceTone,
                                    )}
                                    customInputDisplay={makeStatusInputDisplay(
                                        reservationChoiceTone,
                                    )}
                                />
                            )}
                        />
                    </FormItem>
                )}
                        </div>
                    </FormSectionCard>
                </SectionContainer>

                <SectionContainer show={selectedSection === 'trip'}>
                    <FormSectionCard
                        title="Trip schedule"
                        description="Pickup and return times and locations."
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800">
                        <LiCalendar className="text-base text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400">
                            Total duration
                        </span>
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                            {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                        </span>
                    </div>
                    <FormItem label="Remarks">
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
                </FormSectionCard>
                </SectionContainer>

                <SectionContainer show={selectedSection === 'pricing'}>
                    <FormSectionCard
                        title="Rates"
                        description="Daily rate, discount and deposit."
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                </FormSectionCard>
                <FormSectionCard
                    title="Extras"
                    description="Optional equipment or services added to the rental."
                >
            <div>
                    <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">
                        Extras: a name, unit price and either a fixed or daily
                        pricing type (daily extras multiply by the rental
                        days).
                    </p>
                    {fields.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            No extras selected.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                            Extra {index + 1}
                                        </h6>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-error hover:bg-error-subtle"
                                            onClick={() => remove(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <FormItem
                                            label="Name"
                                            invalid={Boolean(
                                                errors.extras?.[index]?.name,
                                            )}
                                            errorMessage={
                                                errors.extras?.[index]?.name
                                                    ?.message
                                            }
                                        >
                                            <Controller
                                                name={`extras.${index}.name`}
                                                control={control}
                                                render={({ field: nameField }) => (
                                                    <Input
                                                        placeholder="e.g. GPS, baby seat…"
                                                        {...nameField}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem label="Description">
                                            <Controller
                                                name={`extras.${index}.description`}
                                                control={control}
                                                render={({
                                                    field: descriptionField,
                                                }) => (
                                                    <Input
                                                        placeholder="Optional"
                                                        {...descriptionField}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem label="Pricing type">
                                            <Controller
                                                name={`extras.${index}.pricing_type`}
                                                control={control}
                                                render={({
                                                    field: pricingField,
                                                }) => (
                                                    <Select
                                                        options={[
                                                            ...extrasPricingTypeOptions,
                                                        ]}
                                                        value={extrasPricingTypeOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                pricingField.value,
                                                        )}
                                                        onChange={(option) =>
                                                            pricingField.onChange(
                                                                option?.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Quantity"
                                            invalid={Boolean(
                                                errors.extras?.[index]?.quantity,
                                            )}
                                            errorMessage={
                                                errors.extras?.[index]?.quantity
                                                    ?.message
                                            }
                                        >
                                            <Controller
                                                name={`extras.${index}.quantity`}
                                                control={control}
                                                render={({
                                                    field: qtyField,
                                                }) => (
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="1"
                                                        {...qtyField}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Unit price (MAD)"
                                            invalid={Boolean(
                                                errors.extras?.[index]
                                                    ?.unit_price,
                                            )}
                                            errorMessage={
                                                errors.extras?.[index]
                                                    ?.unit_price?.message
                                            }
                                        >
                                            <Controller
                                                name={`extras.${index}.unit_price`}
                                                control={control}
                                                render={({
                                                    field: unitPriceField,
                                                }) => (
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        {...unitPriceField}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem label="Total price">
                                            {(() => {
                                                const row =
                                                    tripValues.extras?.[index]
                                                const total = extrasTotalFor(row)
                                                if (total === null) {
                                                    return (
                                                        <div className="pt-0 text-sm leading-10 text-gray-400 dark:text-gray-500">
                                                            —
                                                        </div>
                                                    )
                                                }
                                                return (
                                                    <div className="pt-0 leading-10">
                                                        <span className="text-sm font-semibold dark:text-gray-100">
                                                            {MAD(total)}
                                                        </span>
                                                        {row?.pricing_type ===
                                                            'daily' && (
                                                            <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                                                                {rentalDays > 0
                                                                    ? `= ${MAD(
                                                                          Number(
                                                                              row.unit_price,
                                                                          ),
                                                                      )} × ${row.quantity} × ${rentalDays} days`
                                                                    : '/day'}
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            })()}
                                        </FormItem>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Button
                        type="button"
                        size="sm"
                        variant="subtle"
                        icon={<LiAdd className="text-lg" />}
                        className="mt-3"
                        onClick={() =>
                            append({
                                name: '',
                                description: '',
                                pricing_type: 'fixed',
                                quantity: '1',
                                unit_price: '',
                            })
                        }
                    >
                        Ajouter un extra
                    </Button>
                </div>
                </FormSectionCard>
                <FormSectionCard
                    title="Summary"
                    description="Live totals — what the client pays for this rental."
                >
                    <dl className="space-y-2.5 text-sm">
                        <div className="flex items-center justify-between">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Total days
                            </dt>
                            <dd className="font-semibold text-gray-700 dark:text-gray-200">
                                {rentalDays}{' '}
                                {rentalDays === 1 ? 'day' : 'days'}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Daily rate
                            </dt>
                            <dd className="text-gray-700 dark:text-gray-200">
                                {MAD(effectiveDailyRate())} × {rentalDays}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Extras
                            </dt>
                            <dd className="text-gray-700 dark:text-gray-200">
                                {MAD(extrasTotal)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Duration discount
                            </dt>
                            <dd className="text-gray-700 dark:text-gray-200">
                                −
                                {MAD(
                                    quote
                                        ? quote.duration_discount
                                        : 0,
                                )}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Discount
                            </dt>
                            <dd className="text-gray-700 dark:text-gray-200">
                                −{MAD(Number(tripValues.discount_amount) || 0)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Tax (
                                {Math.round((quote?.tax_rate ?? 0.2) * 100)}%)
                            </dt>
                            <dd className="text-gray-700 dark:text-gray-200">
                                {MAD(effectiveTax)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-2.5 dark:border-gray-700">
                            <dt className="font-semibold text-gray-700 dark:text-gray-200">
                                Total to pay
                            </dt>
                            <dd className="text-base font-semibold text-gray-800 dark:text-gray-100">
                                {MAD(effectiveTotal)}
                                {quoteFetching && (
                                    <span className="ml-2 text-xs font-normal text-gray-400">
                                        updating…
                                    </span>
                                )}
                            </dd>
                        </div>
                    </dl>
                </FormSectionCard>
                </SectionContainer>

                <SectionContainer show={selectedSection === 'payment'}>
                    {!isEditing && (
                        <>
                            <FormSectionCard
                                title="Payment"
                                description="Record what the client pays at booking — you can split the bill across several instalments."
                            >
                            {paymentFields.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            No payment recorded yet.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {paymentFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                            Payment {index + 1}
                                        </h6>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-error hover:bg-error-subtle"
                                            onClick={() => removePayment(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <FormItem label="Payment date">
                                            <Controller
                                                name={`payments.${index}.payment_date`}
                                                control={control}
                                                render={({ field: dateField }) => (
                                                    <Input
                                                        type="datetime-local"
                                                        {...dateField}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Amount paid (MAD)"
                                            invalid={Boolean(
                                                errors.payments?.[index]
                                                    ?.amount,
                                            )}
                                            errorMessage={
                                                errors.payments?.[index]
                                                    ?.amount?.message
                                            }
                                        >
                                            <Controller
                                                name={`payments.${index}.amount`}
                                                control={control}
                                                render={({ field: amountField }) => (
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        {...amountField}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem label="Payment method">
                                            <Controller
                                                name={`payments.${index}.method`}
                                                control={control}
                                                render={({ field: methodField }) => (
                                                    <Select
                                                        placeholder="Select method"
                                                        options={[
                                                            ...paymentMethodOptions,
                                                        ]}
                                                        value={paymentMethodOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                methodField.value,
                                                        )}
                                                        onChange={(option) =>
                                                            methodField.onChange(
                                                                option?.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem label="Payment status">
                                            <Controller
                                                name={`payments.${index}.status`}
                                                control={control}
                                                render={({ field: statusField }) => (
                                                    <Select
                                                        options={[
                                                            ...paymentRecordStatusOptions,
                                                        ]}
                                                        value={paymentRecordStatusOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                statusField.value,
                                                        )}
                                                        onChange={(option) =>
                                                            statusField.onChange(
                                                                option?.value,
                                                            )
                                                        }
                                                        customOption={makeStatusOptionRenderer(
                                                            paymentRecordChoiceTone,
                                                        )}
                                                        customInputDisplay={makeStatusInputDisplay(
                                                            paymentRecordChoiceTone,
                                                        )}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem label="Reference">
                                            <Controller
                                                name={`payments.${index}.reference`}
                                                control={control}
                                                render={({
                                                    field: referenceField,
                                                }) => (
                                                    <Input
                                                        placeholder="e.g. transfer ref. or receipt no."
                                                        {...referenceField}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Button
                        type="button"
                        size="sm"
                        variant="subtle"
                        icon={<LiBank className="text-lg" />}
                        className="mt-3"
                        onClick={() =>
                            appendPayment({
                                payment_date: dayjs().format(
                                    'YYYY-MM-DDTHH:mm',
                                ),
                                amount: '',
                                method: 'cash',
                                status: 'paid',
                                reference: '',
                            })
                        }
                    >
                        Ajouter un montant
                    </Button>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Generated payment status
                            </p>
                            <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
                                {MAD(createPaidSum)} paid of{' '}
                                {effectiveTotal > 0
                                    ? MAD(effectiveTotal)
                                    : '—'}
                                {quoteFetching && ' · calculating…'}
                            </p>
                        </div>
                        {derivedPaymentStatus ? (
                            <Tag
                                className={`capitalize ${tagToneClass[
                                    paymentStatusTone[
                                        derivedPaymentStatus
                                    ]
                                ]}`}
                            >
                                {derivedPaymentStatus}
                            </Tag>
                        ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                Select a car and dates to compute the total
                            </span>
                        )}
                    </div>
                    </FormSectionCard>
                </>
            )}

            {isEditing && (
                <>
                    <FormSectionCard
                        title="Payments"
                        description="Paid amounts recorded on this reservation."
                    >
                    {paymentsLoading ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            Loading payments…
                        </p>
                    ) : payments.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            No payments recorded yet.
                        </p>
                    ) : (
                        <>
                            <p className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                Paid {MAD(paidSum)} of{' '}
                                {MAD(editTotal)}
                                {quoteFetching && ' · calculating…'}
                                <Tag
                                    className={`capitalize ${tagToneClass[
                                        paymentStatusTone[editDerivedStatus]
                                    ]}`}
                                >
                                    {editDerivedStatus}
                                </Tag>
                            </p>
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {payments.map((payment) => (
                                    <li
                                        key={payment.id}
                                        className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
                                    >
                                        <span className="dark:text-gray-200">
                                            <span className="font-semibold">
                                                {MAD(payment.amount)}
                                            </span>{' '}
                                            · {formatDateTime(payment.payment_date)}
                                            · {payment.method}
                                            {payment.reference
                                                ? ` · ${payment.reference}`
                                                : ''}
                                        </span>
                                        <Tag
                                            className={`capitalize ${tagToneClass[
                                                paymentRecordStatusTone[
                                                    payment.status
                                                ]
                                            ]}`}
                                        >
                                            {payment.status}
                                        </Tag>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {!showAddPayment ? (
                        <Button
                            type="button"
                            size="sm"
                            variant="subtle"
                            icon={<LiBank className="text-lg" />}
                            className="mt-3"
                            onClick={() => {
                                resetAddPayment(addPaymentDefaults())
                                setShowAddPayment(true)
                            }}
                        >
                            Ajouter un montant
                        </Button>
                    ) : (
                        <div className="mt-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                            <h6 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                New payment
                            </h6>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormItem label="Payment date">
                                    <Controller
                                        name="payment_date"
                                        control={addPaymentControl}
                                        render={({ field }) => (
                                            <Input
                                                type="datetime-local"
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Amount (MAD)"
                                    invalid={Boolean(
                                        addPaymentErrors.amount,
                                    )}
                                    errorMessage={
                                        addPaymentErrors.amount?.message
                                    }
                                >
                                    <Controller
                                        name="amount"
                                        control={addPaymentControl}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Payment method">
                                    <Controller
                                        name="method"
                                        control={addPaymentControl}
                                        render={({ field }) => (
                                            <Select
                                                placeholder="Select method"
                                                options={[
                                                    ...paymentMethodOptions,
                                                ]}
                                                value={paymentMethodOptions.find(
                                                    (o) =>
                                                        o.value === field.value,
                                                )}
                                                onChange={(option) =>
                                                    field.onChange(
                                                        option?.value,
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Payment status">
                                    <Controller
                                        name="status"
                                        control={addPaymentControl}
                                        render={({ field }) => (
                                            <Select
                                                options={[
                                                    ...paymentRecordStatusOptions,
                                                ]}
                                                value={paymentRecordStatusOptions.find(
                                                    (o) =>
                                                        o.value === field.value,
                                                )}
                                                onChange={(option) =>
                                                    field.onChange(
                                                        option?.value,
                                                    )
                                                }
                                                customOption={makeStatusOptionRenderer(
                                                    paymentRecordChoiceTone,
                                                )}
                                                customInputDisplay={makeStatusInputDisplay(
                                                    paymentRecordChoiceTone,
                                                )}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Reference">
                                    <Controller
                                        name="reference"
                                        control={addPaymentControl}
                                        render={({ field }) => (
                                            <Input
                                                placeholder="e.g. transfer ref. or receipt no."
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Notes">
                                    <Controller
                                        name="notes"
                                        control={addPaymentControl}
                                        render={({ field }) => (
                                            <Input
                                                placeholder="Optional"
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowAddPayment(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant="solid"
                                    size="sm"
                                    loading={paymentSubmitting}
                                    onClick={() => submitAddPayment()}
                                >
                                    Record payment
                                </Button>
                            </div>
                        </div>
                    )}
                    </FormSectionCard>
                </>
            )}
                </SectionContainer>
            </Form>
            </Container>
            </div>

            {/* Sticky footer — mirrors apps/sales ProductFooter */}
            <div className="sticky bottom-0 left-0 right-0 z-10 mt-8 border-t border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800">
                <Container size="md" className="px-4 lg:px-0">
                    <div className="flex items-center justify-between gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-error hover:bg-error-subtle"
                            onClick={onCancel}
                        >
                            {isEditing ? 'Cancel' : 'Discard'}
                        </Button>
                        <div className="flex items-center gap-2">
                            {hasNextSection && (
                                <Button
                                    type="button"
                                    onClick={() => handleNextSection()}
                                >
                                    Next
                                </Button>
                            )}
                            <Button
                                variant="solid"
                                form="reservation-form"
                                loading={submitting}
                            >
                                {isEditing
                                    ? 'Save changes'
                                    : 'Create reservation'}
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            <Dialog
                isOpen={clientDialogTarget !== null}
                onClose={() => setClientDialogTarget(null)}
                width={560}
                className="max-h-[90vh] overflow-y-auto"
            >
                <h5 className="mb-6 text-base font-bold dark:text-gray-100">
                    Add new client
                </h5>
                <ClientForm
                    client={null}
                    isOpen={clientDialogTarget !== null}
                    onCancel={() => setClientDialogTarget(null)}
                    onSaved={() => setClientDialogTarget(null)}
                    onCreated={handleClientCreated}
                />
            </Dialog>
        </>
    )
}

export default ReservationForm