```jsx
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
    { date: 'Sep 02', 'Page views': 12511, 'Unique visitors': 4600 },
    { date: 'Sep 03', 'Page views': 12380, 'Unique visitors': 5012 },
    { date: 'Sep 04', 'Page views': 12100, 'Unique visitors': 5100 },
    { date: 'Sep 05', 'Page views': 12245, 'Unique visitors': 5300 },
    { date: 'Sep 06', 'Page views': 12520, 'Unique visitors': 5900 },
    { date: 'Sep 07', 'Page views': 12810, 'Unique visitors': 7001 },
    { date: 'Sep 08', 'Page views': 13000, 'Unique visitors': 8122 },
    { date: 'Sep 09', 'Page views': 13245, 'Unique visitors': 9200 },
    { date: 'Sep 10', 'Page views': 13560, 'Unique visitors': 9943 },
    { date: 'Sep 11', 'Page views': 13720, 'Unique visitors': 10100 },
    { date: 'Sep 12', 'Page views': 13033, 'Unique visitors': 10650 },
    { date: 'Sep 13', 'Page views': 12980, 'Unique visitors': 9980 },
    { date: 'Sep 14', 'Page views': 12240, 'Unique visitors': 10000 },
    { date: 'Sep 15', 'Page views': 12110, 'Unique visitors': 10220 },
    { date: 'Sep 16', 'Page views': 11700, 'Unique visitors': 9402 },
    { date: 'Sep 17', 'Page views': 10211, 'Unique visitors': 8050 },
    { date: 'Sep 18', 'Page views': 12320, 'Unique visitors': 10022 },
    { date: 'Sep 19', 'Page views': 12755, 'Unique visitors': 9901 },
    { date: 'Sep 20', 'Page views': 13021, 'Unique visitors': 10101 },
    { date: 'Sep 21', 'Page views': 13840, 'Unique visitors': 10299 },
    { date: 'Sep 22', 'Page views': 14110, 'Unique visitors': 11800 },
    { date: 'Sep 23', 'Page views': 14250, 'Unique visitors': 9801 },
    { date: 'Sep 24', 'Page views': 14700, 'Unique visitors': 8750 },
    { date: 'Sep 25', 'Page views': 15750, 'Unique visitors': 9500 },
    { date: 'Sep 26', 'Page views': 17100, 'Unique visitors': 10750 },
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
```
