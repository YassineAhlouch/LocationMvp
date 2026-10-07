import { Card, Button } from '@/components/ui'
import { BarChart } from '@/components/shared/Chart'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import { colors } from '@/constants/colors.constant'
import dayjs from 'dayjs'
import type { PayrollData } from '../types'

type PayrollBurnRateProps = {
    data: PayrollData
}

const PayrollBurnRate = ({ data }: PayrollBurnRateProps) => {
    const { ytdTotal, monthlyData, variance } = data

    const chartData = monthlyData.map((item) => ({
        month: dayjs(item.month).format('MMM'),
        total: item.total,
    }))

    const isIncrease = variance.trend === 'up'

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h5>Payroll Burn Rate</h5>
                <Button>See All</Button>
            </div>
            <div className="py-4">
                <div className="flex items-baseline gap-2 mb-1">
                    <h4>${(ytdTotal / 1000).toFixed(1)}k</h4>
                    <span className="text-xs heading-text">YTD</span>
                </div>
                <div className="flex items-center gap-1">
                    <GrowShrinkTag
                        value={
                            isIncrease
                                ? variance.percentage
                                : -variance.percentage
                        }
                        suffix="%"
                    />
                    <span>VS Last Month</span>
                </div>
            </div>

            <div>
                <BarChart
                    data={chartData}
                    height={200}
                    barConfig={[
                        {
                            dataKey: 'total',
                            radius: [4, 4, 0, 0],
                            barSize: 32,
                            fill: colors.purple.chart,
                        },
                    ]}
                    xAxisConfig={{
                        dataKey: 'month',
                    }}
                />
            </div>
        </Card>
    )
}

export default PayrollBurnRate
