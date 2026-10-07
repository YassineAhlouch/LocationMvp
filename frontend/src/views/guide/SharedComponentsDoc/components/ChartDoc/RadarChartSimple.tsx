import { RadarChart } from '@/components/shared/Chart'

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

const RadarChartSimple = () => {
    return (
        <RadarChart
            data={data}
            radarConfig={[{ dataKey: 'Revenue' }]}
            angleAxisConfig={{
                dataKey: 'name',
            }}
        />
    )
}

export default RadarChartSimple
