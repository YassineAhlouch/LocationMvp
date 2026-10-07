import { LineChart, ChartTooltipContent } from '@/components/shared/Chart'

const data = [
    { day: 'Aug 01', US: 1200, DE: 2000, JP: 800 },
    { day: 'Aug 02', US: 1350, DE: 2100, JP: 1000 },
    { day: 'Aug 03', US: 1100, DE: 2050, JP: 1200 },
    { day: 'Aug 04', US: 1500, DE: 2150, JP: 950 },
    { day: 'Aug 05', US: 1400, DE: 2250, JP: 1050 },
    { day: 'Aug 06', US: 1550, DE: 2000, JP: 1150 },
    { day: 'Aug 07', US: 1300, DE: 1950, JP: 1300 },
    { day: 'Aug 08', US: 1250, DE: 2100, JP: 1100 },
    { day: 'Aug 09', US: 1450, DE: 2200, JP: 1000 },
    { day: 'Aug 10', US: 1600, DE: 2300, JP: 900 },
    { day: 'Aug 11', US: 1500, DE: 2150, JP: 950 },
    { day: 'Aug 12', US: 1650, DE: 2250, JP: 850 },
    { day: 'Aug 13', US: 1700, DE: 2350, JP: 1000 },
    { day: 'Aug 14', US: 1600, DE: 2400, JP: 1100 },
    { day: 'Aug 15', US: 1750, DE: 2200, JP: 1150 },
    { day: 'Aug 16', US: 1600, DE: 2100, JP: 1300 },
    { day: 'Aug 17', US: 1500, DE: 2050, JP: 1200 },
    { day: 'Aug 18', US: 1450, DE: 2150, JP: 1250 },
    { day: 'Aug 19', US: 1550, DE: 2250, JP: 1400 },
    { day: 'Aug 20', US: 1400, DE: 2100, JP: 1350 },
    { day: 'Aug 21', US: 1650, DE: 2050, JP: 1500 },
    { day: 'Aug 22', US: 1700, DE: 2000, JP: 1600 },
    { day: 'Aug 23', US: 1750, DE: 1900, JP: 1400 },
    { day: 'Aug 24', US: 1600, DE: 1950, JP: 1300 },
    { day: 'Aug 25', US: 1800, DE: 1800, JP: 1200 },
    { day: 'Aug 26', US: 1700, DE: 1750, JP: 1100 },
    { day: 'Aug 27', US: 1900, DE: 1850, JP: 1000 },
    { day: 'Aug 28', US: 2100, DE: 1900, JP: 900 },
    { day: 'Aug 29', US: 2300, DE: 1700, JP: 800 },
    { day: 'Aug 30', US: 2600, DE: 1600, JP: 750 },
    { day: 'Aug 31', US: 3000, DE: 1500, JP: 800 },
]

const CustomTooltip = () => {
    return (
        <div>
            <LineChart
                data={data}
                lineConfig={[
                    { type: 'linear', dataKey: 'US' },
                    { type: 'linear', dataKey: 'DE' },
                    { type: 'linear', dataKey: 'JP' },
                ]}
                xAxisConfig={{
                    dataKey: 'day',
                }}
                tooltipConfig={{
                    content: (
                        <ChartTooltipContent
                            customContent={({ payload, label }) => {
                                return (
                                    <div>
                                        <div className="py-1.5 px-2 border-b border-gray-200 dark:border-gray-700">
                                            <h6 className="text-xs">{label}</h6>
                                        </div>
                                        <div className="flex flex-col gap-1.5 p-2">
                                            {payload?.map((item, index) => {
                                                return (
                                                    <div
                                                        className="flex items-center justify-between"
                                                        key={index}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-2.5 h-0.5 rounded"
                                                                style={{
                                                                    backgroundColor:
                                                                        item.color,
                                                                }}
                                                            ></div>
                                                            <span className="font-semibold heading-text">
                                                                {item.name}
                                                                :{' '}
                                                            </span>
                                                        </div>
                                                        <span className="font-medium">
                                                            $
                                                            {item?.value?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            }}
                        />
                    ),
                }}
            />
        </div>
    )
}

export default CustomTooltip
