import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { LiSpeedometer } from '@/icons'
import { BarChart } from '@/components/shared/Chart'
import { colors } from '@/constants/colors.constant'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import { useNavigate } from 'react-router'
import type { PerformanceData } from '../types'

type PerformanceCardProps = {
    data: PerformanceData
}

const EffortTracking = ({ data }: PerformanceCardProps) => {
    const navigate = useNavigate()
    const { metric, chartData } = data
    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="border border-gray-300 rounded-lg p-0.5 inline-flex">
                                <div className="h-8 w-8 flex items-center justify-center heading-text border border-gray-300 rounded-lg">
                                    <LiSpeedometer className="text-xl" />
                                </div>
                            </div>
                            <div>
                                <h6 className="font-semibold">
                                    Effort Tracking
                                </h6>
                            </div>
                        </div>
                        <Button
                            variant="default"
                            onClick={() =>
                                navigate('/apps/projects/scrumboard')
                            }
                        >
                            View details
                        </Button>
                    </div>
                ),
            }}
        >
            <div className="space-y-4">
                <div>
                    <div className="flex items-baseline gap-2">
                        <h3>{metric.total.toLocaleString()}</h3>
                        <span>{metric.label}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        <GrowShrinkTag
                            value={metric.trend}
                            suffix="%"
                            className="text-xs"
                        />
                        <span className="heading-text">
                            vs last month's hours
                        </span>
                    </div>
                </div>
                <div>
                    <BarChart
                        data={chartData}
                        height={120}
                        xAxisConfig={{
                            dataKey: 'month',
                        }}
                        barConfig={[
                            {
                                dataKey: 'planned',
                                fill: colors.cyan.chart,
                                barSize: 16,
                                radius: [4, 4, 0, 0],
                            },
                            {
                                dataKey: 'actual',
                                fill: colors.blue.chart,
                                barSize: 16,
                                radius: [4, 4, 0, 0],
                            },
                        ]}
                        chartHorizontalSpace={10}
                        chartVerticalSpace={10}
                    />
                </div>
            </div>
        </Card>
    )
}

export default EffortTracking
