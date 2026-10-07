import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import useSpotData from '../hooks/useSpotData'
import { useSpotTradingStore } from '../store/spotTradingStore'
import classNames from '@/utils/classNames'
import { converActivePairDisplay } from '../utils'
import NavToggle from '@/components/shared/NavToggle'
import MarketSelector from './MarketSelector'

type LayoutMode = 'default' | 'tablet' | 'mobile'

interface SpotHeaderProps {
    showDrawerToggle?: boolean
    showMarketSelector?: boolean
    layout?: LayoutMode
    onDrawerToggle?: () => void
    isDrawerOpen?: boolean
}

const SpotHeader = ({
    showDrawerToggle = false,
    showMarketSelector = false,
    layout = 'default',
    onDrawerToggle,
    isDrawerOpen = false,
}: SpotHeaderProps) => {
    const activePair = useSpotTradingStore((state) => state.activePair)
    const { data: spotData, isLoading } = useSpotData()

    const { isPositiveChange, formattedPrice, formattedChange } =
        useMemo(() => {
            if (!spotData)
                return {
                    isPositiveChange: false,
                    formattedPrice: '0.00',
                    formattedChange: '0.00%',
                }

            const isPositive = spotData.priceChangePercentage24h >= 0
            const price = spotData.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
            const change = `${isPositive ? '+' : ''}${spotData.priceChangePercentage24h.toFixed(2)}%`

            return {
                isPositiveChange: isPositive,
                formattedPrice: price,
                formattedChange: change,
            }
        }, [spotData])

    const formatNumber = (num: number, decimals: number = 2) => {
        return num.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })
    }

    const formatVolume = (volume: number): string => {
        if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
        if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
        if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`
        return volume.toFixed(2)
    }

    if (isLoading || !spotData) {
        return null
    }

    if (layout === 'mobile') {
        return (
            <div
                className="border-b border-gray-200 dark:border-gray-800 px-3 py-2"
                role="banner"
                aria-label="Trading pair information"
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-4 min-w-0">
                        <MarketSelector />
                        <div className="flex items-baseline gap-2">
                            <span
                                className={classNames(
                                    'text-xl font-bold',
                                    isPositiveChange
                                        ? 'text-success'
                                        : 'text-error',
                                )}
                            >
                                {formattedPrice}
                            </span>
                            <span
                                className={classNames(
                                    'text-sm font-medium',
                                    isPositiveChange
                                        ? 'text-success'
                                        : 'text-error',
                                )}
                            >
                                {formattedChange}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-xs">Highest</div>
                            <div className="text-xs font-medium heading-text">
                                {formatNumber(spotData.high24h)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-xs">Lowest</div>
                            <div className="text-xs font-medium heading-text">
                                {formatNumber(spotData.low24h)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="text-xs">Index</div>
                            <div className="text-xs font-medium heading-text">
                                {formatNumber(spotData.indexPrice)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-xs">
                                Vol({activePair.split('-')[0]})
                            </div>
                            <div className="text-xs font-medium heading-text">
                                {formatVolume(spotData.volume24h)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div
            className="border-b border-gray-200 dark:border-gray-800 px-4 py-2"
            role="banner"
            aria-label="Trading pair information"
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        {showDrawerToggle && (
                            <button
                                className="mr-2"
                                type="button"
                                onClick={onDrawerToggle}
                                aria-label="Toggle market drawer"
                            >
                                <NavToggle
                                    toggled={isDrawerOpen}
                                    iconType="alignment"
                                />
                            </button>
                        )}
                        {showMarketSelector ? (
                            <MarketSelector />
                        ) : (
                            <>
                                <Avatar
                                    size="sm"
                                    src={spotData.image}
                                    alt={spotData.baseAsset}
                                    className="border-0 bg-transparent"
                                    shape="circle"
                                />
                                <h5>{converActivePairDisplay(activePair)}</h5>
                            </>
                        )}
                        <h5
                            className={classNames(
                                'mx-2',
                                isPositiveChange
                                    ? 'text-success'
                                    : 'text-error',
                            )}
                        >
                            {formattedPrice}
                        </h5>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <div className="text-xs mb-1">24H Change</div>
                            <div className="font-semibold heading-text">
                                <div
                                    className={classNames(
                                        isPositiveChange
                                            ? 'text-success'
                                            : 'text-error',
                                    )}
                                >
                                    <span>{formattedChange}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <div className="text-xs mb-1">24H Index Price</div>
                            <div className="font-semibold heading-text">
                                {formatNumber(spotData.indexPrice)}
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <div className="text-xs mb-1">24H Highest</div>
                            <div className="font-semibold heading-text">
                                {formatNumber(spotData.high24h)}
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <div className="text-xs mb-1">24H Lowest</div>
                            <div className="font-semibold heading-text">
                                {formatNumber(spotData.low24h)}
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <div className="text-xs mb-1">
                                24H Volume ({activePair.split('-')[0]})
                            </div>
                            <div className="font-semibold heading-text">
                                {formatVolume(spotData.volume24h)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpotHeader
