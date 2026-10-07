import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import PieChart from '@/components/shared/Chart/PieChart'
import useResponsive from '@/utils/hooks/useResponsive'
import type { PayrollChartData } from '../types'

type PayrollChartProps = {
    data: PayrollChartData
    loading?: boolean
}

const PayrollChart = ({ data, loading }: PayrollChartProps) => {
    const chartData = data.map((item) => ({
        name: item.name,
        value: item.value,
    }))

    const cellConfig = data.map((item) => ({
        fill: item.color,
    }))

    const { larger, smaller } = useResponsive()

    const chartConfig =
        larger.lg && smaller.xl
            ? {
                  size: 120,
                  innerRadius: 40,
                  outerRadius: 60,
              }
            : {
                  size: 180,
                  innerRadius: 60,
                  outerRadius: 80,
              }

    return (
        <Card>
            <div className="space-y-2">
                <h5>Payroll Composition</h5>
                <div className="flex  sm:flex-row flex-col-reverse items-center justify-between gap-4">
                    {loading ? (
                        <>
                            <div className="flex items-center flex-1 w-full sm:w-auto max-w-[300px]">
                                <div className="space-y-3 flex-1">
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2"
                                            >
                                                <Skeleton className="h-2 w-2 rounded-full" />
                                                <Skeleton className="h-3 w-24" />
                                                <Skeleton className="h-3 w-16 ml-auto" />
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <Skeleton
                                    style={{
                                        height: chartConfig.size,
                                        width: chartConfig.size,
                                    }}
                                    className="rounded-full"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center flex-1 w-full sm:w-auto max-w-[300px]">
                                <div className="space-y-2 flex-1">
                                    {data.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    style={{
                                                        backgroundColor:
                                                            item.color,
                                                    }}
                                                />
                                                <span>{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 heading-text">
                                                <span className="font-medium">
                                                    $
                                                    {item.value.toLocaleString()}
                                                </span>
                                                <span className="text-xs">
                                                    ({item.percentage}%)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <PieChart
                                    data={chartData}
                                    height={chartConfig.size}
                                    width={chartConfig.size}
                                    pieConfig={{
                                        dataKey: 'value',
                                        innerRadius: chartConfig.innerRadius,
                                        outerRadius: chartConfig.outerRadius,
                                        paddingAngle: 2,
                                        cornerRadius: 4,
                                    }}
                                    cellConfig={cellConfig}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Card>
    )
}

export default PayrollChart
