import type { CommonProps } from '@/@types/common'

export type ChartTimeRange =
    | '1m'
    | '5m'
    | '15m'
    | '1h'
    | '4h'
    | '1d'
    | '24h'
    | '7d'
    | '30d'
    | '1y'
    | 'YTD'
    | 'ALL'

export type SpotTradingData = {
    pair: string
    price: number
    priceChange24h: number
    priceChangePercentage24h: number
    indexPrice: number
    high24h: number
    low24h: number
    volume24h: number
    lastUpdate: number
    baseAsset: string
    quoteAsset: string
    image?: string
}

export type OrderBookEntry = {
    price: number
    amount: number
    total: number
    cumulativeAmount?: number
    cumulativeTotal?: number
}

export type OrderBookData = {
    bids: OrderBookEntry[]
    asks: OrderBookEntry[]
    lastUpdate: number
}

export type TradeExecution = {
    id: string
    price: number
    amount: number
    timestamp: number
    side: 'buy' | 'sell'
    total: number
}

// New enhanced types for orders and trading
export type OrderBookView = 'orders' | 'bid' | 'ask'
export type TradingSide = 'buy' | 'sell'
export type OrderType = 'limit' | 'market' | 'stop-limit' | 'oco'
export type OrderStatus =
    | 'pending'
    | 'partial'
    | 'filled'
    | 'cancelled'
    | 'expired'
    | 'rejected'

export type Balance = {
    asset: string
    available: number
    locked: number
}

export type OpenOrder = {
    id: string
    date: Date
    pair: string
    type: OrderType
    side: TradingSide
    price: number
    amount: number
    filled: number
    total: number
    sor?: boolean
    takeProfit?: number
    stopLoss?: number
    status: OrderStatus
}

export type OrderHistory = {
    id: string
    dateTime: Date
    pair: string
    type: OrderType
    side: TradingSide
    averagePrice: number
    price: number
    executed: number
    amount: number
    total: number
    triggerConditions?: string
    status: OrderStatus
}

export type TradeHistory = {
    id: string
    dateTime: Date
    pair: string
    side: TradingSide
    price: number
    amount: number
    total: number
    fee: number
    feeAsset: string
}

export type TradingFormData = {
    price: string
    amount: string
    total: string
    percentage: number
}

export type NewOrderData = {
    pair: string
    side: TradingSide
    type: OrderType
    amount: number
    price: number
    currentPrice: number
}

export type TradingFormProps = {
    side: TradingSide
    orderType: OrderType
    currentPrice: number
    baseAsset: string
    quoteAsset: string
    availableBalance: number
    onOrderSubmit?: (orderData: NewOrderData) => Promise<void>
}

export type OrderRequest = {
    pair: string
    side: TradingSide
    type: OrderType
    amount: number
    price?: number
    timeInForce?: 'GTC' | 'IOC' | 'FOK'
}

export type CumulativeData = {
    quantity: number
    value: number
}

// Component Props Types
export type OrderBookProps = CommonProps & {
    pair: string
}

export type TradingPanelProps = CommonProps & {
    pair: string
    currentPrice: number
}

export type OrdersPanelProps = CommonProps & {
    pair: string
}

export type OrdersPanelTab = 'open' | 'history' | 'trades'

// Store Types
export type SpotTradingState = {
    selectedPair: string
    balances: Balance[]
    openOrders: OpenOrder[]
    orderHistory: OrderHistory[]
    tradeHistory: TradeHistory[]
    orderBookView: OrderBookView
}

export type SpotMarketData = {
    pair: string
    baseAsset: string
    quoteAsset: string
    price: number
    change24h: number
    changePercentage24h: number
    volume24h: number
    leverage?: string
}

export type ChartDataPoint = {
    timestamp: number
    open: number
    high: number
    low: number
    close: number
    volume: number
    price: number
}

export type SpotTradingContextType = {
    // Current State
    activePair: string
    spotData: SpotTradingData | null
    orderBook: OrderBookData | null
    recentTrades: TradeExecution[]
    marketList: SpotMarketData[]
    chartData: ChartDataPoint[]
    timeRange: ChartTimeRange

    // Loading States
    isLoading: boolean
    isOrderBookLoading: boolean
    isTradesLoading: boolean
    isChartLoading: boolean

    // Connection State
    connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error'

    // Actions
    setActivePair: (pair: string) => void
    setTimeRange: (range: ChartTimeRange) => void
    refreshData: () => void
}

// API Response Types
export type GetSpotTradingDataResponse = SpotTradingData

export type GetOrderBookResponse = OrderBookData

export type GetRecentTradesResponse = {
    trades: TradeExecution[]
}

export type GetSpotMarketListResponse = {
    markets: SpotMarketData[]
}

export type GetSpotChartDataResponse = {
    data: ChartDataPoint[]
    timeRange: ChartTimeRange
}
