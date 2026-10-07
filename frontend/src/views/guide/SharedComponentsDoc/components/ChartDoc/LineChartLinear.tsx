import { LineChart } from '@/components/shared/Chart'

const data = [
    { day: 'Aug 01', views: 7250 },
    { day: 'Aug 02', views: 8030 },
    { day: 'Aug 03', views: 7745 },
    { day: 'Aug 04', views: 6855 },
    { day: 'Aug 05', views: 5630 },
    { day: 'Aug 06', views: 4050 },
    { day: 'Aug 07', views: 4010 },
    { day: 'Aug 08', views: 5945 },
    { day: 'Aug 09', views: 6160 },
    { day: 'Aug 10', views: 3300 },
    { day: 'Aug 11', views: 4420 },
    { day: 'Aug 12', views: 5350 },
    { day: 'Aug 13', views: 6620 },
    { day: 'Aug 14', views: 6710 },
    { day: 'Aug 15', views: 7230 },
    { day: 'Aug 16', views: 7850 },
    { day: 'Aug 17', views: 10175 },
    { day: 'Aug 18', views: 10260 },
    { day: 'Aug 19', views: 10630 },
    { day: 'Aug 20', views: 11100 },
    { day: 'Aug 21', views: 6815 },
    { day: 'Aug 22', views: 6980 },
    { day: 'Aug 23', views: 8021 },
    { day: 'Aug 24', views: 9100 },
    { day: 'Aug 25', views: 9250 },
    { day: 'Aug 26', views: 8605 },
    { day: 'Aug 27', views: 7880 },
    { day: 'Aug 28', views: 9990 },
    { day: 'Aug 29', views: 10160 },
    { day: 'Aug 30', views: 10100 },
    { day: 'Aug 31', views: 11200 },
]

const LineChartLinear = () => {
    return (
        <div>
            <LineChart
                data={data}
                lineConfig={[{ type: 'linear', dataKey: 'views' }]}
                xAxisConfig={{
                    dataKey: 'day',
                }}
            />
        </div>
    )
}

export default LineChartLinear
