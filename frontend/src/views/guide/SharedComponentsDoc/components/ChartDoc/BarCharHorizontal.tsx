import { BarChart } from '@/components/shared/Chart'
import { YAxis } from 'recharts'

const data = [
    {
        name: 'Jan',
        Revenue: 3400,
    },
    {
        name: 'Feb',
        Revenue: 2398,
    },
    {
        name: 'Mar',
        Revenue: 3800,
    },
    {
        name: 'Apr',
        Revenue: 3908,
    },
    {
        name: 'May',
        Revenue: 4800,
    },
    {
        name: 'Jun',
        Revenue: 3800,
    },
]

const BarCharHorizontal = () => {
    return (
        <div>
            <BarChart
                data={data}
                barConfig={[{ dataKey: 'Revenue' }]}
                xAxisConfig={{
                    dataKey: 'Revenue',
                    type: 'number',
                }}
                layout="vertical"
            >
                <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
            </BarChart>
        </div>
    )
}

export default BarCharHorizontal
