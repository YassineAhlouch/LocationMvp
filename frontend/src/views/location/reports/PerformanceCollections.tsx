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
import { money, tagToneClass } from '../shared'
import useTranslation from '@/utils/hooks/useTranslation'
import type { TagTone } from '../shared'
import { ReportEmpty, ReportHeader, ReportMetrics } from './shared'
import { resolveReportRange } from './shared'
import type { ReportMetric, ReportRange } from './shared'
import type { PaymentOverview } from '@/@types/location'

const { Tr, Th, Td, THead, TBody } = Table

const PerformanceCollections = () => {
    const { t } = useTranslation()
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
            title: t('reports.collections.metrics.received', 'Total received'),
            value: overview?.totals.paid ?? 0,
            icon: <LiWalletMoney />,
            color: colors.emerald,
        },
        {
            key: 'pending',
            title: t('reports.collections.metrics.pending', 'Pending'),
            value: overview?.totals.pending ?? 0,
            icon: <LiClock />,
            color: colors.yellow,
        },
        {
            key: 'refunded',
            title: t('reports.collections.metrics.refunded', 'Refunded'),
            value: overview?.totals.refunded ?? 0,
            icon: <LiRefresh />,
            color: colors.red,
        },
        {
            key: 'net',
            title: t('reports.collections.metrics.net', 'Net collected'),
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
                title={t('reports.collections.title', 'Collection performance')}
                description={t(
                    'reports.collections.description',
                    'Cash collected, still pending and refunded over the period',
                )}
                range={range}
                onRangeChange={setRange}
            />

            <ReportMetrics items={metrics} loading={loading} />

            <div className="mb-6">
                <Card>
                    <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <h5>
                            {t(
                                'reports.collections.dailyCollections',
                                'Daily collections',
                            )}
                        </h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t(
                                'reports.collections.collectionRate',
                                'Collection rate:',
                            )}{' '}
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
                                valueFormatter: (value: number) => money(value),
                                nameFormatter: (name: string) => {
                                    if (name === 'paid') {
                                        return t(
                                            'reports.collections.series.received',
                                            'Received',
                                        )
                                    }
                                    if (name === 'pending') {
                                        return t(
                                            'reports.collections.series.pending',
                                            'Pending',
                                        )
                                    }
                                    return t(
                                        'reports.collections.series.refunded',
                                        'Refunded',
                                    )
                                },
                            }}
                        />
                    )}
                    <div className="flex items-center justify-center gap-4 mt-4">
                        {[
                            {
                                label: t(
                                    'reports.collections.series.received',
                                    'Received',
                                ),
                                color: colors.emerald.chart,
                            },
                            {
                                label: t(
                                    'reports.collections.series.pending',
                                    'Pending',
                                ),
                                color: colors.yellow.chart,
                            },
                            {
                                label: t(
                                    'reports.collections.series.refunded',
                                    'Refunded',
                                ),
                                color: colors.red.chart,
                            },
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
                    <h5>
                        {t(
                            'reports.collections.byStatus',
                            'Collection by status',
                        )}
                    </h5>
                </div>
                {loading ? (
                    <div className="p-4">
                        <Skeleton height={120} />
                    </div>
                ) : (
                    <Table>
                        <THead>
                            <Tr>
                                <Th>{t('reports.collections.columns.status', 'Status')}</Th>
                                <Th>{t('reports.collections.columns.records', 'Records')}</Th>
                                <Th>{t('reports.collections.columns.amount', 'Amount')}</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {statusRows.map((row) => (
                                <Tr key={row.status}>
                                    <Td>
                                        <Tag
                                            className={`capitalize ${tagToneClass[row.tone]}`}
                                        >
                                            {t(
                                                `payments.status.${row.status}`,
                                                row.status,
                                            )}
                                        </Tag>
                                    </Td>
                                    <Td className="heading-text">
                                        {row.count.toLocaleString()}
                                    </Td>
                                    <Td className="heading-text">
                                        {money(row.amount)}
                                    </Td>
                                </Tr>
                            ))}
                            <Tr>
                                <Td className="font-medium heading-text">
                                    {t(
                                        'reports.collections.total',
                                        'Total',
                                    )}
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
                                    {money(overview?.totals.net ?? 0)}
                                </Td>
                            </Tr>
                        </TBody>
                    </Table>
                )}
            </Card>

            {!loading && chartData.length === 0 && (
                <div className="mt-6">
                    <ReportEmpty
                        message={t(
                            'reports.collections.noData',
                            'No payments in this period',
                        )}
                    />
                </div>
            )}
        </Container>
    )
}

export default PerformanceCollections
