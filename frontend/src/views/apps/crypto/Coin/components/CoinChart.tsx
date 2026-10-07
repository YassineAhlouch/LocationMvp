import Button from '@/components/ui/Button'
import Segment from '@/components/ui/Segment'
import InputGroup from '@/components/ui/InputGroup'
import LineChart from '@/components/shared/Chart/LineChart'
import BarChart from '@/components/shared/Chart/BarChart'
import ChartContainer from '@/components/shared/Chart/ChartContainer'
import { defaultChartConfig } from '@/components/shared/Chart/configs'
import formatNumber from '@/utils/formatNumber'
import { LiDiagram, LiBarChartUp, LiChart } from '@/icons'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart as RechartBar,
    Bar,
} from 'recharts'
import type { ChartDataPoint, ChartTimeRange, ChartType } from '../types'
import type { ReactNode } from 'react'

type CoinChartProps = {
    data: ChartDataPoint[]
    timeRange: ChartTimeRange
    chartType: ChartType
    onTimeRangeChange: (range: ChartTimeRange) => void
    onChartTypeChange: (type: ChartType) => void
    isLoading: boolean
    coinSymbol: string
}

const CHART_HEIGHT = 380

const timeRanges: ChartTimeRange[] = ['1h', '24h', '7d', '30d', '1y', 'ALL']
const chartTypes: { value: ChartType; label: ReactNode }[] = [
    { value: 'line', label: <LiDiagram className="text-lg" /> },
    { value: 'candlestick', label: <LiChart className="text-lg" /> },
    { value: 'volume', label: <LiBarChartUp className="text-lg" /> },
]

const formatTooltipLabel = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
}

