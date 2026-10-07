import {
    ChartContainer,
    ChartTooltipContent,
    defaultChartConfig,
} from '@/components/shared/Chart'
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    Scatter,
} from 'recharts'

const data = [
    {
        month: 'Jan',
        visitors: 590,
        signups: 800,
        bounceRate: 1400,
        returnUsers: 490,
    },
    {
        month: 'Feb',
        visitors: 868,
        signups: 967,
        bounceRate: 1506,
        returnUsers: 590,
    },
    {
        month: 'Mar',
        visitors: 1397,
        signups: 1098,
        bounceRate: 989,
        returnUsers: 350,
    },
    {
        month: 'Apr',
        visitors: 1480,
        signups: 1200,
        bounceRate: 1228,
        returnUsers: 480,
    },
    {
        month: 'May',
        visitors: 1520,
        signups: 1108,
        bounceRate: 1100,
        returnUsers: 460,
    },
    {
        month: 'Jun',
        visitors: 1400,
        signups: 680,
        bounceRate: 1700,
        returnUsers: 380,
    },
]

const nameKey: Record<string, string> = {
    signups: 'Signups',
    bounceRate: 'Bounce Rate',
    returnUsers: 'Return Users',
    visitors: 'Visitors',
}

const Compose = () => {
    return (
        <ChartContainer>
            <ComposedChart
                height={300}
                data={data}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            >
                <CartesianGrid />
                <XAxis
                    dataKey="month"
                    scale="point"
                    {...defaultChartConfig.XAxis}
                />
                <Tooltip
                    content={
                        <ChartTooltipContent
                            nameFormatter={(name) => nameKey[name]}
                        />
                    }
                />
                <Area
                    dataKey="bounceRate"
                    stroke={defaultChartConfig.colors[0]}
                    fill={defaultChartConfig.colors[0]}
                    fillOpacity={0.4}
                    {...defaultChartConfig.area}
                />
                <Bar
                    dataKey="signups"
                    barSize={20}
                    fill={defaultChartConfig.colors[1]}
                    {...defaultChartConfig.bar}
                />
                <Line
                    dataKey="visitors"
                    stroke={defaultChartConfig.colors[2]}
                    {...defaultChartConfig.line}
                />
                <Scatter
                    dataKey="returnUsers"
                    fill={defaultChartConfig.colors[3]}
                />
            </ComposedChart>
        </ChartContainer>
    )
}

export default Compose
