export type TimeRange = '1w' | '1m' | '3m' | '6m' | '1y'

export type CandlestickDataPoint = {
    timestamp: number
    date: string
    open: number
    high: number
    low: number
    close: number
}

export type DashboardAssetCard = {
    id: string
    name: string
    symbol: string
    icon: string
    apy: number
    sparklineData: number[]
    trend: 'up' | 'down'
    balance: number
    usdValue: number
}

export type DashboardWatchlistItem = {
    id: string
    name: string
    symbol: string
    icon: string
    apy: number
    price: number
    sparklineData: number[]
    change24h: number
    marketCap: number
    isFavorite: boolean
}

export type DashboardTransaction = {
    id: string
    assetName: string
    assetSymbol: string
    assetIcon: string
    type: 'receive' | 'send' | 'sell' | 'buy'
    amount: number
    date: string
    timestamp: number
    status: 'available' | 'pending'
}

export type CryptoDashboardData = {
    balance: {
        total: number
        dailyChange: number
        dailyChangePercent: number
    }
    chartData: Record<TimeRange, CandlestickDataPoint[]>
    assets: DashboardAssetCard[]
    watchlist: DashboardWatchlistItem[]
    transactions: DashboardTransaction[]
    walletBalance: {
        usd: number
        btc: number
    }
}
