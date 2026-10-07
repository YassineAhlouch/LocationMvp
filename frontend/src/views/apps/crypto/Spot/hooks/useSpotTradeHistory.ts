import { useCallback } from 'react'
import useSWR from 'swr'
import { apiGetTradeHistory } from '@/services/CryptoService'
import type { TradeHistory } from '../types'

type UseSpotTradeHistoryReturn = {
    tradeHistory: TradeHistory[]
    isLoading: boolean
    error: Error | null
    mutateTradeHistory: () => Promise<void>
}

const useSpotTradeHistory = (): UseSpotTradeHistoryReturn => {
    const {
        data: tradeHistoryData,
        isLoading,
        error,
        mutate,
    } = useSWR(
        '/api/crypto/spot/trades/history',
        () => apiGetTradeHistory<{ trades: TradeHistory[] }>(),
        {
            revalidateOnFocus: false,
            errorRetryCount: 3,
            errorRetryInterval: 2000,
        },
    )

    const tradeHistory = tradeHistoryData?.trades || []

    const mutateTradeHistory = useCallback(async () => {
        await mutate()
    }, [mutate])

    return {
        tradeHistory,
        isLoading,
        error,
        mutateTradeHistory,
    }
}

export default useSpotTradeHistory
