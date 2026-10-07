import { useState } from 'react'
import useSWR from 'swr'
import Container from '@/components/shared/Container'
import Loading from '@/components/shared/Loading'
import CoinHeader from './components/CoinHeader'
import CoinChart from './components/CoinChart'
import CoinTabs from './components/CoinTabs'
import CoinKeyStats from './components/CoinKeyStats'
import {
    apiGetCoinDetails,
    apiGetCoinChartData,
    apiGetCoinNews,
} from '@/services/CryptoService'
import sleep from '@/utils/sleep'
import { useParams, useNavigate } from 'react-router'
import type {
    CoinDetailsState,
    GetCoinDetailsResponse,
    GetCoinChartDataResponse,
    GetCoinNewsResponse,
} from './types'

const Coin = () => {
    const { coinId } = useParams<{ coinId: string }>()
    const navigate = useNavigate()

    const [state, setState] = useState<CoinDetailsState>({
        selectedTimeRange: '24h',
        selectedChartType: 'line',
        activeTab: 'introduction',
        isInWatchlist: false,
    })

    const [isWatchlistLoading, setIsWatchlistLoading] = useState(false)

    const { data: coinDetails, isLoading: coinLoading } = useSWR(
        coinId ? `/crypto/coin/${coinId}` : null,
        () => apiGetCoinDetails<GetCoinDetailsResponse>(coinId!),
        {
            revalidateOnFocus: false,
            errorRetryCount: 3,
        },
    )

    const { data: chartDataResponse, isLoading: chartLoading } = useSWR(
        coinId
            ? `/crypto/coin/${coinId}/chart/${state.selectedTimeRange}`
            : null,
        () =>
            apiGetCoinChartData<GetCoinChartDataResponse>(
                coinId!,
                state.selectedTimeRange,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    const {
        data: newsResponse,
        error: newsError,
        isLoading: newsLoading,
    } = useSWR(
        coinId ? `/crypto/coin/${coinId}/news` : null,
        () => apiGetCoinNews<GetCoinNewsResponse>(coinId!),
        {
            revalidateOnFocus: false,
        },
    )

    const handleTimeRangeChange = (
        timeRange: typeof state.selectedTimeRange,
    ) => {
        setState((prev) => ({ ...prev, selectedTimeRange: timeRange }))
    }

    const handleChartTypeChange = (
        chartType: typeof state.selectedChartType,
    ) => {
        setState((prev) => ({ ...prev, selectedChartType: chartType }))
    }

    const handleTabChange = (tab: typeof state.activeTab) => {
        setState((prev) => ({ ...prev, activeTab: tab }))
    }

    const handleToggleWatchlist = async () => {
        if (!coinId) return

        setIsWatchlistLoading(true)
        await sleep(800)
        setState((prev) => ({ ...prev, isInWatchlist: !prev.isInWatchlist }))
        setIsWatchlistLoading(false)
    }

    const handleDeposit = async () => {
        navigate(`/apps/crypto/assets`)
    }

    const handleTrade = async () => {
        navigate(`/apps/crypto/spot?symbol=${coinDetails?.symbol}`)
    }

    if (coinLoading) {
        return (
            <Container>
                <Loading loading={true} type="cover">
                    <div className="min-h-screen" />
                </Loading>
            </Container>
        )
    }

    return (
        <Container>
            {coinDetails && (
                <div className="space-y-4">
                    <CoinHeader
                        coinDetails={coinDetails}
                        isInWatchlist={state.isInWatchlist}
                        onToggleWatchlist={handleToggleWatchlist}
                        onDeposit={handleDeposit}
                        onTrade={handleTrade}
                        isWatchlistLoading={isWatchlistLoading}
                    />
                    <CoinChart
                        data={chartDataResponse?.data || []}
                        timeRange={state.selectedTimeRange}
                        chartType={state.selectedChartType}
                        onTimeRangeChange={handleTimeRangeChange}
                        onChartTypeChange={handleChartTypeChange}
                        isLoading={chartLoading}
                        coinSymbol={coinDetails.symbol}
                    />
                    <CoinKeyStats
                        coinDetails={coinDetails}
                        loading={coinLoading}
                    />
                    <CoinTabs
                        coinDetails={coinDetails}
                        newsArticles={newsResponse?.data || []}
                        isLoadingNews={newsLoading}
                        newsError={newsError}
                        activeTab={state.activeTab}
                        onTabChange={handleTabChange}
                    />
                </div>
            )}
        </Container>
    )
}

export default Coin
