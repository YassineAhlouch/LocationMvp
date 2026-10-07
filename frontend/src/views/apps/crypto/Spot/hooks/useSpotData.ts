import {
    apiGetSpotTradingData,
    apiGetSpotChartData,
} from '@/services/CryptoService'
import useSWR from 'swr'
import { useSpotTradingStore } from '../store/spotTradingStore'
import type {
    GetSpotTradingDataResponse,
    GetSpotChartDataResponse,
} from '../types'

const useSpotData = () => {
    const activePair = useSpotTradingStore((state) => state.activePair)
    const chartTimeframe = useSpotTradingStore((state) => state.chartTimeframe)

    const {
        data: spotData,
        isLoading: isSpotLoading,
        error: spotError,
        mutate: mutateSpot,
    } = useSWR(
        `/api/crypto/spot/${activePair}`,
        () => apiGetSpotTradingData<GetSpotTradingDataResponse>(activePair),
        {
            refreshInterval: 5000,
            revalidateOnFocus: false,
        },
    )

    const {
        data: chartData,
        isLoading: isChartLoading,
        error: chartError,
        mutate: mutateChart,
    } = useSWR(
        `/api/crypto/spot/${activePair}/chart?timeframe=${chartTimeframe}`,
        () =>
            apiGetSpotChartData<GetSpotChartDataResponse>(
                activePair,
                chartTimeframe,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        data: spotData || null,
        chart: chartData?.data || [],
        isLoading: isSpotLoading || isChartLoading,
        error: spotError || chartError,
        mutate: () => {
            mutateSpot()
            mutateChart()
        },
    }
}

export default useSpotData
