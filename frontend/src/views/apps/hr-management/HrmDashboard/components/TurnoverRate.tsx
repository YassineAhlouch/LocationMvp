import { Card, Button } from '@/components/ui'
import { AreaChart, ChartTooltipContent } from '@/components/shared/Chart'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import type { TurnoverData } from '../types'
import dayjs from 'dayjs'

type TurnoverRateProps = {
    data: TurnoverData
}

const TurnoverRate = ({ data }: TurnoverRateProps) => {
    const { currentRate, targetRate, variance, monthlyData } = data

    const chartData = monthlyData.map((item) => ({
        month: dayjs(item.month).format('MMM'),
        rate: item.rate,
        target: targetRate,
    }))

    const isAboveTarget = variance > 0

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h5>Turnover Rate</h5>
                <Button>See All</Button>
            </div>
            <div className="my-2">
                <div className="flex items-baseline gap-2 mb-1">
                    <h4 className="font-semibold">{currentRate.toFixed(1)}%</h4>
                    <GrowShrinkTag
                        value={isAboveTarget ? variance : -variance}
                        suffix="%"
                    />
                </div>
                <div>Estimated: {targetRate.toFixed(1)}%</div>
            </div>
            <AreaChart
                data={chartData}
                height={270}
                areaConfig={[
                    {
                        dataKey: 'rate',
                        fill: 'url(#gradient-fill)',
                        type: 'linear',
                    },
                ]}
                xAxisConfig={{
                    dataKey: 'month',
                }}
                yAxisConfig={{
                    domain: [6, 10],
                    tickFormatter: (value: number) => `${value}%`,
                }}
                tooltipConfig={{
                    content: <ChartTooltipContent hideIndicator />,
                }}
            >
                {({ colors }) => (
                    <defs>
                        <linearGradient
                            id="gradient-fill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor={colors[0]}
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="60%"
                                stopColor={colors[0]}
                                stopOpacity={0.2}
                            />
                            <stop
                                offset="100%"
                                stopColor={colors[0]}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                )}
            </AreaChart>
        </Card>
    )
}

export default TurnoverRate
