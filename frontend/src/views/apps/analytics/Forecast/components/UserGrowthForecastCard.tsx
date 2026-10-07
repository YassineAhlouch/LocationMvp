import LineChart from '@/components/shared/Chart/LineChart'
import ChartLegendContent from '@/components/shared/Chart/ChartLegendContent'
import ForecastCard from './ForecastCard'
import PrimaryMetric from './PrimaryMetric'
import ParametersList from './ParametersList'
import { colors } from '@/constants/colors.constant'
import { useForecastStore } from '../store/forecastStore'
import { dateRangeValues } from '../utils'
import { apiGetUserGrowthForecast } from '@/services/AnalyticService'
import useSWR from 'swr'
import type { UserGrowthForecastData, ForcastApiParams } from '../types'

const UserGrowthForecastCard = () => {
    const dateRange = useForecastStore((state) => state.dateRange)
    const scenario = useForecastStore((state) => state.scenario)

    const { data, isLoading } = useSWR(
        [
            '/api/forecast/user-growth',
            {
                startDate: dateRangeValues[dateRange].startDate,
                endDate: dateRangeValues[dateRange].endDate,
                scenario,
            },
        ],
        ([, params]) =>
            apiGetUserGrowthForecast<UserGrowthForecastData, ForcastApiParams>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    return (
        <ForecastCard
            title="User Growth Forecast"
            loading={isLoading}
            description="Active user acquisition and growth projections"
            content={
                data && (
                    <div className="flex flex-col justify-between gap-4">
                        <PrimaryMetric
                            value={data?.primaryMetric?.value}
                            label={data?.primaryMetric.label || 'Total Users'}
                            period={data?.primaryMetric.period || 'IN ONE YEAR'}
                            loading={isLoading}
                            format="number"
                        />
                        {data?.parameters && (
                            <ParametersList parameters={data.parameters} />
                        )}
                    </div>
                )
            }
            graph={
                data?.chartData && (
                    <LineChart
                        data={data.chartData.map((item) => ({
                            month: item.month,
                            newUsers: item.newUsers || 0,
                            churnedUsers: item.churnedUsers || 0,
                        }))}
                        lineConfig={[
                            {
                                name: 'Forecasted new users',
                                dataKey: 'newUsers',
                                stroke: colors.emerald.chart,
                                strokeWidth: 2,
                            },
                            {
                                dataKey: 'churnedUsers',
                                name: 'Forecasted churned users',
                                stroke: colors.red.chart,
                                strokeWidth: 2,
                                strokeDasharray: '5 5',
                            },
                        ]}
                        xAxisConfig={{
                            dataKey: 'month',
                        }}
                    >
                        <ChartLegendContent
                            verticalAlign="top"
                            className="!justify-end pb-8"
                            onClick={(e) => console.log(e)}
                        />
                    </LineChart>
                )
            }
        />
    )
}

export default UserGrowthForecastCard
