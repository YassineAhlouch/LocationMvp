import { memo, useCallback } from 'react'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import ChartContainer from '@/components/shared/Chart/ChartContainer'
import { defaultChartConfig } from '@/components/shared/Chart/configs'
import formatNumber from '@/utils/formatNumber'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart as RechartBar,
    Bar,
} from 'recharts'
import useSpotData from '../hooks/useSpotData'
import { useSpotTradingStore } from '../store/spotTradingStore'
import type { ChartTimeRange } from '../store/spotTradingStore'

const CHART_HEIGHT = 391

const timeRanges: ChartTimeRange[] = ['1m', '5m', '15m', '1h', '4h', '1d']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CandlestickShape = (props: any) => {
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

    const { low, high, open, close } = payload
    const isGrowing = close > open
    const color = isGrowing
        ? defaultChartConfig.colors[2]
        : defaultChartConfig.colors[4]

    const centerX = x + width / 2
    const bodyTop = Math.min(open, close)
    const bodyHeight = Math.abs(close - open)

    return (
        <g stroke={color} fill={color} strokeWidth="1">
            <line
                x1={centerX}
                y1={y + (1 - (high - low) / (high - low)) * height}
                x2={centerX}
                y2={y + (1 - (low - low) / (high - low)) * height}
                strokeWidth="1"
            />
            <rect
                x={x + 1}
                y={y + (1 - (bodyTop - low) / (high - low)) * height}
                width={width - 2}
                height={Math.max(1, (bodyHeight / (high - low)) * height)}
                fill={color}
                fillOpacity={isGrowing ? 0.8 : 1}
            />
        </g>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CandlestickTooltipContent = ({ active, payload, label }: any) => {
    const formatTooltipLabel = useCallback((timestamp: number) => {
        const date = new Date(timestamp)
        return date.toLocaleString()
    }, [])

    const formatPrice = useCallback((price: number) => {
        if (typeof price !== 'number' || isNaN(price)) {
            return '$0.00'
        }
        return `${price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 6 : 2,
        })}`
    }, [])

    const formatVolume = useCallback((volume: number) => {
        if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
        if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
        if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`
        return `${volume.toFixed(2)}`
    }, [])

    if (active && payload && payload.length) {
        const data = payload[0].payload
        const { open, close, high, low, volume } = data

        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-lg max-w-xs">
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
                    <p className="text-sm pt-1 border-t border-gray-200 dark:border-gray-600 mt-2">
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

const SpotTradingChart = memo(() => {
    const { chart: chartData } = useSpotData()
    const timeRange = useSpotTradingStore((state) => state.chartTimeframe)
    const setTimeRange = useSpotTradingStore((state) => state.setChartTimeframe)

    const formatXAxisLabel = (timestamp: number) => {
        const date = new Date(timestamp)

        switch (timeRange) {
            case '1m':
            case '5m':
            case '15m':
                return date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            case '1h':
            case '4h':
                return date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            case '1d':
                return date.toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                })
            default:
                return date.toLocaleDateString()
        }
    }

    return (
        <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                <h5 className="font-semibold heading-text">Chart</h5>
                <div className="flex flex-wrap items-center gap-2">
                    <InputGroup className="w-full sm:w-auto">
                        {timeRanges.map((range) => (
                            <Button
                                key={range}
                                className="px-0 sm:px-4"
                                onClick={() => setTimeRange(range)}
                                aria-label={`Select ${range} time range`}
                                aria-pressed={timeRange === range}
                                active={timeRange === range}
                                block
                            >
                                {range}
                            </Button>
                        ))}
                    </InputGroup>
                </div>
            </div>
            <div className="touch-pan-x touch-pan-y">
                <ChartContainer height={CHART_HEIGHT}>
                    <RechartBar
                        data={chartData.map((item) => ({
                            ...item,
                            openClose: [item.open, item.close],
                        }))}
                        height={CHART_HEIGHT}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="currentColor"
                            className="text-gray-200 dark:text-gray-700"
                        />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatXAxisLabel}
                            {...defaultChartConfig.XAxis}
                        />
                        <YAxis
                            tickFormatter={(value) => `${formatNumber(value)}`}
                            {...defaultChartConfig.YAxis}
                            domain={(() => {
                                const allValues = chartData.flatMap((d) => [
                                    d.high,
                                    d.low,
                                ])
                                const minValue = Math.min(...allValues)
                                const maxValue = Math.max(...allValues)
                                const padding = 0
                                return [minValue - padding, maxValue + padding]
                            })()}
                        />
                        <Tooltip content={<CandlestickTooltipContent />} />
                        <Bar
                            dataKey="openClose"
                            shape={<CandlestickShape />}
                            fill="transparent"
                            barSize={
                                timeRange === '1m' || timeRange === '5m' ? 4 : 8
                            }
                        />
                    </RechartBar>
                </ChartContainer>
            </div>
        </div>
    )
})

SpotTradingChart.displayName = 'SpotTradingChart'

export default SpotTradingChart
