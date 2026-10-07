import { AreaChart } from '@/components/shared/Chart'

const data = [
    { month: 'Jan', views: 190 },
    { month: 'Feb', views: 295 },
    { month: 'Mar', views: 250 },
    { month: 'Apr', views: 80 },
    { month: 'May', views: 215 },
    { month: 'Jun', views: 220 },
]

const AreaChartGradiant = () => {
    return (
        <div>
            <AreaChart
                data={data}
                areaConfig={[{ dataKey: 'views', fill: 'url(#gradient-fill)' }]}
                xAxisConfig={{
                    dataKey: 'month',
                }}
            >
                {({ colors }) => (
                    <defs>
                        <linearGradient
                            id="gradient-fill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor={colors[0]}
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor={colors[0]}
                                stopOpacity={0.1}
                            />
                        </linearGradient>
                    </defs>
                )}
            </AreaChart>
        </div>
    )
}

export default AreaChartGradiant
