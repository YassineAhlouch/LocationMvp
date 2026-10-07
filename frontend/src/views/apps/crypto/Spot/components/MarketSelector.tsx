import { useState, useMemo, useCallback } from 'react'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Scroll from '@/components/ui/Scroll'
import Popover from '@/components/ui/Popover'
import { apiGetSpotMarketList } from '@/services/CryptoService'
import { useSpotTradingStore } from '../store/spotTradingStore'
import classNames from '@/utils/classNames'
import { converActivePairDisplay } from '../utils'
import useSWR from 'swr'
import { LiSearch, LiChevronDown } from '@/icons'
import useSpotData from '../hooks/useSpotData'
import type { GetSpotMarketListResponse, SpotMarketData } from '../types'

interface MarketSelectorProps {
    className?: string
}

const MarketSelector = ({ className }: MarketSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const activePair = useSpotTradingStore((state) => state.activePair)
    const setActivePair = useSpotTradingStore((state) => state.setActivePair)

    const { data: spotData } = useSpotData()
    const { data: marketData } = useSWR(
        '/api/crypto/spot/markets',
        () => apiGetSpotMarketList<GetSpotMarketListResponse>(),
        { revalidateOnFocus: false },
    )

    const filteredMarkets = useMemo(() => {
        const markets = marketData?.markets || []
        if (!searchQuery) return markets

        const query = searchQuery.toLowerCase()
        return markets.filter(
            (market: SpotMarketData) =>
                market.pair.toLowerCase().includes(query) ||
                market.baseAsset.toLowerCase().includes(query) ||
                market.quoteAsset.toLowerCase().includes(query),
        )
    }, [marketData?.markets, searchQuery])

    const formatPrice = useCallback((price: number) => {
        return price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 6 : 2,
        })
    }, [])

    const formatChange = useCallback((change: number) => {
        return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`
    }, [])

    const handlePairSelect = useCallback(
        (pair: string) => {
            setActivePair(pair)
            setIsOpen(false)
            setSearchQuery('')
        },
        [setActivePair],
    )

    const handleOpenChange = useCallback((open: boolean) => {
        setIsOpen(open)
        if (!open) setSearchQuery('')
    }, [])

    const triggerButton = (
        <button
            className="flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
        >
            {spotData?.image && (
                <Avatar
                    size={24}
                    src={spotData.image}
                    alt={spotData.baseAsset}
                    className="border-0 bg-transparent"
                    shape="circle"
                />
            )}
            <span className="font-semibold heading-text">
                {converActivePairDisplay(activePair)}
            </span>
            <LiChevronDown
                className={classNames(
                    'w-4 h-4 transition-transform',
                    isOpen && 'rotate-180',
                )}
            />
        </button>
    )

    return (
        <div className={classNames('relative', className)}>
            <Popover
                open={isOpen}
                onOpenChange={handleOpenChange}
                placement="bottom-start"
                width={320}
                renderTrigger={triggerButton}
            >
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <Input
                        placeholder="Search markets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        prefix={<LiSearch />}
                        autoFocus
                    />
                </div>
                <Scroll className="max-h-72">
                    {filteredMarkets.length === 0 ? (
                        <div className="p-4 text-center">No markets found</div>
                    ) : (
                        <div className="py-2">
                            {filteredMarkets.map((market: SpotMarketData) => (
                                <div
                                    key={market.pair}
                                    className={classNames(
                                        'flex items-center justify-between px-3 py-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg',
                                        activePair === market.pair &&
                                            'bg-primary-subtle',
                                    )}
                                    onClick={() =>
                                        handlePairSelect(market.pair)
                                    }
                                    role="option"
                                    aria-selected={activePair === market.pair}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold heading-text text-sm">
                                            {converActivePairDisplay(
                                                market.pair,
                                            )}
                                        </span>
                                        {market.leverage && (
                                            <span className="text-xs px-1 py-0.5 font-medium border border-gray-300 dark:border-gray-700 rounded">
                                                {market.leverage}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="heading-text">
                                            {formatPrice(market.price)}
                                        </span>
                                        <span
                                            className={classNames(
                                                'font-medium min-w-[60px] text-right',
                                                market.changePercentage24h > 0
                                                    ? 'text-success'
                                                    : market.changePercentage24h <
                                                        0
                                                      ? 'text-error'
                                                      : 'text-gray-500',
                                            )}
                                        >
                                            {formatChange(
                                                market.changePercentage24h,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Scroll>
            </Popover>
        </div>
    )
}

export default MarketSelector
