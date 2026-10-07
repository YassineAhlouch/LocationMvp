import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Dropdown from '@/components/ui/Dropdown'
import Progress from '@/components/ui/Progress'
import classNames from '@/utils/classNames'
import { LiGlobal, LiClipboardTick, LiFileCode, LiChevronDown } from '@/icons'
import { RiTwitterXFill, RiTelegram2Line } from 'react-icons/ri'
import { TbCheck, TbStarFilled, TbStar } from 'react-icons/tb'
import { Link } from 'react-scroll'
import type { CoinDetails } from '../types'

type CoinHeaderProps = {
    coinDetails: CoinDetails
    isInWatchlist: boolean
    onToggleWatchlist: () => void
    onDeposit: () => void
    onTrade: () => void
    isWatchlistLoading?: boolean
}

const CoinHeader = ({
    coinDetails,
    isInWatchlist,
    onToggleWatchlist,
    onDeposit,
    onTrade,
    isWatchlistLoading = false,
}: CoinHeaderProps) => {
    const [selectedPeriod, setSelectedPeriod] = useState('1Y')

    const periodOptions = [
        { label: '24H', value: '24H' },
        { label: '1W', value: '1W' },
        { label: '1M', value: '1M' },
        { label: '1Y', value: '1Y' },
        { label: 'History', value: 'History' },
    ]

    const getPriceRange = () => {
        const currentPrice = coinDetails.price
        let lowPrice, highPrice

        switch (selectedPeriod) {
            case '24H':
                lowPrice = currentPrice * 0.95
                highPrice = currentPrice * 1.05
                break
            case '1W':
                lowPrice = currentPrice * 0.9
                highPrice = currentPrice * 1.1
                break
            case '1M':
                lowPrice = currentPrice * 0.8
                highPrice = currentPrice * 1.2
                break
            case '1Y':
                lowPrice = coinDetails.weekLow52
                highPrice = coinDetails.weekHigh52
                break
            case 'History':
                lowPrice = currentPrice * 0.5
                highPrice = currentPrice * 1.5
                break
            default:
                lowPrice = coinDetails.weekLow52
                highPrice = coinDetails.weekHigh52
        }

        return { lowPrice, highPrice }
    }

    const { lowPrice, highPrice } = getPriceRange()
    const pricePosition = Math.min(
        Math.max(
            ((coinDetails.price - lowPrice) / (highPrice - lowPrice)) * 100,
            0,
        ),
        100,
    )

    const formatNumber = (num: number) => {
        if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
        if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
        return `$${num.toLocaleString()}`
    }

    const formatSupply = (num: number) => {
        if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
        if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
        return num.toLocaleString()
    }

    const getBorderClass = (index: number) => {
        let borderClass = ''

        if (index === 0) {
            borderClass =
                'ltr:border-r rtl:border-l xl:border-b-0 border-gray-200 dark:border-gray-700 pb-4 md:pb-0'
        }
        if (index === 1) {
            borderClass =
                'xl:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700 pb-4 md:pb-0'
        }
        if (index === 2) {
            borderClass =
                'ltr:border-r rtl:border-l xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700'
        }

        return borderClass
    }

    return (
        <div className="py-4">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-12">
                <div className="w-full lg:w-[300px] xl:w-[350px] 2xl:w-[450px] space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar
                            src={coinDetails.image}
                            alt={coinDetails.name}
                            shape="circle"
                            className="border-0 bg-transparent"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h5>{coinDetails.name}</h5>
                                <Tag className="bg-transparent">
                                    Rank #{coinDetails.rank}
                                </Tag>
                            </div>
                            <p className="font-medium">{coinDetails.symbol}</p>
                        </div>
                    </div>
                    <div>
                        <p>
                            {(() => {
                                if (!coinDetails.description)
                                    return 'No description available.'
                                const stripHtml = (html: string) => {
                                    const tmp = document.createElement('div')
                                    tmp.innerHTML = html
                                    return (
                                        tmp.textContent || tmp.innerText || ''
                                    )
                                }

                                const plainText = stripHtml(
                                    coinDetails.description,
                                )
                                return plainText.length > 200
                                    ? `${plainText.slice(0, 120)}...`
                                    : plainText
                            })()}
                            <Link
                                className="heading-text cursor-pointer ml-1"
                                to="coin-details"
                                smooth={true}
                                duration={500}
                            >
                                More
                            </Link>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {coinDetails.website && (
                            <a
                                href="https://www.google.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Tag className="gap-1">
                                    <LiGlobal className="text-base" />
                                    <span>Website</span>
                                </Tag>
                            </a>
                        )}
                        {coinDetails.whitepaper && (
                            <a
                                href="https://www.google.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Tag className="gap-1">
                                    <LiClipboardTick className="text-base" />
                                    <span>Whitepaper</span>
                                </Tag>
                            </a>
                        )}
                        {coinDetails.github && (
                            <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Tag className="gap-1">
                                    <LiFileCode className="text-base" />
                                    <span>Source Code</span>
                                </Tag>
                            </a>
                        )}
                        {(coinDetails.twitter || coinDetails.telegram) && (
                            <Dropdown
                                placement="bottom-end"
                                renderTitle={
                                    <Tag
                                        className="cursor-pointer gap-1"
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <span>Community</span>
                                        <LiChevronDown />
                                    </Tag>
                                }
                            >
                                {coinDetails.twitter && (
                                    <Dropdown.Item eventKey="x">
                                        <a
                                            href="https://x.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 w-full"
                                        >
                                            <RiTwitterXFill className="text-base" />
                                            <span>X (Formerly Twitter)</span>
                                        </a>
                                    </Dropdown.Item>
                                )}
                                {coinDetails.telegram && (
                                    <Dropdown.Item eventKey="telegram">
                                        <a
                                            href="https://telegram.org/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 w-full"
                                        >
                                            <RiTelegram2Line className="text-base" />
                                            <span>Telegram</span>
                                        </a>
                                    </Dropdown.Item>
                                )}
                            </Dropdown>
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-baseline gap-2">
                                    <h4>
                                        $
                                        {coinDetails.price.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits:
                                                    coinDetails.price < 1
                                                        ? 6
                                                        : 2,
                                            },
                                        )}
                                    </h4>
                                    <span>USD</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Tag
                                        className={classNames(
                                            'border-0',
                                            coinDetails.priceChangePercentage24h >=
                                                0
                                                ? 'bg-success-subtle text-success'
                                                : 'bg-error-subtle text-error',
                                        )}
                                    >
                                        {coinDetails.priceChangePercentage24h >=
                                        0
                                            ? '+'
                                            : ''}
                                        {coinDetails.priceChangePercentage24h.toFixed(
                                            2,
                                        )}
                                        %
                                    </Tag>
                                </div>
                            </div>
                            <div className="text-xs font-medium">
                                <span>Price Today</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={onToggleWatchlist}
                                loading={isWatchlistLoading}
                                icon={
                                    isInWatchlist ? (
                                        <TbStarFilled className="text-amber-500 text-base" />
                                    ) : (
                                        <TbStar className="text-base" />
                                    )
                                }
                                aria-label={
                                    isInWatchlist
                                        ? 'Remove from watchlist'
                                        : 'Add to watchlist'
                                }
                                aria-pressed={isInWatchlist}
                            />
                            <Button
                                onClick={onDeposit}
                                aria-label="Deposit cryptocurrency"
                            >
                                Deposit
                            </Button>
                            <Button
                                onClick={onTrade}
                                aria-label="Trade cryptocurrency"
                                variant="solid"
                            >
                                Trade
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="min-w-0 flex items-center gap-2">
                                <span className="whitespace-nowrap">
                                    Lower Price
                                </span>
                                <span className="font-medium heading-text whitespace-nowrap">
                                    ${lowPrice.toFixed(lowPrice < 1 ? 4 : 2)}
                                </span>
                            </div>

                            <div className="min-w-[150px] flex-1 sm:flex-none relative">
                                <Progress
                                    percent={pricePosition}
                                    className="h-2"
                                    showInfo={false}
                                    strokeClass="bg-gray-200 dark:bg-gray-500"
                                />
                            </div>

                            <div className="min-w-0 flex items-center gap-2">
                                <span className="whitespace-nowrap">
                                    Upper Price
                                </span>
                                <span className="font-medium heading-text whitespace-nowrap">
                                    ${highPrice.toFixed(highPrice < 1 ? 4 : 2)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <Dropdown
                                renderTitle={
                                    <div>
                                        <Button size="sm">
                                            {selectedPeriod}
                                        </Button>
                                    </div>
                                }
                                placement="bottom-end"
                            >
                                {periodOptions.map((option) => (
                                    <Dropdown.Item
                                        key={option.value}
                                        eventKey={option.value}
                                        className="justify-between"
                                        onClick={() =>
                                            setSelectedPeriod(option.value)
                                        }
                                        active={selectedPeriod === option.value}
                                    >
                                        {option.label}
                                        {selectedPeriod === option.value && (
                                            <TbCheck className="ml-2" />
                                        )}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown>
                        </div>
                    </div>

                    <Card bodyClass="px-2 pb-3">
                        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            <div className={getBorderClass(0)}>
                                <p className="mb-1 heading-text">Market Cap</p>
                                <h6 className="font-semibold">
                                    {formatNumber(coinDetails.marketCap)}
                                </h6>
                                <p className="text-xs">
                                    {coinDetails.marketDominance.toFixed(2)}%
                                    dominance
                                </p>
                            </div>

                            <div className={getBorderClass(1)}>
                                <p className="mb-1">24h Volume</p>
                                <h6 className="font-semibold">
                                    {formatNumber(coinDetails.volume24h)}
                                </h6>
                                <p className="text-xs">
                                    Vol/MCap:{' '}
                                    {(
                                        (coinDetails.volume24h /
                                            coinDetails.marketCap) *
                                        100
                                    ).toFixed(2)}
                                    %
                                </p>
                            </div>

                            <div className={getBorderClass(2)}>
                                <p className="mb-1">Circulating Supply</p>
                                <h6 className="font-semibold">
                                    {formatSupply(
                                        coinDetails.circulatingSupply,
                                    )}
                                </h6>
                                <p className="text-xs">{coinDetails.symbol}</p>
                            </div>

                            <div className={getBorderClass(3)}>
                                <p className="mb-1">Total Supply</p>
                                <h6 className="font-semibold">
                                    {coinDetails.totalSupply
                                        ? formatSupply(coinDetails.totalSupply)
                                        : 'N/A'}
                                </h6>
                                <p className="text-xs">
                                    {coinDetails.totalSupply
                                        ? `${((coinDetails.circulatingSupply / coinDetails.totalSupply) * 100).toFixed(1)}% in circulation`
                                        : 'No data'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CoinHeader
