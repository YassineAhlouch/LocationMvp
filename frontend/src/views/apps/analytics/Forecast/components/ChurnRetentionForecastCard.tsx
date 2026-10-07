import { useState } from 'react'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import Loading from '@/components/shared/Loading'
import { apiGetChurnRetentionForecast } from '@/services/AnalyticService'
import { useForecastStore } from '../store/forecastStore'
import { dateRangeValues } from '../utils'
import { CohortChart } from '@/components/shared/Chart'
import { LiLightbulbOn } from '@/icons'
import useSWR from 'swr'
import type { ChurnRetentionForecastData, ForcastApiParams } from '../types'

const ChurnRetentionForecastCard = () => {
    const dateRange = useForecastStore((state) => state.dateRange)
    const scenario = useForecastStore((state) => state.scenario)

    const { data, isLoading } = useSWR(
        [
            '/api/forecast/churn-retention',
            {
                startDate: dateRangeValues[dateRange].startDate,
                endDate: dateRangeValues[dateRange].endDate,
                scenario,
            },
        ],
        ([, params]) =>
            apiGetChurnRetentionForecast<
                ChurnRetentionForecastData,
                ForcastApiParams
            >(params),
        {
            revalidateOnFocus: false,
        },
    )
    const [selectedCohort, setSelectedCohort] = useState<string | null>(null)

    const handleCohortSelect = (cohortKey: string) => {
        setSelectedCohort(cohortKey)
    }

    const timeUnits = data?.chartData
        ? Array.from(
              {
                  length: Math.max(
                      ...Object.values(data.chartData).map(
                          (cohort) => cohort.periods.length,
                      ),
                  ),
              },
              (_, i) => `Period ${i + 1}`,
          )
        : []

    const getSummaryMetrics = () => {
        if (!data) return null

        const { parameters } = data
        const trendText =
            parameters.churnTrend === 'improving'
                ? 'improving'
                : parameters.churnTrend === 'declining'
                  ? 'declining'
                  : 'stable'
        const trendColor =
            parameters.churnTrend === 'improving'
                ? 'text-green-600'
                : parameters.churnTrend === 'declining'
                  ? 'text-red-600'
                  : 'text-blue-600'

        return {
            currentRetention: parameters.currentRetention,
            targetRetention: parameters.targetRetention,
            trend: trendText,
            trendColor,
            change: parameters.targetRetention - parameters.currentRetention,
        }
    }

    const generateInsight = () => {
        if (!data) return null

        const { parameters } = data
        const current = parameters.currentRetention
        const target = parameters.targetRetention
        const change = target - current
        const trend = parameters.churnTrend

        return (
            <Card>
                <div className="flex gap-4">
                    <div className="mt-1">
                        <LiLightbulbOn className="heading-text text-xl" />
                    </div>
                    <span>
                        Retention is currently at{' '}
                        <span className="heading-text font-medium">
                            {current}%
                        </span>
                        ,
                        {Math.abs(change) < 1 ? (
                            <>
                                which is on par with the target benchmark of{' '}
                                <span className="heading-text font-medium">
                                    {target}%
                                </span>
                                .{' '}
                            </>
                        ) : change > 0 ? (
                            <>
                                with a target to reach{' '}
                                <span className="heading-text font-medium">
                                    {target}%
                                </span>{' '}
                                (
                                <span className="heading-text font-medium">
                                    {change.toFixed(1)} percentage point
                                    improvement
                                </span>
                                ).{' '}
                            </>
                        ) : (
                            <>
                                which is above the conservative target of{' '}
                                <span className="heading-text font-medium">
                                    {target}%
                                </span>
                                .{' '}
                            </>
                        )}
                        {trend === 'improving' ? (
                            <>
                                The trend is{' '}
                                <span className="font-mediumt text-success">
                                    improving
                                </span>
                                , showing positive momentum in customer
                                retention efforts. This upward trajectory
                                suggests that recent initiatives are working
                                effectively. To capitalize on this momentum,
                                consider scaling successful retention programs
                                and identifying what's driving the improvement
                                to replicate across all customer segments.
                            </>
                        ) : trend === 'declining' ? (
                            <>
                                The trend is{' '}
                                <span className="font-medium text-error">
                                    declining
                                </span>
                                , indicating potential challenges in customer
                                retention that require immediate attention. This
                                downward pattern suggests underlying issues that
                                need to be addressed. Focus on identifying churn
                                drivers through customer feedback, improving
                                onboarding processes, and implementing proactive
                                engagement strategies to reverse this trend.
                            </>
                        ) : (
                            <>
                                The trend remains{' '}
                                <span className="font-medium text-indigo-500">
                                    stable
                                </span>
                                , indicating that customer retention efforts are
                                holding steady without significant fluctuations.
                                While this is a positive sign of consistency,
                                maintaining stability alone may not be enough
                                for long-term growth. To strengthen resilience,
                                it could be valuable to explore opportunities
                                for pushing retention slightly higher through
                                proactive engagement strategies and improved
                                customer experience initiatives.
                            </>
                        )}
                    </span>
                </div>
            </Card>
        )
    }

    const metrics = getSummaryMetrics()

    return (
        <Card>
            <div className="mb-4">
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton height={10} width="20%" />
                        <Skeleton height={10} />
                    </div>
                ) : (
                    <>
                        <h5>Churn & Retention Forecast</h5>
                        {metrics && (
                            <>
                                <div className="leading-relaxed mt-4">
                                    {generateInsight()}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
            <div>
                <Loading className="min-h-[300px]" loading={isLoading}>
                    {data?.chartData && (
                        <div className="mt-4">
                            <CohortChart
                                data={data.chartData}
                                timeUnits={timeUnits}
                                valueFormatter={(value) =>
                                    value.toLocaleString()
                                }
                                onCohortSelect={handleCohortSelect}
                                selectedCohort={selectedCohort}
                                minValue={0}
                                maxValue={100}
                                showLegend={true}
                                legendTitle="Retention Rate"
                                customerCohortCell={(cohort) => (
                                    <>
                                        <div className="font-medium heading-text">
                                            {cohort.key}
                                        </div>
                                        <div className="text-xs font-medium">
                                            {cohort.value} Users
                                        </div>
                                    </>
                                )}
                                cohortHeaderText="Cohort"
                                sizeLabelText="Initial Users"
                                percentageSuffix="%"
                            />
                        </div>
                    )}
                </Loading>
            </div>
        </Card>
    )
}

export default ChurnRetentionForecastCard
