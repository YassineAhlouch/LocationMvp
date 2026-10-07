import dayjs from 'dayjs'
import formatCurrency from '@/utils/formatCurrency'
import type {
    CarStatus,
    ClientStatus,
    ExpenseStatus,
    ExpenseType,
    ReservationStatus,
    SelectOption,
    TransmissionType,
    FuelType,
    ClientSource,
    PaymentStatus,
} from '@/@types/location'

/** Format a MAD amount like the rest of the dashboard. */
export const MAD = (value: number | null | undefined) =>
    formatCurrency(Number(value ?? 0), 'MAD', 'fr-MA', 2)

export const formatDateTime = (value?: string | null) =>
    value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '—'

type ApiError = { response?: { data?: { message?: string } } }

/** Surface the backend's validation/domain message, else a fallback. */
export const apiErrorMessage = (error: unknown, fallback: string) =>
    (error as ApiError)?.response?.data?.message ?? fallback

export const formatDate = (value?: string | null) =>
    value ? dayjs(value).format('DD/MM/YYYY') : '—'

export type TagTone = 'success' | 'error' | 'warning' | 'primary' | 'default'

export const tagToneClass: Record<TagTone, string> = {
    success: 'bg-success-subtle text-success border-0',
    error: 'bg-error-subtle text-error border-0',
    warning: 'bg-warning-subtle text-warning border-0',
    primary: 'bg-primary-subtle text-primary border-0',
    default: '',
}

export const carStatusTone: Record<CarStatus, TagTone> = {
    available: 'success',
    reserved: 'primary',
    rented: 'warning',
    maintenance: 'error',
    inactive: 'default',
}

export const reservationStatusTone: Record<ReservationStatus, TagTone> = {
    pending: 'warning',
    confirmed: 'primary',
    active: 'success',
    completed: 'default',
    cancelled: 'error',
}

export const clientStatusTone: Record<ClientStatus, TagTone> = {
    normal: 'success',
    vip: 'primary',
    blacklist: 'error',
}

export const expenseStatusTone: Record<ExpenseStatus, TagTone> = {
    paid: 'success',
    pending: 'warning',
    overdue: 'error',
}

export const paymentStatusTone: Record<PaymentStatus, TagTone> = {
    paid: 'success',
    partial: 'warning',
    unpaid: 'error',
}

export const carStatusOptions: SelectOption<CarStatus>[] = [
    { value: 'available', label: 'Available' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inactive', label: 'Inactive' },
]

export const transmissionOptions: SelectOption<TransmissionType>[] = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' },
]

export const fuelOptions: SelectOption<FuelType>[] = [
    { value: 'diesel', label: 'Diesel' },
    { value: 'petrol', label: 'Petrol' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' },
]

export const clientStatusOptions: SelectOption<ClientStatus>[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'vip', label: 'VIP' },
    { value: 'blacklist', label: 'Blacklist' },
]

export const clientSourceOptions: SelectOption<ClientSource>[] = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'referral', label: 'Referral' },
    { value: 'phone', label: 'Phone' },
    { value: 'walk_in', label: 'Walk-in' },
    { value: 'other', label: 'Other' },
]

export const expenseTypeOptions: SelectOption<ExpenseType>[] = [
    { value: 'insurance', label: 'Insurance' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'repair', label: 'Repair' },
    { value: 'tax', label: 'Tax' },
    { value: 'oil_change', label: 'Oil change' },
    { value: 'tires', label: 'Tires' },
    { value: 'inspection', label: 'Inspection' },
]

export const expenseStatusOptions: SelectOption<'pending' | 'paid'>[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
]

export const reservationStatusOptions: SelectOption<ReservationStatus>[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
]

export const paymentStatusOptions: SelectOption<PaymentStatus>[] = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'partial', label: 'Partial' },
    { value: 'paid', label: 'Paid' },
]