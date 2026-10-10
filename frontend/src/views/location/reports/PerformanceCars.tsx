import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Skeleton from '@/components/ui/Skeleton'
import IconFrame from '@/components/shared/IconFrame'
import { BarChart } from '@/components/shared/Chart'
import { colors } from '@/constants/colors.constant'
import classNames from '@/utils/classNames'
import { apiGetCarReports } from '@/services/LocationService'
import { LiBarChartUp, LiCar, LiReceipt, LiWalletMoney } from '@/icons'
import { MAD } from '../shared'
import { ReportEmpty, ReportHeader, ReportMetrics } from './shared'
import { resolveReportRange } from './shared'
import type { ReportMetric, ReportRange } from './shared'
import type { CarReport } from '@/@types/location'

const { Tr, Th, Td, THead, TBody } = Table

const compactMAD = (value: number) => {
    if (Math.abs(value) >= 1e6) {
        return `${(value / 1e6).toFixed(1)}M`
    }
    if (Math.abs(value) >= 1e3) {
        return `${(value / 1e3).toFixed(0)}k`
    }
    return `${Math.round(value)}`
}

const PerformanceCars = () => {
    const [range, setRange] = useState<ReportRange>('thisMonth')
    const [cars, setCars] = useState<CarReport[]>([])
    const [loading, setLoading] = useState(true)

    const period = useMemo(() => resolveReportRange(range), [range])

    const fetchReports = useCallback(() => {
        setLoading(true)
        apiGetCarReports({ from: period.from, to: period.to })
            .then(setCars)
            .catch(() => setCars([]))
            .finally(() => setLoading(false))
    }, [period.from, period.to])

    useEffect(() => {
        fetchReports()
    }, [fetchReports])

    const totals = useMemo(
        () =>
            cars.reduce(
                (acc, car) => ({
                    revenue: acc.revenue + car.revenue,
                    expenses: acc.expenses + car.expenses,
                    margin: acc.margin + car.margin,
                    booked_days: acc.booked_days + car.booked_days,
                }),
                { revenue: 0, expenses: 0, margin: 0, booked_days: 0 },
            ),
        [cars],
    )

    const metrics: ReportMetric[] = [
        {
            key: 'revenue',
            title: 'Revenue',
            value: totals.revenue,
            icon: <LiWalletMoney />,
            color: colors.emerald,
        },
        {
            key: 'expenses',
            title: 'Expenses',
            value: totals.expenses,
            icon: <LiReceipt />,
            color: colors.rose,
        },
        {
            key: 'margin',
            title: 'Margin',
            value: totals.margin,
            icon: <LiBarChartUp />,
            color: colors.blue,
        },
        {
            key: 'booked',
            title: 'Booked days',
            value: totals.booked_days,
            icon: <LiCar />,
            color: colors.orange,
            formatter: (value) => value.toLocaleString(),
        },
    ]

    const chartData = useMemo(
        () =>
            [...cars]
                .slice(0, 8)
                .map((car) => ({
                    label: car.registration_number,
                    value: car.margin,
                })),
        [cars],
    )

    return (
        <Container>
            <ReportHeader
                title="Vehicle performance"
                description="Revenue, expenses and margin for every car on hire"
                range={range}
                onRangeChange={setRange}
            />

            <ReportMetrics items={metrics} loading={loading} />

            <div className="mb-6">
                <Card>
                    <div className="mb-4">
                        <h5>Top vehicles by margin</h5>
                    </div>
                    {loading ? (
                        <Skeleton height={280} />
                    ) : chartData.length > 0 ? (
                        <BarChart
                            data={chartData}
                            height={280}
                            barConfig={[
                                {
                                    dataKey: 'value',
                                    fill: colors.emerald.chart,
                                    barSize: 26,
                                    radius: [2, 2, 0, 0] as [
                                        number,
                                        number,
                                        number,
                                        number,
                                    ],
                                },
                            ]}
                            xAxisConfig={{ dataKey: 'label' }}
                            yAxisConfig={{
                                tickFormatter: (value: number) =>
                                    compactMAD(value),
                                width: 48,
                            }}
                            tooltipContentConfig={{
                                valueFormatter: (value: number) => MAD(value),
                                nameFormatter: () => 'Margin',
                            }}
                        />
                    ) : (
                        <ReportEmpty message="No vehicle data available" />
                    )}
                </Card>
            </div>

            <Card bodyClass="p-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h5>Vehicle performance</h5>
                </div>
                {loading ? (
                    <Table hoverable={false}>
                        <THead>
                            <Tr>
                                <Th>Vehicle</Th>
                                <Th>Revenue</Th>
                                <Th>Expenses</Th>
                                <Th>Margin</Th>
                                <Th>Booked days</Th>
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
                                                    width={90}
                                                />
                                            </Td>
                                        ),
                                    )}
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                ) : cars.length > 0 ? (
                    <Table>
                        <THead>
                            <Tr>
                                <Th>Vehicle</Th>
                                <Th>Revenue</Th>
                                <Th>Expenses</Th>
                                <Th>Margin</Th>
                                <Th>Booked days</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {cars.map((car) => (
                                <Tr key={car.car_id}>
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
                                                        car.registration_number
                                                    }
                                                </span>
                                                {car.brand && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {car.brand}
                                                        {car.model
                                                            ? ` · ${car.model}`
                                                            : ''}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Td>
                                    <Td className="heading-text">
                                        {MAD(car.revenue)}
                                    </Td>
                                    <Td className="heading-text">
                                        {MAD(car.expenses)}
                                    </Td>
                                    <Td>
                                        <span
                                            className={classNames(
                                                'heading-text font-medium',
                                                car.margin >= 0
                                                    ? 'text-success'
                                                    : 'text-error',
                                            )}
                                        >
                                            {MAD(car.margin)}
                                        </span>
                                    </Td>
                                    <Td className="heading-text">
                                        {car.booked_days}
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                ) : (
                    <ReportEmpty message="No vehicle data available" />
                )}
            </Card>
        </Container>
    )
}

export default PerformanceCars
