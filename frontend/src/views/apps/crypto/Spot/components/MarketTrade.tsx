import { useEffect, useRef, useCallback } from 'react'
import Scroll from '@/components/ui/Scroll'
import { apiGetRecentTrades } from '@/services/CryptoService'
import { useSpotTradingStore } from '../store/spotTradingStore'
import classNames from '@/utils/classNames'
import useSWR from 'swr'
import dayjs from 'dayjs'
import type { GetRecentTradesResponse } from '../types'

const MarketTrade = () => {
    const activePair = useSpotTradingStore((state) => state.activePair)

    const { data } = useSWR(
        `/api/crypto/spot/${activePair}/trades`,
        () => apiGetRecentTrades<GetRecentTradesResponse>(activePair),
        {
            refreshInterval: 3000,
            revalidateOnFocus: false,
        },
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const recentTrades = data?.trades || []
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to latest trades
    useEffect(() => {
        if (scrollRef.current && recentTrades.length > 0) {
            scrollRef.current.scrollTop = 0
        }
    }, [recentTrades])

    const formatPrice = useCallback((price: number) => {
        return price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 6 : 2,
        })
    }, [])

    const formatAmount = useCallback((amount: number) => {
        return amount.toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 6,
        })
    }, [])

    const baseAsset = activePair.split('-')[0]
    const quoteAsset = activePair.split('-')[1]

    return (
        <div className="p-4">
            <h5 className="mb-2">Market Trade</h5>
            <div className="flex items-center py-1">
                <div className="flex-1 text-left text-xs font-medium">
                    Price ({quoteAsset})
                </div>
                <div className="w-24 text-right text-xs font-medium">
                    Amount ({baseAsset})
                </div>
                <div className="w-26 text-right text-xs font-medium ltr:pr-2 rtl:pl-2">
                    Time
                </div>
            </div>
            <Scroll.FlexSize className="max-h-[390px]">
                {recentTrades.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No recent trades
                    </div>
                ) : (
                    <div>
                        {recentTrades.map((trade) => (
                            <div
                                key={trade.id}
                                className="flex items-center py-1.5 rounded transition-colors text-xs ltr:pr-2 rtl:pl-2"
                            >
                                <div
                                    className={classNames(
                                        'font-medium flex-1 min-w-0',
                                        trade.side === 'buy'
                                            ? 'text-success'
                                            : 'text-error',
                                    )}
                                >
                                    {formatPrice(trade.price)}
                                </div>
                                <div className="w-24 heading-text flex justify-end">
                                    {formatAmount(trade.amount)}
                                </div>
                                <div className="w-26 flex justify-end">
                                    {dayjs
                                        .unix(trade.timestamp)
                                        .format('HH:mm:ss A')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Scroll.FlexSize>
        </div>
    )
}

export default MarketTrade
