import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import Switcher from '@/components/ui/Switcher'
import Skeleton from '@/components/ui/Skeleton'
import Table from '@/components/ui/Table'
import StatisticCard from '@/components/shared/StatisticCard'
import IconFrame from '@/components/shared/IconFrame'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import Divider from '@/components/shared/Divider'
import { LineChart, BarChart, PieChart } from '@/components/shared/Chart'
import { colors } from '@/constants/colors.constant'
import formatNumber from '@/utils/formatNumber'
import { formatDate } from '@/utils/formatDate'
import classNames from '@/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import useDirection from '@/utils/hooks/useDirection'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { useSessionUser } from '@/store/authStore'
import {
    apiGetDashboardSummary,
    apiGetDashboardTimeline,
    apiGetCarReports,
} from '@/services/LocationService'
import { MAD } from './shared'
import type { CarReport, DashboardSummary, DashboardTimeline } from '@/@types/location'
import type { ReactNode } from 'react'
import {
    LiChevronDown,
    LiWalletMoney,
    LiReceipt,
    LiCalendar,
    LiBarChartUp,
    LiCar,
} from '@/icons'

dayjs.extend(quarterOfYear)

const { Tr, Th, Td, THead, TBody } = Table

type TimeRange = 'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear'
type ComparisonPeriod =
    | 'lastWeek'
    | 'lastMonth'
    | 'lastQuarter'
    | 'lastYear'

const timeRangeOptions: { key: TimeRange; label: string }[] = [
    { key: 'thisWeek', label: 'This Week' },
    { key: 'thisMonth', label: 'This Month' },
    { key: 'thisQuarter', label: 'This Quarter' },
    { key: 'thisYear', label: 'This Year' },
]

const getComparisonPeriodForTimeRange = (
    timeRange: TimeRange,
): ComparisonPeriod => {
    switch (timeRange) {
        case 'thisWeek':
            return 'lastWeek'
        case 'thisMonth':
            return 'lastMonth'
        case 'thisQuarter':
            return 'lastQuarter'
        case 'thisYear':
            return 'lastYear'
    }
}

const getDateRanges = (
    timeRange: TimeRange,
    comparisonPeriod: ComparisonPeriod,
) => {
    const now = dayjs()
    let current: { start: Date; end: Date }
    let comparison: { start: Date; end: Date }

    switch (timeRange) {
        case 'thisWeek':
            current = {
                start: now.startOf('week').toDate(),
                end: now.endOf('week').toDate(),
            }
            break
        case 'thisMonth':
            current = {
                start: now.startOf('month').toDate(),
                end: now.endOf('month').toDate(),
            }
            break
        case 'thisQuarter':
            current = {
                start: now.startOf('quarter').toDate(),
                end: now.endOf('quarter').toDate(),
            }
            break
        case 'thisYear':
            current = {
                start: now.startOf('year').toDate(),
                end: now.endOf('year').toDate(),
            }
            break
    }

    switch (comparisonPeriod) {
        case 'lastWeek':
            comparison = {
                start: now
                    .subtract(1, 'week')
                    .startOf('week')
                    .toDate(),
                end: now.subtract(1, 'week').endOf('week').toDate(),
            }
            break
        case 'lastMonth':
            comparison = {
                start: now
                    .subtract(1, 'month')
                    .startOf('month')
                    .toDate(),
                end: now.subtract(1, 'month').endOf('month').toDate(),
            }
            break
        case 'lastQuarter':
            comparison = {
                start: now
                    .subtract(1, 'quarter')
                    .startOf('quarter')
                    .toDate(),
                end: now
                    .subtract(1, 'quarter')
                    .endOf('quarter')
                    .toDate(),
            }
            break
        case 'lastYear':
            comparison = {
                start: now.subtract(1, 'year').startOf('year').toDate(),
                end: now.subtract(1, 'year').endOf('year').toDate(),
            }
            break
    }

    return { current, comparison }
}

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
    change: number
    icon?: ReactNode
    formatter?: (value: number) => string
    comparisonEnabled?: boolean
}

const MetricCard = ({
    title,
    value,
    change,
    icon,
    formatter,
    comparisonEnabled = true,
}: MetricCardProps) => {
    const formatValue = (val: number | string): string => {
        if (typeof val === 'string') return val
        if (formatter) return formatter(val)
        return formatNumber(val)
    }

    return (
        <StatisticCard
            inset
            footer={
                comparisonEnabled && (
                    <div className="flex items-center justify-between gap-2 py-0.5 px-2">
                        <GrowShrinkTag
                            value={change}
                            suffix="%"
                            showIcon={true}
                            className="bg-transparent px-0 font-semibold"
                        />
                        <span>vs last period</span>
                    </div>
                )
            }
        >
            <div className="flex items-center gap-4">
                <IconFrame>
                    <span className="text-xl heading-text">{icon}</span>
                </IconFrame>
            </div>
            <div className="mt-4">
                <p>{title}</p>
                <h4>{formatValue(value)}</h4>
            </div>
        </StatisticCard>
    )
}

