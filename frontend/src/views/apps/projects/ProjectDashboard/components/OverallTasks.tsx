import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { LiTask } from '@/icons'
import { PieChart } from '@/components/shared/Chart'
import { colors } from '@/constants/colors.constant'
import useResponsive from '@/utils/hooks/useResponsive'
import { useNavigate } from 'react-router'
import type { TaskDistribution } from '../types'

type TaskDistributionCardProps = {
    data: TaskDistribution
}

const OverallTasks = ({ data }: TaskDistributionCardProps) => {
    const navigate = useNavigate()
    const { total, categories } = data

    const colorMap: Record<string, string> = {
        'On Going': colors.blue.chart,
        'Under Review': colors.cyan.chart,
        Finish: colors.emerald.chart,
    }

    const getColor = (label: string) => colorMap[label] || colors.gray.chart

    const { larger } = useResponsive()

    const chartSize = larger['2xl'] ? 180 : 140

    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="border border-gray-300 rounded-lg p-0.5 inline-flex">
                                <div className="h-8 w-8 flex items-center justify-center heading-text border border-gray-300 rounded-lg">
                                    <LiTask className="text-xl" />
                                </div>
                            </div>
                            <div>
                                <h6 className="font-semibold">Overall Tasks</h6>
                            </div>
                        </div>
                        <Button
                            variant="default"
                            onClick={() => navigate('/apps/projects/tasks')}
                        >
                            View details
                        </Button>
                    </div>
                ),
            }}
        >
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <PieChart
                            data={categories.map((cat) => ({
                                name: cat.label,
                                value: cat.count,
                            }))}
                            height={chartSize}
                            width={chartSize}
                            pieConfig={{
                                dataKey: 'value',
                                nameKey: 'name',
                                cx: '50%',
                                cy: '50%',
                                innerRadius: 50,
                                outerRadius: 70,
                                paddingAngle: 2,
                                cornerRadius: 4,
                            }}
                            cellConfig={categories.map((cat) => ({
                                fill: getColor(cat.label),
                            }))}
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="heading-text font-medium mb-1">
                                Total
                            </div>
                            <h3>{total}</h3>
                        </div>
                        <div className="space-y-2">
                            {categories.map((category, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{
                                                backgroundColor: getColor(
                                                    category.label,
                                                ),
                                            }}
                                        />
                                        <span className="font-medium">
                                            {category.label}
                                        </span>
                                    </div>
                                    <span className="font-medium heading-text flex gap-1">
                                        {category.count}
                                        <span className="hidden 2xl:block">
                                            Task
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default OverallTasks
