import Card from '@/components/ui/Card'
import Tooltip from '@/components/ui/Tooltip'
import Skeleton from '@/components/ui/Skeleton'
import { ChartContainer, defaultChartConfig } from '@/components/shared/Chart'
import { ComposedChart, Area } from 'recharts'
import classNames from '@/utils/classNames'
import { apiGetCustomerStatistics } from '@/services/CustomersService'
import formatCurrency from '@/utils/formatCurrency'
import {
    LuUsers,
    LuSparkles,
    LuBadgeDollarSign,
    LuBolt,
    LuArrowUp,
    LuArrowDown,
    LuInfo,
} from 'react-icons/lu'
import useSWR from 'swr'

type GetCustomerStatisticsResponse = Record<
    string,
    {
        value: number
        trend: string
        growthData: {
            name: string
            value: number
        }[]
    }
>

const statisticMap: Record<string, { label: string; icon: React.ReactNode }> = {
    totalCustomer: {
        label: 'Total Customer',
        icon: <LuUsers />,
    },
    newCustomer: {
        label: 'New Customer',
        icon: <LuSparkles />,
    },
    orderRevenue: {
        label: 'Order Revenue',
        icon: <LuBadgeDollarSign />,
    },
    referral: {
        label: 'Referral',
        icon: <LuBolt />,
    },
}

const CutomerListStatistic = () => {
    const { data, isLoading } = useSWR(
        ['/api/customer/statistics'],
        () => apiGetCustomerStatistics<GetCustomerStatisticsResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const getBorderClass = (index: number) => {
        let borderClass = ''

        if (index === 0 || index === 2) {
            borderClass =
                'border-b border-r-0 md:border-b-0 md:ltr:border-r md:rtl:border-l border-gray-200 dark:border-gray-700'
        }

        if (index === 1) {
            borderClass =
                'border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700'
        }

        return borderClass
    }

    return (
        <Card bodyClass="px-2 pt-6 pb-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                {data &&
                    Object.entries(data).map(([key, props], index) => (
                        <div
                            key={key}
                            className={classNames(
                                'flex flex-col gap-2 px-4',
                                getBorderClass(index),
                            )}
                        >
                            <div className="flex items-stretch gap-2 heading-text">
                                <span className="text-lg text-pr">
                                    {statisticMap[key].icon}
                                </span>
                                <span className="font-medium flex items-center gap-1">
                                    {statisticMap[key].label}
                                    <Tooltip title="This week">
                                        <LuInfo className="text-xs" />
                                    </Tooltip>
                                </span>
                            </div>
                            <div className="flex items-end gap-4">
                                <div className="flex items-center gap-1 mb-3">
                                    <h3 className="text-xl font-semibold">
                                        {key === 'orderRevenue'
                                            ? formatCurrency(props.value, 'USD')
                                            : props.value}
                                    </h3>
                                    <span className="text-lg">
                                        {props.trend === 'up' ? (
                                            <LuArrowUp className="text-success" />
                                        ) : (
                                            <LuArrowDown className="text-error" />
                                        )}
                                    </span>
                                </div>
                                <ChartContainer height={50} width={100}>
                                    <ComposedChart data={props.growthData}>
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
                                                    stopColor={
                                                        defaultChartConfig
                                                            .colors[0]
                                                    }
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="75%"
                                                    stopColor={
                                                        defaultChartConfig
                                                            .colors[0]
                                                    }
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            dataKey="value"
                                            stroke={
                                                defaultChartConfig.colors[0]
                                            }
                                            fill={'url(#gradient-fill)'}
                                            fillOpacity={0.4}
                                            {...defaultChartConfig.area}
                                        />
                                    </ComposedChart>
                                </ChartContainer>
                            </div>
                        </div>
                    ))}
                {isLoading &&
                    !data &&
                    [...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className={classNames(
                                'flex flex-col justify-center gap-2 px-4',
                                getBorderClass(index),
                            )}
                        >
                            <div className="flex flex-col justify-center gap-2 h-[80px] max-w-[200px]">
                                <Skeleton height={10} />
                                <Skeleton height={10} width="60%" />
                            </div>
                        </div>
                    ))}
            </div>
        </Card>
    )
}

export default CutomerListStatistic