type RevenueExpensesProps = {
    totalRevenue: number
    reservations: number
    revenueChange: number
    reservationsChange: number
    comparisonEnabled: boolean
    timeline: DashboardTimeline | null
}

const RevenueExpenses = ({
    totalRevenue,
    reservations,
    revenueChange,
    reservationsChange,
    comparisonEnabled,
    timeline,
}: RevenueExpensesProps) => {
    const [direction] = useDirection()

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
                    <h5>Revenue & Expenses</h5>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mt-4">
                        <div className="">
                            <span>Total Revenue</span>
                            <div className="flex items-center gap-2">
                                <h4>{MAD(totalRevenue)}</h4>
                                {comparisonEnabled && (
                                    <GrowShrinkTag
                                        value={revenueChange}
                                        suffix="%"
                                        showIcon={true}
                                    />
                                )}
                            </div>
                        </div>
                        <Divider
                            orientation="vertical"
                            className="hidden sm:block h-12"
                        />
                        <div>
                            <span>Total Reservations</span>
                            <div className="flex items-center gap-2">
                                <h4>{formatNumber(reservations)}</h4>
                                {comparisonEnabled && (
                                    <GrowShrinkTag
                                        value={reservationsChange}
                                        suffix="%"
                                        showIcon={true}
                                    />
                                )}
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
                        valueFormatter: (value: number) => MAD(value),
                        nameFormatter: (name: string) => {
                            if (name === 'revenue') {
                                return 'Revenue'
                            }
                            return 'Expenses'
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
    const data = useMemo(() => {
        if (!byStatus) return []
        return Object.entries(byStatus)
            .filter(([, count]) => count > 0)
            .map(([status, count]) => ({
                name: status,
                value: count,
                color: statusChartColor(status),
            }))
    }, [byStatus])

    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <Card className="h-full" bodyClass="flex flex-col h-full">
            <div className="mb-4">
                <h5>Reservations by Status</h5>
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
                                <Th>Status</Th>
                                <Th className="text-right">Count</Th>
                                <Th className="text-right">Share</Th>
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
                        No reservations in this period
                    </div>
                )}
            </div>
        </Card>
    )
}

type AvgRevenuePerRentalProps = {
    avgRevenue: number
    reservations: number
    change: number
    comparisonEnabled: boolean
    timeline: DashboardTimeline | null
}

