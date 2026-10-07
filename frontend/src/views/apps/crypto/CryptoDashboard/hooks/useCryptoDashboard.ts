import useSWR from 'swr'
import { apiGetCryptoDashboard } from '@/services/CryptoService'
import type {
    CryptoDashboardData,
    TimeRange,
    CandlestickDataPoint,
    DashboardAssetCard,
    DashboardWatchlistItem,
    DashboardTransaction,
} from '../types'

type UseCryptoDashboardReturn = {
    balance: CryptoDashboardData['balance'] | null
    chartData: Record<TimeRange, CandlestickDataPoint[]> | null
    assets: DashboardAssetCard[]
    watchlist: DashboardWatchlistItem[]
    transactions: DashboardTransaction[]
    walletBalance: CryptoDashboardData['walletBalance'] | null
    isLoading: boolean
    error: Error | undefined
    mutate: () => void
}

const useCryptoDashboard = (
    selectedTimeRange: TimeRange = '3m',
): UseCryptoDashboardReturn => {
    const { data, error, isLoading, mutate } = useSWR(
        ['/crypto/dashboard', selectedTimeRange],
        ([, timeRange]) =>
            apiGetCryptoDashboard<CryptoDashboardData>({ timeRange }),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        balance: data?.balance || null,
        chartData: data?.chartData || null,
        assets: data?.assets || [],
        watchlist: data?.watchlist || [],
        transactions: data?.transactions || [],
        walletBalance: data?.walletBalance || null,
        isLoading,
        error,
        mutate,
    }
}

export default useCryptoDashboard