const formatPrice = (price: number) => {
    if (typeof price !== 'number' || isNaN(price)) {
        return '$0.00'
    }
    return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: price < 1 ? 6 : 2,
    })}`
}

const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`
    return `$${volume.toFixed(2)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CandlestickTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        const [open, close] = data.openClose || [0, 0]
        const { high, low, volume } = data

        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg max-w-xs">
                <p className="mb-2 font-medium">{formatTooltipLabel(label)}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span>Open: </span>
                        <span className="font-semibold heading-text">
                            {formatPrice(open)}
                        </span>
                    </div>
                    <div>
                        <span>Close: </span>
                        <span
                            className={`font-semibold ${close >= open ? 'text-success' : 'text-error'}`}
                        >
                            {formatPrice(close)}
                        </span>
                    </div>
                    <div>
                        <span>High: </span>
                        <span className="font-semibold heading-text">
                            {formatPrice(high)}
                        </span>
                    </div>
                    <div>
                        <span>Low: </span>
                        <span className="font-semibold heading-text">
                            {formatPrice(low)}
                        </span>
                    </div>
                </div>
                {volume && (
                    <p className="text-sm pt-1 border-t border-gray-200 dark:border-gray-600">
                        <span>Volume: </span>
                        <span className="font-semibold heading-text">
                            {formatVolume(volume)}
                        </span>
                    </p>
                )}
            </div>
        )
    }
    return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BarShape = (props: any) => {
    const { x, y, width, height, payload } = props

    if (
        !payload ||
        typeof x !== 'number' ||
        typeof y !== 'number' ||
        typeof width !== 'number' ||
        typeof height !== 'number'
    ) {
        return null
    }

    const { low, high, openClose, previousClose } = payload
    const [open, close] = openClose || [0, 0]
    const isGrowing =
        previousClose !== undefined ? close > previousClose : close > open
    const color = isGrowing
        ? defaultChartConfig.colors[2]
        : defaultChartConfig.colors[4]
    const ratio = open !== close ? Math.abs(height / (open - close)) : 1

    return (
        <g stroke={color} fill="none" strokeWidth="2">
            <path
                d={`M ${x},${y}L ${x},${y + height}L ${x + width},${y + height}L ${x + width},${y}L ${x},${y}`}
                fill={color}
            />
            {isGrowing ? (
                <path
                    d={`M ${x + width / 2}, ${y + height}v ${(open - low) * ratio}`}
                />
            ) : (
                <path
                    d={`M ${x + width / 2}, ${y}v ${(close - low) * ratio}`}
                />
            )}
            {isGrowing ? (
                <path
                    d={`M ${x + width / 2}, ${y}v ${(close - high) * ratio}`}
                />
            ) : (
                <path
                    d={`M ${x + width / 2}, ${y + height}v ${(open - high) * ratio}`}
                />
            )}
        </g>
    )
}

const CoinChart = ({
    data,
    timeRange,
    chartType,
    onTimeRangeChange,
    onChartTypeChange,
    isLoading,
}: CoinChartProps) => {
    const formatXAxisLabel = (timestamp: number) => {
        const date = new Date(timestamp)

        switch (timeRange) {
            case '1h':
                return date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            case '24h':
                return date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            case '7d':
            case '30d':
                return date.toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                })
            case '1y':
            case 'YTD':
            case 'ALL':
                return date.toLocaleDateString([], {
                    month: 'short',
                    year: '2-digit',
                })
            default:
                return date.toLocaleDateString()
        }
    }

    const priceChange =
        data.length > 1 ? data[data.length - 1].price - data[0].price : 0
    const isPositive = priceChange >= 0

    return (
        <div id="coin-chart">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                    <InputGroup className="w-full md:w-auto">
                        {timeRanges.map((range) => (
                            <Button
                                key={range}
                                onClick={() => onTimeRangeChange(range)}
                                aria-label={`Select ${range} time range`}
                                aria-pressed={timeRange === range}
                                active={timeRange === range}
                                className="px-1 sm:px-4"
                                block
                            >
                                {range}
                            </Button>
                        ))}
                    </InputGroup>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <div className="flex gap-2 min-w-max">
                        <Segment
                            value={chartType}
                            onChange={(value) =>
                                onChartTypeChange(value as ChartType)
                            }
                        >
                            {chartTypes.map((type) => (
                                <Segment.Item
                                    key={type.value}
                                    value={type.value}
                                    className="px-2"
                                >
                                    {type.label}
                                </Segment.Item>
                            ))}
                        </Segment>
                    </div>
                </div>
            </div>

            <div className="touch-pan-x touch-pan-y">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div>Loading chart...</div>
                    </div>
                ) : (
                    <>
                        {chartType === 'line' && (
                            <LineChart
                                data={data}
                                height={CHART_HEIGHT}
                                lineConfig={[
                                    {
                                        dataKey: 'price',
                                        type: 'linear',
                                        stroke: isPositive
                                            ? defaultChartConfig.colors[2]
                                            : defaultChartConfig.colors[4],
                                    },
                                ]}
                                yAxisConfig={{
                                    domain: (() => {
                                        const allValues = data.flatMap((d) => [
                                            d.high,
                                            d.low,
                                            d.open,
                                            d.close,
                                        ])
                                        const minValue = Math.min(
                                            ...(allValues as number[]),
                                        )
                                        const maxValue = Math.max(
                                            ...(allValues as number[]),
                                        )
                                        return [minValue, maxValue]
                                    })(),
                                    tickFormatter: (value) =>
                                        `$${formatNumber(value)}`,
                                    hide: false,
                                }}
                                xAxisConfig={{
                                    dataKey: 'timestamp',
                                    tickFormatter: formatXAxisLabel,
                                }}
                            />
                        )}
                        {chartType === 'volume' && (
                            <BarChart
                                data={data}
                                height={CHART_HEIGHT}
                                barConfig={[
                                    {
                                        dataKey: 'volume',
                                        fill: defaultChartConfig.colors[0],
                                        barSize: 20,
                                        radius: [4, 4, 0, 0],
                                    },
                                ]}
                                yAxisConfig={{
                                    domain: (() => {
                                        const allValues = data.flatMap((d) => [
                                            d.high,
                                            d.low,
                                            d.open,
                                            d.close,
                                        ])
                                        const minValue = Math.min(
                                            ...(allValues as number[]),
                                        )
                                        const maxValue = Math.max(
                                            ...(allValues as number[]),
                                        )
                                        return [minValue, maxValue]
                                    })(),
                                    tickFormatter: (value) =>
                                        `$${formatNumber(value)}`,
                                    hide: false,
                                }}
                                xAxisConfig={{
                                    dataKey: 'timestamp',
                                    tickFormatter: formatXAxisLabel,
                                }}
                            />
                        )}
                        {chartType === 'candlestick' && (
                            <ChartContainer height={CHART_HEIGHT}>
                                <RechartBar
                                    data={data.map(
                                        ({ open, close, ...other }, index) => ({
                                            ...other,
                                            openClose: [open, close],
                                            previousClose:
                                                index > 0
                                                    ? data[index - 1].close
                                                    : undefined,
                                        }),
                                    )}
                                    height={CHART_HEIGHT}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 20,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="timestamp"
                                        tickFormatter={formatXAxisLabel}
                                        {...defaultChartConfig.XAxis}
                                    />
                                    <YAxis
                                        domain={(() => {
                                            const allValues = data.flatMap(
                                                (d) => [
                                                    d.high,
                                                    d.low,
                                                    d.open,
                                                    d.close,
                                                ],
                                            )
                                            const minValue = Math.min(
                                                ...(allValues as number[]),
                                            )
                                            const maxValue = Math.max(
                                                ...(allValues as number[]),
                                            )
                                            return [minValue, maxValue]
                                        })()}
                                        tickFormatter={(value) =>
                                            `$${formatNumber(value)}`
                                        }
                                    />
                                    <Tooltip
                                        content={<CandlestickTooltipContent />}
                                    />
                                    <Bar
                                        dataKey="openClose"
                                        shape={<BarShape />}
                                        fill="transparent"
                                        barSize={
                                            timeRange === 'ALL' ||
                                            timeRange === '1y' ||
                                            timeRange === '1h'
                                                ? 6
                                                : 18
                                        }
                                    />
                                </RechartBar>
                            </ChartContainer>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default CoinChart
