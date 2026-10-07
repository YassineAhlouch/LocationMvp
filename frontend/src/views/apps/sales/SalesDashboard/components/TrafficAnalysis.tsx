import Card from '@/components/ui/Card'
import Divider from '@/components/shared/Divider'
import { BarChart } from '@/components/shared/Chart'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import { useSalesDashboardStore } from '@/views/apps/sales/SalesDashboard/store/salesDashboardStore'
import { LiArrowUp, LiArrowDown } from '@/icons'
import type { TrafficAnalysisData } from '../types'

type TrafficAnalysisProps = {
    data: TrafficAnalysisData
}

const TrafficAnalysis = ({ data }: TrafficAnalysisProps) => {
    const comparisonEnabled = useSalesDashboardStore(
        (state) => state.comparisonEnabled,
    )

    const chartData = data.chartData.map((item, index) => {
        const result: Record<string, string | number> = {
            date: item.label,
            current: item.value,
        }
        if (comparisonEnabled && data.comparisonData?.[index]) {
            result.previous = data.comparisonData[index].value
        }
        return result
    })

    const barConfig = [
        {
            dataKey: 'current',
            fill: 'var(--success)',
        },
    ]

    if (comparisonEnabled) {
        barConfig.push({
            dataKey: 'previous',
            fill: 'var(--gray-400)',
        })
    }

    return (
        <Card>
            <div className="mb-4">
                <h5>Traffic Analysis</h5>
            </div>
            <div className="flex items-center gap-2 sm:gap-8 mb-8">
                <div>
                    <p className="mb-1">Sessions</p>
                    <div className="flex items-center gap-2">
                        <h4>{data.value.toLocaleString()}</h4>
                        {comparisonEnabled && (
                            <GrowShrinkTag value={data.change} suffix="%" />
                        )}
                    </div>
                </div>
                <Divider orientation="vertical" className="h-12" />
                <div>
                    <p className="mb-1">Bounce Rate</p>
                    <div className="flex items-center gap-2">
                        <h4>{data.bounceRate.value}%</h4>
                        {comparisonEnabled && (
                            <GrowShrinkTag
                                value={-data.bounceRate.change}
                                suffix="%"
                            />
                        )}
                    </div>
                </div>
            </div>

            <BarChart
                data={chartData}
                height={150}
                barConfig={barConfig}
                xAxisConfig={{
                    dataKey: 'date',
                    axisLine: false,
                    tickLine: false,
                    tick: false,
                }}
                yAxisConfig={{
                    axisLine: false,
                    tickLine: false,
                    tick: false,
                }}
                cartesianGridConfig={{
                    strokeDasharray: '3 3',
                    horizontal: false,
                    vertical: false,
                }}
            />
            <div className="space-y-2">
                {data.sources?.map((source) => {
                    const isPositive = source.percentageChange >= 0
                    return (
                        <div
                            key={source.name}
                            className="flex items-center justify-between"
                        >
                            <span>{source.name}</span>
                            <div className="flex items-center gap-3">
                                <span className="heading-text font-medium">
                                    {source.count.toLocaleString()}
                                </span>
                                <div
                                    className={`flex items-center gap-1 text-xs font-semibold min-w-[50px] justify-end ${
                                        isPositive
                                            ? 'text-success'
                                            : 'text-error'
                                    }`}
                                >
                                    {isPositive ? (
                                        <LiArrowUp className="text-sm" />
                                    ) : (
                                        <LiArrowDown className="text-sm" />
                                    )}
                                    <span>
                                        {Math.abs(source.percentageChange)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default TrafficAnalysis
