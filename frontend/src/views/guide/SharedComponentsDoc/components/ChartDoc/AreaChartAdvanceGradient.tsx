import { AreaChart, ChartTooltipContent } from '@/components/shared/Chart'

const data = [
    { day: 'Sep 12', views: 1330 },
    { day: 'Sep 13', views: 3400 },
    { day: 'Sep 14', views: 4470 },
    { day: 'Sep 15', views: 3540 },
    { day: 'Sep 16', views: 2610 },
    { day: 'Sep 17', views: 2680 },
    { day: 'Sep 18', views: 4750 },
    { day: 'Sep 19', views: 3820 },
    { day: 'Sep 20', views: 6690 },
    { day: 'Sep 21', views: 6960 },
    { day: 'Sep 22', views: 6030 },
    { day: 'Sep 23', views: 8100 },
    { day: 'Sep 24', views: 9170 },
    { day: 'Sep 25', views: 8240 },
    { day: 'Sep 26', views: 8310 },
]

const AreaChartGradiant = () => {
    return (
        <div>
            <AreaChart
                data={data}
                areaConfig={[
                    {
                        dataKey: 'views',
                        fill: 'url(#gradient-color)',
                        stroke: 'url(#gradient-color)',
                        mask: 'url(#fade-mask)',
                    },
                ]}
                xAxisConfig={{
                    dataKey: 'day',
                }}
                tooltipConfig={{
                    content: <ChartTooltipContent hideIndicator />,
                }}
            >
                <defs>
                    <linearGradient
                        id="gradient-color"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="33%" stopColor="#FF69B4" />
                        <stop offset="66%" stopColor="#8A2BE2" />
                        <stop offset="100%" stopColor="#1E90FF" />
                    </linearGradient>
                    <linearGradient
                        id="fade-gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <mask id="fade-mask">
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="95%"
                            fill="url(#fade-gradient)"
                        />
                    </mask>
                </defs>
            </AreaChart>
        </div>
    )
}

export default AreaChartGradiant
