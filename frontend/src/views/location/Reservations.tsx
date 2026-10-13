import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Container from '@/components/shared/Container'
import { useNavigate } from 'react-router'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Skeleton from '@/components/ui/Skeleton'
import Avatar from '@/components/ui/Avatar'
import Dialog from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Pagination from '@/components/ui/Pagination'
import Tabs from '@/components/ui/Tabs'
import Dropdown from '@/components/ui/Dropdown'
import Segment from '@/components/ui/Segment'
import Collapsible from '@/components/ui/Collapsible'
import Tooltip from '@/components/ui/Tooltip'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { Form, FormItem } from '@/components/ui/Form'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { CSVLink } from 'react-csv'
import classNames from '@/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import dayjs from 'dayjs'
import {
    apiGetReservations,
    apiGetDashboardSummary,
    apiConfirmReservation,
    apiCancelReservation,
    apiMarkReservationNoShow,
    apiActivateReservation,
    apiCompleteReservation,
    apiGetClient,
} from '@/services/LocationService'
import type {
    DashboardSummary,
    PaymentStatus,
    Reservation,
    ReservationStatus,
    Client,
} from '@/@types/location'
import useTranslation from '@/utils/hooks/useTranslation'
import ReservationForm from './forms/ReservationForm'
import ClientForm from './forms/ClientForm'
import CarInspection from './CarInspection'
import type { CarInspectionHandle } from './CarInspection'
import {
    MAD,
    formatDateTime,
    reservationStatusTone,
    paymentStatusTone,
    tagToneClass,
} from './shared'
import StatCards from './StatCards'
import {
    LiSearch,
    LiArrowUp,
    LiArrowDown,
    LiDownload,
    LiAdd,
    LiBox,
    LiBoxTick,
    LiBoxTime,
    LiCar,
    LiCalendar,
    LiUser,
    LiClock,
    LiCross,
    LiChevronLeft,
    LiElement3,
    LiTextAlignLeft,
    LiChevronDown,
    LiMapPin,
    LiMoney,
    LiPhone,
    LiTickCircle,
    LiPlay,
    LiUserCross,
    LiReceipt,
    LiEdit,
} from '@/icons'

const { TabNav, TabList } = Tabs

const rangeOptions = (t: any) => [
    { value: '30', label: t('reservations.last30Days', 'Last 30 days') },
    { value: '60', label: t('reservations.last60Days', 'Last 60 days') },
    { value: '90', label: t('reservations.last90Days', 'Last 90 days') },
]

const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const sortableFields = [
    { key: 'pickup_datetime', label: 'Pickup date' },
    { key: 'expected_return_datetime', label: 'Return date' },
    { key: 'created_at', label: 'Created date' },
    { key: 'total_amount', label: 'Total amount' },
    { key: 'status', label: 'Status' },
]

const paymentStatusFilterOptions = (t: any) => [
    { value: '', label: t('reservations.all', 'All') },
    { value: 'paid', label: t('reservations.payment.paid', 'Paid') },
    { value: 'partial', label: t('reservations.payment.partial', 'Partial') },
    { value: 'unpaid', label: t('reservations.payment.unpaid', 'Unpaid') },
]

const csvHeaders = [
    { label: 'Reservation', key: 'reservation_number' },
    { label: 'Status', key: 'status' },
    { label: 'Payment', key: 'payment_status' },
    { label: 'Car', key: 'car' },
    { label: 'Client', key: 'client' },
    { label: 'Pickup', key: 'pickup_datetime' },
    { label: 'Return', key: 'expected_return_datetime' },
    { label: 'Created', key: 'created_at' },
    { label: 'Total (MAD)', key: 'total_amount' },
]

type ReservationCardStyle = { bg: string; icon: ReactNode; label: string }

const getReservationCardMap = (t: any): Record<ReservationStatus, ReservationCardStyle> => ({
    pending: { bg: 'bg-warning', icon: <LiClock />, label: t('reservations.status.pending', 'Pending') },
    confirmed: { bg: 'bg-primary', icon: <LiTickCircle />, label: t('reservations.status.confirmed', 'Confirmed') },
    reserved: { bg: 'bg-purple-600', icon: <LiPhone />, label: t('reservations.status.reserved', 'Reserved') },
    active: { bg: 'bg-success', icon: <LiCar />, label: t('reservations.status.active', 'Active') },
    completed: { bg: 'bg-info', icon: <LiBoxTick />, label: t('reservations.status.completed', 'Completed') },
    cancelled: { bg: 'bg-error', icon: <LiCross />, label: t('reservations.status.cancelled', 'Cancelled') },
    no_show: { bg: 'bg-gray-500', icon: <LiBoxTime />, label: t('reservations.status.no_show', 'No Show') },
})

const paymentTextColor: Record<PaymentStatus, string> = {
    paid: 'text-success',
    partial: 'text-warning',
    unpaid: 'text-error',
}

type ReservationFormDialogProps = {
    open: boolean
    reservation: Reservation | null
    onClose: () => void
    onSaved: () => void
}

const ReservationFormDialog = ({
    open,
    reservation,
    onClose,
    onSaved,
}: ReservationFormDialogProps) => (
    <Dialog
        isOpen={open}
        onClose={onClose}
        width={880}
        className="max-h-[90vh] overflow-y-auto"
    >
        <ReservationForm
            reservation={reservation}
            isOpen={open}
            onCancel={onClose}
            onSaved={onSaved}
        />
    </Dialog>
)

