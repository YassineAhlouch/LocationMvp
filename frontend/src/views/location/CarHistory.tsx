import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { LiBank, LiCar, LiWalletMoney } from '@/icons'
import { apiGetCarHistory } from '@/services/LocationService'
import useTranslation from '@/utils/hooks/useTranslation'
import {
    changeTypeMeta,
    fallbackMeta,
    fieldLabels,
    formatValue,
} from './ReservationHistory'
import { money } from './shared'
import {
    apiErrorMessage,
    formatDate,
    formatDateTime,
    tagToneClass,
} from './shared'
import type { CarHistoryEntry, HistoryChange } from '@/@types/location'
import type { DateRange } from '@/components/shared/PeriodPicker'

type CarHistoryProps = {
    carId: number
    range: DateRange
}

type HistoryFilter = 'all' | 'car' | 'reservation' | 'expense' | 'payment'

type AuditSource = 'car' | 'expense' | 'payment'

/** Human fallbacks for car/expense/payment field names. */
const historyFieldLabels: Record<string, string> = {
    registration_number: 'Registration',
    daily_price: 'Daily price',
    purchase_price: 'Purchase price',
    insurance_company: 'Insurer',
    insurance_policy_number: 'Policy number',
    insurance_expiry_date: 'Insurance expiry',
    technical_inspection_expiry: 'Technical inspection',
    current_mileage: 'Mileage',
    current_fuel_level: 'Fuel level',
    next_service_mileage: 'Next service (km)',
    last_maintenance_at: 'Last maintenance',
    is_active: 'Active',
    notes: 'Notes',
    type: 'Type',
    title: 'Title',
    amount: 'Amount',
    vendor: 'Vendor',
    start_date: 'Start date',
    due_date: 'Due date',
    paid_date: 'Paid date',
    method: 'Method',
    reference: 'Reference',
    status: 'Status',
}

const moneyFields = new Set([
    'daily_price',
    'purchase_price',
    'amount',
    'daily_rate',
    'total_amount',
    'deposit_amount',
    'discount_amount',
    'paid_amount',
])

const dateFields = new Set([
    'insurance_expiry_date',
    'technical_inspection_expiry',
    'start_date',
    'due_date',
    'paid_date',
    'last_maintenance_at',
    'pickup_datetime',
    'expected_return_datetime',
    'actual_return_datetime',
])

