import Scroll from '@/components/ui/Scroll'
import Tabs from '@/components/ui/Tabs'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import type { RevenueTrendsData, MetricType } from '../types'
import classNames from '@/utils/classNames'

type RevenueMetricsProps = {
    trendsData: RevenueTrendsData | null
    isLoading: boolean
    selectedMetric: string
    onMetricChange: (metric: MetricType) => void
}

const { TabNav, TabList } = Tabs

const RevenueMetrics = ({
    trendsData,
    onMetricChange,
    selectedMetric,
}: RevenueMetricsProps) => {
    const formatCurrency = (value: number) => {
        return `$${value.toLocaleString()}`
    }

    const formatNumber = (value: number) => {
        return value.toLocaleString()
    }

    const metrics = [
        {
            label: 'Monthly Recurring Revenue',
            value: trendsData?.summary?.currentMrr,
            growth: trendsData?.summary?.mrrGrowth,
            formatter: formatCurrency,
            key: 'mrr',
        },
        {
            label: 'Annual Recurring Revenue',
            value: trendsData?.summary?.currentArr,
            growth: trendsData?.summary?.arrGrowth,
            formatter: formatCurrency,
            key: 'arr',
        },
        {
            label: 'Active Subscriptions',
            value: trendsData?.summary?.currentActiveSubscriptions,
            growth: trendsData?.summary?.activeSubscriptionsGrowth,
            formatter: formatNumber,
            key: 'activeSubscriptions',
        },
        {
            label: 'Net Revenue',
            value: trendsData?.summary?.currentNetRevenue,
            growth: trendsData?.summary?.netRevenueGrowth,
            formatter: formatCurrency,
            key: 'netRevenue',
        },
    ]

    return (
        <Tabs
            value={selectedMetric}
            onChange={(value) => onMetricChange(value as MetricType)}
        >
            <Scroll edgeShadow>
                <TabList className="flex lg:grid lg:grid-cols-4 overflow-x-hidden">
                    {metrics.map((metric) => {
                        return (
                            <TabNav
                                key={metric.key}
                                value={metric.key}
                                className="justify-start min-w-[230px] p-0"
                            >
                                <span
                                    className={classNames(
                                        'space-y-1 py-4 px-6 w-full transition duration-150 hover:bg-gray-50 dark:hover:bg-gray-800',
                                    )}
                                >
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                                        {metric.label}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="h5">
                                            {metric.value
                                                ? metric.formatter(metric.value)
                                                : '--'}
                                        </span>
                                        {metric.growth !== undefined && (
                                            <GrowShrinkTag
                                                value={metric.growth}
                                                suffix="%"
                                            />
                                        )}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                                        vs previous period
                                    </span>
                                </span>
                            </TabNav>
                        )
                    })}
                </TabList>
            </Scroll>
        </Tabs>
    )
}

export default RevenueMetrics
