import { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { apiGetOrderBook } from '@/services/CryptoService'
import useSWR from 'swr'
import { useSpotTradingStore } from '../store/spotTradingStore'
import Skeleton from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import Scroll from '@/components/ui/Scroll'
import type {
    GetOrderBookResponse,
    OrderBookView,
    OrderBookEntry,
} from '../types'
import classNames from '@/utils/classNames'

type TooltipData = {
    averagePrice: number
    cumulativeAmount: number
    cumulativeTotal: number
    baseAsset: string
    quoteAsset: string
}

type CustomTooltipProps = {
    data: TooltipData | null
    position: { x: number; y: number } | null
    visible: boolean
}

type OrderBookRowProps = {
    entry: OrderBookEntry
    side: 'bid' | 'ask'
    maxCumulative: number
    isHovered: boolean
    onHover: (entry: OrderBookEntry | null) => void
    onClick?: (price: number) => void
    baseAsset: string
    quoteAsset: string
    averagePrice: number
    onTooltipHover: (data: TooltipData | null, element?: HTMLElement) => void
}

const OrderIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
        >
            <path
                d="M2.66663 2.66699L7.33329 2.66699L7.33329 7.33366L2.66663 7.33366L2.66663 2.66699Z"
                className="fill-error"
            />
            <path
                d="M2.66663 8.66699L7.33329 8.66699L7.33329 13.3337L2.66663 13.3337L2.66663 8.66699Z"
                className="fill-success"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.66663 2.66699L13.3333 2.66699L13.3333 5.33366L8.66663 5.33366L8.66663 2.66699ZM8.66663 6.66699L13.3333 6.66699L13.3333 9.33366L8.66663 9.33366L8.66663 6.66699ZM13.3333 10.667L8.66663 10.667L8.66663 13.3337L13.3333 13.3337L13.3333 10.667Z"
                className="fill-gray-400 dark:fill-gray-600"
            />
        </svg>
    )
}

const BidIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
        >
            <g>
                <path
                    d="M2.66663 2.66699L7.33329 2.66699L7.33329 13.3337L2.66663 13.3337L2.66663 2.66699Z"
                    className="fill-success"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.66663 2.66699L13.3333 2.66699L13.3333 5.33366L8.66663 5.33366L8.66663 2.66699ZM8.66663 6.66699L13.3333 6.66699L13.3333 9.33366L8.66663 9.33366L8.66663 6.66699ZM13.3333 10.667L8.66663 10.667L8.66663 13.3337L13.3333 13.3337L13.3333 10.667Z"
                    className="fill-gray-400 dark:fill-gray-600"
                />
            </g>
        </svg>
    )
}

const AskIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
        >
            <g>
                <path
                    d="M2.66663 2.66699L7.33329 2.66699L7.33329 13.3337L2.66663 13.3337L2.66663 2.66699Z"
                    className="fill-error"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.66663 2.66699L13.3333 2.66699L13.3333 5.33366L8.66663 5.33366L8.66663 2.66699ZM8.66663 6.66699L13.3333 6.66699L13.3333 9.33366L8.66663 9.33366L8.66663 6.66699ZM13.3333 10.667L8.66663 10.667L8.66663 13.3337L13.3333 13.3337L13.3333 10.667Z"
                    className="fill-gray-400 dark:fill-gray-600"
                />
            </g>
        </svg>
    )
}

