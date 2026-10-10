import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import Skeleton from '@/components/ui/Skeleton'
import { LineChart } from '@/components/shared/Chart'
import { colors } from '@/constants/colors.constant'
import { apiGetPaymentsOverview } from '@/services/LocationService'
import { LiClock, LiRefresh, LiStatusUp, LiWalletMoney } from '@/icons'
import { MAD, tagToneClass } from '../shared'
import type { TagTone } from '../shared'
import { ReportEmpty, ReportHeader, ReportMetrics } from './shared'
import { resolveReportRange } from './shared'
import type { ReportMetric, ReportRange } from './shared'
import type { PaymentOverview } from '@/@types/location'

const { Tr, Th, Td, THead, TBody } = Table

const PerformanceCollections = () => {
    const [range, setRange] = useState<ReportRange>('thisMonth')
    const [overview, setOverview] = useState<PaymentOverview | null>(null)
    const [loading, setLoading] = useState(true)

    const period = useMemo(() => resolveReportRange(range), [range])

    const fetchReport = useCallback(() => {
        setLoading(true)
        apiGetPaymentsOverview({ from: period.from, to: period.to })
            .then(setOverview)
            .catch(() => setOverview(null))
            .finally(() => setLoading(false))
    }, [period.from, period.to])

    useEffect(() => {
        fetchReport()
    }, [fetchReport])

    const collectionRate = useMemo(() => {
        const paid = overview?.totals.paid ?? 0
        const pending = overview?.totals.pending ?? 0
        const billed = paid + pending

        return billed > 0 ? (paid / billed) * 100 : 0
    }, [overview])

    const chartData = useMemo(() => {
        if (!overview) {
            return []
        }

        return overview.trend.labels.map((label, index) => ({
            date: dayjs(label).format('DD/MM'),
            paid: overview.trend.paid[index] ?? 0,
            pending: overview.trend.pending[index] ?? 0,
            refunded: overview.trend.refunded[index] ?? 0,
        }))
    }, [overview])

    const metrics: ReportMetric[] = [
        {
            key: 'received',
            title: 'Total received',
            value: overview?.totals.paid ?? 0,
            icon: <LiWalletMoney />,
            color: colors.emerald,
        },
        {
            key: 'pending',
            title: 'Pending',
            value: overview?.totals.pending ?? 0,
            icon: <LiClock />,
            color: colors.yellow,
        },
        {
            key: 'refunded',
            title: 'Refunded',
            value: overview?.totals.refunded ?? 0,
            icon: <LiRefresh />,
            color: colors.red,
        },
        {
            key: 'net',
            title: 'Net collected',
            value: overview?.totals.net ?? 0,
            icon: <LiStatusUp />,
            color: colors.blue,
        },
    ]

    const statusRows: {
        status: string
        tone: TagTone
        count: number
        amount: number
    }[] = [
        {
            status: 'paid',
            tone: 'success',
            count: overview?.counts.paid ?? 0,
            amount: overview?.totals.paid ?? 0,
        },
        {
            status: 'pending',
            tone: 'warning',
            count: overview?.counts.pending ?? 0,
            amount: overview?.totals.pending ?? 0,
        },
        {
            status: 'refunded',
            tone: 'neutral',
            count: overview?.counts.refunded ?? 0,
            amount: overview?.totals.refunded ?? 0,
        },
    ]

    return (
        <Container>
            <ReportHeader
                title="Collection performance"
                description="Cash collected, still pending and refunded over the period"
                range={range}
                onRangeChange={setRange}
            />

            <ReportMetrics items={metrics} loading={loading} />

            <div className="mb-6">
                <Card>
                    <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <h5>Daily collections</h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Collection rate:{' '}
                            <span className="font-semibold heading-text">
                                {collectionRate.toFixed(1)}%
                            </span>
                        </span>
                    </div>
                    {loading ? (
                        <Skeleton height={300} />
                    ) : (
                        <LineChart
                            data={chartData}
                            height={300}
                            lineConfig={[
                                { type: 'linear', dataKey: 'paid' },
                                { type: 'linear', dataKey: 'pending' },
                                { type: 'linear', dataKey: 'refunded' },
                            ]}
                            xAxisConfig={{
                                dataKey: 'date',
                                axisLine: false,
                                tickLine: false,
                            }}
                            yAxisConfig={{
                                axisLine: false,
                                tickLine: false,
                                width: 48,
                            }}
                            tooltipContentConfig={{
                                valueFormatter: (value: number) => MAD(value),
                                nameFormatter: (name: string) => {
                                    if (name === 'paid') {
                                        return 'Received'
                                    }
                                    if (name === 'pending') {
                                        return 'Pending'
                                    }
                                    return 'Refunded'
                                },
                            }}
                        />
                    )}
                    <div className="flex items-center justify-center gap-4 mt-4">
                        {[
                            { label: 'Received', color: colors.emerald.chart },
                            { label: 'Pending', color: colors.yellow.chart },
                            { label: 'Refunded', color: colors.red.chart },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-2"
                            >
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card bodyClass="p-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h5>Collection by status</h5>
                </div>
                {loading ? (
                    <div className="p-4">
                        <Skeleton height={120} />
                    </div>
                ) : (
                    <Table>
                        <THead>
                            <Tr>
                                <Th>Status</Th>
                                <Th>Records</Th>
                                <Th>Amount</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {statusRows.map((row) => (
                                <Tr key={row.status}>
                                    <Td>
                                        <Tag
                                            className={`capitalize ${tagToneClass[row.tone]}`}
                                        >
                                            {row.status}
                                        </Tag>
                                    </Td>
                                    <Td className="heading-text">
                                        {row.count.toLocaleString()}
                                    </Td>
                                    <Td className="heading-text">
                                        {MAD(row.amount)}
                                    </Td>
                                </Tr>
                            ))}
                            <Tr>
                                <Td className="font-medium heading-text">
                                    Total
                                </Td>
                                <Td className="heading-text">
                                    {(
                                        overview?.counts.paid ??
                                        0
                                    ).toLocaleString()}
                                    {' / '}
                                    {(
                                        overview?.counts.total ??
                                        0
                                    ).toLocaleString()}
                                </Td>
                                <Td className="heading-text">
                                    {MAD(overview?.totals.net ?? 0)}
                                </Td>
                            </Tr>
                        </TBody>
                    </Table>
                )}
            </Card>

            {!loading && chartData.length === 0 && (
                <div className="mt-6">
                    <ReportEmpty message="No payments in this period" />
                </div>
            )}
        </Container>
    )
}

export default PerformanceCollections
