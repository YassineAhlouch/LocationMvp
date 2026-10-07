import BarChart from '@/components/shared/Chart/BarChart'
import ChartLegendContent from '@/components/shared/Chart/ChartLegendContent'
import ForecastCard from './ForecastCard'
import PrimaryMetric from './PrimaryMetric'
import ParametersList from './ParametersList'
import { useForecastStore } from '../store/forecastStore'
import { dateRangeValues } from '../utils'
import { colors } from '@/constants/colors.constant'
import { apiGetRevenueForecast } from '@/services/AnalyticService'
import useSWR from 'swr'
import type { RevenueForecastData, ForcastApiParams } from '../types'

const RevenueForecastCard = () => {
    const dateRange = useForecastStore((state) => state.dateRange)
    const scenario = useForecastStore((state) => state.scenario)

    const { data, isLoading } = useSWR(
        [
            '/api/forecast/revenue',
            {
                startDate: dateRangeValues[dateRange].startDate,
                endDate: dateRangeValues[dateRange].endDate,
                scenario,
            },
        ],
        ([, params]) =>
            apiGetRevenueForecast<RevenueForecastData, ForcastApiParams>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    return (
        <ForecastCard
            title="Revenue Forecast"
            description="Monthly recurring revenue projections and growth"
            loading={isLoading}
            content={
                data && (
                    <div className="flex flex-col justify-between gap-4">
                        <PrimaryMetric
                            value={data?.primaryMetric?.value}
                            label={
                                data?.primaryMetric.label ||
                                'Monthly Recurring Revenue'
                            }
                            period={data?.primaryMetric.period || 'IN ONE YEAR'}
                            loading={isLoading}
                            format="currency"
                        />
                        {data?.parameters && (
                            <ParametersList parameters={data.parameters} />
                        )}
                    </div>
                )
            }
            graph={
                data?.chartData && (
                    <BarChart
                        height={300}
                        data={data.chartData.map((item) => ({
                            month: item.month,
                            newMRR: item.newMRR || 0,
                            churnedMRR: item.churnedMRR || 0,
                        }))}
                        barConfig={[
                            {
                                dataKey: 'newMRR',
                                name: 'Forecasted new MRR',
                                barSize: 15,
                                radius: [4, 4, 0, 0],
                                color: colors.blue.chart,
                            },
                            {
                                dataKey: 'churnedMRR',
                                name: 'Forecasted churned MRR',
                                radius: [4, 4, 0, 0],
                                barSize: 15,
                                color: colors.yellow.chart,
                            },
                        ]}
                        xAxisConfig={{
                            dataKey: 'month',
                        }}
                    >
                        <ChartLegendContent
                            verticalAlign="top"
                            className="!justify-end pb-8"
                        />
                    </BarChart>
                )
            }
        ></ForecastCard>
    )
}

export default RevenueForecastCard
