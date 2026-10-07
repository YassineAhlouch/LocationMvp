import Card from '@/components/ui/Card'
import { LineChart } from '@/components/shared/Chart'
import { colors } from '@/constants/colors.constant'
import formatCurrencyCompact from '@/utils/formatCurrencyCompact'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import type { NetRevenueRetentionData } from '../types'
import dayjs from 'dayjs'

type NetRevenueRetentionProps = {
    data: NetRevenueRetentionData
    isLoading?: boolean
}

const NetRevenueRetention = ({ data, isLoading }: NetRevenueRetentionProps) => {
    if (isLoading) {
        return (
            <Card>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </Card>
        )
    }

    const { current, monthlyData, target, breakdown, changeFromLastMonth } =
        data

    const chartData = monthlyData.map((item) => ({
        month: dayjs(item.month).format('MMM'),
        nrr: item.nrr,
        target: target,
    }))

    const isAboveTarget = current > target

    const expansionPercentage = breakdown
        ? (breakdown.expansion /
              (breakdown.expansion + Math.abs(breakdown.contraction))) *
          100
        : 50
    const contractionPercentage = 100 - expansionPercentage

    return (
        <Card>
            <div className="mb-4">
                <h5>Net Revenue Retention</h5>
                <div className="flex items-end gap-2 mt-4">
                    <h4>{current.toFixed(1)}%</h4>
                    <span className="heading-text font-medium">
                        {isAboveTarget ? 'Growing' : 'Contracting'}
                    </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                    <GrowShrinkTag
                        value={changeFromLastMonth || 2.5}
                        suffix="%"
                        showIcon
                    />
                    <span>vs Last Month</span>
                </div>
            </div>

            <LineChart
                data={chartData}
                height={200}
                lineConfig={[
                    {
                        dataKey: 'nrr',
                        stroke: isAboveTarget
                            ? colors.emerald.chart
                            : colors.red.chart,
                        type: 'linear',
                    },
                    {
                        dataKey: 'target',
                        strokeWidth: 1,
                        strokeDasharray: '5 5',
                        dot: false,
                    },
                ]}
                xAxisConfig={{
                    dataKey: 'month',
                }}
                yAxisConfig={{
                    domain: [95, 120],
                    tickFormatter: (value: number) => `${value}%`,
                }}
            />

            {breakdown && (
                <div className="mt-6 space-y-4">
                    <div className="flex h-1.5 rounded-full overflow-hidden">
                        <div
                            className={colors.emerald.bg}
                            style={{ width: `${expansionPercentage}%` }}
                        />
                        <div
                            className={colors.red.bg}
                            style={{ width: `${contractionPercentage}%` }}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span>Starting ARR</span>
                            <span className="heading-text font-medium">
                                {formatCurrencyCompact(breakdown.startingArr)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Expansion</span>
                            <span className="text-success font-medium">
                                +{formatCurrencyCompact(breakdown.expansion)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Contraction</span>
                            <span className="text-error font-medium">
                                {formatCurrencyCompact(breakdown.contraction)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                            <span className="font-medium">NRR (Total)</span>
                            <span className="heading-text font-medium">
                                {current.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}

export default NetRevenueRetention
