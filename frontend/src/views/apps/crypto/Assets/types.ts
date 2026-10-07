export type PortfolioAsset = {
    id: string
    name: string
    symbol: string
    icon: string
    balance: number
    value: number
    priceChange24h: number
    priceChangePercentage24h: number
    allocation: number
}

export type PortfolioOverview = {
    totalValue: number
    tradingBalance: number
    totalChange24h: number
    totalChangePercentage24h: number
}

export type Transaction = {
    id: string
    date: number
    type: 'deposit' | 'withdraw' | 'swap'
    asset: string
    name: string
    icon: string
    amount: number
    value: number
    fee: number
    status: 'completed' | 'pending' | 'failed'
    txHash?: string
}

export type TradeHistory = {
    id: string
    date: number
    type: 'buy' | 'sell' | 'swap'
    asset: string
    name: string
    icon: string
    amount: number
    value: number
    fee: number
    status: 'completed' | 'pending' | 'failed'
    pnlPercentage?: number // Only for sell/swap trades
    pnlAmount?: number // Only for sell/swap trades
}

export type ChartDataPoint = {
    timestamp: number
    value: number
}

export type DepositRequest = {
    asset: string
    network: string
    amount: number
}

export type WithdrawalRequest = {
    asset: string
    network: string
    address: string
    amount: number
}

export type TradeRequest = {
    type: 'buy' | 'sell'
    asset: string
    amount: number
    paymentMethod: string
}

export type Network = {
    id: string
    name: string
    symbol: string
    fee: number
}
