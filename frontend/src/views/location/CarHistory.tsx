import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { LiCar } from '@/icons'
import { apiGetCarHistory } from '@/services/LocationService'
import {
    changeTypeMeta,
    fallbackMeta,
    fieldLabels,
    formatValue,
} from './ReservationHistory'
import { apiErrorMessage, formatDateTime, tagToneClass } from './shared'
import type { CarHistoryEntry } from '@/@types/location'

type CarHistoryProps = {
    carId: number
}

type HistoryFilter = 'all' | 'car' | 'reservation'

const carActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
        created: 'Vehicle created',
        updated: 'Vehicle updated',
        deleted: 'Vehicle deleted',
    }
    return (
        labels[action] ??
        action
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase())
    )
}

const CarHistory = ({ carId }: CarHistoryProps) => {
    const [entries, setEntries] = useState<CarHistoryEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filter, setFilter] = useState<HistoryFilter>('all')

    useEffect(() => {
        let active = true
        setLoading(true)
        setError(null)
        apiGetCarHistory(carId)
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
    }, [carId])

    const visible = useMemo(
        () =>
            filter === 'all'
                ? entries
                : entries.filter((entry) => entry.source === filter),
        [entries, filter],
    )

    return (
        <Card bodyClass="p-4">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h6 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        History
                    </h6>
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        Vehicle activity and reservation changes
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
                            All
                        </Button>
                        <Button
                            size="sm"
                            active={filter === 'car'}
                            clickFeedback={false}
                            onClick={() => setFilter('car')}
                        >
                            Vehicle
                        </Button>
                        <Button
                            size="sm"
                            active={filter === 'reservation'}
                            clickFeedback={false}
                            onClick={() => setFilter('reservation')}
                        >
                            Reservations
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
                    No history recorded yet.
                </p>
            ) : (
                <ol>
                    {visible.map((entry, index) => {
                        const isCar = entry.source === 'car'
                        const meta = isCar ? null : changeTypeMeta[entry.change_type] ?? fallbackMeta
                        const Icon = isCar ? LiCar : meta!.Icon
                        const tone = isCar ? 'primary' : meta!.tone
                        const label = isCar
                            ? carActionLabel(entry.action)
                            : meta!.label
                        const field = isCar
                            ? undefined
                            : fieldLabels[entry.field_name]
                        const oldValue = isCar
                            ? null
                            : formatValue(entry.old_value, entry.field_name)
                        const newValue = isCar
                            ? null
                            : formatValue(entry.new_value, entry.field_name)

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

                                    {isCar ? (
                                        entry.description && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {entry.description}
                                                {entry.user?.full_name &&
                                                    ` · by ${entry.user.full_name}`}
                                            </p>
                                        )
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
                                                {field && (
                                                    <span>
                                                        {entry.reservation
                                                            ? ' · '
                                                            : ''}
                                                        {field}
                                                    </span>
                                                )}
                                                {entry.user?.full_name &&
                                                    ` · by ${entry.user.full_name}`}
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
