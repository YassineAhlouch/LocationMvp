import { PieChart } from '@/components/shared/Chart'
import { Label } from 'recharts'

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
    { name: 'Group E', value: 278 },
]

const PieChartDonutContent = () => {
    return (
        <div>
            <PieChart
                data={data}
                pieConfig={{
                    dataKey: 'value',
                    innerRadius: 70,
                    outerRadius: 100,
                }}
                pieContent={
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="text-3xl font-bold fill-gray-900 dark:fill-gray-100"
                                        >
                                            {data.reduce(
                                                (acc, curr) => acc + curr.value,
                                                0,
                                            )}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="text-base font-medium fill-gray-500 dark:fill-gray-400"
                                        >
                                            in total
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                }
            />
        </div>
    )
}

export default PieChartDonutContent
