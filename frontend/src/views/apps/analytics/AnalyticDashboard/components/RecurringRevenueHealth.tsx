import Card from '@/components/ui/Card'
import { LineChart } from '@/components/shared/Chart'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import formatCurrencyCompact from '@/utils/formatCurrencyCompact'
import type { ArrData } from '../types'
import dayjs from 'dayjs'

type RecurringRevenueHealthProps = {
    data: ArrData
}

const RecurringRevenueHealth = ({ data }: RecurringRevenueHealthProps) => {
    const {
        currentMrr,
        current,
        mrrVsLastMonth,
        arrVsLastYear,
        sparklineData,
        mrrMovers,
    } = data

    const chartData = sparklineData.map((item) => ({
        date: dayjs(item.date).format('MMM DD'),
        totalMrr: item.totalMrr,
        netNewMrr: item.netNewMrr,
        churnContraction: item.churnContraction,
    }))

    const netNewMrrValues = chartData.map((d) => d.netNewMrr)
    const minValue = Math.min(...netNewMrrValues)
    const maxValue = Math.max(...netNewMrrValues)
    const range = maxValue - minValue
    const padding = range * 0.3

    const yAxisDomain = [
        Math.floor(minValue - padding),
        Math.ceil(maxValue + padding),
    ]

    return (
        <Card>
            <div className="space-y-4">
                <h5>Recurring Revenue Health</h5>
                <LineChart
                    data={chartData}
                    height={180}
                    lineConfig={[
                        {
                            dataKey: 'netNewMrr',
                            name: 'Net MRR',
                        },
                    ]}
                    xAxisConfig={{
                        dataKey: 'date',
                        hide: true,
                    }}
                    yAxisConfig={{
                        hide: true,
                        domain: yAxisDomain,
                    }}
                />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center gap-2 font-medium mb-2">
                            <span className="font-medium">Current MRR</span>
                        </div>
                        <h4 className="mb-1">
                            {formatCurrencyCompact(currentMrr)}
                        </h4>
                        <span className="inline-flex flex-wrap items-center gap-1">
                            <GrowShrinkTag
                                value={mrrVsLastMonth}
                                suffix="% "
                                showIcon
                            />
                            <span>vs Last Month</span>
                        </span>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 font-medium mb-2">
                            <span className="font-medium">Current ARR</span>
                        </div>
                        <h4 className="mb-1">
                            {formatCurrencyCompact(current)}
                        </h4>
                        <span className="inline-flex flex-wrap items-center gap-1">
                            <GrowShrinkTag
                                value={arrVsLastYear}
                                suffix="%"
                                showIcon
                            />
                            <span>vs Last Year</span>
                        </span>
                    </div>
                </div>
                <div className="pt-4">
                    <h6 className="mb-2">MRR Movers</h6>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span>New Sales</span>
                            <span className="heading-text font-medium">
                                {formatCurrencyCompact(mrrMovers.newSales)}/mo
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Expansion</span>
                            <span className="heading-text font-medium">
                                {formatCurrencyCompact(mrrMovers.expansion)}/mo
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Churn</span>
                            <span className="text-error font-medium">
                                {formatCurrencyCompact(mrrMovers.churn)}/mo
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default RecurringRevenueHealth
