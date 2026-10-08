import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import Tag from '@/components/ui/Tag'
import {
    LiBank,
    LiBoxAdd,
    LiCalendar,
    LiMoneyChange,
    LiPenTool,
    LiRefresh,
    LiRepeat,
    LiTag,
} from '@/icons'
import { apiGetReservationChanges } from '@/services/LocationService'
import type {
    ReservationChange,
    ReservationChangeType,
} from '@/@types/location'
import {
    apiErrorMessage,
    formatDateTime,
    tagToneClass,
} from './shared'
import type { TagTone } from './shared'

type ReservationHistoryProps = {
    reservationId: number
}

export type ChangeTypeMeta = {
    label: string
    tone: TagTone
    Icon: ComponentType<{ className?: string }>
}

export const changeTypeMeta: Record<ReservationChangeType, ChangeTypeMeta> = {
    creation: { label: 'Created', tone: 'primary', Icon: LiBoxAdd },
    status_change: { label: 'Status change', tone: 'purple', Icon: LiRefresh },
    extension: { label: 'Extended', tone: 'success', Icon: LiCalendar },
    discount: { label: 'Discount', tone: 'warning', Icon: LiMoneyChange },
    date_change: { label: 'Date change', tone: 'neutral', Icon: LiRepeat },
    manual_edit: { label: 'Manual edit', tone: 'default', Icon: LiPenTool },
    pricing_update: { label: 'Pricing update', tone: 'warning', Icon: LiTag },
    payment: { label: 'Payment', tone: 'success', Icon: LiBank },
}

/** Fallback for change types added on the backend after this build. */
export const fallbackMeta: ChangeTypeMeta = {
    label: 'Change',
    tone: 'default',
    Icon: LiPenTool,
}

export const fieldLabels: Record<string, string> = {
    status: 'Status',
    pickup_datetime: 'Pickup date',
    expected_return_datetime: 'Return date',
    actual_return_datetime: 'Actual return',
    daily_rate: 'Daily rate',
    discount_amount: 'Discount',
    deposit_amount: 'Deposit',
    car_id: 'Car',
    primary_client_id: 'Primary client',
    secondary_client_id: 'Secondary client',
    pickup_location: 'Pickup location',
    return_location: 'Return location',
    remarks: 'Remarks',
    paid_amount: 'Paid amount',
    payment_status: 'Payment status',
    total_amount: 'Total',
}

export const formatValue = (
    value: string | null,
    field: string,
): string | null => {
    if (value === null || value === undefined) {
        return null
    }
    const trimmed = value.trim()
    if (trimmed === '' || trimmed === 'null') {
        return null
    }
    if (field === 'status' || field === 'payment_status') {
        return trimmed
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase())
    }
    return trimmed
}

const ReservationHistory = ({ reservationId }: ReservationHistoryProps) => {
    const [changes, setChanges] = useState<ReservationChange[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!reservationId) {
            setLoading(false)
            return
        }
        let active = true
        setLoading(true)
        setError(null)
        apiGetReservationChanges(reservationId)
            .then((list) => {
                if (active) {
                    setChanges(list)
                }
            })
            .catch((err) => {
                if (active) {
                    setError(
                        apiErrorMessage(err, 'Could not load the history'),
                    )
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false)
                }
            })
        return () => {
            active = false
        }
    }, [reservationId])

    return (
        <div>
            <div className="mb-5 flex items-center justify-between gap-2">
                <div>
                    <h6 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        History
                    </h6>
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        Changes on this reservation
                    </p>
                </div>
                {!loading && !error && (
                    <Tag className="rounded-full">{changes.length}</Tag>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[0, 1, 2].map((n) => (
                        <div key={n} className="flex gap-3">
                            <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <p className="text-sm text-error">{error}</p>
            ) : changes.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    No changes recorded yet.
                </p>
            ) : (
                <ol>
                    {changes.map((change, index) => {
                        const meta = changeTypeMeta[change.change_type]
                            ? changeTypeMeta[change.change_type]
                            : fallbackMeta
                        const Icon = meta.Icon
                        const field = fieldLabels[change.field_name]
                        const oldValue = formatValue(
                            change.old_value,
                            change.field_name,
                        )
                        const newValue = formatValue(
                            change.new_value,
                            change.field_name,
                        )
                        return (
                            <li
                                key={change.id}
                                className="relative flex gap-3 pb-6 last:pb-0"
                            >
                                {index < changes.length - 1 && (
                                    <span className="absolute left-4 top-9 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                                )}
                                <span
                                    className={`z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base ${tagToneClass[meta.tone]}`}
                                >
                                    <Icon />
                                </span>
                                <div className="min-w-0 flex-1 pt-0.5">
                                    <div className="flex flex-wrap items-center justify-between gap-x-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                            {meta.label}
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            {formatDateTime(change.created_at)}
                                        </span>
                                    </div>
                                    {field && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            {field}
                                            {change.created_by?.full_name &&
                                                ` · by ${change.created_by.full_name}`}
                                        </p>
                                    )}
                                    {(oldValue || newValue) && (
                                        <p className="mt-1 flex flex-wrap items-center gap-1 text-sm">
                                            {oldValue && (
                                                <span className="text-gray-400 line-through dark:text-gray-500">
                                                    {oldValue}
                                                </span>
                                            )}
                                            {oldValue && newValue && (
                                                <span className="text-gray-400 dark:text-gray-500">
                                                    →
                                                </span>
                                            )}
                                            {newValue && (
                                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                                    {newValue}
                                                </span>
                                            )}
                                        </p>
                                    )}
                                    {change.reason && (
                                        <p className="mt-1.5 rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                            “{change.reason}”
                                        </p>
                                    )}
                                </div>
                            </li>
                        )
                    })}
                </ol>
            )}
        </div>
    )
}

export default ReservationHistory