const CarHistory = ({ carId, range }: CarHistoryProps) => {
    const { t } = useTranslation()
    const [entries, setEntries] = useState<CarHistoryEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filter, setFilter] = useState<HistoryFilter>('all')

    useEffect(() => {
        let active = true
        setLoading(true)
        setError(null)
        apiGetCarHistory(carId, {
            from: dayjs(range.from).format('YYYY-MM-DD'),
            to: dayjs(range.to).format('YYYY-MM-DD'),
        })
            .then((list) => {
                if (active) {
                    setEntries(list)
                }
            })
            .catch((err) => {
                if (active) {
                    setError(apiErrorMessage(err, 'Could not load the history'))
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
    }, [carId, range])

    const visible = useMemo(
        () =>
            filter === 'all'
                ? entries
                : entries.filter((entry) => entry.source === filter),
        [entries, filter],
    )

    /** Audit actions, localized with a humanized fallback. */
    const actionLabel = (source: AuditSource, action: string): string =>
        t(
            `cars.overview.history.${source}Action.${action}`,
            action
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase()),
        )

    /** Field names for audit diffs, localized with a humanized fallback. */
    const fieldLabel = (field: string): string =>
        t(
            `cars.overview.history.fields.${field}`,
            historyFieldLabels[field] ??
                field
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase()),
        )

    /** Values: money, dates and status labels go through their locale keys. */
    const formatChangeValue = (
        value: string | null,
        field: string,
        source: AuditSource | 'reservation',
    ): string | null => {
        const base = formatValue(value, field)
        if (!base) {
            return null
        }
        const raw = String(value ?? '').trim()
        if (moneyFields.has(field)) {
            return money(Number(raw))
        }
        if (dateFields.has(field)) {
            return formatDate(raw)
        }
        if (field === 'type') {
            return t(`expenses.type.${raw}`, base)
        }
        if (field === 'method') {
            return t(`payments.method.${raw}`, base)
        }
        if (field === 'is_active') {
            const on = raw === '1' || raw.toLowerCase() === 'true'
            return on ? t('common.yes', 'Yes') : t('common.no', 'No')
        }
        if (field === 'status') {
            if (source === 'expense') {
                return t(`expenses.status.${raw}`, base)
            }
            if (source === 'payment') {
                return t(`payments.status.${raw}`, base)
            }
            if (source === 'reservation') {
                return t(`reservations.status.${raw}`, base)
            }
            return t(`cars.status.${raw}`, base)
        }
        if (field === 'payment_status' && source === 'reservation') {
            return t(`reservations.payment.${raw}`, base)
        }
        return base
    }

    /** One field movement: label + old (struck) → new. */
    const ChangeLine = ({
        change,
        source,
    }: {
        change: HistoryChange
        source: AuditSource
    }) => {
        const oldValue = formatChangeValue(change.old, change.field, source)
        const newValue = formatChangeValue(change.new, change.field, source)

        return (
            <div className="flex flex-wrap items-center gap-1 text-sm">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                    {fieldLabel(change.field)}
                </span>
                {oldValue && (
                    <span className="text-gray-400 line-through dark:text-gray-500">
                        {oldValue}
                    </span>
                )}
                {oldValue && newValue && (
                    <span className="text-gray-400 dark:text-gray-500">→</span>
                )}
                {newValue ? (
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                        {newValue}
                    </span>
                ) : (
                    <span className="text-gray-400 dark:text-gray-500">—</span>
                )}
            </div>
        )
    }

    return (
        <Card bodyClass="p-4">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h6 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {t('cars.overview.history.title', 'History')}
                    </h6>
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        {t(
                            'cars.overview.history.subtitle',
                            'Every movement on this vehicle — updates, expenses, payments and reservations',
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <InputGroup>
                        <Button
                            size="sm"
                            active={filter === 'all'}
                            clickFeedback={false}
                            onClick={() => setFilter('all')}
                        >
                            {t('cars.overview.history.all', 'All')}
                        </Button>
                        <Button
                            size="sm"
                            active={filter === 'car'}
                            clickFeedback={false}
                            onClick={() => setFilter('car')}
                        >
                            {t('cars.overview.history.vehicle', 'Vehicle')}
                        </Button>
                        <Button
                            size="sm"
                            active={filter === 'reservation'}
                            clickFeedback={false}
                            onClick={() => setFilter('reservation')}
                        >
                            {t('cars.overview.history.reservations', 'Reservations')}
                        </Button>
                        <Button
                            size="sm"
                            active={filter === 'expense'}
                            clickFeedback={false}
                            onClick={() => setFilter('expense')}
                        >
                            {t('cars.overview.history.expenses', 'Expenses')}
                        </Button>
                        <Button
                            size="sm"
                            active={filter === 'payment'}
                            clickFeedback={false}
                            onClick={() => setFilter('payment')}
                        >
                            {t('cars.overview.history.payments', 'Payments')}
                        </Button>
                    </InputGroup>
                    {!loading && !error && (
                        <Tag className="rounded-full">{visible.length}</Tag>
                    )}
                </div>
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
            ) : visible.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t('cars.overview.history.empty', 'No history recorded yet.')}
                </p>
            ) : (
                <ol>
                    {visible.map((entry, index) => {
                        const audit =
                            entry.source === 'car' ||
                            entry.source === 'expense' ||
                            entry.source === 'payment'
                        const meta = !audit
                            ? changeTypeMeta[entry.change_type] ?? fallbackMeta
                            : null
                        const Icon = entry.source === 'car'
                            ? LiCar
                            : entry.source === 'expense'
                                ? LiWalletMoney
                                : entry.source === 'payment'
                                    ? LiBank
                                    : meta!.Icon
                        const tone = entry.source === 'car'
                            ? 'primary'
                            : entry.source === 'expense'
                                ? 'warning'
                                : entry.source === 'payment'
                                    ? 'success'
                                    : meta!.tone
                        const label = audit
                            ? actionLabel(entry.source, entry.action)
                            : t(
                                  `cars.overview.history.changeType.${entry.change_type}`,
                                  meta!.label,
                              )
                        const by = entry.user?.full_name
                            ? ` · ${t('cars.overview.history.by', 'by')} ${entry.user.full_name}`
                            : ''

                        // Context line: what the movement is about — the
                        // expense title, the reservation number, or the raw
                        // audit description as a fallback.
                        const contextTitle =
                            entry.source === 'expense'
                                ? entry.expense?.title
                                : entry.source === 'payment'
                                    ? entry.payment?.reservation_number
                                    : null

                        const oldValue = !audit
                            ? formatChangeValue(
                                  entry.old_value,
                                  entry.field_name,
                                  'reservation',
                              )
                            : null
                        const newValue = !audit
                            ? formatChangeValue(
                                  entry.new_value,
                                  entry.field_name,
                                  'reservation',
                              )
                            : null

                        return (
                            <li
                                key={entry.id}
                                className="relative flex gap-3 pb-6 last:pb-0"
                            >
                                {index < visible.length - 1 && (
                                    <span className="absolute left-4 top-9 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                                )}
                                <span
                                    className={`z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base ${tagToneClass[tone]}`}
                                >
                                    <Icon />
                                </span>
                                <div className="min-w-0 flex-1 pt-0.5">
                                    <div className="flex flex-wrap items-center justify-between gap-x-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                            {label}
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            {formatDateTime(entry.created_at)}
                                        </span>
                                    </div>

                                    {audit ? (
                                        <>
                                            {contextTitle ? (
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    {entry.source ===
                                                        'payment' &&
                                                    entry.payment ? (
                                                        <Link
                                                            to={`${APPS_PREFIX_PATH}/reservations/${entry.payment.reservation_id}/modifier`}
                                                            className="font-medium text-primary hover:underline"
                                                        >
                                                            {contextTitle}
                                                        </Link>
                                                    ) : (
                                                        contextTitle
                                                    )}
                                                    {by}
                                                </p>
                                            ) : null}
                                            {entry.changes.length > 0 && (
                                                <div className="mt-1.5 space-y-1">
                                                    {entry.changes.map(
                                                        (change) => (
                                                            <ChangeLine
                                                                key={
                                                                    change.field
                                                                }
                                                                change={change}
                                                                source={
                                                                    entry.source
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                            {entry.changes.length === 0 &&
                                                entry.description && (
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                                        {entry.description}
                                                        {by}
                                                    </p>
                                                )}
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {entry.reservation && (
                                                    <Link
                                                        to={`${APPS_PREFIX_PATH}/reservations/${entry.reservation.id}/modifier`}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        {
                                                            entry.reservation
                                                                .reservation_number
                                                        }
                                                    </Link>
                                                )}
                                                {entry.field_name && (
                                                    <span>
                                                        {entry.reservation
                                                            ? ' · '
                                                            : ''}
                                                        {t(
                                                            `activity.field.${entry.field_name}`,
                                                            fieldLabels[
                                                                entry.field_name
                                                            ] ?? '',
                                                        )}
                                                    </span>
                                                )}
                                                {by}
                                            </p>
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
                                            {entry.reason && (
                                                <p className="mt-1.5 rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                    “{entry.reason}”
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </li>
                        )
                    })}
                </ol>
            )}
        </Card>
    )
}

export default CarHistory
