import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Tag from '@/components/ui/Tag'
import { apiGetDashboardSummary } from '@/services/LocationService'
import type { DashboardSummary } from '@/@types/location'
import {
    MAD,
    carStatusTone,
    reservationStatusTone,
    tagToneClass,
} from './shared'

type KpiProps = {
    label: string
    value: string
    hint: string
    tone: 'success' | 'error' | 'warning' | 'primary' | 'default'
}

const KpiCard = ({ label, value, hint, tone }: KpiProps) => {
    return (
        <Card className="rounded-xl">
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {label}
                </span>
                <div className="flex items-center justify-between">
                    <strong className="text-2xl font-bold dark:text-gray-100">
                        {value}
                    </strong>
                    <span
                        className={`h-9 w-9 rounded-full ${tagToneClass[tone]}`}
                    />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                    {hint}
                </span>
            </div>
        </Card>
    )
}

type StatusSplitProps = {
    title: string
    items: Array<{
        label: string
        count: number
        tone: 'success' | 'error' | 'warning' | 'primary' | 'default'
    }>
}

const StatusSplit = ({ title, items }: StatusSplitProps) => {
    const max = Math.max(1, ...items.map((item) => item.count))
    return (
        <Card
            className="rounded-xl h-full"
            header={{ content: title }}
            bodyClass="flex flex-col gap-3"
        >
            {items.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                        <span className="capitalize text-gray-600 dark:text-gray-300">
                            {item.label}
                        </span>
                        <span className="font-semibold dark:text-gray-200">
                            {item.count}
                        </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                            className={`h-full rounded-full ${tagToneClass[item.tone].split(' ')[0]}`}
                            style={{ width: `${(item.count / max) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </Card>
    )
}

const LocationDashboard = () => {
    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        setLoading(true)
        apiGetDashboardSummary()
            .then((data) => {
                if (mounted) {
                    setSummary(data)
                }
            })
            .catch(() => {
                if (mounted) {
                    setSummary(null)
                }
            })
            .finally(() => {
                if (mounted) {
                    setLoading(false)
                }
            })
        return () => {
            mounted = false
        }
    }, [])

    if (loading) {
        return (
            <Container className="flex h-full items-center justify-center p-8">
                <Spinner size="40px" />
            </Container>
        )
    }

    const s = summary

    return (
        <Container className="p-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold dark:text-gray-100">
                            Rental Dashboard
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {s
                                ? `${s.period.from} → ${s.period.to}`
                                : 'Summary unavailable'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard
                        label="Net revenue"
                        value={s ? MAD(s.revenue.net) : '—'}
                        hint={
                            s
                                ? `Paid ${MAD(s.revenue.paid)} · Pending ${MAD(s.revenue.pending)}`
                                : ''
                        }
                        tone="success"
                    />
                    <KpiCard
                        label="Expenses"
                        value={s ? MAD(s.expenses.total) : '—'}
                        hint={
                            s
                                ? `${s.expenses.overdue_count} overdue · ${MAD(s.expenses.pending)} pending`
                                : ''
                        }
                        tone="error"
                    />
                    <KpiCard
                        label="Reservations"
                        value={s ? String(s.reservations.total) : '—'}
                        hint={
                            s
                                ? `${s.reservations.currently_active} currently active`
                                : ''
                        }
                        tone="primary"
                    />
                    <KpiCard
                        label="Fleet"
                        value={s ? String(s.fleet.total_cars) : '—'}
                        hint={
                            s
                                ? `${s.fleet.currently_rented} rented · ${Math.round(s.occupancy.rate * 100)}% occupancy`
                                : ''
                        }
                        tone="warning"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <StatusSplit
                        title="Reservations by status"
                        items={
                            s
                                ? Object.entries(s.reservations.by_status).map(
                                      ([status, count]) => ({
                                          label: status,
                                          count,
                                          tone: reservationStatusTone[
                                              status as keyof typeof reservationStatusTone
                                          ],
                                      }),
                                  )
                                : []
                        }
                    />
                    <StatusSplit
                        title="Fleet by status"
                        items={
                            s
                                ? Object.entries(s.fleet.by_status).map(
                                      ([status, count]) => ({
                                          label: status,
                                          count,
                                          tone: carStatusTone[
                                              status as keyof typeof carStatusTone
                                          ],
                                      }),
                                  )
                                : []
                        }
                    />
                </div>

                {s && (
                    <Card
                        className="rounded-xl"
                        header={{ content: 'Details' }}
                        bodyClass="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 text-sm"
                    >
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 dark:text-gray-400">
                                Refunded
                            </span>
                            <strong className="dark:text-gray-100">
                                {MAD(s.revenue.refunded)}
                            </strong>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 dark:text-gray-400">
                                Net
                            </span>
                            <strong className="dark:text-gray-100">
                                {MAD(s.net)}
                            </strong>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 dark:text-gray-400">
                                Booked days
                            </span>
                            <strong className="dark:text-gray-100">
                                {s.occupancy.booked_days}
                            </strong>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 dark:text-gray-400">
                                Available days
                            </span>
                            <strong className="dark:text-gray-100">
                                {s.occupancy.available_days}
                            </strong>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 dark:text-gray-400">
                                All-time reservations
                            </span>
                            <strong className="dark:text-gray-100">
                                {typeof s.reservations.total === 'number'
                                    ? s.reservations.total
                                    : 0}
                            </strong>
                        </div>
                    </Card>
                )}

                {!s && (
                    <Card className="rounded-xl">
                        <div className="flex items-center justify-center gap-2 p-6 text-sm text-gray-500">
                            <Tag className={tagToneClass.error}>
                                Failed to load summary
                            </Tag>
                        </div>
                    </Card>
                )}
            </div>
        </Container>
    )
}

export default LocationDashboard
