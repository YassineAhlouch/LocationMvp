import { RadarChart } from '@/components/shared/Chart'

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
]

const RadarChartMultiple = () => {
    return (
        <RadarChart
            data={data}
            radarConfig={[
                { dataKey: 'Revenue', fillOpacity: 0.4 },
                { dataKey: 'Profit', fillOpacity: 0.4 },
            ]}
            angleAxisConfig={{
                dataKey: 'name',
            }}
        />
    )
}

export default RadarChartMultiple
