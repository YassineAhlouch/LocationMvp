import formatNumber from '@/utils/formatNumber'
import type { ReactNode } from 'react'
import type { CoinDetails } from '../types'

type CoinKeyStatsProps = {
    coinDetails: CoinDetails
    loading?: boolean
}

const CoinKeyStats = ({ coinDetails, loading = false }: CoinKeyStatsProps) => {
    const formatPercentage = (num: number) => `${num.toFixed(2)}%`

    type StatRowProps = {
        label: string
        value: string | ReactNode
        loading?: boolean
    }

    const StatRow = ({ label, value }: StatRowProps) => {
        return (
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                <span>{label}</span>
                <span className="font-medium heading-text text-right">
                    {value}
                </span>
            </div>
        )
    }

    const stats = [
        {
            label: 'Market Cap Rank',
            value: `#${coinDetails.rank}`,
        },
        {
            label: 'Market Dominance',
            value: formatPercentage(coinDetails.marketDominance),
        },
        {
            label: '52W High',
            value: `$${coinDetails.weekHigh52.toLocaleString()}`,
        },
        {
            label: '52W Low',
            value: `$${coinDetails.weekLow52.toLocaleString()}`,
        },
        {
            label: 'All Time High',
            value: `$${Math.max(coinDetails.weekHigh52, coinDetails.price * 1.5).toLocaleString()}`,
        },
        {
            label: '30D Performance',
            value: (
                <span
                    className={
                        coinDetails.priceChangePercentage30d >= 0
                            ? 'text-success'
                            : 'text-error'
                    }
                >
                    {coinDetails.priceChangePercentage30d >= 0 ? '+' : ''}
                    {coinDetails.priceChangePercentage30d.toFixed(2)}%
                </span>
            ),
        },
        {
            label: 'Circulating Supply',
            value: `${formatNumber(coinDetails.circulatingSupply)} ${coinDetails.symbol}`,
        },
        ...(coinDetails.totalSupply
            ? [
                  {
                      label: 'Total Supply',
                      value: `${formatNumber(coinDetails.totalSupply)} ${coinDetails.symbol}`,
                  },
              ]
            : []),
        {
            label: 'Max Supply',
            value: coinDetails.maxSupply
                ? `${formatNumber(coinDetails.maxSupply)} ${coinDetails.symbol}`
                : 'No Limit',
        },
        ...(coinDetails.tvl
            ? [
                  {
                      label: 'Total Value Locked',
                      value: formatNumber(coinDetails.tvl, 0),
                  },
              ]
            : []),
        ...(coinDetails.volatilityIndex
            ? [
                  {
                      label: 'Volatility Index',
                      value: coinDetails.volatilityIndex.toFixed(2),
                  },
              ]
            : []),
        ...(coinDetails.sharpeRatio
            ? [
                  {
                      label: 'Sharpe Ratio',
                      value: coinDetails.sharpeRatio.toFixed(2),
                  },
              ]
            : []),
        ...(coinDetails.activeAddresses
            ? [
                  {
                      label: 'Active Addresses',
                      value: formatNumber(coinDetails.activeAddresses, 0),
                  },
              ]
            : []),
        ...(coinDetails.dailyTransactions
            ? [
                  {
                      label: 'Daily Transactions',
                      value: formatNumber(coinDetails.dailyTransactions, 0),
                  },
              ]
            : []),
        ...(coinDetails.averageGasFees
            ? [
                  {
                      label: 'Average Gas Fees',
                      value: `$${coinDetails.averageGasFees.toFixed(2)}`,
                  },
              ]
            : []),
    ]

    const midPoint = Math.ceil(stats.length / 2)
    const leftColumnStats = stats.slice(0, midPoint)
    const rightColumnStats = stats.slice(midPoint)

    return (
        <div id="coin-stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-0">
                    {leftColumnStats.map((stat, index) => (
                        <StatRow
                            key={`left-${index}`}
                            label={stat.label}
                            value={stat.value}
                            loading={loading}
                        />
                    ))}
                </div>
                <div className="space-y-0">
                    {rightColumnStats.map((stat, index) => (
                        <StatRow
                            key={`right-${index}`}
                            label={stat.label}
                            value={stat.value}
                            loading={loading}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CoinKeyStats
