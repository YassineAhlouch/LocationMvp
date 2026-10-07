import type { TableQueries } from '@/@types/common'

export type MarketType = 'all' | 'spot' | 'futures'

export type CryptoMarketData = {
    id: string
    symbol: string
    name: string
    image: string
    price: number
    priceChange24h: number
    priceChangePercentage24h: number
    priceChangePercentage30d: number
    marketCap: number
    volume24h: number
    circulatingSupply: number
    sparklineData: number[]
    marketType: MarketType
    rank: number
}

export type MarketStatistics = {
    hot: CryptoMarketData[]
    newListings: CryptoMarketData[]
    topGainers: CryptoMarketData[]
    topLosers: CryptoMarketData[]
}

export type MarketFilters = {
    tab: string
    search: string
    priceRange: [number, number]
    volumeRange: [number, number]
    changeFilter: string
    volumeFilter?: string[]
    priceFilter?: string[]
}

export type GetMarketDataResponse = {
    data: CryptoMarketData[]
    pagination: {
        total: number
        page: number
        pageSize: number
    }
    meta: {
        totalMarketCap: number
        totalVolume24h: number
        marketCapChange24h: number
    }
}

export type GetMarketStatisticsResponse = MarketStatistics

export type MarketDataContextProps = {
    // Data
    marketData: CryptoMarketData[] | null
    statistics: MarketStatistics | null

    // State
    activeTab: MarketType
    filters: MarketFilters
    pagingState: TableQueries
    filterState: Record<string, string>
    isLoading: boolean
    error?: Error | null

    // Actions
    setActiveTab: (tab: MarketType) => void
    setFilters: (filters: Partial<MarketFilters>) => void
    setQueryParams: (params: Record<string, unknown>) => void
    setData: (
        callback: (data: GetMarketDataResponse) => GetMarketDataResponse,
    ) => void
    refreshData: () => void
}
