import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import { ChartContainer, LineChart } from '@/components/shared/Chart'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import formatCurrency from '@/utils/formatCurrency'
import type { TimeRange, CandlestickDataPoint } from '../types'

type TotalPortfolioProps = {
    balance: number
    dailyChange: number
    dailyChangePercent: number
    chartData: Record<TimeRange, CandlestickDataPoint[]> | null
    selectedTimeRange: TimeRange
    onTimeRangeChange: (timeRange: TimeRange) => void
}

const timeRanges: TimeRange[] = ['1w', '1m', '3m', '6m', '1y']

const TotalPortfolio = ({
    balance,
    dailyChangePercent,
    chartData,
    selectedTimeRange,
    onTimeRangeChange,
}: TotalPortfolioProps) => {
    const currentChartData = chartData?.[selectedTimeRange] || []

    const lineChartData = currentChartData.map((item) => ({
        date: item.date,
        balance: item.close,
    }))

    return (
        <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h4>{formatCurrency(balance)}</h4>
                        <div className="flex items-center gap-1 mt-1">
                            <GrowShrinkTag
                                value={dailyChangePercent}
                                suffix="%"
                            />
                        </div>
                    </div>
                    <div className="font-medium">Total Portfolio</div>
                </div>
                <InputGroup className="w-full sm:w-auto">
                    {timeRanges.map((range) => (
                        <Button
                            block
                            key={range}
                            active={selectedTimeRange === range}
                            onClick={() => onTimeRangeChange(range)}
                        >
                            {range}
                        </Button>
                    ))}
                </InputGroup>
            </div>
            <div className="mt-8">
                <ChartContainer>
                    <LineChart
                        data={lineChartData}
                        lineConfig={[
                            {
                                dataKey: 'balance',
                                type: 'linear',
                                strokeWidth: 2,
                            },
                        ]}
                        xAxisConfig={{
                            dataKey: 'date',
                        }}
                        tooltipConfig={{
                            content: ({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    return (
                                        <div className="bg-gray-900 dark:bg-gray-800 text-white p-3 rounded-lg shadow-lg text-xs">
                                            <div className="font-medium mb-2">
                                                {data.date}
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <span className="text-gray-400">
                                                    Balance:
                                                </span>
                                                <span>
                                                    {formatCurrency(
                                                        data.balance,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            },
                        }}
                    />
                </ChartContainer>
            </div>
        </Card>
    )
}

export default TotalPortfolio
