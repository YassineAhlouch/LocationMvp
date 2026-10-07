import { LineChart } from '@/components/shared/Chart'

const data = [
    {
        name: 'Jan',
        Profit: 4000,
        Revenue: 2400,
    },
    {
        name: 'Feb',
        Profit: 3000,
        Revenue: 1398,
    },
    {
        name: 'Mar',
        Profit: 2000,
        Revenue: 9800,
    },
    {
        name: 'Apr',
        Profit: 2780,
        Revenue: 3908,
    },
    {
        name: 'May',
        Profit: 1890,
        Revenue: 4800,
    },
    {
        name: 'Jun',
        Profit: 2390,
        Revenue: 3800,
    },
    {
        name: 'Jul',
        Profit: 3490,
        Revenue: 4300,
    },
]

const LineChartSimple = () => {
    return (
        <div>
            <LineChart
                data={data}
                lineConfig={[
                    { type: 'monotone', dataKey: 'Revenue' },
                    { type: 'monotone', dataKey: 'Profit' },
                ]}
                xAxisConfig={{
                    dataKey: 'name',
                }}
            />
        </div>
    )
}

export default LineChartSimple
