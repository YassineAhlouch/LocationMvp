import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import Table from '@/components/ui/Table'
import StatisticCard from '@/components/shared/StatisticCard'
import Avatar from '@/components/ui/Avatar'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import Divider from '@/components/shared/Divider'
import Progress from '@/components/ui/Progress'
import { TbSum } from 'react-icons/tb'
import { Rectangle } from 'recharts'
import { LineChart, BarChart, PieChart } from '@/components/shared/Chart'
import { colors } from '@/constants/colors.constant'
import formatNumber from '@/utils/formatNumber'
import { formatDate } from '@/utils/formatDate'
import classNames from '@/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import useDirection from '@/utils/hooks/useDirection'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/ar'
import 'dayjs/locale/es'
import 'dayjs/locale/zh'
import 'dayjs/locale/en'
import { useSessionUser } from '@/store/authStore'
import PeriodPicker, {
    currentMonthRange,
    previousPeriod,
} from '@/components/shared/PeriodPicker'
import type { DateRange } from '@/components/shared/PeriodPicker'
import {
    apiGetDashboardSummary,
    apiGetDashboardTimeline,
    apiGetCarReports,
} from '@/services/LocationService'
import { money } from './shared'
import { useLocaleStore } from '@/store/localeStore'
import useTranslation from '@/utils/hooks/useTranslation'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import type { CarReport, DashboardSummary, DashboardTimeline } from '@/@types/location'
import type { ReactNode } from 'react'
import {
    LiWalletMoney,
    LiReceipt,
    LiCalendar,
    LiBarChartUp,
    LiCar,
    LiMoney,
    LiRepeat,
    LiAlertTriangle,
    LiUserAdd,
} from '@/icons'

const { Tr, Th, Td, THead, TBody } = Table

/** Drill-down page behind one card; the slug is the backend's KpiMetric. */
const kpiPath = (metric: string) => `${APPS_PREFIX_PATH}/dashboard/kpi/${metric}`

const toDateString = (date: Date) => dayjs(date).format('YYYY-MM-DD')

/** Percentage change between two values (previous === 0 → 0). */
const pctChange = (current: number, previous: number) =>
    previous === 0
        ? 0
        : Math.round(((current - previous) / Math.abs(previous)) * 100)

/** Chart status → tone color, reusing the shared status tone maps. */
const statusChartColors: Record<string, string> = {
    // reservation statuses
    pending: colors.yellow.chart,
    confirmed: colors.blue.chart,
    reserved: colors.purple.chart, // reservation reserved (also fleet "reserved")
    active: colors.emerald.chart,
    completed: colors.cyan.chart,
    cancelled: colors.red.chart,
    no_show: colors.gray.chart,
    // car/fleet statuses
    available: colors.emerald.chart,
    rented: colors.yellow.chart,
    maintenance: colors.red.chart,
    inactive: colors.gray.chart,
}

const statusChartColor = (status: string) =>
    statusChartColors[status] ?? colors.gray.chart

