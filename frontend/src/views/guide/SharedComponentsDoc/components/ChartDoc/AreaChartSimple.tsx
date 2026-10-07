import { AreaChart } from '@/components/shared/Chart'

const data = [
    { month: 'Jan', views: 190 },
    { month: 'Feb', views: 295 },
    { month: 'Mar', views: 250 },
    { month: 'Apr', views: 80 },
    { month: 'May', views: 215 },
    { month: 'Jun', views: 220 },
]

const AreaChartSimple = () => {
    return (
        <div>
            <AreaChart
                data={data}
                areaConfig={[{ dataKey: 'views' }]}
                xAxisConfig={{
                    dataKey: 'month',
                }}
            />
        </div>
    )
}

export default AreaChartSimple
