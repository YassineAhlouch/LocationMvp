import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import { PieChart } from '@/components/shared/Chart'
import { colors } from '@/constants/colors.constant'
import type { JobLevelData } from '../types'

type JobLevelDistributionProps = {
    data: JobLevelData
}

// Color mapping for job levels (4 levels only)
const levelColors: Record<string, string> = {
    Executive: colors.blue.chart,
    'Senior Executive': colors.purple.chart,
    Manager: colors.emerald.chart,
    Director: colors.yellow.chart,
}

const JobLevelDistribution = ({ data }: JobLevelDistributionProps) => {
    const { total, levels } = data

    const chartData = levels.map((level) => ({
        name: level.name,
        value: level.count,
    }))

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h5>Job Level Distribution</h5>
                <Button>See All</Button>
            </div>
            <div className="flex flex-col items-center">
                <div className="relative w-full flex justify-center">
                    <PieChart
                        data={chartData}
                        height={220}
                        width={220}
                        pieConfig={{
                            dataKey: 'value',
                            nameKey: 'name',
                            cx: '50%',
                            cy: '50%',
                            innerRadius: 70,
                            outerRadius: 90,
                            paddingAngle: 2,
                            cornerRadius: 4,
                        }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-xs">Total</div>
                        <div className="text-3xl font-semibold heading-text">
                            {total}
                        </div>
                    </div>
                </div>

                <div className="w-full mt-4 space-y-2">
                    {levels.map((level, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor:
                                            levelColors[level.name] ||
                                            colors.gray.chart,
                                    }}
                                />
                                <span className="font-medium">
                                    {level.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{level.count}</span>
                                <Tag className="bg-transparent">
                                    {level.percentage}%
                                </Tag>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default JobLevelDistribution
