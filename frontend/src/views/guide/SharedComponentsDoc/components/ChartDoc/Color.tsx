import {
    LineChart,
    BarChart,
    AreaChart,
    PieChart,
} from '@/components/shared/Chart'

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

const Color = () => {
    return (
        <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <LineChart
                    data={data}
                    lineConfig={[
                        {
                            type: 'monotone',
                            dataKey: 'Revenue',
                            stroke: '#00d56f',
                        },
                        {
                            type: 'monotone',
                            dataKey: 'Profit',
                            stroke: '#f97b32',
                        },
                    ]}
                    xAxisConfig={{
                        dataKey: 'name',
                    }}
                />
                <BarChart
                    data={data}
                    barConfig={[
                        { dataKey: 'Revenue', fill: '#742ae3' },
                        { dataKey: 'Profit', fill: '#c7acf0' },
                    ]}
                    xAxisConfig={{
                        dataKey: 'name',
                    }}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AreaChart
                    data={data}
                    areaConfig={[
                        {
                            dataKey: 'Revenue',
                            stroke: '#31cbe9',
                            fill: '#31cbe9',
                        },
                        {
                            dataKey: 'Profit',
                            stroke: '#f3cb46',
                            fill: '#f3cb46',
                        },
                    ]}
                    xAxisConfig={{
                        dataKey: 'name',
                    }}
                />
                <PieChart
                    data={data}
                    pieConfig={{
                        dataKey: 'Profit',
                        innerRadius: 60,
                        outerRadius: 100,
                    }}
                    cellConfig={[
                        { fill: '#417df2' },
                        { fill: '#f2a436' },
                        { fill: '#f97b32' },
                        { fill: '#00be71' },
                        { fill: '#00b6d2' },
                        { fill: '#ef4198' },
                    ]}
                />
            </div>
        </div>
    )
}

export default Color
