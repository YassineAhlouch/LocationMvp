import { PieChart } from '@/components/shared/Chart'

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
    { name: 'Group E', value: 278 },
]

const PieChartDonut = () => {
    return (
        <div>
            <PieChart
                data={data}
                pieConfig={{
                    dataKey: 'value',
                    innerRadius: 60,
                    outerRadius: 100,
                }}
            />
        </div>
    )
}

export default PieChartDonut
