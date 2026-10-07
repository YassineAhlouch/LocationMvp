import { memo } from 'react'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Skeleton from '@/components/ui/Skeleton'
import classNames from '@/utils/classNames'
import useMarketData from '../hooks/useMarketData'
import { formatPrice, formatPercentage } from '../utils'
import { colors } from '@/constants/colors.constant'
import { LuArrowUp, LuArrowDown } from 'react-icons/lu'
import { LiZap, LiStar, LiArrowUp, LiArrowDown } from '@/icons'
import { Link } from 'react-router'
import type { ReactNode } from 'react'
import type { CryptoMarketData } from '../types'

type CryptoListItemProps = {
    crypto: CryptoMarketData
    showSparkline?: boolean
}

type StatisticSectionProps = {
    title: string
    icon: ReactNode
    data: CryptoMarketData[]
    isLoading: boolean
    showSparkline?: boolean
    className?: string
}

const CryptoListItem = memo(({ crypto }: CryptoListItemProps) => {
    const isPositive = crypto.priceChangePercentage24h >= 0

    return (
        <Link
            className="flex items-center justify-between py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            to={`/apps/crypto/coin/${crypto.symbol.toLocaleLowerCase()}`}
        >
            <div className="flex items-center gap-2 flex-1">
                <Avatar
                    size={20}
                    className="border-0 bg-white flex-shrink-0"
                    shape="circle"
                    src={crypto.image}
                    alt={crypto.name}
                >
                    {crypto.symbol.slice(0, 2)}
                </Avatar>
                <span className="font-medium heading-text truncate">
                    {crypto.symbol}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right">
                    <div className="font-medium heading-text">
                        {formatPrice(crypto.price)}
                    </div>
                </div>
                <div
                    className={classNames(
                        'text-xs font-medium flex items-center gap-1',
                        isPositive ? 'text-success' : 'text-error',
                    )}
                >
                    {isPositive ? (
                        <LuArrowUp size={12} />
                    ) : (
                        <LuArrowDown size={12} />
                    )}
                    {formatPercentage(crypto.priceChangePercentage24h)}
                </div>
            </div>
        </Link>
    )
})

const StatisticSection = ({
    title,
    icon,
    data,
    isLoading,
    className,
    showSparkline = false,
}: StatisticSectionProps) => {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-2 w-10" />
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <Skeleton className="h-3 w-12" />
                                <Skeleton className="h-2 w-8" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 heading-text px-2">
                <span
                    className={classNames(
                        'rounded-full text-white p-0.75',
                        className,
                    )}
                >
                    {icon}
                </span>
                <span className="font-semibold leading-0">{title}</span>
            </div>
            <div className="space-y-1">
                {data.length > 0 ? (
                    data
                        .slice(0, 5)
                        .map((crypto) => (
                            <CryptoListItem
                                key={crypto.id}
                                crypto={crypto}
                                showSparkline={showSparkline}
                            />
                        ))
                ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No data available
                    </div>
                )}
            </div>
        </div>
    )
}

const MarketStatistic = () => {
    const { statistics, isLoading } = useMarketData()

    const sections = [
        {
            title: 'Hot',
            icon: <LiZap className="text-sm" />,
            data: statistics?.hot || [],
            showSparkline: true,
            className: colors.orange.bg,
        },
        {
            title: 'New Listings',
            icon: <LiStar className="text-sm" />,
            data: statistics?.newListings || [],
            showSparkline: false,
            className: colors.blue.bg,
        },
        {
            title: 'Top Gainers',
            icon: <LiArrowUp className="text-sm" />,
            data: statistics?.topGainers || [],
            showSparkline: false,
            className: colors.emerald.bg,
        },
        {
            title: 'Top Losers',
            icon: <LiArrowDown className="text-sm" />,
            data: statistics?.topLosers || [],
            showSparkline: false,
            className: colors.red.bg,
        },
    ]

    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {sections.map((section) => (
                <Card
                    key={section.title}
                    bodyClass="px-2"
                    role="region"
                    aria-label="Cryptocurrency market statistics"
                >
                    <div
                        role="region"
                        aria-label={`${section.title} cryptocurrency list`}
                    >
                        <StatisticSection
                            title={section.title}
                            icon={section.icon}
                            data={section.data}
                            className={section.className}
                            isLoading={isLoading}
                            showSparkline={section.showSparkline}
                        />
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default MarketStatistic
