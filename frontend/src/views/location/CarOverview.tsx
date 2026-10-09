import { useEffect, useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { Link } from 'react-router'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Table from '@/components/ui/Table'
import Loading from '@/components/shared/Loading'
import { LineChart } from '@/components/shared/Chart'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { LiCalendar } from '@/icons'
import {
    LuArrowRightLeft,
    LuTrendingUp,
    LuWallet,
} from 'react-icons/lu'
import { apiGetCarOverview } from '@/services/LocationService'
import {
    MAD,
    expenseStatusTone,
    formatDate,
    formatDateTime,
    reservationStatusTone,
    tagToneClass,
} from './shared'
import type { CarOverview as CarOverviewData } from '@/@types/location'
import type { TagTone } from './shared'

const { Tr, Th, Td, THead, TBody } = Table

type CarOverviewProps = {
    carId: number
}

type KpiCardProps = {
    label: string
    value: string
    hint?: string
    tone: TagTone
    Icon: ComponentType<{ className?: string }>
}

const KpiCard = ({ label, value, hint, tone, Icon }: KpiCardProps) => (
    <Card bodyClass="p-4">
        <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
                <p className="truncate text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {label}
                </p>
                <h4 className="mt-1 dark:text-gray-100">{value}</h4>
                {hint && (
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {hint}
                    </p>
                )}
            </div>
            <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg ${tagToneClass[tone]}`}
            >
                <Icon />
            </span>
        </div>
    </Card>
)

const EmptyRow = ({ columns, label }: { columns: number; label: string }) => (
    <Tr>
        <Td colSpan={columns}>
            <span className="block py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                {label}
            </span>
        </Td>
    </Tr>
)

const CarOverview = ({ carId }: CarOverviewProps) => {
    const [overview, setOverview] = useState<CarOverviewData | null>(null)
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        let active = true
        setLoading(true)
        setFailed(false)
        apiGetCarOverview(carId)
            .then((res) => {
                if (active) {
                    setOverview(res)
                }
            })
            .catch(() => {
                if (active) {
                    setFailed(true)
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

    const chartData = useMemo(() => {
        if (!overview) {
            return []
        }
        return overview.stats.timeline.labels.map((label, index) => ({
            month: dayjs(label).format('MMM YY'),
            revenue: overview.stats.timeline.revenue[index] ?? 0,
            expenses: overview.stats.timeline.expenses[index] ?? 0,
        }))
    }, [overview])

    if (loading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Loading loading />
            </div>
        )
    }

    if (failed || !overview) {
        return (
            <Card bodyClass="p-6">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Could not load this vehicle&apos;s overview.
                </p>
            </Card>
        )
    }

    const { stats } = overview
    const maxTypeAmount = Math.max(
        1,
        ...stats.expenses.by_type.map((item) => item.amount),
    )

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <KpiCard
                    label="Reservations"
                    value={String(stats.reservations.total)}
                    hint={`${stats.reservations.active} active · ${stats.reservations.upcoming} upcoming`}
                    tone="primary"
                    Icon={LiCalendar}
                />
                <KpiCard
                    label="Revenue (paid)"
                    value={MAD(stats.revenue.paid)}
                    hint={`${MAD(stats.revenue.pending)} pending`}
                    tone="success"
                    Icon={LuWallet}
                />
                <KpiCard
                    label="Expenses (paid)"
                    value={MAD(stats.expenses.paid)}
                    hint={`${stats.expenses.overdue_count} overdue · ${MAD(stats.expenses.pending)} pending`}
                    tone="warning"
                    Icon={LuArrowRightLeft}
                />
                <KpiCard
                    label="Net margin"
                    value={MAD(stats.net)}
                    hint={`${stats.reservations.booked_days} days booked`}
                    tone={stats.net >= 0 ? 'success' : 'error'}
                    Icon={LuTrendingUp}
                />
            </div>

            <Card bodyClass="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h6>Revenue &amp; expenses</h6>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Last 12 months · paid cash-basis
                        </p>
                    </div>
                </div>
                <LineChart
                    data={chartData}
                    height={300}
                    xAxisConfig={{ dataKey: 'month' }}
                    lineConfig={[
                        {
                            type: 'monotone',
                            dataKey: 'revenue',
                            name: 'Revenue',
                            stroke: 'var(--success)',
                            strokeWidth: 2,
                            dot: false,
                        },
                        {
                            type: 'monotone',
                            dataKey: 'expenses',
                            name: 'Expenses',
                            stroke: 'var(--error)',
                            strokeWidth: 2,
                            dot: false,
                        },
                    ]}
                    tooltipContentConfig={{
                        valueFormatter: (value: number) => MAD(value),
                    }}
                />
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Card bodyClass="p-0">
                    <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                        <h6>Recent reservations</h6>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Latest bookings for this vehicle
                        </p>
                    </div>
                    <Table className="text-nowrap">
                        <THead>
                            <Tr>
                                <Th>Reservation</Th>
                                <Th>Client</Th>
                                <Th>Pickup</Th>
                                <Th>Status</Th>
                                <Th className="text-right">Total</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {overview.recent_reservations.length === 0 ? (
                                <EmptyRow
                                    columns={5}
                                    label="No reservations yet"
                                />
                            ) : (
                                overview.recent_reservations.map(
                                    (reservation) => (
                                        <Tr key={reservation.id}>
                                            <Td>
                                                <Link
                                                    to={`${APPS_PREFIX_PATH}/reservations/${reservation.id}/modifier`}
                                                    className="font-semibold text-primary hover:underline"
                                                >
                                                    {
                                                        reservation.reservation_number
                                                    }
                                                </Link>
                                            </Td>
                                            <Td>
                                                <span className="text-gray-700 dark:text-gray-200">
                                                    {reservation.primary_client
                                                        ?.full_name ?? '—'}
                                                </span>
                                            </Td>
                                            <Td>
                                                <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {formatDateTime(
                                                        reservation.pickup_datetime,
                                                    )}
                                                </span>
                                            </Td>
                                            <Td>
                                                <Tag
                                                    className={`capitalize ${tagToneClass[reservationStatusTone[reservation.status]]}`}
                                                >
                                                    {reservation.status.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </Tag>
                                            </Td>
                                            <Td className="text-right">
                                                <span className="whitespace-nowrap font-semibold dark:text-gray-100">
                                                    {MAD(
                                                        reservation.total_amount,
                                                    )}
                                                </span>
                                            </Td>
                                        </Tr>
                                    ),
                                )
                            )}
                        </TBody>
                    </Table>
                </Card>

                <Card bodyClass="p-0">
                    <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                        <h6>Recent expenses</h6>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Latest costs booked to this vehicle
                        </p>
                    </div>
                    <Table className="text-nowrap">
                        <THead>
                            <Tr>
                                <Th>Expense</Th>
                                <Th>Type</Th>
                                <Th>Date</Th>
                                <Th>Status</Th>
                                <Th className="text-right">Amount</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {overview.recent_expenses.length === 0 ? (
                                <EmptyRow
                                    columns={5}
                                    label="No expenses yet"
                                />
                            ) : (
                                overview.recent_expenses.map((expense) => {
                                    const status = expense.is_overdue
                                        ? 'overdue'
                                        : expense.status
                                    return (
                                        <Tr key={expense.id}>
                                            <Td>
                                                <span className="font-medium heading-text">
                                                    {expense.title}
                                                </span>
                                            </Td>
                                            <Td>
                                                <span className="capitalize text-gray-700 dark:text-gray-200">
                                                    {expense.type.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                            </Td>
                                            <Td>
                                                <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {formatDate(
                                                        expense.paid_date ??
                                                            expense.due_date,
                                                    )}
                                                </span>
                                            </Td>
                                            <Td>
                                                <Tag
                                                    className={`capitalize ${tagToneClass[expenseStatusTone[status]]}`}
                                                >
                                                    {status.replace('_', ' ')}
                                                </Tag>
                                            </Td>
                                            <Td className="text-right">
                                                <span className="whitespace-nowrap font-semibold dark:text-gray-100">
                                                    {MAD(expense.amount)}
                                                </span>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            )}
                        </TBody>
                    </Table>
                </Card>
            </div>

            <Card bodyClass="p-4">
                <div className="mb-4">
                    <h6>Spending by type</h6>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Lifetime paid + pending expenses
                    </p>
                </div>
                {stats.expenses.by_type.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        No expenses recorded for this vehicle.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {stats.expenses.by_type.map((item) => (
                            <div key={item.type}>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="capitalize text-gray-700 dark:text-gray-200">
                                        {item.type.replace('_', ' ')}
                                        <span className="ml-1 text-xs text-gray-400">
                                            ({item.count})
                                        </span>
                                    </span>
                                    <span className="font-semibold dark:text-gray-100">
                                        {MAD(item.amount)}
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                    <div
                                        className="h-full rounded-full bg-primary"
                                        style={{
                                            width: `${Math.round((item.amount / maxTypeAmount) * 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}

export default CarOverview
