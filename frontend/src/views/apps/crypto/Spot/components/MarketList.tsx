import { useState, useMemo, useCallback } from 'react'
import Scroll from '@/components/ui/Scroll'
import { apiGetSpotMarketList } from '@/services/CryptoService'
import { useSpotTradingStore } from '../store/spotTradingStore'
import Input from '@/components/ui/Input'
import classNames from '@/utils/classNames'
import { converActivePairDisplay } from '../utils'
import useSWR from 'swr'
import { LiSearch } from '@/icons'
import type { GetSpotMarketListResponse, SpotMarketData } from '../types'

const MarketList = () => {
    const { data } = useSWR(
        '/api/crypto/spot/markets',
        () => apiGetSpotMarketList<GetSpotMarketListResponse>(),
        {
            refreshInterval: 10000,
            revalidateOnFocus: false,
        },
    )

    const activePair = useSpotTradingStore((state) => state.activePair)
    const setActivePair = useSpotTradingStore((state) => state.setActivePair)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredMarkets = useMemo(() => {
        const marketList = data?.markets || []
        if (!searchQuery) return marketList

        const query = searchQuery.toLowerCase()
        return marketList.filter(
            (market: SpotMarketData) =>
                market.pair.toLowerCase().includes(query) ||
                market.baseAsset.toLowerCase().includes(query) ||
                market.quoteAsset.toLowerCase().includes(query),
        )
    }, [data?.markets, searchQuery])

    const formatPrice = (price: number) => {
        return price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 6 : 2,
        })
    }

    const formatChange = useCallback((change: number) => {
        return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`
    }, [])

    const handlePairSelect = useCallback(
        (pair: string) => {
            setActivePair(pair)
        },
        [setActivePair],
    )

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value)
        },
        [],
    )

    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="mb-4">
                <Input
                    placeholder="Search markets..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    prefix={<LiSearch />}
                    aria-label="Search trading pairs"
                />
            </div>
            <Scroll className="h-[375px]">
                {filteredMarkets.length === 0 ? (
                    <div className="p-4 text-center">No markets found</div>
                ) : (
                    <div className="flex flex-col ltr:px-1 rtl:px-1">
                        <div className="flex items-center py-1 px-2">
                            <div className="flex-1 text-left text-xs font-medium">
                                Name
                            </div>
                            <div className="lg:w-16 2xl:w-20 text-right text-xs font-medium">
                                Price
                            </div>
                            <div className="lg:w-16 2xl:w-20 text-right text-xs font-medium">
                                24h %
                            </div>
                        </div>
                        {filteredMarkets.map((market: SpotMarketData) => (
                            <div
                                key={market.pair}
                                className={classNames(
                                    'flex items-center py-1.5 px-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xs',
                                    activePair === market.pair &&
                                        'bg-primary-subtle',
                                )}
                                onClick={() => handlePairSelect(market.pair)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Select ${market.pair} trading pair`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        handlePairSelect(market.pair)
                                    }
                                }}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold heading-text">
                                            {converActivePairDisplay(
                                                market.pair,
                                            )}
                                        </span>
                                        {market.leverage && (
                                            <span className="text-xs px-1 py-0.5 font-medium border border-gray-300 dark:border-gray-700 heading-text bg-white dark:bg-gray-800 rounded-md scale-90">
                                                {market.leverage}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="lg:w-16 2xl:w-20 flex justify-end heading-text">
                                    {formatPrice(market.price)}
                                </div>
                                <div
                                    className={classNames(
                                        'font-medium lg:w-16 2xl:w-20 flex justify-end',
                                        market.changePercentage24h > 0
                                            ? 'text-success'
                                            : market.changePercentage24h < 0
                                              ? 'text-error'
                                              : 'text-gray-500 dark:text-gray-400',
                                    )}
                                >
                                    {formatChange(market.changePercentage24h)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Scroll>
        </div>
    )
}

export default MarketList