/** Compact MAD label for chart axes. */
const compactMAD = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}k`
    return `${Math.round(value)}`
}

type MetricCardProps = {
    title: string
    value: number | string
    icon?: ReactNode
    color?: string
    formatter?: (value: number) => string
    /** Drill-down page for this card; turns the card into a link. */
    to?: string
}

const MetricCard = ({
    title,
    value,
    icon,
    color = 'text-primary',
    formatter,
    to,
}: MetricCardProps) => {
    const formatValue = (val: number | string): string => {
        if (typeof val === 'string') return val
        if (formatter) return formatter(val)
        return formatNumber(val)
    }

    const card = (
        <StatisticCard
            className={classNames(
                'h-full pb-2',
                to && 'cursor-pointer transition-shadow hover:shadow-md',
            )}
        >
            <div className="flex h-full items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="line-clamp-2 text-sm font-medium leading-5 heading-text">
                        {title}
                    </div>
                    <h4 className="mt-1 truncate text-lg sm:text-xl">
                        {formatValue(value)}
                    </h4>
                </div>
                {icon && (
                    <span
                        className={classNames(
                            'shrink-0 text-2xl sm:text-3xl',
                            color,
                        )}
                    >
                        {icon}
                    </span>
                )}
            </div>
        </StatisticCard>
    )

    if (!to) {
        return card
    }

    return (
        <Link to={to} className="block h-full">
            {card}
        </Link>
    )
}

type RevenueExpensesProps = {
    totalRevenue: number
    reservations: number
    revenueChange: number
    reservationsChange: number
    timeline: DashboardTimeline | null
}

const RevenueExpenses = ({
    totalRevenue,
    reservations,
    revenueChange,
    reservationsChange,
    timeline,
}: RevenueExpensesProps) => {
    const [direction] = useDirection()
    const { t } = useTranslation()

    const chartData = useMemo(() => {
        if (!timeline) return []
        return timeline.months.map((month, index) => ({
            date: dayjs(`${month}-01`).format('MMM YY'),
            revenue: timeline.revenue[index] ?? 0,
            expenses: timeline.expenses[index] ?? 0,
        }))
    }, [timeline])

    return (
        <Card>
            <div className="flex items-center justify-between">
                <div>
                    <h5>{t('dashboard.revenueExpenses')}</h5>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mt-4">
                        <div className="">
                            <span>{t('dashboard.totalRevenue')}</span>
                            <div className="flex items-center gap-2">
                                <h4>{money(totalRevenue)}</h4>
                                <GrowShrinkTag
                                    value={revenueChange}
                                    suffix="%"
                                    showIcon={true}
                                />
                            </div>
                        </div>
                        <Divider
                            orientation="vertical"
                            className="hidden sm:block h-12"
                        />
                        <div>
                            <span>{t('dashboard.totalReservations')}</span>
                            <div className="flex items-center gap-2">
                                <h4>{formatNumber(reservations)}</h4>
                                <GrowShrinkTag
                                    value={reservationsChange}
                                    suffix="%"
                                    showIcon={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <LineChart
                    data={chartData}
                    height={315}
                    lineConfig={[
                        {
                            type: 'linear',
                            dataKey: 'revenue',
                        },
                        {
                            type: 'linear',
                            dataKey: 'expenses',
                        },
                    ]}
                    xAxisConfig={{
                        dataKey: 'date',
                        axisLine: false,
                        tickLine: false,
                    }}
                    yAxisConfig={{
                        hide: false,
                        axisLine: false,
                        tickLine: false,
                        orientation: direction === 'rtl' ? 'right' : 'left',
                        width: 40,
                        tickFormatter: (value: number) => compactMAD(value),
                    }}
                    tooltipContentConfig={{
                        valueFormatter: (value: number) => money(value),
                        nameFormatter: (name: string) => {
                            if (name === 'revenue') {
                                return t('dashboard.revenue', 'Revenue')
                            }
                            return t('dashboard.expenses', 'Expenses')
                        },
                    }}
                />
            </div>
        </Card>
    )
}

type ReservationsByStatusProps = {
    byStatus: Record<string, number> | undefined
}

const ReservationsByStatus = ({ byStatus }: ReservationsByStatusProps) => {
    const { t } = useTranslation()
    const data = useMemo(() => {
        if (!byStatus) return []
        return Object.entries(byStatus)
            .filter(([, count]) => count > 0)
            .map(([status, count]) => ({
                name: t(`dashboard.${status}`) || status,
                value: count,
                color: statusChartColor(status),
            }))
    }, [byStatus, t])

    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <Card className="h-full" bodyClass="flex flex-col h-full">
            <div className="mb-4">
                <h5>{t('dashboard.reservationsByStatus')}</h5>
            </div>

            <div className="flex justify-center mb-4">
                <PieChart
                    data={data.map((item) => ({
                        name: item.name,
                        value: item.value,
                    }))}
                    height={200}
                    pieConfig={{
                        dataKey: 'value',
                        nameKey: 'name',
                        cx: '50%',
                        cy: '50%',
                        innerRadius: 65,
                        outerRadius: 85,
                        paddingAngle: 2,
                        cornerRadius: 4,
                    }}
                    cellConfig={data.map((item) => ({
                        fill: item.color,
                    }))}
                />
            </div>

            <div className="flex-1">
                {data.length > 0 ? (
                    <Table compact overflow={false} hoverable={false}>
                        <THead>
                            <Tr className="bg-transparent">
                                <Th>{t('dashboard.status', 'Status')}</Th>
                                <Th className="text-right">{t('dashboard.count', 'Count')}</Th>
                                <Th className="text-right">{t('dashboard.share', 'Share')}</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {data.map((item) => (
                                <Tr key={item.name}>
                                    <Td>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{
                                                    backgroundColor:
                                                        item.color,
                                                }}
                                            />
                                            <span className="font-medium capitalize">
                                                {item.name}
                                            </span>
                                        </div>
                                    </Td>
                                    <Td className="text-right">
                                        <span className="font-medium heading-text">
                                            {item.value.toLocaleString()}
                                        </span>
                                    </Td>
                                    <Td className="text-right">
                                        <span className="font-medium heading-text">
                                            {total > 0
                                                ? `${((item.value / total) * 100).toFixed(1)}%`
                                                : '0%'}
                                        </span>
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">
                        {t('dashboard.noReservationsInPeriod', 'No reservations in this period')}
                    </div>
                )}
            </div>
        </Card>
    )
}

type BarShapeProps = {
    x?: number
    y?: number
    width?: number
    height?: number
}

const RevenueBar = ({ x = 0, y = 0, width = 0, height = 0 }: BarShapeProps) => (
    <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={colors.blue.chart}
        radius={[4, 4, 0, 0]}
    />
)

type AvgRevenuePerRentalProps = {
    avgRevenue: number
    reservations: number
    change: number
    timeline: DashboardTimeline | null
}

const AvgRevenuePerRental = ({
    avgRevenue,
    reservations,
    change,
    timeline,
}: AvgRevenuePerRentalProps) => {
    const { t } = useTranslation()
    const chartData = useMemo(() => {
        if (!timeline) return []
        return timeline.months.map((month, index) => {
            const date = dayjs(`${month}-01`)
            return {
                label: date.format('MMM'),
                fullLabel: date.format('MMM YY'),
                value: timeline.revenue[index] ?? 0,
            }
        })
    }, [timeline])

    return (
        <Card className="h-full" bodyClass="flex flex-col h-full">
            <div className="mb-4">
                <h5>{t('dashboard.avgRevenueRental')}</h5>
            </div>
            <div className="flex items-center gap-2">
                <h4>{money(avgRevenue)}</h4>
                <GrowShrinkTag value={change} suffix="%" />
            </div>
            <div className="mt-1">
                {t('dashboard.reservationsInPeriod', {
                    value: formatNumber(reservations),
                })}
            </div>
            <div className="mt-4 lg:mt-14 xl:mt-4 flex-1">
                <BarChart
                    data={chartData}
                    height={280}
                    barConfig={[
                        {
                            dataKey: 'value',
                            barSize: 10,
                            shape: RevenueBar as unknown as undefined,
                        },
                    ]}
                    xAxisConfig={{
                        dataKey: 'label',
                        interval: 'preserveStartEnd',
                        minTickGap: 16,
                    }}
                    yAxisConfig={{
                        hide: false,
                        tickFormatter: (value: number) => compactMAD(value),
                        width: 40,
                        tickMargin: 4,
                    }}
                    tooltipContentConfig={{
                        customContent: (props) => {
                            const { payload } = props
                            if (!payload || !payload.length) return null

                            const point = payload[0].payload
                            const value = point.value ?? 0

                            return (
                                <div className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-w-[8rem] rounded-lg border shadow-xl">
                                    <div className="px-2.5 py-1.5">
                                        <div className="heading-text font-medium">
                                            {point.fullLabel ?? point.label}
                                        </div>
                                        <div className="grid gap-1.5 mt-1.5">
                                            <div className="flex w-full items-center gap-2">
                                                <div
                                                    className="shrink-0 rounded-[2px] h-2.5 w-2.5"
                                                    style={{
                                                        backgroundColor:
                                                            colors.blue.chart,
                                                    }}
                                                />
                                                <div className="flex flex-1 justify-between items-center gap-x-3">
                                                    <span className="heading-text font-mono font-medium tabular-nums text-xs">
                                                        {t(
                                                            'dashboard.revenue',
                                                            'Revenue',
                                                        )}
                                                    </span>
                                                    <span className="heading-text font-mono font-medium tabular-nums text-xs">
                                                        {money(value)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        },
                    }}
                />
            </div>
        </Card>
    )
}

type FleetByStatusProps = {
    byStatus: Record<string, number> | undefined
    totalCars: number
    rented: number
}

/**
 * Fleet split by status, using the Acquisition Channel card's visual
 * language: a dominant share, a segmented bar, a legend and a small table.
 */
const FleetByStatus = ({ byStatus, totalCars, rented }: FleetByStatusProps) => {
    const { t } = useTranslation()

    const segments = useMemo(() => {
        const entries = Object.entries(byStatus ?? {})
            .filter(([, value]) => value > 0)
            .sort((a, b) => b[1] - a[1])

        const total = entries.reduce((sum, [, value]) => sum + value, 0)

        return entries.map(([status, value]) => ({
            key: status,
            label: t(`dashboard.${status}`) || status,
            value,
            color: statusChartColor(status),
            share: total > 0 ? (value / total) * 100 : 0,
        }))
    }, [byStatus, t])

    const top = segments[0]

    return (
        <Card className="h-full" bodyClass="flex h-full flex-col">
            <div className="flex h-full flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h5>{t('dashboard.fleetByStatus', 'Fleet by Status')}</h5>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t('dashboard.fleetSummary', {
                            total: formatNumber(totalCars),
                            rented: formatNumber(rented),
                            defaultValue: '{{total}} cars · {{rented}} rented now',
                        })}
                    </span>
                </div>
                <div className="pt-2">
                    <div className="flex flex-wrap items-baseline gap-2">
                        <h4>{top ? `${Math.round(top.share)}%` : '—'}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t('dashboard.fleetOfFleet', 'of the fleet')}
                        </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium capitalize heading-text">
                        {top?.label ?? t('dashboard.noData', 'No data available')}
                    </p>
                </div>

                {segments.length > 0 ? (
                    <>
                        <div className="space-y-2">
                            <div className="flex h-8 w-full gap-0.5">
                                {segments.map((segment) => (
                                    <div
                                        key={segment.key}
                                        style={{
                                            width: `${segment.share}%`,
                                            backgroundColor: segment.color,
                                        }}
                                        className="h-full rounded-sm"
                                    />
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {segments.map((segment) => (
                                    <span
                                        key={segment.key}
                                        className="flex items-center gap-2 text-sm capitalize"
                                    >
                                        <span
                                            className="h-3 w-3 rounded-full"
                                            style={{
                                                backgroundColor: segment.color,
                                            }}
                                        />
                                        {segment.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto pt-4">
                            <Table compact overflow={false} hoverable={false}>
                                <THead>
                                    <Tr className="bg-transparent">
                                        <Th>{t('dashboard.status', 'Status')}</Th>
                                        <Th className="text-right">
                                            {t('dashboard.fleetCars', 'Cars')}
                                        </Th>
                                        <Th className="text-right">
                                            {t('dashboard.share', 'Share')}
                                        </Th>
                                    </Tr>
                                </THead>
                                <TBody>
                                    {segments.map((segment) => (
                                        <Tr key={segment.key}>
                                            <Td>
                                                <div className="flex items-center gap-2 capitalize">
                                                    <span
                                                        className="h-2.5 w-2.5 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                segment.color,
                                                        }}
                                                    />
                                                    <span className="font-medium">
                                                        {segment.label}
                                                    </span>
                                                </div>
                                            </Td>
                                            <Td className="text-right">
                                                {formatNumber(segment.value)}
                                            </Td>
                                            <Td className="text-right">
                                                {segment.share.toFixed(1)}%
                                            </Td>
                                        </Tr>
                                    ))}
                                </TBody>
                            </Table>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center py-8 text-sm text-gray-400">
                        {t('dashboard.noData', 'No data available')}
                    </div>
                )}
            </div>
        </Card>
    )
}

type OccupancyProps = {
    bookedDays: number
    availableDays: number
    rate: number
}

const occupancyStroke = (rate: number) => {
    if (rate >= 0.75) return 'stroke-success'
    if (rate >= 0.5) return 'stroke-warning'
    return 'stroke-error'
}

const Occupancy = ({ bookedDays, availableDays, rate }: OccupancyProps) => {
    const { t } = useTranslation()
    const percent = Math.round(rate * 100)
    const totalDays = bookedDays + availableDays

    return (
        <Card className="h-full" bodyClass="flex h-full flex-col">
            <div className="mb-2">
                <h5>{t('dashboard.occupancy', 'Occupancy')}</h5>
            </div>
            <div className="flex flex-1 items-center justify-center py-8">
                <Progress
                    className="flex justify-center"
                    variant="circle"
                    percent={percent}
                    width={200}
                    gapDegree={120}
                    gapPosition="bottom"
                    strokeClass={occupancyStroke(rate)}
                    customInfo={
                        <div className="text-center">
                            <h3>{percent}%</h3>
                            <span>
                                {t(
                                    'dashboard.occupancyRate',
                                    'Occupancy Rate',
                                )}
                            </span>
                        </div>
                    }
                />
            </div>
            <div className="-mt-14 divide-y divide-gray-200 dark:divide-gray-700">
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 heading-text">
                        <LiCalendar className="text-lg" />
                        <span>{t('dashboard.bookedDays', 'Booked days')}</span>
                    </div>
                    <span className="font-semibold heading-text">
                        {formatNumber(bookedDays)}
                    </span>
                </div>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 heading-text">
                        <LiCar className="text-lg" />
                        <span>
                            {t('dashboard.availableDays', 'Available days')}
                        </span>
                    </div>
                    <span className="font-semibold heading-text">
                        {formatNumber(availableDays)}
                    </span>
                </div>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 heading-text">
                        <TbSum className="text-lg" />
                        <span>{t('dashboard.totalDays', 'Total days')}</span>
                    </div>
                    <span className="font-semibold heading-text">
                        {formatNumber(totalDays)}
                    </span>
                </div>
            </div>
        </Card>
    )
}

type TopVehiclesProps = {
    vehicles: CarReport[]
}

const TopVehicles = ({ vehicles }: TopVehiclesProps) => {
    const { t } = useTranslation()
    return (
        <Card bodyClass="p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h5>{t('dashboard.topPerformingVehicles')}</h5>
            </div>
            {vehicles.length > 0 ? (
                <Table>
                    <THead>
                        <Tr>
                            <Th>{t('dashboard.vehicle')}</Th>
                            <Th>{t('dashboard.revenue')}</Th>
                            <Th>{t('dashboard.expenses')}</Th>
                            <Th>{t('dashboard.margin')}</Th>
                            <Th>{t('dashboard.bookedDays')}</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {vehicles.map((vehicle) => (
                            <Tr key={vehicle.car_id}>
                                <Td>
                                    <Link
                                        to={`${APPS_PREFIX_PATH}/vehicules/${vehicle.car_id}/overview`}
                                        className="group flex items-center gap-2"
                                    >
                                        <Avatar
                                            shape="round"
                                            size={35}
                                            className="vehicle-avatar shrink-0"
                                            src={vehicle.image ?? undefined}
                                            icon={<LiCar />}
                                            alt={vehicle.registration_number}
                                        />
                                        <div>
                                            <span className="font-medium heading-text group-hover:text-primary">
                                                {
                                                    vehicle.registration_number
                                                }
                                            </span>
                                            {vehicle.brand && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {vehicle.brand}
                                                    {vehicle.model
                                                        ? ` · ${vehicle.model}`
                                                        : ''}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </Td>
                                <Td className="heading-text">
                                    {money(vehicle.revenue)}
                                </Td>
                                <Td className="heading-text">
                                    {money(vehicle.expenses)}
                                </Td>
                                <Td>
                                    <span
                                        className={classNames(
                                            'heading-text font-medium',
                                            vehicle.margin >= 0
                                                ? 'text-success'
                                                : 'text-error',
                                        )}
                                    >
                                        {money(vehicle.margin)}
                                    </span>
                                </Td>
                                <Td className="heading-text">
                                    {vehicle.booked_days}
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            ) : (
                <div className="flex items-center justify-center p-8 text-sm text-gray-400">
                    No vehicle data available
                </div>
            )}
        </Card>
    )
}

type DashboardHeaderProps = {
    userName?: string
    currentDate: Date
    range: DateRange
    onRangeChange: (range: DateRange) => void
}

const DashboardHeader = ({
    userName,
    currentDate,
    range,
    onRangeChange,
}: DashboardHeaderProps) => {
    const { t, i18n } = useTranslation()
    const currentLang = useLocaleStore((state) => state.currentLang)
    const [tick, setTick] = useState(0)
    const i18nObj = typeof i18n === 'object' ? i18n : null

    const formattedLang = useMemo(
        () => currentLang.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase()),
        [currentLang],
    )

    /**
     * dayjs locale loads asynchronously after a language change, so the
     * date can render in the previous locale. Apply the locale immediately
     * and re-format when it changes.
     */
    useEffect(() => {
        if (formattedLang) {
            dayjs.locale(formattedLang)
        }
        setTick((v) => v + 1)
    }, [formattedLang])

    useEffect(() => {
        const handler = () => {
            if (formattedLang) {
                dayjs.locale(formattedLang)
            }
            setTick((v) => v + 1)
        }
        i18nObj?.on?.('languageChanged', handler)
        return () => {
            i18nObj?.off?.('languageChanged', handler)
        }
    }, [i18nObj, formattedLang])

    const formattedDate = useMemo(
        () => formatDate(currentDate, 'dddd, DD MMMM YYYY'),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentDate, formattedLang, tick],
    )

    const displayName = userName || 'User'

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0 py-2.5">
            <div>
                <h4>{t('common.hi')}, {displayName}</h4>
                <p className="mt-1">{formattedDate}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <PeriodPicker value={range} onChange={onRangeChange} />
            </div>
        </div>
    )
}

const MetricCardSkeleton = () => {
    return (
        <StatisticCard className="h-full">
            <div className="flex h-full items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton height={12} width={80} />
                    <Skeleton height={24} width={120} />
                </div>
                <Skeleton variant="circle" height={30} width={30} />
            </div>
        </StatisticCard>
    )
}

const LocationDashboardLoaders = () => {
    const skeletonHeader = (
        <div className="flex items-center justify-between mb-8">
            <Skeleton height={12} width={160} />
        </div>
    )

    return (
        <div className="h-full">
            <Container>
                <DashboardHeaderSkeleton />
                <div className="space-y-4">
                    <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <MetricCardSkeleton key={index} />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 xl:col-span-2">
                            <Card>
                                <div className="space-y-8">
                                    {skeletonHeader}
                                    <div className="flex items-center gap-8">
                                        <div className="space-y-2">
                                            <Skeleton
                                                height={16}
                                                width={80}
                                            />
                                            <Skeleton
                                                height={16}
                                                width={120}
                                            />
                                        </div>
                                        <Divider
                                            orientation="vertical"
                                            className="h-12"
                                        />
                                        <div className="space-y-2">
                                            <Skeleton
                                                height={16}
                                                width={80}
                                            />
                                            <Skeleton
                                                height={16}
                                                width={120}
                                            />
                                        </div>
                                    </div>
                                    <Skeleton height={315} />
                                </div>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 xl:col-span-1">
                            <Card>
                                <div className="space-y-10">
                                    {skeletonHeader}
                                    <div className="flex items-center justify-center">
                                        <Skeleton
                                            variant="circle"
                                            height={180}
                                            width={180}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map(
                                            (_, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between"
                                                >
                                                    <Skeleton
                                                        height={12}
                                                        width={80}
                                                    />
                                                    <Skeleton
                                                        height={12}
                                                        width={60}
                                                    />
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Card key={index}>
                                <div className="space-y-8">
                                    {skeletonHeader}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton
                                                height={16}
                                                width={100}
                                            />
                                            <Skeleton
                                                height={16}
                                                width={50}
                                            />
                                        </div>
                                        <Skeleton height={16} width={160} />
                                    </div>
                                    <Skeleton height={220} />
                                </div>
                            </Card>
                        ))}
                    </div>
                    <Card bodyClass="p-0">
                        <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
                            <Skeleton height={12} width={200} />
                        </div>
                        <Table hoverable={false}>
                            <THead>
                                <Tr>
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <Th key={index}>
                                                <Skeleton
                                                    height={14}
                                                    width={80}
                                                />
                                            </Th>
                                        ),
                                    )}
                                </Tr>
                            </THead>
                            <TBody>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Tr key={index}>
                                        {Array.from({ length: 5 }).map(
                                            (__, cellIndex) => (
                                                <Td key={cellIndex}>
                                                    <Skeleton
                                                        height={14}
                                                        width={80}
                                                    />
                                                </Td>
                                            ),
                                        )}
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    </Card>
                </div>
            </Container>
        </div>
    )
}

const DashboardHeaderSkeleton = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0 py-2.5">
            <div className="space-y-2">
                <Skeleton height={12} width={160} />
                <Skeleton height={12} width={200} />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                    <Skeleton height={16} width={60} />
                    <Skeleton height={16} width={40} />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton height={16} width={60} />
                    <Skeleton height={16} width={80} />
                </div>
            </div>
        </div>
    )
}

const LocationDashboard = () => {
    const { user } = useSessionUser()
    const { windowWidth } = useResponsive()
    const { t } = useTranslation()

    const [range, setRange] = useState<DateRange>(currentMonthRange)

    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [prevSummary, setPrevSummary] = useState<DashboardSummary | null>(
        null,
    )
    const [timeline, setTimeline] = useState<DashboardTimeline | null>(null)
    const [vehicles, setVehicles] = useState<CarReport[]>([])
    const [loading, setLoading] = useState(true)

    const fetchDashboard = useCallback(async () => {
        setLoading(true)

        const comparison = previousPeriod(range)

        try {
            const [summaryRes, prevRes, timelineRes, carsRes] =
                await Promise.all([
                    apiGetDashboardSummary({
                        from: toDateString(range.from),
                        to: toDateString(range.to),
                    }),
                    apiGetDashboardSummary({
                        from: toDateString(comparison.from),
                        to: toDateString(comparison.to),
                    }),
                    apiGetDashboardTimeline({ months: 12 }).catch(() => null),
                    apiGetCarReports({
                        from: toDateString(range.from),
                        to: toDateString(range.to),
                    }).catch(() => []),
                ])

            setSummary(summaryRes)
            setPrevSummary(prevRes)
            setTimeline(timelineRes)
            setVehicles(carsRes)
        } catch {
            setSummary(null)
            setPrevSummary(null)
        } finally {
            setLoading(false)
        }
    }, [range])

    useEffect(() => {
        fetchDashboard()
    }, [fetchDashboard])

    const displayName = user?.full_name || user?.first_name || 'there'

    const netRevenueChange = useMemo(
        () =>
            summary && prevSummary
                ? pctChange(summary.net, prevSummary.net)
                : 0,
        [summary, prevSummary],
    )

    const reservationsChange = useMemo(
        () =>
            summary && prevSummary
                ? pctChange(
                      summary.reservations.total,
                      prevSummary.reservations.total,
                  )
                : 0,
        [summary, prevSummary],
    )

    const avgRevenue = useMemo(() => {
        if (!summary) return 0
        const reservations = summary.reservations.total
        return reservations > 0
            ? summary.net / reservations
            : summary.net
    }, [summary])

    const avgRevenueChange = useMemo(() => {
        if (!summary || !prevSummary) return 0
        const prevReservations = prevSummary.reservations.total
        const prevAvg =
            prevReservations > 0
                ? prevSummary.net / prevReservations
                : prevSummary.net
        return pctChange(avgRevenue, prevAvg)
    }, [summary, prevSummary, avgRevenue])

    if (loading) {
        return <LocationDashboardLoaders />
    }

    return (
        <div className="h-full">
            <Container>
                <DashboardHeader
                    userName={displayName}
                    currentDate={new Date()}
                    range={range}
                    onRangeChange={setRange}
                />
                <div className="space-y-4">
                    <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <MetricCard
                            title={t('dashboard.netRevenue', 'Net Revenue')}
                            value={summary?.net ?? 0}
                            icon={<LiWalletMoney />}
                            color="text-indigo-600 dark:text-indigo-400"
                            formatter={money}
                            to={kpiPath('net-revenue')}
                        />
                        <MetricCard
                            title={t('dashboard.expenses', 'Expenses')}
                            value={summary?.expenses.total ?? 0}
                            icon={<LiReceipt />}
                            color="text-orange-600 dark:text-orange-400"
                            formatter={money}
                            to={kpiPath('expenses')}
                        />
                        <MetricCard
                            title={t('dashboard.reservations', 'Reservations')}
                            value={summary?.reservations.total ?? 0}
                            icon={<LiCalendar />}
                            color="text-sky-600 dark:text-sky-400"
                            to={kpiPath('reservations')}
                        />
                        <MetricCard
                            title={t('dashboard.occupancy', 'Occupancy')}
                            value={`${Math.round((summary?.occupancy.rate ?? 0) * 100)}%`}
                            icon={<LiBarChartUp />}
                            color="text-emerald-600 dark:text-emerald-400"
                            to={kpiPath('occupancy')}
                        />
                        <MetricCard
                            title={t(
                                'dashboard.outstandingPayments',
                                'Outstanding Payments',
                            )}
                            value={summary?.outstanding.amount ?? 0}
                            icon={<LiMoney />}
                            color="text-rose-600 dark:text-rose-400"
                            formatter={money}
                            to={kpiPath('outstanding')}
                        />
                        <MetricCard
                            title={t(
                                'dashboard.todayPickupsReturns',
                                "Today's Pickups & Returns",
                            )}
                            value={
                                (summary?.today.pickups ?? 0) +
                                (summary?.today.returns ?? 0)
                            }
                            icon={<LiRepeat />}
                            color="text-violet-600 dark:text-violet-400"
                            to={kpiPath('today')}
                        />
                        <MetricCard
                            title={t(
                                'dashboard.fleetAttention',
                                'Fleet Requiring Attention',
                            )}
                            value={summary?.attention.total ?? 0}
                            icon={<LiAlertTriangle />}
                            color="text-amber-600 dark:text-amber-400"
                            to={kpiPath('fleet-attention')}
                        />
                        <MetricCard
                            title={t('dashboard.newCustomers', 'New Customers')}
                            value={summary?.new_clients ?? 0}
                            icon={<LiUserAdd />}
                            color="text-teal-600 dark:text-teal-400"
                            to={kpiPath('new-clients')}
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 xl:col-span-2">
                            <RevenueExpenses
                                totalRevenue={summary?.revenue.net ?? 0}
                                reservations={
                                    summary?.reservations.total ?? 0
                                }
                                revenueChange={netRevenueChange}
                                reservationsChange={reservationsChange}
                                timeline={timeline}
                            />
                        </div>
                        <div className="lg:col-span-1 xl:col-span-1">
                            <ReservationsByStatus
                                byStatus={summary?.reservations.by_status}
                            />
                        </div>
                        <div className="lg:col-span-1 xl:hidden">
                            {windowWidth < 1280 && (
                                <AvgRevenuePerRental
                                    avgRevenue={avgRevenue}
                                    reservations={
                                        summary?.reservations.total ?? 0
                                    }
                                    change={avgRevenueChange}
                                    timeline={timeline}
                                />
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div className="hidden xl:block">
                            {windowWidth >= 1280 && (
                                <AvgRevenuePerRental
                                    avgRevenue={avgRevenue}
                                    reservations={
                                        summary?.reservations.total ?? 0
                                    }
                                    change={avgRevenueChange}
                                    timeline={timeline}
                                />
                            )}
                        </div>
                        <FleetByStatus
                            byStatus={summary?.fleet.by_status}
                            totalCars={summary?.fleet.total_cars ?? 0}
                            rented={summary?.fleet.currently_rented ?? 0}
                        />
                        <Occupancy
                            bookedDays={summary?.occupancy.booked_days ?? 0}
                            availableDays={
                                summary?.occupancy.available_days ?? 0
                            }
                            rate={summary?.occupancy.rate ?? 0}
                        />
                    </div>
                    <TopVehicles vehicles={vehicles} />
                </div>
            </Container>
        </div>
    )
}

export default LocationDashboard