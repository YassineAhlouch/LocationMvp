import { BarChart } from '@/components/shared/Chart'

const data = [
    {
        name: 'Jan',
        Revenue: 2400,
    },
    {
        name: 'Feb',
        Revenue: 1398,
    },
    {
        name: 'Mar',
        Revenue: 9800,
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
    {
        name: 'Jul',
        Revenue: 5271,
    },
    {
        name: 'Aug',
        Revenue: 2799,
    },
    {
        name: 'Sep',
        Revenue: 7321,
    },
    {
        name: 'Oct',
        Revenue: 6198,
    },
    {
        name: 'Nov',
        Revenue: 5000,
    },
    {
        name: 'Dec',
        Revenue: 4300,
    },
]

const BarChartSimple = () => {
    return (
        <div>
            <BarChart
                data={data}
                barConfig={[{ dataKey: 'Revenue' }]}
                xAxisConfig={{
                    dataKey: 'name',
                }}
            />
        </div>
    )
}

export default BarChartSimple
