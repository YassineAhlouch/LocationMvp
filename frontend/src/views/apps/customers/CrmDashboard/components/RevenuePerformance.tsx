import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import LineChart from '@/components/shared/Chart/LineChart'
import { defaultColors } from '@/components/shared/Chart/configs'
import {
    filterRevenueByHorizon,
    convertCurrency,
    formatCurrency,
} from '../utils/dataTransformers'
import type { RevenueChartProps } from '../types'

const RevenuePerformance = ({ data, currency }: RevenueChartProps) => {
    const chartData = useMemo(() => {
        const filtered = filterRevenueByHorizon(data.current)
        return filtered.map((point) => ({
            period: point.period,
            actual: convertCurrency(point.revenue, currency),
            forecast: convertCurrency(point.forecast, currency),
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.current, currency])

    return (
        <Card>
            <div className="mb-4">
                <h5 className="heading-text">Revenue Performance</h5>
            </div>
            <LineChart
                data={chartData}
                height={370}
                lineConfig={[
                    {
                        dataKey: 'actual',
                        name: 'Actual Revenue',
                        stroke: defaultColors[0],
                    },
                    {
                        dataKey: 'forecast',
                        name: 'Forecasted Revenue',
                        stroke: defaultColors[2],
                        strokeDasharray: '5 5',
                    },
                ]}
                xAxisConfig={{
                    dataKey: 'period',
                }}
                yAxisConfig={{
                    hide: false,
                    width: 40,
                    tickFormatter: (value: number) =>
                        formatCurrency(value, currency),
                }}
            />
        </Card>
    )
}

export default RevenuePerformance
