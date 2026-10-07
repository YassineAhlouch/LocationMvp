import { Card, Button } from '@/components/ui'
import { BarChart } from '@/components/shared/Chart'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import formatNumber from '@/utils/formatNumber'
import { colors } from '@/constants/colors.constant'
import type { EmployeeQualityData } from '../types'

type EmployeeQualityScoreProps = {
    data: EmployeeQualityData
}

const EmployeeQualityScore = ({ data }: EmployeeQualityScoreProps) => {
    const { companyAvgScore, previousScore, trend, departments } = data

    const chartData = departments.map((dept) => ({
        name: dept.name,
        score: dept.avgScore,
    }))

    const scoreDiff = Math.abs(companyAvgScore - previousScore)
    const isImproving = trend === 'up'

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h5>Employee Quality Score</h5>
                <Button>See All</Button>
            </div>
            <div className="py-4">
                <div className="flex items-baseline gap-2 mb-1">
                    <h4>{companyAvgScore.toFixed(1)}</h4>
                    <GrowShrinkTag
                        value={parseInt(
                            formatNumber(isImproving ? scoreDiff : -scoreDiff),
                        )}
                        suffix="%"
                    />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Company Average (out of 100)
                </div>
            </div>

            <div>
                <BarChart
                    data={chartData}
                    height={200}
                    barConfig={[
                        {
                            dataKey: 'score',
                            radius: [4, 4, 0, 0],
                            barSize: 32,
                            fill: colors.cyan.chart,
                        },
                    ]}
                    xAxisConfig={{
                        dataKey: 'name',
                    }}
                />
            </div>
        </Card>
    )
}

export default EmployeeQualityScore