type ClientFormDialogProps = {
    open: boolean
    client: Client | null
    onClose: () => void
    onSaved: () => void
}

const ClientFormDialog = ({
    open,
    client,
    onClose,
    onSaved,
}: ClientFormDialogProps) => (
    <Dialog
        isOpen={open}
        onClose={onClose}
        width={760}
        className="max-h-[90vh] overflow-y-auto"
    >
        <h5 className="mb-6 text-base font-bold dark:text-gray-100">
            {client ? 'Edit client' : 'Add client'}
        </h5>
        <ClientForm
            client={client}
            isOpen={open}
            onCancel={onClose}
            onSaved={onSaved}
        />
    </Dialog>
)

type CancelDialogProps = {
    reservation: Reservation | null
    onClose: () => void
    onCancelled: () => void
}

const CancelDialog = ({
    reservation,
    onClose,
    onCancelled,
}: CancelDialogProps) => {
    const [reason, setReason] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleCancel = async () => {
        if (!reservation || !reason.trim()) {
            return
        }
        setSubmitting(true)
        try {
            await apiCancelReservation(reservation.id, {
                reason: reason.trim(),
            })
            toast.push(
                <Notification type="success" title={t('reservations.reservationCancelled', 'Reservation cancelled')} />,
            )
            onCancelled()
            onClose()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title="Could not cancel reservation"
                />,
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog isOpen={Boolean(reservation)} onClose={onClose} width={480}>
            <h5 className="mb-4 text-base font-bold dark:text-gray-100">
                Cancel reservation {reservation?.reservation_number}
            </h5>
            <Form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleCancel()
                }}
            >
                <FormItem label="Reason (required)">
                    <Input
                        textArea
                        placeholder="e.g. Client changed plans"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </FormItem>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>
                        Back
                    </Button>
                    <Button
                        variant="solid"
                        loading={submitting}
                        disabled={!reason.trim()}
                        onClick={handleCancel}
                    >
                        Cancel reservation
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

type NoShowDialogProps = {
    reservation: Reservation | null
    onClose: () => void
    onNoShow: () => void
}

const NoShowDialog = ({
    reservation,
    onClose,
    onNoShow,
}: NoShowDialogProps) => {
    const [reason, setReason] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleNoShow = async () => {
        if (!reservation || !reason.trim()) {
            return
        }
        setSubmitting(true)
        try {
            await apiMarkReservationNoShow(reservation.id, {
                reason: reason.trim(),
            })
            toast.push(
                <Notification
                    type="success"
                    title={t('reservations.reservationMarkedNoShow', 'Reservation marked as no show')}
                />,
            )
            onNoShow()
            onClose()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title="Could not mark reservation as no show"
                />,
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog isOpen={Boolean(reservation)} onClose={onClose} width={480}>
            <h5 className="mb-4 text-base font-bold dark:text-gray-100">
                Mark {reservation?.reservation_number} as no show
            </h5>
            <Form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleNoShow()
                }}
            >
                <FormItem label="Reason (required)">
                    <Input
                        textArea
                        placeholder="e.g. Client never arrived at pickup"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </FormItem>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>
                        Back
                    </Button>
                    <Button
                        variant="solid"
                        loading={submitting}
                        disabled={!reason.trim()}
                        onClick={handleNoShow}
                    >
                        Mark as no show
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

type ActivateDialogProps = {
    reservation: Reservation | null
    onClose: () => void
    onActivated: () => void
}

const ActivateDialog = ({
    reservation,
    onClose,
    onActivated,
}: ActivateDialogProps) => {
    const [mileage, setMileage] = useState('')
    const [fuel, setFuel] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const inspectionRef = useRef<CarInspectionHandle>(null)

    useEffect(() => {
        if (!reservation) {
            setMileage('')
            setFuel('')
            inspectionRef.current?.reset()
        }
    }, [reservation])

    const handleActivate = async () => {
        if (!reservation) {
            return
        }
        setSubmitting(true)
        try {
            const formData = new FormData()
            if (mileage.trim()) {
                formData.append('pickup_mileage', mileage.trim())
            }
            if (fuel.trim()) {
                formData.append('pickup_fuel_level', fuel.trim())
            }
            inspectionRef.current?.appendTo(formData)
            await apiActivateReservation(reservation.id, formData)
            toast.push(
                <Notification type="success" title={t('reservations.reservationActivated', 'Reservation activated')} />,
            )
            onActivated()
            onClose()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title="Could not activate reservation"
                />,
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog isOpen={Boolean(reservation)} onClose={onClose} width={720}>
            <h5 className="mb-1 text-base font-bold dark:text-gray-100">
                Activate {reservation?.reservation_number}
            </h5>
            <p className="mb-4 text-sm text-gray-400">
                Client signed the contract — the car goes on rent.
            </p>
            <Form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleActivate()
                }}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormItem label="Pickup mileage (km)">
                        <Input
                            type="number"
                            placeholder="Optional"
                            value={mileage}
                            onChange={(e) => setMileage(e.target.value)}
                        />
                    </FormItem>
                    <FormItem label="Pickup fuel level (%)">
                        <Input
                            type="number"
                            placeholder="Optional"
                            value={fuel}
                            onChange={(e) => setFuel(e.target.value)}
                        />
                    </FormItem>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                    <CarInspection ref={inspectionRef} type="pickup" />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>
                        Back
                    </Button>
                    <Button
                        variant="solid"
                        loading={submitting}
                        onClick={handleActivate}
                    >
                        Activate reservation
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

type CompleteDialogProps = {
    reservation: Reservation | null
    onClose: () => void
    onCompleted: () => void
}

const CompleteDialog = ({
    reservation,
    onClose,
    onCompleted,
}: CompleteDialogProps) => {
    const [mileage, setMileage] = useState('')
    const [fuel, setFuel] = useState('')
    const [issues, setIssues] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const inspectionRef = useRef<CarInspectionHandle>(null)

    useEffect(() => {
        if (!reservation) {
            setMileage('')
            setFuel('')
            setIssues('')
            inspectionRef.current?.reset()
        }
    }, [reservation])

    const handleComplete = async () => {
        if (!reservation) {
            return
        }
        setSubmitting(true)
        try {
            const formData = new FormData()
            if (mileage.trim()) {
                formData.append('return_mileage', mileage.trim())
            }
            if (fuel.trim()) {
                formData.append('return_fuel_level', fuel.trim())
            }
            if (issues.trim()) {
                formData.append('reported_issues', issues.trim())
            }
            inspectionRef.current?.appendTo(formData)
            await apiCompleteReservation(reservation.id, formData)
            toast.push(
                <Notification type="success" title={t('reservations.reservationCompleted', 'Reservation completed')} />,
            )
            onCompleted()
            onClose()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title="Could not complete reservation"
                />,
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog isOpen={Boolean(reservation)} onClose={onClose} width={720}>
            <h5 className="mb-1 text-base font-bold dark:text-gray-100">
                Complete {reservation?.reservation_number}
            </h5>
            <p className="mb-4 text-sm text-gray-400">
                Car returned — the reservation is finished.
            </p>
            <Form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleComplete()
                }}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormItem label="Return mileage (km)">
                        <Input
                            type="number"
                            placeholder="Optional"
                            value={mileage}
                            onChange={(e) => setMileage(e.target.value)}
                        />
                    </FormItem>
                    <FormItem label="Return fuel level (%)">
                        <Input
                            type="number"
                            placeholder="Optional"
                            value={fuel}
                            onChange={(e) => setFuel(e.target.value)}
                        />
                    </FormItem>
                </div>
                <FormItem label="Reported issues">
                    <Input
                        textArea
                        placeholder="Any damage or issues found on return (optional)"
                        value={issues}
                        onChange={(e) => setIssues(e.target.value)}
                    />
                </FormItem>

                <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                    <CarInspection ref={inspectionRef} type="return" />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>
                        Back
                    </Button>
                    <Button
                        variant="solid"
                        loading={submitting}
                        onClick={handleComplete}
                    >
                        Complete reservation
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

type ExpandableReservationDetailsProps = {
    reservation: Reservation
    expand: boolean
    onExpand: () => void
    onConfirm: (reservation: Reservation) => void
    onActivate: (reservation: Reservation) => void
    onComplete: (reservation: Reservation) => void
    onCancel: (reservation: Reservation) => void
    onNoShow: (reservation: Reservation) => void
    onEdit: (reservation: Reservation) => void
    onInvoice: (reservation: Reservation) => void
}

const ExpandableReservationDetails = ({
    reservation,
    expand,
    onExpand,
    onConfirm,
    onActivate,
    onComplete,
    onCancel,
    onNoShow,
    onEdit,
    onInvoice,
}: ExpandableReservationDetailsProps) => {
    const extras = reservation.extras ?? []
    const extrasTotal = extras.reduce(
        (sum, extra) => sum + extra.total_price,
        0,
    )

    return (
        <Collapsible open={expand}>
            <div
                className="flex justify-between px-4 py-2.5 group cursor-pointer"
                role="toggle"
                onClick={onExpand}
            >
                <span className="heading-text font-medium group-hover:text-primary">
                    {expand ? t('reservations.hideDetails', 'Hide Details') : t('reservations.showDetails', 'Show Details')}
                </span>
                <LiChevronLeft
                    className={`text-lg transition-transform group-hover:text-primary ${
                        expand ? '-rotate-90' : ''
                    }`}
                />
            </div>
            <Collapsible.Content>
                <div className="p-4 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="font-semibold heading-text uppercase tracking-wide flex items-center gap-2">
                                <LiCar className="text-base" />
                                <span>{t('reservations.carTrip', 'Car & Trip')}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1 heading-text font-medium">
                                    <LiCar className="text-base" />
                                    {reservation.car?.registration_number ??
                                        '—'}
                                </span>
                                <span>·</span>
                                <span className="heading-text font-medium">
                                    {MAD(reservation.daily_rate)}/day ×{' '}
                                    {reservation.rental_days} days
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <LiCalendar className="text-base" />
                                <span className="font-medium">
                                    {formatDateTime(
                                        reservation.pickup_datetime,
                                    )}{' '}
                                    →{' '}
                                    {formatDateTime(
                                        reservation.expected_return_datetime,
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <LiMapPin className="text-base" />
                                <span className="font-medium">
                                    {reservation.pickup_location ?? '—'} →{' '}
                                    {reservation.return_location ?? '—'}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="font-semibold heading-text uppercase tracking-wide flex items-center gap-2">
                                <LiUser className="text-base" />
                                <span>{t('reservations.clients', 'Clients')}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <LiUser className="text-base" />
                                <span className="heading-text font-medium">
                                    {reservation.primary_client?.full_name ??
                                        '—'}
                                </span>
                                {reservation.primary_client?.phone && (
                                    <span className="flex items-center gap-1 text-sm">
                                        <LiPhone className="text-base" />
                                        {reservation.primary_client.phone}
                                    </span>
                                )}
                            </div>
                            {reservation.secondary_client && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <LiUser className="text-base" />
                                    <span className="heading-text font-medium">
                                        {reservation.secondary_client.full_name}
                                    </span>
                                    {reservation.secondary_client.phone && (
                                        <span className="flex items-center gap-1 text-sm">
                                            <LiPhone className="text-base" />
                                            {reservation.secondary_client.phone}
                                        </span>
                                    )}
                                </div>
                            )}
                            {reservation.remarks && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {reservation.remarks}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="font-semibold heading-text uppercase tracking-wide flex items-center gap-2">
                            <LiMoney className="text-base" />
                            <span>{t('reservations.pricingSummary', 'Pricing Summary')}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{t('reservations.subtotal', 'Subtotal')}</span>
                                <span className="font-medium heading-text">
                                    {MAD(reservation.subtotal)}
                                </span>
                            </div>
                            {extras.length > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                        Extras ({extras.length})
                                    </span>
                                    <span className="font-medium heading-text">
                                        {MAD(extrasTotal)}
                                    </span>
                                </div>
                            )}
                            {reservation.discount_amount > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                        Discount
                                    </span>
                                    <span className="font-medium heading-text">
                                        -{MAD(reservation.discount_amount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{t('reservations.tax', 'Tax')}</span>
                                <span className="font-medium heading-text">
                                    {MAD(reservation.tax_amount)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{t('reservations.deposit', 'Deposit')}</span>
                                <span className="font-medium heading-text">
                                    {MAD(reservation.deposit_amount)}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-semibold heading-text">
                                        Total
                                    </span>
                                    <span className="text-base font-bold heading-text">
                                        {MAD(reservation.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-600 pt-4">
                        {['pending', 'reserved'].includes(
                            reservation.status,
                        ) && (
                            <Button
                                size="sm"
                                variant="solid"
                                onClick={() => onConfirm(reservation)}
                            >
                                Confirm
                            </Button>
                        )}
                        {['confirmed', 'reserved'].includes(
                            reservation.status,
                        ) && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-success hover:bg-success-subtle"
                                onClick={() => onActivate(reservation)}
                            >
                                Activate
                            </Button>
                        )}
                        {reservation.status === 'active' && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-primary hover:bg-primary-subtle"
                                onClick={() => onComplete(reservation)}
                            >
                                Complete
                            </Button>
                        )}
                        {['pending', 'confirmed', 'reserved'].includes(
                            reservation.status,
                        ) && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => onNoShow(reservation)}
                            >
                                No show
                            </Button>
                        )}
                        {[
                            'pending',
                            'confirmed',
                            'reserved',
                            'active',
                        ].includes(reservation.status) && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-error hover:bg-error-subtle"
                                onClick={() => onCancel(reservation)}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary hover:bg-primary-subtle"
                            onClick={() => onInvoice(reservation)}
                        >
                            Invoice
                        </Button>
                        <Button
                            size="sm"
                            variant="subtle"
                            onClick={() => onEdit(reservation)}
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            </Collapsible.Content>
        </Collapsible>
    )
}

const Reservations = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
    const [range, setRange] = useState('30')
    const [sortBy, setSortBy] = useState('')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [viewMode, setViewMode] = useState<'card' | 'table'>('table')

    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [summaryLoading, setSummaryLoading] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Reservation | null>(null)
    const [cancelling, setCancelling] = useState<Reservation | null>(null)
    const [noShowing, setNoShowing] = useState<Reservation | null>(null)
    const [activating, setActivating] = useState<Reservation | null>(null)
    const [completing, setCompleting] = useState<Reservation | null>(null)
    const [editingClient, setEditingClient] = useState<Client | null>(null)
    const [clientDialogOpen, setClientDialogOpen] = useState(false)

    const { larger } = useResponsive()

    const fetchReservations = useCallback(() => {
        setLoading(true)
        const params: Record<string, unknown> = {
            page: pageIndex,
            per_page: pageSize,
            pickup_from: dayjs()
                .subtract(Number(range), 'day')
                .format('YYYY-MM-DD'),
        }
        if (q.trim()) {
            params.q = q.trim()
        }
        if (statusFilter) {
            params.status = statusFilter
        }
        if (paymentStatusFilter) {
            params.payment_status = paymentStatusFilter
        }
        if (sortBy) {
            params.sort_by = sortBy
            params.sort_dir = sortDir
        }
        apiGetReservations(params)
            .then((res) => {
                setReservations(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setReservations([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [
        pageIndex,
        pageSize,
        q,
        statusFilter,
        paymentStatusFilter,
        range,
        sortBy,
        sortDir,
    ])

    useEffect(() => {
        fetchReservations()
    }, [fetchReservations])

    useEffect(() => {
        setSummaryLoading(true)
        apiGetDashboardSummary({
            from: dayjs().subtract(Number(range), 'day').format('YYYY-MM-DD'),
            to: dayjs().format('YYYY-MM-DD'),
        })
            .then(setSummary)
            .catch(() => setSummary(null))
            .finally(() => setSummaryLoading(false))
    }, [range])

    const handleConfirm = useCallback(
        async (reservation: Reservation) => {
            try {
                await apiConfirmReservation(reservation.id)
                toast.push(
                    <Notification
                        type="success"
                        title={`${reservation.reservation_number} confirmed`}
                    />,
                )
                fetchReservations()
            } catch {
                toast.push(
                    <Notification
                        type="danger"
                        title="Could not confirm reservation"
                    />,
                )
            }
        },
        [fetchReservations],
    )

    const handleExpand = (id: number) => {
        setExpandedId((current) => (current === id ? null : id))
    }

    const columns = useMemo<ColumnDef<Reservation>[]>(
        () => [
            {
                header: t('reservations.table.reservation', 'Reservation'),
                accessorKey: 'reservation_number',
                cell: (props) => (
                    <span className="font-semibold heading-text text-nowrap">
                        #{props.row.original.reservation_number}
                    </span>
                ),
            },
            {
                header: t('reservations.table.car', 'Car'),
                accessorKey: 'car.registration_number',
                cell: (props) => {
                    const car = props.row.original.car
                    if (!car) return <span className="text-gray-400">—</span>
                    return (
                        <span className="font-medium text-nowrap cursor-pointer hover:text-primary select-none"
                              onClick={() => navigate(`${APPS_PREFIX_PATH}/vehicules/${car.id}/overview`)}>
                            {car.registration_number}
                        </span>
                    )
                },
            },
            {
                header: t('reservations.table.client', 'Client'),
                accessorKey: 'primary_client.full_name',
                cell: (props) => {
                    const client = props.row.original.primary_client
                    if (!client) return <span className="text-gray-400">—</span>
                    return (
                        <span className="font-medium text-nowrap cursor-pointer hover:text-primary select-none"
                              onClick={async () => {
                                  try {
                                      const fullClient = await apiGetClient(client.id)
                                      setEditingClient(fullClient)
                                      setClientDialogOpen(true)
                                  } catch {
                                      // fallback: use minimal client data
                                      setEditingClient(client as Client)
                                      setClientDialogOpen(true)
                                  }
                              }}>
                            {client.full_name}
                        </span>
                    )
                },
            },
            {
                header: t('reservations.table.period', 'Period'),
                accessorKey: 'pickup_datetime',
                cell: (props) => {
                    const reservation = props.row.original
                    return (
                        <div className="flex flex-col text-nowrap">
                            <span>
                                {formatDateTime(reservation.pickup_datetime)}
                            </span>
                            <span className="text-xs text-gray-400">
                                →{' '}
                                {formatDateTime(
                                    reservation.expected_return_datetime,
                                )}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: t('reservations.table.created', 'Created'),
                accessorKey: 'created_at',
                cell: (props) => (
                    <span className="text-nowrap text-gray-500 dark:text-gray-400">
                        {formatDateTime(props.row.original.created_at)}
                    </span>
                ),
            },
            {
                header: t('reservations.table.total', 'Total'),
                accessorKey: 'total_amount',
                cell: (props) => (
                    <span className="font-semibold heading-text text-nowrap">
                        {MAD(props.row.original.total_amount)}
                    </span>
                ),
            },
            {
                header: t('reservations.table.payment', 'Payment'),
                accessorKey: 'payment_status',
                cell: (props) => {
                    const status = props.row.original.payment_status
                    return (
                        <Tag
                            className={classNames(
                                'capitalize border-0',
                                tagToneClass[paymentStatusTone[status]],
                            )}
                        >
                            {t(`reservations.payment.${status}`, status)}
                        </Tag>
                    )
                },
            },
            {
                header: t('reservations.table.status', 'Status'),
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.row.original.status
                    return (
                        <Tag
                            className={classNames(
                                'capitalize border-0',
                                tagToneClass[reservationStatusTone[status]],
                            )}
                        >
                            {t(`reservations.status.${status}`, status)}
                        </Tag>
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: (props) => {
                    const reservation = props.row.original
                    const status = reservation.status
                    return (
                        <div className="flex items-center justify-end gap-1">
                            {['pending', 'reserved'].includes(status) && (
                                <Tooltip title={t('reservations.actions.confirm', 'Confirm')} placement="top">
                                    <Button
                                        size="sm"
                                        variant="subtle"
                                        icon={<LiTickCircle />}
                                        aria-label="Confirm reservation"
                                        onClick={() =>
                                            handleConfirm(reservation)
                                        }
                                    />
                                </Tooltip>
                            )}
                            {['confirmed', 'reserved'].includes(status) && (
                                <Tooltip title={t('reservations.actions.activate', 'Activate')} placement="top">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-success hover:bg-success-subtle"
                                        icon={<LiPlay />}
                                        aria-label="Activate reservation"
                                        onClick={() =>
                                            setActivating(reservation)
                                        }
                                    />
                                </Tooltip>
                            )}
                            {status === 'active' && (
                                <Tooltip title={t('reservations.actions.complete', 'Complete')} placement="top">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-primary hover:bg-primary-subtle"
                                        icon={<LiBoxTick />}
                                        aria-label="Complete reservation"
                                        onClick={() =>
                                            setCompleting(reservation)
                                        }
                                    />
                                </Tooltip>
                            )}
                            {['pending', 'confirmed', 'reserved'].includes(
                                status,
                            ) && (
                                <Tooltip title={t('reservations.actions.noShow', 'No show')} placement="top">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        icon={<LiUserCross />}
                                        aria-label="Mark reservation as no show"
                                        onClick={() =>
                                            setNoShowing(reservation)
                                        }
                                    />
                                </Tooltip>
                            )}
                            {[
                                'pending',
                                'confirmed',
                                'reserved',
                                'active',
                            ].includes(status) && (
                                <Tooltip title={t('reservations.actions.cancel', 'Cancel')} placement="top">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-error hover:bg-error-subtle"
                                        icon={<LiCross />}
                                        aria-label="Cancel reservation"
                                        onClick={() =>
                                            setCancelling(reservation)
                                        }
                                    />
                                </Tooltip>
                            )}
                            <Tooltip title={t('reservations.actions.invoice', 'Invoice')} placement="top">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-primary hover:bg-primary-subtle"
                                    icon={<LiReceipt />}
                                    aria-label="View invoice"
                                    onClick={() => {
                                        navigate(
                                            `${APPS_PREFIX_PATH}/reservations/${reservation.id}/facture`,
                                        )
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title={t('reservations.actions.edit', 'Edit')} placement="top">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    icon={<LiEdit />}
                                    aria-label="Edit reservation"
                                    onClick={() => {
                                        navigate(
                                            `${APPS_PREFIX_PATH}/reservations/${reservation.id}/modifier`,
                                        )
                                    }}
                                />
                            </Tooltip>
                        </div>
                    )
                },
            },
        ],
        [handleConfirm, navigate, t],
    )

    const statCards = useMemo(
        () => [
            {
                id: 'total',
                label: t('reservations.total', 'Total'),
                value: summary?.reservations.total ?? 0,
                icon: <LiBox />,
            },
            {
                id: 'pending',
                label: t('reservations.status.pending', 'Pending'),
                value: summary?.reservations.by_status.pending ?? 0,
                icon: <LiBoxTime />,
            },
            {
                id: 'active',
                label: t('reservations.status.active', 'Active'),
                value: summary?.reservations.by_status.active ?? 0,
                icon: <LiCar />,
            },
            {
                id: 'completed',
                label: t('reservations.status.completed', 'Completed'),
                value: summary?.reservations.by_status.completed ?? 0,
                icon: <LiBoxTick />,
            },
        ],
        [summary, t],
    )

    const csvData = useMemo(
        () =>
            reservations.map((reservation) => ({
                reservation_number: reservation.reservation_number,
                status: reservation.status,
                payment_status: reservation.payment_status,
                car: reservation.car?.registration_number ?? '—',
                client: reservation.primary_client?.full_name ?? '—',
                pickup_datetime: formatDateTime(reservation.pickup_datetime),
                expected_return_datetime: formatDateTime(
                    reservation.expected_return_datetime,
                ),
                created_at: formatDateTime(reservation.created_at),
                total_amount: reservation.total_amount,
            })),
        [reservations],
    )

    const getSortButtonLabel = () => {
        const field = sortableFields.find((item) => item.key === sortBy)
        return field ? `${t('reservations.sortBy', 'Sort by')}: ${field.label}` : t('reservations.sort', 'Sort')
    }

    const handleResetSort = () => {
        setSortBy('')
        setSortDir('desc')
    }

    return (
        <Container className="">
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <h4>Reservations</h4>
                    <div className="flex items-center gap-2">
                        <Dropdown
                            placement="bottom-end"
                            menuClass="min-w-[180px]"
                            renderTitle={
                                <Button>
                                    {larger.sm
                                        ? rangeOptions(t).find(
                                              (option) =>
                                                  option.value === range,
                                          )?.label
                                        : `${range}d`}
                                </Button>
                            }
                        >
                            {rangeOptions(t).map((option) => (
                                <Dropdown.Item
                                    key={option.value}
                                    onClick={() => {
                                        setRange(option.value)
                                        setPageIndex(1)
                                    }}
                                    active={range === option.value}
                                >
                                    <span className="flex items-center justify-between w-full">
                                        <span>{option.label}</span>
                                        {range === option.value && (
                                            <LiTickCircle />
                                        )}
                                    </span>
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                        <CSVLink
                            filename="reservations.csv"
                            data={csvData}
                            headers={csvHeaders}
                        >
                            <Button icon={<LiDownload />}>
                                {larger.sm && t('reservations.export', 'Export')}
                            </Button>
                        </CSVLink>
                        <Button
                            variant="solid"
                            icon={<LiAdd />}
                            onClick={() => {
                                setEditing(null)
                                setDialogOpen(true)
                            }}
                        >
                            {larger.sm && t('reservations.newReservation', 'New reservation')}
                        </Button>
                    </div>
                </div>

                <StatCards items={statCards} loading={summaryLoading} />

                <Tabs
                    value={statusFilter}
                    onChange={(val) => {
                        setStatusFilter(val)
                        setPageIndex(1)
                        setExpandedId(null)
                    }}
                >
                    <TabList>
                        <TabNav value="">{t('reservations.all', 'All')}</TabNav>
                        <TabNav value="pending">{t('reservations.status.pending', 'Pending')}</TabNav>
                        <TabNav value="confirmed">{t('reservations.status.confirmed', 'Confirmed')}</TabNav>
                        <TabNav value="reserved">{t('reservations.status.reserved', 'Reserved')}</TabNav>
                        <TabNav value="active">{t('reservations.status.active', 'Active')}</TabNav>
                        <TabNav value="completed">{t('reservations.status.completed', 'Completed')}</TabNav>
                        <TabNav value="cancelled">{t('reservations.status.cancelled', 'Cancelled')}</TabNav>
                        <TabNav value="no_show">{t('reservations.status.no_show', 'No Show')}</TabNav>
                    </TabList>
                </Tabs>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 sm:flex-none sm:min-w-[250px]">
                        <DebouceInput
                            prefix={<LiSearch className="heading-text" />}
                            placeholder={t('reservations.searchPlaceholder', 'Search reservations…')}
                            onChange={(e) => {
                                setQ(e.target.value)
                                setPageIndex(1)
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Segment
                            value={viewMode}
                            onChange={(value) =>
                                setViewMode(value as 'card' | 'table')
                            }
                        >
                            <Segment.Item value="card" className="px-2">
                                <LiElement3 />
                            </Segment.Item>
                            <Segment.Item value="table" className="px-2">
                                <LiTextAlignLeft />
                            </Segment.Item>
                        </Segment>
                        <Dropdown
                            placement="bottom-end"
                            renderTitle={
                                <Button
                                    icon={<LiChevronDown />}
                                    iconAlignment="end"
                                >
                                    {larger.sm ? (
                                        <span className="flex items-center gap-1">
                                            {t('reservations.paymentFilter', 'Payment')}{': '}
                                            {
                                                paymentStatusFilterOptions(t).find(
                                                    (option) =>
                                                        option.value ===
                                                        paymentStatusFilter,
                                                )?.label
                                            }
                                        </span>
                                    ) : (
                                        'Payment'
                                    )}
                                </Button>
                            }
                        >
                            {paymentStatusFilterOptions(t).map((option) => (
                                <Dropdown.Item
                                    key={option.value}
                                    onClick={() => {
                                        setPaymentStatusFilter(option.value)
                                        setPageIndex(1)
                                    }}
                                    active={
                                        paymentStatusFilter === option.value
                                    }
                                >
                                    <span className="flex items-center justify-between w-full">
                                        <span>{option.label}</span>
                                        {paymentStatusFilter ===
                                            option.value && <LiTickCircle />}
                                    </span>
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                        <Dropdown
                            placement="bottom-end"
                            renderTitle={
                                <Button
                                    icon={
                                        sortDir === 'asc' ? (
                                            <LiArrowUp />
                                        ) : (
                                            <LiArrowDown />
                                        )
                                    }
                                >
                                    {larger.sm ? (
                                        <span className="flex items-center gap-1">
                                            {getSortButtonLabel()}
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                </Button>
                            }
                        >
                            <div className="mb-1">
                                <Segment
                                    value={sortDir}
                                    className="w-full"
                                    onChange={(value) =>
                                        setSortDir(value as 'asc' | 'desc')
                                    }
                                >
                                    <Segment.Item value="asc">
                                        <span className="flex items-center gap-1">
                                            <LiArrowUp />
                                            <span>Asc</span>
                                        </span>
                                    </Segment.Item>
                                    <Segment.Item value="desc">
                                        <span className="flex items-center gap-1">
                                            <LiArrowDown />
                                            <span>Desc</span>
                                        </span>
                                    </Segment.Item>
                                </Segment>
                            </div>
                            {sortableFields.map((field) => (
                                <Dropdown.Item
                                    key={field.key}
                                    onClick={() => {
                                        setSortBy(field.key)
                                        setPageIndex(1)
                                    }}
                                    active={sortBy === field.key}
                                >
                                    <span className="flex items-center justify-between w-full">
                                        <span>{field.label}</span>
                                        {sortBy === field.key && (
                                            <LiTickCircle />
                                        )}
                                    </span>
                                </Dropdown.Item>
                            ))}
                            {sortBy && (
                                <>
                                    <Dropdown.Item variant="divider" />
                                    <Dropdown.Item onClick={handleResetSort}>
                                        <span className="text-error">
                                            {t('reservations.resetSort', 'Reset Sort')}
                                        </span>
                                    </Dropdown.Item>
                                </>
                            )}
                        </Dropdown>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <DataTable
                        compact
                        verticalDivider={{
                            head: true,
                            body: true,
                            footer: true,
                        }}
                        overflowClass="rounded-xs border border-gray-300 dark:border-gray-600"
                        columns={columns}
                        data={reservations}
                        loading={loading}
                        noData={!loading && reservations.length === 0}
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
                ) : loading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Card key={index}>
                                <div className="flex justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton
                                                variant="circle"
                                                className="w-6 h-6"
                                            />
                                            <Skeleton className="w-24 h-2" />
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Skeleton className="w-16 h-2" />
                                            <Skeleton className="w-16 h-2" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <Skeleton className="w-20" />
                                        <Skeleton className="w-10" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : reservations.length === 0 ? (
                    <div className="text-center py-16">
                        <h6 className="font-semibold mb-1">
                            No reservations found
                        </h6>
                        <p className="text-sm text-gray-400">
                            Try widening the filters or create a new
                            reservation.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {reservations.map((reservation) => (
                                <Card
                                    key={reservation.id}
                                    className={classNames(
                                        expandedId !== reservation.id &&
                                            'print:hidden',
                                    )}
                                    footer={{
                                        className: 'p-0 border-dashed',
                                        content: (
                                            <ExpandableReservationDetails
                                                reservation={reservation}
                                                expand={
                                                    expandedId ===
                                                    reservation.id
                                                }
                                                onExpand={() =>
                                                    handleExpand(reservation.id)
                                                }
                                                onConfirm={handleConfirm}
                                                onActivate={setActivating}
                                                onComplete={setCompleting}
                                                onCancel={setCancelling}
                                                onNoShow={setNoShowing}
                                                onEdit={(res) => {
                                                    navigate(
                                                        `${APPS_PREFIX_PATH}/reservations/${res.id}/modifier`,
                                                    )
                                                }}
                                                onInvoice={(res) => {
                                                    navigate(
                                                        `${APPS_PREFIX_PATH}/reservations/${res.id}/facture`,
                                                    )
                                                }}
                                            />
                                        ),
                                    }}
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="print:hidden">
                                                    <Avatar
                                                        size={20}
                                                        className={classNames(
                                                            'border-0',
                                                            getReservationCardMap(t)[
                                                                reservation
                                                                    .status
                                                            ]?.bg,
                                                            'text-white',
                                                        )}
                                                        icon={
                                                            <span className="text-base">
                                                                {
                                                                    getReservationCardMap(t)[
                                                                        reservation
                                                                            .status
                                                                    ]?.icon
                                                                }
                                                            </span>
                                                        }
                                                    />
                                                </div>
                                                <h6>
                                                    #
                                                    {
                                                        reservation.reservation_number
                                                    }
                                                </h6>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2 mt-2">
                                                <span className="font-medium">
                                                    {
                                                        getReservationCardMap(t)[
                                                            reservation.status
                                                        ]?.label
                                                    }
                                                </span>
                                                <span className="hidden sm:inline">
                                                    •
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <LiCalendar className="text-base" />
                                                    <span className="leading-none font-medium">
                                                        {formatDateTime(
                                                            reservation.pickup_datetime,
                                                        )}
                                                    </span>
                                                </span>
                                                <span className="hidden sm:inline">
                                                    •
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <LiCar className="text-base" />
                                                    <span className="leading-none font-medium">
                                                        {reservation.car
                                                            ?.registration_number ??
                                                            '—'}
                                                    </span>
                                                </span>
                                                <span className="hidden sm:inline">
                                                    •
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <LiUser className="text-base" />
                                                    <span className="leading-none font-medium">
                                                        {reservation
                                                            .primary_client
                                                            ?.full_name ?? '—'}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <h6>
                                                    {MAD(
                                                        reservation.total_amount,
                                                    )}
                                                </h6>
                                                <div className="flex justify-end">
                                                    <Tag
                                                        className={classNames(
                                                            'bg-transparent capitalize',
                                                            paymentTextColor[
                                                                reservation
                                                                    .payment_status
                                                            ],
                                                        )}
                                                    >
                                                        {
                                                            reservation.payment_status
                                                        }
                                                    </Tag>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <div className="py-4 flex justify-between">
                            <Pagination
                                pageSize={pageSize}
                                currentPage={pageIndex}
                                total={total}
                                onChange={(page) => setPageIndex(page)}
                            />
                            <Select
                                size="sm"
                                className="w-[120px]"
                                placement="top"
                                isSearchable={false}
                                value={
                                    pageSizeOption.find(
                                        (option) => option.value === pageSize,
                                    ) ?? null
                                }
                                options={pageSizeOption}
                                onChange={(option) => {
                                    if (option?.value) {
                                        setPageSize(option.value)
                                        setPageIndex(1)
                                    }
                                }}
                            />
                        </div>
                    </>
                )}
            </div>

            <ReservationFormDialog
                open={dialogOpen}
                reservation={editing}
                onClose={() => setDialogOpen(false)}
                onSaved={fetchReservations}
            />

            <CancelDialog
                reservation={cancelling}
                onClose={() => setCancelling(null)}
                onCancelled={fetchReservations}
            />

            <NoShowDialog
                reservation={noShowing}
                onClose={() => setNoShowing(null)}
                onNoShow={fetchReservations}
            />

            <ActivateDialog
                reservation={activating}
                onClose={() => setActivating(null)}
                onActivated={fetchReservations}
            />

            <CompleteDialog
                reservation={completing}
                onClose={() => setCompleting(null)}
                onCompleted={fetchReservations}
            />

            <ClientFormDialog
                open={clientDialogOpen}
                client={editingClient}
                onClose={() => {
                    setClientDialogOpen(false)
                    setEditingClient(null)
                }}
                onSaved={fetchReservations}
            />
        </Container>
    )
}

export default Reservations
