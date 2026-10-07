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
    rank: number
}

export type ChartTimeRange = '1h' | '24h' | '7d' | '30d' | '1y' | 'YTD' | 'ALL'
export type ChartType = 'line' | 'candlestick' | 'volume'

export type ChartDataPoint = {
    timestamp: number
    price: number
    volume?: number
    high?: number
    low?: number
    open?: number
    close?: number
}

export type CoinDetails = CryptoMarketData & {
    totalSupply?: number
    maxSupply?: number
    marketDominance: number
    tvl?: number
    weekHigh52: number
    weekLow52: number
    volatilityIndex?: number
    sharpeRatio?: number
    activeAddresses?: number
    dailyTransactions?: number
    averageGasFees?: number
    description: string
    website?: string
    whitepaper?: string
    github?: string
    twitter?: string
    telegram?: string
}

export type NewsArticle = {
    id: string
    title: string
    excerpt: string
    publishedAt: string
    source: string
    url: string
    imageUrl?: string
}

export type CoinDetailsState = {
    selectedTimeRange: ChartTimeRange
    selectedChartType: ChartType
    activeTab: 'introduction' | 'feed'
    isInWatchlist: boolean
}

export type GetCoinDetailsResponse = CoinDetails

export type GetCoinChartDataResponse = {
    data: ChartDataPoint[]
    timeRange: ChartTimeRange
}

export type GetCoinNewsResponse = {
    data: NewsArticle[]
}
