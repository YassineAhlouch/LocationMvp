import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { LiBarChartUp } from '@/icons'
import SegmentedProgressBar from '@/components/shared/SegmentProgressBar'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import { colors } from '@/constants/colors.constant'
import { useNavigate } from 'react-router'
import type { ProgressData } from '../types'

type ProgressCardProps = {
    data: ProgressData
    className?: string
}

const ProjectProgress = ({ data, className }: ProgressCardProps) => {
    const navigate = useNavigate()
    const { metrics } = data

    return (
        <Card
            className={className}
            header={{
                content: (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="border border-gray-300 rounded-lg p-0.5 inline-flex">
                                <div className="h-8 w-8 flex items-center justify-center heading-text border border-gray-300 rounded-lg">
                                    <LiBarChartUp className="text-xl" />
                                </div>
                            </div>
                            <div>
                                <h6 className="font-semibold">
                                    Project Progress
                                </h6>
                            </div>
                        </div>
                        <Button
                            variant="default"
                            onClick={() => navigate('/apps/projects/timeline')}
                        >
                            View details
                        </Button>
                    </div>
                ),
            }}
        >
            <div className="space-y-8">
                {metrics.map((metric, index) => {
                    return (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">
                                    {metric.label}
                                </span>
                                <div className="flex items-center gap-2">
                                    <GrowShrinkTag
                                        value={metric.trend}
                                        suffix="%"
                                        className="text-xs"
                                    />
                                    <span className="text-lg font-bold heading-text">
                                        {metric.percentage}%
                                    </span>
                                </div>
                            </div>
                            <SegmentedProgressBar
                                segments={60}
                                percent={metric.percentage}
                                filledClass={
                                    index === 0
                                        ? colors.emerald.bg
                                        : colors.blue.bg
                                }
                                gap={2}
                                height={28}
                            />
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default ProjectProgress