const AvgRevenuePerRental = ({
    avgRevenue,
    reservations,
    change,
    comparisonEnabled,
    timeline,
}: AvgRevenuePerRentalProps) => {
    const chartData = useMemo(() => {
        if (!timeline) return []
        return timeline.months.map((month, index) => ({
            label: dayjs(`${month}-01`).format('MMM YY'),
            value: timeline.revenue[index] ?? 0,
        }))
    }, [timeline])

    return (
        <Card className="h-full" bodyClass="flex flex-col h-full">
            <div className="mb-4">
                <h5>Average Revenue / Rental</h5>
            </div>
            <div className="flex items-center gap-2">
                <h4>{MAD(avgRevenue)}</h4>
                {comparisonEnabled && (
                    <GrowShrinkTag value={change} suffix="%" />
                )}
            </div>
            <div className="mt-1">
                {formatNumber(reservations)} reservations in period
            </div>
            <div className="mt-4 lg:mt-14 xl:mt-4 flex-1">
                <BarChart
                    data={chartData}
                    height={250}
                    barConfig={[
                        {
                            dataKey: 'value',
                            fill: colors.blue.chart,
                            barSize: 10,
                            radius: [2, 2, 0, 0] as [number, number, number, number],
                        },
                    ]}
                    xAxisConfig={{
                        dataKey: 'label',
                    }}
                    yAxisConfig={{
                        hide: false,
                        tickFormatter: (value: number) => compactMAD(value),
                        width: 40,
                    }}
                    tooltipContentConfig={{
                        valueFormatter: (value: number) => MAD(value),
                        nameFormatter: () => 'Monthly revenue',
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

const FleetByStatus = ({ byStatus, totalCars, rented }: FleetByStatusProps) => {
    const chartData = useMemo(() => {
        if (!byStatus) return []
        return Object.entries(byStatus).map(([status, value]) => ({
            label: status,
            value,
            color: statusChartColor(status),
        }))
    }, [byStatus])

    return (
        <Card>
            <div className="flex items-center gap-2 mb-4">
                <h5>Fleet by Status</h5>
            </div>
            <div className="flex items-center gap-2 sm:gap-8 mb-4">
                <div>
                    <p className="mb-1">Total Cars</p>
                    <div className="flex items-center gap-2">
                        <h4>{formatNumber(totalCars)}</h4>
                    </div>
                </div>
                <Divider orientation="vertical" className="h-12" />
                <div>
                    <p className="mb-1">Rented now</p>
                    <div className="flex items-center gap-2">
                        <h4>{formatNumber(rented)}</h4>
                    </div>
                </div>
            </div>

            <div>
                <BarChart
                    data={chartData}
                    height={220}
                    barConfig={[
                        {
                            dataKey: 'value',
                            fill: colors.cyan.chart,
                            barSize: 18,
                            radius: [2, 2, 0, 0] as [number, number, number, number],
                        },
                    ]}
                    xAxisConfig={{
                        dataKey: 'label',
                        axisLine: false,
                        tickLine: false,
                        tick: false,
                    }}
                    yAxisConfig={{
                        axisLine: false,
                        tickLine: false,
                        tick: false,
                    }}
                    cartesianGridConfig={{
                        strokeDasharray: '3 3',
                        horizontal: true,
                        vertical: false,
                    }}
                />
            </div>
            <div className="space-y-2">
                {chartData.map((status) => (
                    <div
                        key={status.label}
                        className="flex items-center justify-between"
                    >
                        <span className="flex items-center gap-2 capitalize">
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: status.color,
                                }}
                            />
                            {status.label}
                        </span>
                        <span className="heading-text font-medium">
                            {status.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    )
}

type OccupancyProps = {
    bookedDays: number
    availableDays: number
    rate: number
}

const Occupancy = ({ bookedDays, availableDays, rate }: OccupancyProps) => {
    const chartData = useMemo(
        () => [
            { label: 'Booked', value: bookedDays },
            { label: 'Available', value: availableDays },
        ],
        [bookedDays, availableDays],
    )

    return (
        <Card>
            <div className="mb-4">
                <h5>Occupancy</h5>
            </div>
            <div className="flex items-center gap-2 sm:gap-8 mb-4">
                <div>
                    <p className="mb-1">Occupancy Rate</p>
                    <div className="flex items-center gap-2">
                        <h4>{Math.round(rate * 100)}%</h4>
                    </div>
                </div>
                <Divider orientation="vertical" className="h-12" />
                <div>
                    <p className="mb-1">Booked Days</p>
                    <div className="flex items-center gap-2">
                        <h4>{formatNumber(bookedDays)}</h4>
                    </div>
                </div>
            </div>

            <div>
                <BarChart
                    data={chartData}
                    height={200}
                    barConfig={[
                        {
                            dataKey: 'value',
                            fill: colors.emerald.chart,
                            barSize: 20,
                            radius: [2, 2, 0, 0] as [number, number, number, number],
                        },
                    ]}
                    xAxisConfig={{
                        dataKey: 'label',
                        axisLine: false,
                        tickLine: false,
                    }}
                    yAxisConfig={{
                        axisLine: false,
                        tickLine: false,
                    }}
                    cartesianGridConfig={{
                        strokeDasharray: '3 3',
                        horizontal: false,
                        vertical: false,
                    }}
                />
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors.emerald.chart }}
                    />
                    <span className="text-sm">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors.gray.chart }}
                    />
                    <span className="text-sm">Available</span>
                </div>
            </div>
        </Card>
    )
}

type TopVehiclesProps = {
    vehicles: CarReport[]
}

const TopVehicles = ({ vehicles }: TopVehiclesProps) => {
    return (
        <Card bodyClass="p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h5>Top Performing Vehicles</h5>
            </div>
            {vehicles.length > 0 ? (
                <Table>
                    <THead>
                        <Tr>
                            <Th>Vehicle</Th>
                            <Th>Revenue</Th>
                            <Th>Expenses</Th>
                            <Th>Margin</Th>
                            <Th>Booked Days</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {vehicles.map((vehicle) => (
                            <Tr key={vehicle.car_id}>
                                <Td>
                                    <div className="flex items-center gap-2">
                                        <IconFrame size={32}>
                                            <span className="heading-text text-lg">
                                                <LiCar />
                                            </span>
                                        </IconFrame>
                                        <div>
                                            <span className="font-medium heading-text">
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
                                    </div>
                                </Td>
                                <Td className="heading-text">
                                    {MAD(vehicle.revenue)}
                                </Td>
                                <Td className="heading-text">
                                    {MAD(vehicle.expenses)}
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
                                        {MAD(vehicle.margin)}
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
    timeRange: TimeRange
    comparisonEnabled: boolean
    onTimeRangeChange: (range: TimeRange) => void
    onComparisonChange: (enabled: boolean) => void
}

const DashboardHeader = ({
    userName,
    currentDate,
    timeRange,
    comparisonEnabled,
    onTimeRangeChange,
    onComparisonChange,
}: DashboardHeaderProps) => {
    const formattedDate = useMemo(
        () => formatDate(currentDate, 'dddd, DD MMMM YYYY'),
        [currentDate],
    )

    const displayName = userName || 'User'

    const currentTimeRangeLabel =
        timeRangeOptions.find((opt) => opt.key === timeRange)?.label ||
        'This Month'

    const handleTimeRangeSelect = (eventKey: string) => {
        onTimeRangeChange(eventKey as TimeRange)
    }

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0 py-2.5">
            <div>
                <h4>Hey, {displayName}</h4>
                <p className="mt-1">{formattedDate}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="heading-text">Comparison:</span>
                    <Switcher
                        checked={comparisonEnabled}
                        onChange={(checked) => onComparisonChange(checked)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="heading-text">Time Range:</span>
                    <Dropdown
                        activeKey={timeRange}
                        renderTitle={
                            <Button
                                icon={<LiChevronDown className="text-sm" />}
                                iconAlignment="end"
                            >
                                {currentTimeRangeLabel}
                            </Button>
                        }
                        placement="bottom-end"
                    >
                        {timeRangeOptions.map((option) => (
                            <Dropdown.Item
                                key={option.key}
                                eventKey={option.key}
                                onSelect={handleTimeRangeSelect}
                            >
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

const MetricCardSkeleton = () => {
    return (
        <StatisticCard
            inset
            footer={
                <div className="flex items-center justify-between gap-2 py-1.5">
                    <Skeleton height={12} width={60} />
                    <span>
                        <Skeleton height={12} width={60} />
                    </span>
                </div>
            }
        >
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg text-xl border border-gray-200 dark:border-gray-700 heading-text">
                    <Skeleton height={16} width={16} />
                </div>
            </div>
            <div className="mt-8 space-y-2">
                <Skeleton height={12} width={80} />
                <Skeleton height={12} width={160} />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, index) => (
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

    const [timeRange, setTimeRange] = useState<TimeRange>('thisMonth')
    const [comparisonEnabled, setComparisonEnabled] = useState(true)

    const comparisonPeriod = useMemo(
        () => getComparisonPeriodForTimeRange(timeRange),
        [timeRange],
    )

    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [prevSummary, setPrevSummary] = useState<DashboardSummary | null>(
        null,
    )
    const [timeline, setTimeline] = useState<DashboardTimeline | null>(null)
    const [vehicles, setVehicles] = useState<CarReport[]>([])
    const [loading, setLoading] = useState(true)

    const fetchDashboard = useCallback(async () => {
        setLoading(true)

        const { current, comparison } = getDateRanges(
            timeRange,
            comparisonPeriod,
        )

        try {
            const [summaryRes, prevRes, timelineRes, carsRes] =
                await Promise.all([
                    apiGetDashboardSummary({
                        from: toDateString(current.start),
                        to: toDateString(current.end),
                    }),
                    comparisonEnabled
                        ? apiGetDashboardSummary({
                              from: toDateString(comparison.start),
                              to: toDateString(comparison.end),
                          })
                        : Promise.resolve(null),
                    apiGetDashboardTimeline({ months: 12 }).catch(() => null),
                    apiGetCarReports({
                        from: toDateString(current.start),
                        to: toDateString(current.end),
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
    }, [timeRange, comparisonPeriod, comparisonEnabled])

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

    const expensesChange = useMemo(
        () =>
            summary && prevSummary
                ? pctChange(
                      summary.expenses.total,
                      prevSummary.expenses.total,
                  )
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

    const occupancyChange = useMemo(
        () =>
            summary && prevSummary
                ? pctChange(
                      summary.occupancy.rate,
                      prevSummary.occupancy.rate,
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
                    timeRange={timeRange}
                    comparisonEnabled={comparisonEnabled}
                    onTimeRangeChange={setTimeRange}
                    onComparisonChange={setComparisonEnabled}
                />
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard
                            title="Net Revenue"
                            value={summary?.net ?? 0}
                            change={netRevenueChange}
                            icon={<LiWalletMoney />}
                            formatter={MAD}
                        />
                        <MetricCard
                            title="Expenses"
                            value={summary?.expenses.total ?? 0}
                            change={expensesChange}
                            icon={<LiReceipt />}
                            formatter={MAD}
                        />
                        <MetricCard
                            title="Reservations"
                            value={summary?.reservations.total ?? 0}
                            change={reservationsChange}
                            icon={<LiCalendar />}
                        />
                        <MetricCard
                            title="Occupancy"
                            value={`${Math.round((summary?.occupancy.rate ?? 0) * 100)}%`}
                            change={occupancyChange}
                            icon={<LiBarChartUp />}
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
                                comparisonEnabled={comparisonEnabled}
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
                                    comparisonEnabled={comparisonEnabled}
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
                                    comparisonEnabled={comparisonEnabled}
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