import { useMemo } from 'react'
import useSWR from 'swr'
import { AreaChart } from '@/components/shared/Chart'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Loading from '@/components/shared/Loading'
import InputGroup from '@/components/ui/InputGroup'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import Divider from '@/components/shared/Divider'
import { useAssetsStore } from '../store/assetsStore'
import {
    apiGetPortfolioOverview,
    apiGetPortfolioChart,
} from '@/services/CryptoService'
import formatCurrency from '@/utils/formatCurrency'
import { colors } from '@/constants/colors.constant'
import dayjs from 'dayjs'
import type {
    PortfolioOverview as PortfolioOverviewType,
    ChartDataPoint,
} from '../types'

const dateRangeOptions = [
    { value: '1d', label: '1D' },
    { value: '7d', label: '7D' },
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '1y', label: '1Y' },
    { value: 'ALL', label: 'ALL' },
]

const PortfolioOverview = () => {
    const selectedDateRange = useAssetsStore((state) => state.selectedDateRange)
    const setDateRange = useAssetsStore((state) => state.setDateRange)

    const { data: portfolioData, isLoading: portfolioLoading } = useSWR(
        ['/api/crypto/portfolio/overview', selectedDateRange],
        ([, range]) =>
            apiGetPortfolioOverview<PortfolioOverviewType>({
                dateRange: range,
            }),
        {
            revalidateOnFocus: false,
            errorRetryCount: 3,
            errorRetryInterval: 1000,
        },
    )

    const { data: chartResponse, isLoading: chartLoading } = useSWR(
        ['/api/crypto/portfolio/chart', selectedDateRange],
        ([, range]) =>
            apiGetPortfolioChart<{ data: ChartDataPoint[]; dateRange: string }>(
                { dateRange: range },
            ),
        {
            revalidateOnFocus: false,
            errorRetryCount: 3,
            errorRetryInterval: 1000,
        },
    )

    const isLoading = portfolioLoading || chartLoading
    const chartData = chartResponse?.data

    const formattedChartData = useMemo(() => {
        if (!chartData) return []

        return chartData.map((point) => ({
            timestamp: dayjs
                .unix(point.timestamp)
                .format(selectedDateRange === '1d' ? 'HH:mm' : 'MMM DD'),
            value: point.value,
        }))
    }, [chartData, selectedDateRange])

    const chartColor =
        portfolioData?.totalChangePercentage24h &&
        portfolioData.totalChangePercentage24h >= 0
            ? colors.emerald.chart
            : colors.red.chart
    return (
        <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8 lg:gap-4 xl:gap-12">
                    <div>
                        <div className="flex heading-text">Portfolio total</div>
                        <div className="flex items-baseline gap-2">
                            <h5>
                                $
                                {portfolioData?.totalValue.toLocaleString(
                                    'en-US',
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    },
                                )}
                            </h5>
                            {portfolioData && (
                                <GrowShrinkTag
                                    value={parseFloat(
                                        portfolioData.totalChangePercentage24h.toFixed(
                                            2,
                                        ),
                                    )}
                                    suffix="%"
                                />
                            )}
                        </div>
                    </div>
                    <Divider
                        orientation="vertical"
                        className="h-[50px] hidden md:block"
                    />
                    <div>
                        <div className="heading-text">Trading balance</div>
                        <h5>
                            {formatCurrency(
                                portfolioData?.tradingBalance || 0,
                                'USD',
                            )}
                        </h5>
                    </div>
                </div>
                <InputGroup className="w-full md:w-auto">
                    {dateRangeOptions.map((option) => (
                        <Button
                            block
                            key={option.value}
                            value={option.value}
                            onClick={() => setDateRange(option.value)}
                            active={option.value === selectedDateRange}
                            disabled={isLoading}
                        >
                            {option.label}
                        </Button>
                    ))}
                </InputGroup>
            </div>
            <Loading loading={isLoading} className="h-[300px]">
                {formattedChartData.length > 0 ? (
                    <AreaChart
                        data={formattedChartData}
                        areaConfig={[
                            {
                                dataKey: 'value',
                                fill: 'url(#gradient-fill)',
                                stroke: chartColor,
                                strokeWidth: 2,
                            },
                        ]}
                        height={300}
                        xAxisConfig={{
                            dataKey: 'timestamp',
                        }}
                    >
                        {() => (
                            <defs>
                                <linearGradient
                                    id="gradient-fill"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={chartColor}
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="40%"
                                        stopColor={chartColor}
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor={chartColor}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                        )}
                    </AreaChart>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No chart data available</p>
                    </div>
                )}
            </Loading>
        </Card>
    )
}

export default PortfolioOverview
