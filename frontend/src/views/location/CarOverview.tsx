import { useEffect, useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { Link } from 'react-router'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Table from '@/components/ui/Table'
import Loading from '@/components/shared/Loading'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import usePermissions from '@/utils/hooks/usePermissions'
import useTranslation from '@/utils/hooks/useTranslation'
import { LiCalendar } from '@/icons'
import {
    LuArrowRightLeft,
    LuTrendingUp,
    LuWallet,
} from 'react-icons/lu'
import { apiGetCarOverview } from '@/services/LocationService'
import FinancialOverviewChart from './FinancialOverviewChart'
import {
    money,
    expenseStatusTone,
    formatDate,
    formatDateTime,
    reservationStatusTone,
    tagToneClass,
} from './shared'
import type { CarOverview as CarOverviewData } from '@/@types/location'
import type { DateRange } from '@/components/shared/PeriodPicker'
import type { TagTone } from './shared'

const { Tr, Th, Td, THead, TBody } = Table

type CarOverviewProps = {
    carId: number
    range: DateRange
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

const CarOverview = ({ carId, range }: CarOverviewProps) => {
    const { can } = usePermissions()
    const { t } = useTranslation()
    const [overview, setOverview] = useState<CarOverviewData | null>(null)
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        let active = true
        setLoading(true)
        setFailed(false)
        apiGetCarOverview(carId, {
            from: dayjs(range.from).format('YYYY-MM-DD'),
            to: dayjs(range.to).format('YYYY-MM-DD'),
        })
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
    }, [carId, range])

    const chartData = useMemo(() => {
        if (!overview) {
            return []
        }
        return overview.stats.timeline.labels.map((label, index) => ({
            month: dayjs(label).format('MMM'),
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
                    {t(
                        'cars.overview.failed',
                        "Could not load this vehicle's overview.",
                    )}
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
                    label={t('cars.overview.reservations', 'Reservations')}
                    value={String(stats.reservations.total)}
                    hint={`${stats.reservations.active} ${t('cars.overview.active', 'active')} · ${stats.reservations.upcoming} ${t('cars.overview.upcoming', 'upcoming')}`}
                    tone="primary"
                    Icon={LiCalendar}
                />
                <KpiCard
                    label={t('cars.overview.revenuePaid', 'Revenue (paid)')}
                    value={money(stats.revenue.paid)}
                    hint={`${money(stats.revenue.pending)} ${t('cars.overview.pending', 'pending')}`}
                    tone="success"
                    Icon={LuWallet}
                />
                <KpiCard
                    label={t('cars.overview.expensesPaid', 'Expenses (paid)')}
                    value={money(stats.expenses.paid)}
                    hint={`${stats.expenses.overdue_count} ${t('cars.overview.overdue', 'overdue')} · ${money(stats.expenses.pending)} ${t('cars.overview.pending', 'pending')}`}
                    tone="warning"
                    Icon={LuArrowRightLeft}
                />
                <KpiCard
                    label={t('cars.overview.netMargin', 'Net margin')}
                    value={money(stats.net)}
                    hint={`${stats.reservations.booked_days} ${t('cars.overview.daysBooked', 'days booked')}`}
                    tone={stats.net >= 0 ? 'success' : 'error'}
                    Icon={LuTrendingUp}
                />
            </div>

            <Card bodyClass="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h6>
                            {t(
                                'cars.overview.revenueExpenses',
                                'Revenue & Expenses',
                            )}
                        </h6>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t(
                                'cars.overview.chartSubtitleRange',
                                '{{range}} · paid cash-basis',
                                {
                                    range: `${dayjs(range.from).format('DD MMM YYYY')} – ${dayjs(range.to).format('DD MMM YYYY')}`,
                                },
                            )}
                        </p>
                    </div>
                </div>
                <FinancialOverviewChart data={chartData} height={280} />
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Card bodyClass="p-0">
                    <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                        <h6>
                            {t(
                                'cars.overview.recentReservations',
                                'Recent reservations',
                            )}
                        </h6>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t(
                                'cars.overview.recentReservationsSubRange',
                                'Latest bookings within the selected period',
                            )}
                        </p>
                    </div>
                    <Table className="text-nowrap">
                        <THead>
                            <Tr>
                                <Th>
                                    {t(
                                        'cars.overview.table.reservation',
                                        'Reservation',
                                    )}
                                </Th>
                                <Th>
                                    {t('cars.overview.table.client', 'Client')}
                                </Th>
                                <Th>
                                    {t('cars.overview.table.pickup', 'Pickup')}
                                </Th>
                                <Th>
                                    {t('cars.overview.table.status', 'Status')}
                                </Th>
                                <Th className="text-right">
                                    {t('cars.overview.table.total', 'Total')}
                                </Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {overview.recent_reservations.length === 0 ? (
                                <EmptyRow
                                    columns={5}
                                    label={t(
                                        'cars.overview.noReservations',
                                        'No reservations yet',
                                    )}
                                />
                            ) : (
                                overview.recent_reservations.map(
                                    (reservation) => (
                                        <Tr key={reservation.id}>
                                            <Td>
                                                <Link
                                                    to={`${APPS_PREFIX_PATH}/reservations/${reservation.id}/${
                                                        can(
                                                            'reservations.update',
                                                        )
                                                            ? 'modifier'
                                                            : 'facture'
                                                    }`}
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
                                                    {t(
                                                        `reservations.status.${reservation.status}`,
                                                        reservation.status.replace(
                                                            '_',
                                                            ' ',
                                                        ),
                                                    )}
                                                </Tag>
                                            </Td>
                                            <Td className="text-right">
                                                <span className="whitespace-nowrap font-semibold dark:text-gray-100">
                                                    {money(
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
                        <h6>
                            {t(
                                'cars.overview.recentExpenses',
                                'Recent expenses',
                            )}
                        </h6>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t(
                                'cars.overview.recentExpensesSubRange',
                                'Latest costs booked within the selected period',
                            )}
                        </p>
                    </div>
                    <Table className="text-nowrap">
                        <THead>
                            <Tr>
                                <Th>
                                    {t(
                                        'cars.overview.table.expense',
                                        'Expense',
                                    )}
                                </Th>
                                <Th>
                                    {t('cars.overview.table.type', 'Type')}
                                </Th>
                                <Th>
                                    {t('cars.overview.table.date', 'Date')}
                                </Th>
                                <Th>
                                    {t('cars.overview.table.status', 'Status')}
                                </Th>
                                <Th className="text-right">
                                    {t('cars.overview.table.amount', 'Amount')}
                                </Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {overview.recent_expenses.length === 0 ? (
                                <EmptyRow
                                    columns={5}
                                    label={t(
                                        'cars.overview.noExpenses',
                                        'No expenses yet',
                                    )}
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
                                                    {t(
                                                        `expenses.type.${expense.type}`,
                                                        expense.type.replace(
                                                            '_',
                                                            ' ',
                                                        ),
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
                                                    {expense.is_overdue
                                                        ? t(
                                                              'expenses.status.overdue',
                                                              'Overdue',
                                                          )
                                                        : t(
                                                              `expenses.status.${expense.status}`,
                                                              expense.status.replace(
                                                                  '_',
                                                                  ' ',
                                                              ),
                                                          )}
                                                </Tag>
                                            </Td>
                                            <Td className="text-right">
                                                <span className="whitespace-nowrap font-semibold dark:text-gray-100">
                                                    {money(expense.amount)}
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
                    <h6>
                        {t(
                            'cars.overview.spendingByType',
                            'Spending by type',
                        )}
                    </h6>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t(
                            'cars.overview.spendingSubRange',
                            'Paid + pending expenses within the selected period',
                        )}
                    </p>
                </div>
                {stats.expenses.by_type.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        {t(
                            'cars.overview.noSpending',
                            'No expenses recorded for this vehicle.',
                        )}
                    </p>
                ) : (
                    <div className="space-y-3">
                        {stats.expenses.by_type.map((item) => (
                            <div key={item.type}>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="text-gray-700 dark:text-gray-200">
                                        {t(
                                            `expenses.type.${item.type}`,
                                            item.type.replace('_', ' '),
                                        )}
                                        <span className="ml-1 text-xs text-gray-400">
                                            ({item.count})
                                        </span>
                                    </span>
                                    <span className="font-semibold dark:text-gray-100">
                                        {money(item.amount)}
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
