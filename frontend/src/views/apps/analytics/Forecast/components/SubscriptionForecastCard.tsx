import BarChart from '@/components/shared/Chart/BarChart'
import ChartLegendContent from '@/components/shared/Chart/ChartLegendContent'
import ForecastCard from './ForecastCard'
import PrimaryMetric from './PrimaryMetric'
import ParametersList from './ParametersList'
import { defaultColors } from '@/components/shared/Chart/configs'
import { useForecastStore } from '../store/forecastStore'
import { dateRangeValues } from '../utils'
import { apiGetSubscriptionForecast } from '@/services/AnalyticService'
import useSWR from 'swr'
import type { SubscriptionForecastData, ForcastApiParams } from '../types'

const baseBarConfig = {
    barSize: 25,
    stackId: 'plans',
}

const chartColor1 = defaultColors[6]
const chartColor2 = defaultColors[5]
const chartColor3 = defaultColors[3]

const SubscriptionForecastCard = () => {
    const dateRange = useForecastStore((state) => state.dateRange)
    const scenario = useForecastStore((state) => state.scenario)

    const { data, isLoading } = useSWR(
        [
            '/api/forecast/subscriptions',
            {
                startDate: dateRangeValues[dateRange].startDate,
                endDate: dateRangeValues[dateRange].endDate,
                scenario,
            },
        ],
        ([, params]) =>
            apiGetSubscriptionForecast<
                SubscriptionForecastData,
                ForcastApiParams
            >(params),
        {
            revalidateOnFocus: false,
        },
    )

    return (
        <ForecastCard
            title="Subscription Plans Forecast"
            description="Plan distribution and subscription growth projections"
            loading={isLoading}
            content={
                data && (
                    <div className="flex flex-col justify-between gap-4">
                        <PrimaryMetric
                            value={data?.primaryMetric?.value}
                            label={
                                data?.primaryMetric.label ||
                                'Total Subscriptions'
                            }
                            period={data?.primaryMetric.period || 'IN ONE YEAR'}
                            loading={isLoading}
                            format="number"
                        />
                        {data?.parameters && (
                            <ParametersList
                                parameters={data?.parameters || {}}
                            />
                        )}
                        {data?.parameters && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <div
                                        className="h-1 rounded-full"
                                        style={{
                                            backgroundColor: chartColor1,
                                            width: `${data.parameters.planMix.free}%`,
                                        }}
                                    />
                                    <div
                                        className=" h-1 rounded-full"
                                        style={{
                                            backgroundColor: chartColor2,
                                            width: `${data.parameters.planMix.pro}%`,
                                        }}
                                    />
                                    <div
                                        className="h-1 rounded-full"
                                        style={{
                                            backgroundColor: chartColor3,
                                            width: `${data.parameters.planMix.enterprise}%`,
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor: chartColor1,
                                            }}
                                        />
                                        <span className="flex items-center gap-1">
                                            <span>Free:</span>
                                            <span className="heading-text font-medium">
                                                {data.parameters.planMix.free}%
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor: chartColor2,
                                            }}
                                        />
                                        <span className="flex items-center gap-1">
                                            <span>Pro:</span>
                                            <span className="heading-text font-medium">
                                                {data.parameters.planMix.pro}%
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor: chartColor3,
                                            }}
                                        />
                                        <span className="flex items-center gap-1">
                                            <span>Enterprise:</span>
                                            <span className="heading-text font-medium">
                                                {
                                                    data.parameters.planMix
                                                        .enterprise
                                                }
                                                %
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
            graph={
                data?.chartData && (
                    <BarChart
                        data={data?.chartData || []}
                        barConfig={[
                            {
                                dataKey: 'free',
                                name: 'Free Plan',
                                fill: chartColor1,
                                radius: 0,
                                ...baseBarConfig,
                            },
                            {
                                dataKey: 'pro',
                                name: 'Pro Plan',
                                fill: chartColor2,
                                radius: 0,
                                ...baseBarConfig,
                            },
                            {
                                dataKey: 'enterprise',
                                name: 'Enterprise Plan',
                                fill: chartColor3,
                                radius: [4, 4, 0, 0],
                                ...baseBarConfig,
                            },
                        ]}
                        xAxisConfig={{ dataKey: 'month' }}
                        height={300}
                    >
                        <ChartLegendContent
                            verticalAlign="top"
                            className="!justify-end pb-8"
                        />
                    </BarChart>
                )
            }
        />
    )
}

export default SubscriptionForecastCard
