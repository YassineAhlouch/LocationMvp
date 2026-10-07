import { useState, useCallback } from 'react'
import useCryptoDashboard from './hooks/useCryptoDashboard'
import CryptoDashboardContainer from './components/CryptoDashboardContainer'
import CryptoDashboardLoaders from './components/CryptoDashboardLoaders'
import TotalPortfolio from './components/TotalPortfolio'
import MyAssets from './components/MyAssets'
import WatchlistTable from './components/Watchlist'
import BuySellPanel from './components/BuySellPanel'
import TransactionHistory from './components/TransactionHistory'
import { useCryptoDashboardStore } from '@/views/apps/crypto/CryptoDashboard/store/cryptoDashboardStore'
import type { DashboardWatchlistItem, TimeRange } from './types'

const CryptoDashboard = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('1m')
    const { balance, chartData, assets, watchlist, transactions, isLoading } =
        useCryptoDashboard(selectedTimeRange)

    const setSelectedAsset = useCryptoDashboardStore(
        (state) => state.setSelectedAsset,
    )

    const handleBuyClick = useCallback(
        (item: DashboardWatchlistItem) => {
            setSelectedAsset({
                name: item.name,
                symbol: item.symbol,
                icon: item.icon,
                price: item.price,
            })
        },
        [setSelectedAsset],
    )

    if (isLoading) {
        return <CryptoDashboardLoaders />
    }

    return (
        <CryptoDashboardContainer
            totalPortfolio={
                <TotalPortfolio
                    balance={balance?.total || 0}
                    dailyChange={balance?.dailyChange || 0}
                    dailyChangePercent={balance?.dailyChangePercent || 0}
                    chartData={chartData}
                    selectedTimeRange={selectedTimeRange}
                    onTimeRangeChange={setSelectedTimeRange}
                />
            }
            assetCards={<MyAssets assets={assets} />}
            watchlistTable={
                <WatchlistTable
                    watchlist={watchlist}
                    onBuyClick={handleBuyClick}
                />
            }
            buySellPanel={<BuySellPanel />}
            transactionHistory={
                <TransactionHistory transactions={transactions} />
            }
        />
    )
}

export default CryptoDashboard
