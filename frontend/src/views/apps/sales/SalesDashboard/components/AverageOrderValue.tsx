import Card from '@/components/ui/Card'
import { BarChart } from '@/components/shared/Chart'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import formatCurrency from '@/utils/formatCurrency'
import { colors } from '@/constants/colors.constant'
import { useSalesDashboardStore } from '@/views/apps/sales/SalesDashboard/store/salesDashboardStore'
import { Rectangle } from 'recharts'
import type { SupportingMetric } from '../types'

type AverageOrderValueProps = {
    data: SupportingMetric
}

type BarShapeProps = {
    x?: number
    y?: number
    width?: number
    height?: number
    payload?: { gap?: number }
}

const CustomValueBar = (props: BarShapeProps) => {
    const { x = 0, y = 0, width = 0, height = 0, payload } = props
    const hasGap = (payload?.gap ?? 0) > 0
    const radius: [number, number, number, number] = hasGap
        ? [0, 0, 0, 0]
        : [4, 4, 0, 0]

    return (
        <Rectangle
            x={x}
            y={y}
            width={width}
            height={height}
            fill={colors.blue.chart}
            radius={radius}
        />
    )
}

const CustomGapBar = (props: BarShapeProps) => {
    const { x = 0, y = 0, width = 0, height = 0 } = props

    return (
        <Rectangle
            x={x}
            y={y}
            width={width}
            height={height}
            fill={colors.cyan.chart}
            radius={[4, 4, 0, 0]}
        />
    )
}

const AverageOrderValue = ({ data }: AverageOrderValueProps) => {
    const comparisonEnabled = useSalesDashboardStore(
        (state) => state.comparisonEnabled,
    )
    return (
        <Card>
            <div className="mb-4">
                <h5>Average Order Value</h5>
            </div>
            <div className="flex items-center gap-2">
                <h4>{formatCurrency(data.value)}</h4>
                {comparisonEnabled && (
                    <GrowShrinkTag value={data.change} suffix="%" />
                )}
            </div>
            <div className="mt-1">
                Avg.{' '}
                <span className="heading-text font-medium">
                    {data.avgItemsPerTransaction ?? 0}
                </span>{' '}
                items per transaction
            </div>
            <div className="mt-4 lg:mt-14 xl:mt-4">
                <BarChart
                    data={data.chartData}
                    height={280}
                    barConfig={[
                        {
                            dataKey: 'value',
                            stackId: 'aov',
                            barSize: 10,
                            shape: CustomValueBar as unknown as undefined,
                        },
                        {
                            dataKey: 'gap',
                            stackId: 'aov',
                            barSize: 10,
                            shape: CustomGapBar as unknown as undefined,
                        },
                    ]}
                    xAxisConfig={{
                        dataKey: 'label',
                    }}
                    yAxisConfig={{
                        hide: false,
                        tickFormatter: (value: number) => formatCurrency(value),
                        width: 30,
                        domain: ['dataMin', 'dataMax + 800'],
                    }}
                    tooltipContentConfig={{
                        customContent: (props) => {
                            const { payload } = props
                            if (!payload || !payload.length) return null

                            const { gap, value, label, estimated } =
                                payload[0].payload
                            const gapValue = gap ?? 0
                            const actualValue = value ?? 0
                            const estimatedValue =
                                estimated ?? actualValue + gapValue

                            return (
                                <div className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-w-[8rem] rounded-lg border shadow-xl">
                                    <div className="px-2.5 py-1.5">
                                        <div className="heading-text font-medium">
                                            {label}
                                        </div>
                                        <div className="grid gap-1.5 mt-1.5">
                                            <div className="flex w-full items-center gap-2">
                                                <div
                                                    className="shrink-0 rounded-[2px] h-2.5 w-2.5"
                                                    style={{
                                                        backgroundColor:
                                                            colors.blue.chart,
                                                    }}
                                                />
                                                <div className="flex flex-1 justify-between items-center gap-x-3">
                                                    <span className="heading-text font-mono font-medium tabular-nums text-xs">
                                                        Actual
                                                    </span>
                                                    <span className="heading-text font-mono font-medium tabular-nums text-xs">
                                                        {formatCurrency(
                                                            actualValue,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex w-full items-center gap-2">
                                                <div
                                                    className="shrink-0 rounded-[2px] h-2.5 w-2.5"
                                                    style={{
                                                        backgroundColor:
                                                            colors.cyan.chart,
                                                    }}
                                                />
                                                <div className="flex flex-1 justify-between items-center gap-x-3">
                                                    <span className="heading-text font-mono font-medium tabular-nums text-xs">
                                                        Estimated
                                                    </span>
                                                    <span className="heading-text font-mono font-medium tabular-nums text-xs">
                                                        {formatCurrency(
                                                            estimatedValue,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        },
                    }}
                />
            </div>
        </Card>
    )
}

export default AverageOrderValue
