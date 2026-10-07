import Skeleton from '@/components/ui/Skeleton'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import Divider from '@/components/shared/Divider'
import { useSubscriptionAnalyticsStore } from '@/views/apps/analytics/Subscriptions/store/subscriptionAnalyticsStore'
import { apiGetSubscriberTrends } from '@/services/AnalyticService'
import useSWR from 'swr'
import type { GetSubscriberTrendsResponse } from '../types'

const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
}

const MetricItem = ({
    title,
    value,
    percentage,
    neutral,
}: {
    title: string
    value: string | number
    percentage: number
    neutral?: boolean
}) => (
    <div className="space-y-1">
        <div className="flex items-center gap-2">
            <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-end gap-2">
            <h4>{typeof value === 'number' ? formatNumber(value) : value}</h4>
            <span>
                {neutral ? (
                    <span className="font-medium text-xs">({percentage}%)</span>
                ) : (
                    <GrowShrinkTag
                        className="bg-transparent p-0"
                        value={percentage}
                        suffix="%"
                    />
                )}
            </span>
        </div>
    </div>
)

const SubscriberMetrics = () => {
    const { dateRange } = useSubscriptionAnalyticsStore()

    const { data, isLoading, error } = useSWR(
        [
            '/api/analytic/subscription/trends',
            {
                startDate: dateRange.startDate.toISOString(),
                endDate: dateRange.endDate.toISOString(),
            },
        ],
        ([, params]) =>
            apiGetSubscriberTrends<
                GetSubscriberTrendsResponse,
                Record<string, unknown>
            >(params),
        {
            revalidateOnFocus: false,
        },
    )

    console.log('data', data)

    if (isLoading) {
        return (
            <div className="space-y-6 p-4">
                <div className="space-y-6">
                    <Skeleton height={10} width={100} />
                    <div className="space-y-2">
                        <Skeleton height={10} />
                        <Skeleton height={10} />
                        <Skeleton height={10} />
                        <Skeleton height={10} width="60%" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton height={10} width={120} />
                        <Skeleton height={10} width={80} />
                    </div>
                    <div className="space-y-2">
                        <Skeleton height={10} width={120} />
                        <Skeleton height={10} width={80} />
                    </div>
                    <div>
                        <Divider />
                    </div>
                    <div className="space-y-2">
                        <Skeleton height={10} width={120} />
                        <Skeleton height={10} width={80} />
                    </div>
                </div>
            </div>
        )
    }

    if (error || !data) {
        return null
    }

    const { metrics } = data

    const generateInsights = () => {
        const insights = []
        const churnRate = metrics.churnRate
        const growthRate = metrics.totalGrowth
        const activePercentage = metrics.activeSubscribers.percentage

        // Churn analysis
        if (churnRate < 3) {
            insights.push(
                'Excellent retention with low churn rate - your subscribers are highly engaged.',
            )
        } else if (churnRate < 5) {
            insights.push(
                'Healthy churn rate within industry standards - monitor for any upward trends.',
            )
        } else {
            insights.push(
                'Elevated churn rate detected - consider reviewing subscriber satisfaction and engagement strategies.',
            )
        }

        // Growth analysis
        if (growthRate > 10) {
            insights.push(
                'Strong subscriber growth momentum - capitalize on current acquisition channels.',
            )
        } else if (growthRate > 5) {
            insights.push(
                'Steady growth trajectory - explore opportunities to accelerate acquisition.',
            )
        } else if (growthRate > 0) {
            insights.push(
                'Modest growth - focus on optimizing conversion funnels and retention strategies.',
            )
        } else {
            insights.push(
                'Negative growth trend - immediate attention needed for acquisition and retention.',
            )
        }

        // Engagement analysis
        if (activePercentage > 90) {
            insights.push(
                'Outstanding subscriber engagement levels across your user base.',
            )
        } else if (activePercentage > 80) {
            insights.push(
                'Good engagement rates - identify and replicate successful engagement patterns.',
            )
        } else {
            insights.push(
                'Engagement opportunity - consider implementing re-activation campaigns for inactive subscribers.',
            )
        }

        return insights.slice(0, 2) // Return top 2 insights
    }

    const insights = generateInsights()

    return (
        <div className="space-y-6 p-4">
            <div>
                <h5>Insights</h5>
                <div className="space-y-2 mt-2">
                    {insights.map((insight, index) => (
                        <div className="flex gap-2" key={index}>
                            <div>•</div>
                            <p>{insight}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                <MetricItem
                    title="Active Subscribers"
                    value={metrics.activeSubscribers.value}
                    percentage={metrics.activeSubscribers.percentage}
                />

                <MetricItem
                    title="New Subscribers"
                    value={metrics.newSubscribers.value}
                    percentage={metrics.newSubscribers.percentage}
                />
                <div>
                    <Divider />
                </div>
                <MetricItem
                    title="Churned Subscribers"
                    value={metrics.churnedSubscribers.value}
                    percentage={metrics.churnedSubscribers.percentage}
                    neutral
                />
            </div>
        </div>
    )
}

export default SubscriberMetrics
