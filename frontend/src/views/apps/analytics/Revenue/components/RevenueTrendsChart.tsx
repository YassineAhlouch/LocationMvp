import { useMemo } from 'react'
import useSWR from 'swr'
import Card from '@/components/ui/Card'
import Switcher from '@/components/ui/Switcher'
import LineChart from '@/components/shared/Chart/LineChart'
import Loading from '@/components/shared/Loading'
import RevenueMetrics from './RevenueMetrics'
import { useRevenueAnalyticsStore } from '../store/revenueAnalyticsStore'
import { apiGetAllRevenueTrends } from '@/services/AnalyticService'
import dayjs from 'dayjs'
import type {
    MetricType,
    GetRevenueTrendsResponse,
    GetRevenueTrendsRequest,
} from '../types'

type LineConfig = {
    type?: 'linear' | 'monotone'
    dataKey: MetricType
    stroke: string
    strokeWidth: number
    dot: boolean
    strokeDasharray?: string
}

const metricOptions: Array<{
    value: MetricType
    label: string
    color: string
}> = [
    { value: 'mrr', label: 'MRR', color: 'var(--primary)' },
    { value: 'arr', label: 'ARR', color: 'var(--success)' },
    {
        value: 'activeSubscriptions',
        label: 'Active Subscriptions',
        color: 'var(--info)',
    },
    { value: 'netRevenue', label: 'Net Revenue', color: 'var(--warning)' },
]
const RevenueTrendsChart = () => {
    const dateRange = useRevenueAnalyticsStore((state) => state.dateRange)
    const selectedMetric = useRevenueAnalyticsStore(
        (state) => state.selectedMetric,
    )
    const comparisonMode = useRevenueAnalyticsStore(
        (state) => state.comparisonMode,
    )
    const setSelectedMetric = useRevenueAnalyticsStore(
        (state) => state.setSelectedMetric,
    )
    const setComparisonMode = useRevenueAnalyticsStore(
        (state) => state.setComparisonMode,
    )

    const {
        data: trendsData,
        isLoading,
        error,
    } = useSWR(
        dateRange
            ? [
                  '/api/analytic/revenue/trends/all',
                  {
                      startDate: dateRange.startDate,
                      endDate: dateRange.endDate,
                      includeComparison: comparisonMode !== 'none',
                      comparisonType: comparisonMode,
                  },
              ]
            : null,
        ([, params]) =>
            apiGetAllRevenueTrends<
                GetRevenueTrendsResponse,
                Partial<GetRevenueTrendsRequest>
            >(params),
        {
            revalidateOnFocus: false,
            onError: (error) => {
                console.error('Failed to fetch revenue trends:', error)
            },
        },
    )

    const chartData = useMemo(() => {
        const metricData = trendsData?.metrics?.[selectedMetric]
        if (!metricData || !Array.isArray(metricData)) return []

        return metricData.map((item) => ({
            date: dayjs(item.date).format('MMM DD'),
            [selectedMetric]: item.value,
            ...(comparisonMode !== 'none' &&
                item.previousValue && {
                    [`${selectedMetric}Previous`]: item.previousValue,
                }),
        }))
    }, [trendsData, selectedMetric, comparisonMode])

    const lineConfig = useMemo(() => {
        const selectedOption = metricOptions.find(
            (option) => option.value === selectedMetric,
        )
        const config: LineConfig[] = [
            {
                type: 'linear',
                dataKey: selectedMetric,
                stroke: selectedOption?.color || 'var(--primary)',
                strokeWidth: 3,
                dot: false,
            },
        ]

        if (comparisonMode !== 'none') {
            config.push({
                type: 'linear',
                dataKey: `${selectedMetric}Previous` as MetricType,
                stroke: 'var(--gray-400)',
                strokeWidth: 2,
                strokeDasharray: '5 5',
                dot: false,
            })
        }
        return config
    }, [selectedMetric, comparisonMode])

    const getComparisonLabel = () => {
        switch (comparisonMode) {
            case 'previousPeriod':
                return 'Previous Period'
            case 'sameLastYear':
                return 'Same Period Last Year'
            default:
                return 'Previous Period'
        }
    }

    return (
        <Card bodyClass="p-0">
            <RevenueMetrics
                trendsData={trendsData || null}
                isLoading={isLoading}
                selectedMetric={selectedMetric}
                onMetricChange={setSelectedMetric}
            />
            <div className="flex flex-col gap-6 p-6">
                <div className="relative">
                    <Loading loading={isLoading} type="cover">
                        {error ? (
                            <div className="flex items-center justify-center h-96 text-gray-500">
                                <div className="text-center">
                                    <p className="text-lg font-medium">
                                        Failed to load revenue trends
                                    </p>
                                    <p className="text-sm">
                                        Please try refreshing the page
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <LineChart
                                data={chartData}
                                lineConfig={lineConfig}
                                height={400}
                                xAxisConfig={{
                                    dataKey: 'date',
                                }}
                            />
                        )}
                    </Loading>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        {comparisonMode !== 'none' && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-0.5 rounded"
                                        style={{
                                            backgroundColor: metricOptions.find(
                                                (o) =>
                                                    o.value === selectedMetric,
                                            )?.color,
                                        }}
                                    />
                                    <span>Current Period</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-0.5 rounded"
                                        style={{
                                            borderTop:
                                                '2px dashed var(--gray-400)',
                                            backgroundColor: 'transparent',
                                        }}
                                    />
                                    <span>{getComparisonLabel()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">
                            Compare to last year
                        </span>
                        <Switcher
                            checked={comparisonMode === 'sameLastYear'}
                            onChange={(checked) =>
                                setComparisonMode(
                                    checked ? 'sameLastYear' : 'none',
                                )
                            }
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default RevenueTrendsChart
