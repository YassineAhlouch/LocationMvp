import { BarChart } from '@/components/shared/Chart'

const data = [
    { date: 'Aug 02', 'Page views': 7350, 'Unique visitors': 4550 },
    { date: 'Aug 03', 'Page views': 11220, 'Unique visitors': 7055 },
    { date: 'Aug 04', 'Page views': 10740, 'Unique visitors': 6840 },
    { date: 'Aug 05', 'Page views': 11111, 'Unique visitors': 7811 },
    { date: 'Aug 06', 'Page views': 11000, 'Unique visitors': 7250 },
    { date: 'Aug 07', 'Page views': 11230, 'Unique visitors': 7650 },
    { date: 'Aug 08', 'Page views': 10201, 'Unique visitors': 7430 },
    { date: 'Aug 09', 'Page views': 9900, 'Unique visitors': 7623 },
    { date: 'Aug 10', 'Page views': 10490, 'Unique visitors': 6955 },
    { date: 'Aug 11', 'Page views': 10120, 'Unique visitors': 8180 },
    { date: 'Aug 12', 'Page views': 10570, 'Unique visitors': 5122 },
    { date: 'Aug 13', 'Page views': 10234, 'Unique visitors': 5001 },
    { date: 'Aug 14', 'Page views': 6775, 'Unique visitors': 4950 },
    { date: 'Aug 15', 'Page views': 6620, 'Unique visitors': 4511 },
    { date: 'Aug 17', 'Page views': 7840, 'Unique visitors': 5390 },
    { date: 'Aug 18', 'Page views': 10566, 'Unique visitors': 6800 },
    { date: 'Aug 19', 'Page views': 10443, 'Unique visitors': 6542 },
    { date: 'Aug 20', 'Page views': 10670, 'Unique visitors': 6400 },
]

const BarChartStack = () => {
    return (
        <div>
            <BarChart
                data={data}
                barConfig={[
                    {
                        dataKey: 'Page views',
                        radius: [0, 0, 6, 6],
                        stackId: 'a',
                    },
                    {
                        dataKey: 'Unique visitors',
                        radius: [6, 6, 0, 0],
                        stackId: 'a',
                    },
                ]}
                xAxisConfig={{
                    dataKey: 'date',
                }}
            />
        </div>
    )
}

export default BarChartStack
