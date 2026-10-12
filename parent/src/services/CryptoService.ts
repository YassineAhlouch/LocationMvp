import ApiService from './ApiService'

export async function apiGetMarketData<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/market',
        method: 'get',
        params,
    })
}

export async function apiGetMarketStatistics<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/market/statistics',
        method: 'get',
        params,
    })
}

export async function apiGetMarketOverview<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/market/overview',
        method: 'get',
        params,
    })
}

export async function apiGetCryptoDetails<
    T,
    U extends Record<string, unknown>,
>({ id, ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/crypto/market/${id}`,
        method: 'get',
        params,
    })
}

// Legacy endpoints for backward compatibility
export async function apiGetAllMarket<T, U extends Record<string, unknown>>({
    ...params
}: U) {
    return apiGetMarketData<T, U>({ ...params, marketType: 'all' })
}

export async function apiGetSpotMarket<T, U extends Record<string, unknown>>({
    ...params
}: U) {
    return apiGetMarketData<T, U>({ ...params, marketType: 'spot' })
}

export async function apiGetFuturesMarket<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return apiGetMarketData<T, U>({ ...params, marketType: 'futures' })
}

// New coin details endpoints
export async function apiGetCoinDetails<T>(coinId: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/crypto/coin/${coinId}`,
        method: 'get',
    })
}

export async function apiGetCoinChartData<T>(
    coinId: string,
    timeRange: string = '24h',
) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/crypto/coin/${coinId}/chart`,
        method: 'get',
        params: { timeRange },
    })
}

export async function apiGetCoinNews<T>(coinId: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/crypto/coin/${coinId}/news`,
        method: 'get',
    })
}

// Spot Trading API endpoints
export async function apiGetSpotTradingData<T>(pair: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/crypto/spot/${pair}`,
        method: 'get',
    })
}

export async function apiGetOrderBook<T>(pair: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/crypto/spot/${pair}/orderbook`,
        method: 'get',
    })
}

export async function apiGetRecentTrades<T>(pair: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/crypto/spot/${pair}/trades`,
        method: 'get',
    })
}

export async function apiGetSpotMarketList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/spot/markets',
        method: 'get',
    })
}

export async function apiGetSpotChartData<T>(
    pair: string,
    timeRange: string = '24h',
) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/crypto/spot/${pair}/chart`,
        method: 'get',
        params: { timeRange },
    })
}

// New Order Management API endpoints
export async function apiGetBalances<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/spot/balances',
        method: 'get',
    })
}

export async function apiGetOpenOrders<T>(pair?: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/spot/orders/open',
        method: 'get',
        params: pair ? { pair } : {},
    })
}

export async function apiGetOrderHistory<T>(pair?: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/spot/orders/history',
        method: 'get',
        params: pair ? { pair } : {},
    })
}

export async function apiGetTradeHistory<T>(pair?: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/spot/trades/history',
        method: 'get',
        params: pair ? { pair } : {},
    })
}

export async function apiGetPortfolioOverview<T>(
    params?: Record<string, unknown>,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/portfolio/overview',
        method: 'get',
        params,
    })
}

export async function apiGetPortfolioChart<T>(params: { dateRange: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/portfolio/chart',
        method: 'get',
        params,
    })
}

export async function apiGetPortfolioAssets<T>(
    params?: Record<string, unknown>,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/portfolio/assets',
        method: 'get',
        params,
    })
}

export async function apiGetPortfolioTransactions<T>(
    params?: Record<string, unknown>,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/portfolio/transactions',
        method: 'get',
        params,
    })
}

export async function apiGetPortfolioTrades<T>(
    params?: Record<string, unknown>,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/portfolio/trades',
        method: 'get',
        params,
    })
}

export async function apiGetAvailableNetworks<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/networks',
        method: 'get',
    })
}

export async function apiGetDepositAddress<T>(network: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/crypto/deposit/address/${network}`,
        method: 'get',
    })
}

// ============================================
// CRYPTO DASHBOARD API ENDPOINTS
// ============================================

export async function apiGetCryptoDashboard<T>(
    params?: Record<string, unknown>,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/dashboard',
        method: 'get',
        params,
    })
}

export async function apiGetCryptoDashboardChart<T>(timeRange: string = '1W') {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/dashboard/chart',
        method: 'get',
        params: { timeRange },
    })
}

export async function apiGetCryptoDashboardWatchlist<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/dashboard/watchlist',
        method: 'get',
    })
}

export async function apiGetCryptoDashboardTransactions<T>(type?: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/dashboard/transactions',
        method: 'get',
        params: type ? { type } : {},
    })
}

export async function apiGetFiatCurrencies<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crypto/fiat-currencies',
        method: 'get',
    })
}