const CustomTooltip = ({ data, position, visible }: CustomTooltipProps) => {
    if (!visible || !data || !position) return null

    return (
        <div
            className="fixed z-50 pointer-events-none"
            style={{
                left: position.x - 190,
                top: position.y,
                transform: 'translateY(-50%)',
            }}
        >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 text-xs min-w-[180px]">
                <div className="font-medium mb-2 heading-text">
                    Order Details
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between gap-4">
                        <span>Avg Price:</span>
                        <span className="font-mono heading-text">
                            {data.averagePrice.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span>Sum ({data.baseAsset}):</span>
                        <span className="font-mono heading-text">
                            {data.cumulativeAmount.toFixed(6)}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span>Sum ({data.quoteAsset}):</span>
                        <span className="font-mono heading-text">
                            {data.cumulativeTotal.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const OrderBookRow = ({
    entry,
    side,
    maxCumulative,
    isHovered,
    onHover,
    onClick,
    baseAsset,
    quoteAsset,
    averagePrice,
    onTooltipHover,
}: OrderBookRowProps) => {
    const cumulativePercentage =
        maxCumulative > 0
            ? ((entry.cumulativeTotal || 0) / maxCumulative) * 100
            : 0
    const rowRef = useRef<HTMLDivElement>(null)

    const handleMouseEnter = () => {
        onHover(entry)
        onTooltipHover(
            {
                averagePrice,
                cumulativeAmount: entry.cumulativeAmount || 0,
                cumulativeTotal: entry.cumulativeTotal || 0,
                baseAsset,
                quoteAsset,
            },
            rowRef.current || undefined,
        )
    }

    const handleMouseLeave = () => {
        onHover(null)
        onTooltipHover(null)
    }

    return (
        <div
            ref={rowRef}
            className={classNames(
                'relative flex items-center py-1.25 px-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-xs',
                isHovered && 'bg-gray-100 dark:bg-gray-800',
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => onClick?.(entry.price)}
        >
            <div
                className={classNames(
                    'absolute inset-y-0 right-0 opacity-5 dark:opacity-10',
                    side === 'bid' ? 'bg-success' : 'bg-error',
                )}
                style={{ width: `${cumulativePercentage}%` }}
            />
            <div className="relative z-10 flex items-center w-full">
                <div
                    className={classNames(
                        'flex-1 font-medium',
                        side === 'bid' ? 'text-success' : 'text-error',
                    )}
                >
                    {entry.price.toFixed(2)}
                </div>
                <div className="w-24 text-right heading-text">
                    {entry.amount.toFixed(6)}
                </div>
                <div className="w-24 text-right heading-text">
                    {entry.total.toFixed(2)}
                </div>
            </div>
        </div>
    )
}

const OrderBook = ({ maxRows }: { maxRows?: number }) => {
    const activePair = useSpotTradingStore((state) => state.activePair)
    const orderBookView = useSpotTradingStore((state) => state.orderBookView)
    const setOrderBookView = useSpotTradingStore(
        (state) => state.setOrderBookView,
    )

    const [hoveredEntry, setHoveredEntry] = useState<OrderBookEntry | null>(
        null,
    )
    const [hoveredSide, setHoveredSide] = useState<'bid' | 'ask' | null>(null)

    const [tooltipData, setTooltipData] = useState<TooltipData | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState<{
        x: number
        y: number
    } | null>(null)
    const [tooltipVisible, setTooltipVisible] = useState(false)
    const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [baseAsset, quoteAsset] = useMemo(() => {
        return activePair.split('-')
    }, [activePair])

    const {
        data: orderBook,
        isLoading: isOrderBookLoading,
        error: orderBookError,
    } = useSWR(
        `/api/crypto/spot/${activePair}/orderbook`,
        () => apiGetOrderBook<GetOrderBookResponse>(activePair),
        {
            refreshInterval: 2000,
            revalidateOnFocus: false,
        },
    )

    const processedOrderBook = useMemo(() => {
        if (!orderBook) return null

        const processedBids = orderBook.bids
            .sort((a, b) => b.price - a.price)
            .reduce((acc, bid, index) => {
                const cumulativeAmount =
                    (acc[index - 1]?.cumulativeAmount || 0) + bid.amount
                const cumulativeTotal =
                    (acc[index - 1]?.cumulativeTotal || 0) + bid.total

                acc.push({
                    ...bid,
                    cumulativeAmount,
                    cumulativeTotal,
                })
                return acc
            }, [] as OrderBookEntry[])

        const processedAsks = orderBook.asks
            .sort((a, b) => a.price - b.price)
            .reduce((acc, ask, index) => {
                const cumulativeAmount =
                    (acc[index - 1]?.cumulativeAmount || 0) + ask.amount
                const cumulativeTotal =
                    (acc[index - 1]?.cumulativeTotal || 0) + ask.total

                acc.push({
                    ...ask,
                    cumulativeAmount,
                    cumulativeTotal,
                })
                return acc
            }, [] as OrderBookEntry[])

        return {
            bids: processedBids,
            asks: processedAsks.reverse(),
            lastUpdate: orderBook.lastUpdate,
        }
    }, [orderBook])

    const averagePrices = useMemo(() => {
        if (!processedOrderBook)
            return {
                bids: {},
                asks: {},
                bidsPercentage: 50,
                asksPercentage: 50,
            }

        const bidAverages: Record<number, number> = {}
        const askAverages: Record<number, number> = {}

        processedOrderBook.bids.forEach((bid) => {
            const cumulativeAmount = bid.cumulativeAmount || 0
            const cumulativeTotal = bid.cumulativeTotal || 0
            bidAverages[bid.price] =
                cumulativeAmount > 0
                    ? cumulativeTotal / cumulativeAmount
                    : bid.price
        })

        processedOrderBook.asks.forEach((ask) => {
            const cumulativeAmount = ask.cumulativeAmount || 0
            const cumulativeTotal = ask.cumulativeTotal || 0
            askAverages[ask.price] =
                cumulativeAmount > 0
                    ? cumulativeTotal / cumulativeAmount
                    : ask.price
        })
        const totalBidsValue = processedOrderBook.bids.reduce(
            (sum, bid) => sum + bid.total,
            0,
        )
        const totalAsksValue = processedOrderBook.asks.reduce(
            (sum, ask) => sum + ask.total,
            0,
        )
        const totalValue = totalBidsValue + totalAsksValue

        return {
            bids: bidAverages,
            asks: askAverages,
            bidsPercentage: (totalBidsValue / totalValue) * 100,
            asksPercentage: (totalAsksValue / totalValue) * 100,
        }
    }, [processedOrderBook])

    const maxCumulativeValues = useMemo(() => {
        if (!processedOrderBook) return { bids: 0, asks: 0 }

        const maxBidCumulative = Math.max(
            ...processedOrderBook.bids.map((b) => b.cumulativeTotal || 0),
        )
        const maxAskCumulative = Math.max(
            ...processedOrderBook.asks.map((a) => a.cumulativeTotal || 0),
        )

        return {
            bids: maxBidCumulative,
            asks: maxAskCumulative,
        }
    }, [processedOrderBook])

    const spread = useMemo(() => {
        if (
            !processedOrderBook ||
            processedOrderBook.bids.length === 0 ||
            processedOrderBook.asks.length === 0
        ) {
            return null
        }

        const highestBid = processedOrderBook.bids[0].price
        const lowestAsk =
            processedOrderBook.asks[processedOrderBook.asks.length - 1].price
        const spreadValue = lowestAsk - highestBid
        const spreadPercentage = (spreadValue / lowestAsk) * 100

        return {
            value: spreadValue,
            percentage: spreadPercentage,
        }
    }, [processedOrderBook])

    const handleTooltipHover = useCallback(
        (data: TooltipData | null, element?: HTMLElement) => {
            if (tooltipTimeoutRef.current) {
                clearTimeout(tooltipTimeoutRef.current)
                tooltipTimeoutRef.current = null
            }

            if (data && element) {
                const rect = element.getBoundingClientRect()

                setTooltipData(data)
                setTooltipPosition({
                    x: rect.left,
                    y: rect.top + rect.height / 2,
                })
                setTooltipVisible(true)
            } else {
                tooltipTimeoutRef.current = setTimeout(() => {
                    setTooltipVisible(false)
                    setTooltipData(null)
                    setTooltipPosition(null)
                }, 100)
            }
        },
        [],
    )

    const handleRowHover = useCallback(
        (entry: OrderBookEntry | null, side: 'bid' | 'ask') => {
            setHoveredEntry(entry)
            setHoveredSide(side)
        },
        [],
    )

    useEffect(() => {
        return () => {
            if (tooltipTimeoutRef.current) {
                clearTimeout(tooltipTimeoutRef.current)
            }
        }
    }, [])

    const shouldHighlightRow = useCallback(
        (entry: OrderBookEntry, side: 'bid' | 'ask') => {
            if (!hoveredEntry || hoveredSide !== side) return false

            if (side === 'bid') {
                return entry.price >= hoveredEntry.price
            } else {
                return entry.price <= hoveredEntry.price
            }
        },
        [hoveredEntry, hoveredSide],
    )

    const viewModeOptions = [
        { icon: <OrderIcon />, value: 'orders', label: 'Orders' },
        { icon: <BidIcon />, value: 'bid', label: 'Bid' },
        { icon: <AskIcon />, value: 'ask', label: 'Ask' },
    ]

    if (isOrderBookLoading) {
        return (
            <div className="p-4">
                <div className="space-y-2">
                    {Array.from({ length: 15 }).map((_, index) => (
                        <Skeleton key={index} className="h-5" />
                    ))}
                </div>
            </div>
        )
    }

    if (orderBookError || !processedOrderBook) {
        return (
            <div className="p-4 text-center">
                <div className="mb-2">Failed to load order book</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <h5>Order Book</h5>
                    <div className="flex gap-1">
                        {viewModeOptions.map((option) => (
                            <Tooltip key={option.value} title={option.label}>
                                <Button
                                    className="h-6 w-6 p-0"
                                    size="sm"
                                    icon={option.icon}
                                    value={option.value}
                                    active={orderBookView === option.value}
                                    onClick={() =>
                                        setOrderBookView(
                                            option.value as OrderBookView,
                                        )
                                    }
                                ></Button>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-xs font-medium">
                    <div className="flex-1">Price</div>
                    <div className="w-24 text-right">Amount</div>
                    <div className="w-24 text-right">Total</div>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <Scroll.FlexSize>
                    {/* Asks (Sell Orders) */}
                    {(orderBookView === 'orders' ||
                        orderBookView === 'ask') && (
                        <div>
                            {(maxRows
                                ? processedOrderBook.asks.slice(-maxRows)
                                : processedOrderBook.asks
                            ).map((ask, index) => (
                                <OrderBookRow
                                    key={`ask-${ask.price}-${index}`}
                                    entry={ask}
                                    side="ask"
                                    maxCumulative={maxCumulativeValues.asks}
                                    isHovered={shouldHighlightRow(ask, 'ask')}
                                    onHover={(entry) =>
                                        handleRowHover(entry, 'ask')
                                    }
                                    baseAsset={baseAsset}
                                    quoteAsset={quoteAsset}
                                    averagePrice={
                                        averagePrices.asks[ask.price] ||
                                        ask.price
                                    }
                                    onTooltipHover={handleTooltipHover}
                                />
                            ))}
                        </div>
                    )}

                    {/* Spread indicator */}
                    {orderBookView === 'orders' && spread && (
                        <div className="py-2 px-3 bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium">Spread</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono">
                                        {spread.value.toFixed(2)}
                                    </span>
                                    <span
                                        className={classNames(
                                            'font-mono',
                                            spread.percentage > 0.1
                                                ? 'text-error'
                                                : 'text-gray-500 dark:text-gray-400',
                                        )}
                                    >
                                        ({spread.percentage.toFixed(3)}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    {(orderBookView === 'orders' ||
                        orderBookView === 'bid') && (
                        <div>
                            {(maxRows
                                ? processedOrderBook.bids.slice(0, maxRows)
                                : processedOrderBook.bids
                            ).map((bid, index) => (
                                <OrderBookRow
                                    key={`bid-${bid.price}-${index}`}
                                    entry={bid}
                                    side="bid"
                                    maxCumulative={maxCumulativeValues.bids}
                                    isHovered={shouldHighlightRow(bid, 'bid')}
                                    onHover={(entry) =>
                                        handleRowHover(entry, 'bid')
                                    }
                                    baseAsset={baseAsset}
                                    quoteAsset={quoteAsset}
                                    averagePrice={
                                        averagePrices.bids[bid.price] ||
                                        bid.price
                                    }
                                    onTooltipHover={handleTooltipHover}
                                />
                            ))}
                        </div>
                    )}
                </Scroll.FlexSize>
                <div className="flex items-center gap-2 text-xs px-2 py-4">
                    <div className="flex gap-1">
                        <span className="font-medium heading-text">B</span>
                        <span className="text-success font-medium">
                            {averagePrices.bidsPercentage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex-1 flex gap-1">
                        <div
                            className="bg-success h-1 flex-1"
                            style={{
                                width: `${averagePrices.bidsPercentage.toFixed(1)}%`,
                            }}
                        />
                        <div
                            className="bg-error h-1 flex-1"
                            style={{
                                width: `${averagePrices.asksPercentage.toFixed(1)}%`,
                            }}
                        />
                    </div>
                    <div className="flex gap-1">
                        <span className="text-error font-medium">
                            {averagePrices.asksPercentage.toFixed(1)}%
                        </span>
                        <span className="font-medium heading-text">A</span>
                    </div>
                </div>
            </div>
            <CustomTooltip
                data={tooltipData}
                position={tooltipPosition}
                visible={tooltipVisible}
            />
        </div>
    )
}

export default OrderBook
