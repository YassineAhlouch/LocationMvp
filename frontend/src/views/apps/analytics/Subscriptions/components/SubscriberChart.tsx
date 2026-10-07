import useSWR from 'swr'
import BarChart from '@/components/shared/Chart/BarChart'
import Spinner from '@/components/ui/Spinner'
import { defaultColors } from '@/components/shared/Chart/configs'
import { useSubscriptionAnalyticsStore } from '@/views/apps/analytics/Subscriptions/store/subscriptionAnalyticsStore'
import { apiGetSubscriberTrends } from '@/services/AnalyticService'
import type { GetSubscriberTrendsResponse } from '../types'

const chartColor1 = defaultColors[1]
const chartColor2 = defaultColors[4]

const baseBarConfig = {
    barSize: 10,
    radius: 8,
    stackId: 'trends',
}

const SubscriberChart = () => {
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[320px]">
                <Spinner size={40} />
            </div>
        )
    }

    if (error || !data) {
        return null
    }

    const chartData = data.trends.map((trend) => ({
        ...trend,
        gap: 100,
        date: new Date(trend.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }),
    }))

    return (
        <>
            <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h5>Subscriber Growth Trends</h5>
                <div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-0.5 rounded"
                                style={{ backgroundColor: chartColor1 }}
                            />
                            <span className="font-medium">New Subscribers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-0.5 rounded"
                                style={{ backgroundColor: chartColor2 }}
                            />
                            <span className="font-medium">Unsubscribers</span>
                        </div>
                    </div>
                </div>
            </div>
            <BarChart
                data={chartData}
                height={320}
                stackOffset="sign"
                barConfig={[
                    {
                        dataKey: 'newSubscribers',
                        name: 'New Subscribers',
                        fill: chartColor1,
                        style: { transform: 'translate(0px, -4px)' },
                        ...baseBarConfig,
                    },
                    {
                        dataKey: 'unsubscribers',
                        name: 'Unsubscribers',
                        fill: chartColor2,
                        style: { transform: 'translate(0px, 4px)' },
                        ...baseBarConfig,
                    },
                ]}
                xAxisConfig={{ dataKey: 'date' }}
                tooltipConfig={{
                    content: ({ payload, label }) => (
                        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                            <p className="font-medium heading-text mb-2">
                                {label}
                            </p>
                            <div className="space-y-1">
                                {payload.map((entry, index) => (
                                    <p
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor: entry.color,
                                            }}
                                        />
                                        <span className="capitalize font-mono font-medium tabular-nums text-xs heading-text">
                                            {entry.dataKey
                                                .replace(/([A-Z])/g, ' $1')
                                                .trim()}
                                            :
                                        </span>
                                        <span className="font-medium heading-text">
                                            {entry.value.toLocaleString()}
                                        </span>
                                    </p>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
                                <p className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                                    <span className="capitalize font-mono font-medium tabular-nums text-xs heading-text">
                                        Net Growth:
                                    </span>
                                    <span
                                        className={`font-medium ${payload[0]?.payload?.netGrowth >= 0 ? 'text-success' : 'text-error'}`}
                                    >
                                        {payload[0]?.payload?.netGrowth >= 0
                                            ? '+'
                                            : ''}
                                        {payload[0]?.payload?.netGrowth?.toLocaleString()}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ),
                }}
            />
        </>
    )
}

export default SubscriberChart
