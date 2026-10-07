import { AreaChart } from '@/components/shared/Chart'

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
    { date: 'Aug 16', 'Page views': 7222, 'Unique visitors': 5072 },
    { date: 'Aug 17', 'Page views': 7840, 'Unique visitors': 5390 },
    { date: 'Aug 18', 'Page views': 10566, 'Unique visitors': 6800 },
    { date: 'Aug 19', 'Page views': 10443, 'Unique visitors': 6542 },
    { date: 'Aug 20', 'Page views': 10670, 'Unique visitors': 6400 },
    { date: 'Aug 21', 'Page views': 11220, 'Unique visitors': 7300 },
    { date: 'Aug 22', 'Page views': 6888, 'Unique visitors': 4455 },
    { date: 'Aug 23', 'Page views': 7050, 'Unique visitors': 5011 },
    { date: 'Aug 24', 'Page views': 8123, 'Unique visitors': 7771 },
    { date: 'Aug 25', 'Page views': 8999, 'Unique visitors': 7650 },
    { date: 'Aug 26', 'Page views': 9250, 'Unique visitors': 7101 },
    { date: 'Aug 27', 'Page views': 9400, 'Unique visitors': 6998 },
    { date: 'Aug 28', 'Page views': 9800, 'Unique visitors': 7250 },
    { date: 'Aug 29', 'Page views': 10150, 'Unique visitors': 7890 },
    { date: 'Aug 30', 'Page views': 10310, 'Unique visitors': 7105 },
    { date: 'Sep 01', 'Page views': 11400, 'Unique visitors': 8201 },
]

const AreaChartStack = () => {
    return (
        <div>
            <AreaChart
                data={data}
                areaConfig={[
                    { dataKey: 'Page views' },
                    { dataKey: 'Unique visitors' },
                ]}
                xAxisConfig={{
                    dataKey: 'date',
                }}
            />
        </div>
    )
}

export default AreaChartStack
