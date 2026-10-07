/* eslint-disable @typescript-eslint/no-explicit-any */
import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import { mock } from '../MockAdapter'
import {
    cryptoMarketData,
    marketStatistics,
    marketOverview,
    coinDetailsData,
    chartDataSets,
    newsArticlesData,
    spotTradingPairs,
    getSpotTradingData,
    getOrderBookData,
    getTradeExecutions,
    getSpotChartData,
    generateBalances,
    generateOrderHistory,
    generateTradeHistory,
    getOpenOrdersByPair,
    getOrderHistoryByPair,
    getTradeHistoryByPair,
    getCryptoDashboardData,
    getDashboardChartData,
    getDashboardWatchlist,
    getDashboardTransactions,
} from '../data/cryptoData'
import {
    generatePortfolioOverview,
    generatePortfolioAssets,
    generatePortfolioChart,
    generateTransactionHistory,
    generateTradeHistoryData,
    getAvailableNetworks,
    generateWalletAddress,
    getFiatCurrencies,
} from '../data/cryptoData'
import sleep from '@/utils/sleep'

const filterByMarketType = (data: any[], marketType: any) => {
    if (marketType === 'all') {
        return data
    }
    return data.filter(
        (crypto) =>
            crypto.marketType === marketType || crypto.marketType === 'all',
    )
}

const applySearchFilter = (data: any[], query: string) => {
    if (!query) return data
    const searchTerm = query.toLowerCase()
    return data.filter(
        (crypto) =>
            crypto.name.toLowerCase().includes(searchTerm) ||
            crypto.symbol.toLowerCase().includes(searchTerm),
    )
}

// Helper function to apply sorting
const applySorting = (data: any[], sortKey: string, sortOrder: string) => {
    if (!sortKey) return data

    return [...data].sort((a, b) => {
        const aValue: unknown = a[sortKey as keyof any]
        const bValue: unknown = b[sortKey as keyof any]

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue)
        }

        return 0
    })
}

const paginateData = (data: any[], page: number, pageSize: number) => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return {
        data: data.slice(startIndex, endIndex),
        pagination: {
            total: data.length,
            page,
            pageSize,
        },
    }
}

mock.onGet('/api/crypto/market').reply((config) => {
    const params = config.params || {}
    const {
        marketType = 'all',
        query = '',
        sortKey = '',
        sortOrder = 'desc',
        pageIndex = 1,
        pageSize = 20,
        changeFilter = 'all',
        volumeFilter = '',
        priceFilter = '',
    } = params

    let filteredData = cryptoMarketData

    filteredData = filterByMarketType(filteredData as any, marketType)

    filteredData = applySearchFilter(filteredData as any, query)

    if (changeFilter && changeFilter !== 'all') {
        if (changeFilter === 'gainers') {
            filteredData = filteredData.filter(
                (crypto: any) => crypto.priceChangePercentage24h > 0,
            )
        } else if (changeFilter === 'losers') {
            filteredData = filteredData.filter(
                (crypto: any) => crypto.priceChangePercentage24h < 0,
            )
        }
    }

    if (volumeFilter && volumeFilter !== '') {
        const volumeFilters = volumeFilter.split(',')
        filteredData = filteredData.filter((crypto: any) => {
            return volumeFilters.some((filter: any) => {
                switch (filter) {
                    case '1mto10m':
                        return (
                            crypto.volume24h >= 1000000 &&
                            crypto.volume24h < 10000000
                        )
                    case '10mto50m':
                        return (
                            crypto.volume24h >= 10000000 &&
                            crypto.volume24h < 50000000
                        )
                    case '50mto100m':
                        return (
                            crypto.volume24h >= 50000000 &&
                            crypto.volume24h < 100000000
                        )
                    case '100mAbove':
                        return crypto.volume24h >= 100000000
                    default:
                        return true
                }
            })
        })
    }

    if (priceFilter && priceFilter !== '') {
        const priceFilters = priceFilter.split(',')
        filteredData = filteredData.filter((crypto: any) => {
            return priceFilters.some((filter: any) => {
                switch (filter) {
                    case 'under1':
                        return crypto.price < 1
                    case '1to100':
                        return crypto.price >= 1 && crypto.price < 100
                    case '100to1000':
                        return crypto.price >= 100 && crypto.price < 1000
                    case 'over1000':
                        return crypto.price >= 1000
                    default:
                        return true
                }
            })
        })
    }

    filteredData = applySorting(filteredData, sortKey, sortOrder)

    const paginatedResult = paginateData(
        filteredData,
        parseInt(pageIndex),
        parseInt(pageSize),
    )

    const response = {
        data: paginatedResult.data,
        pagination: paginatedResult.pagination,
        meta: marketOverview,
    }

    return [200, response]
})

mock.onGet('/api/crypto/market/statistics').reply(() => {
    const response = marketStatistics
    return [200, response]
})

mock.onGet(/\/api\/crypto\/market\/\w+/).reply((config) => {
    const id = config.url?.split('/').pop()
    const crypto = cryptoMarketData.find((c: any) => c.id === id)

    if (!crypto) {
        return [404, { message: 'Cryptocurrency not found' }]
    }

    return [200, crypto]
})

mock.onGet('/api/crypto/market/overview').reply(() => {
    return [200, marketOverview]
})

mock.onGet(/\/api\/crypto\/coin\/\w+$/).reply((config) => {
    const coinId = config.url?.split('/').pop()
    const coinDetails = coinDetailsData(coinId || '')

    if (!coinDetails) {
        return [404, { message: 'Coin not found' }]
    }

    return [200, coinDetails]
})

mock.onGet('/api/crypto/spot/markets').reply(() => {
    return [200, { markets: spotTradingPairs }]
})

mock.onGet(/\/api\/crypto\/spot\/[^/]+$/).reply((config) => {
    const urlParts = config.url?.split('/')
    const pair = urlParts?.[urlParts.length - 1]

    if (!pair) {
        return [404, { message: 'Trading pair not found' }]
    }

    const spotData = getSpotTradingData(pair)
    return [200, spotData]
})

mock.onGet(/\/api\/crypto\/coin\/\w+\/chart/).reply((config) => {
    const urlParts = config.url?.split('/')
    const coinId = urlParts?.[urlParts.length - 2]
    const timeRange = config.params?.timeRange || '24h'

    if (chartDataSets(coinId || '')) {
        const chartData = (chartDataSets(coinId || '') as any)?.[timeRange]
        return [200, { data: chartData, timeRange }]
    }
    return [404, { message: 'Chart data not found' }]
})

mock.onGet(/\/api\/crypto\/coin\/\w+\/news/).reply((config) => {
    const urlParts = config.url?.split('/')
    const coinId = urlParts?.[urlParts.length - 2]

    if (!coinId || !newsArticlesData(coinId)) {
        return [404, { message: 'News not found' }]
    }

    const news = newsArticlesData(coinId)
    return [200, { data: news }]
})

mock.onGet(/\/api\/crypto\/spot\/[^/]+\/orderbook/).reply((config) => {
    const urlParts = config.url?.split('/')
    const pair = urlParts?.[urlParts.length - 2]

    if (!pair) {
        return [404, { message: 'Trading pair not found' }]
    }

    const orderBook = getOrderBookData(pair)
    return [200, orderBook]
})

mock.onGet(/\/api\/crypto\/spot\/[^/]+\/trades/).reply((config) => {
    const urlParts = config.url?.split('/')
    const pair = urlParts?.[urlParts.length - 2]

    if (!pair) {
        return [404, { message: 'Trading pair not found' }]
    }

    const trades = getTradeExecutions(pair)
    return [200, { trades }]
})

mock.onGet(/\/api\/crypto\/spot\/[^/]+\/chart/).reply((config) => {
    const urlParts = config.url?.split('/')
    const pair = urlParts?.[urlParts.length - 2]
    const timeRange = config.params?.timeRange || '24h'

    if (!pair) {
        return [404, { message: 'Trading pair not found' }]
    }

    const chartData = getSpotChartData(pair, timeRange)
    return [200, { data: chartData, timeRange }]
})

mock.onGet('/api/crypto/spot/balances').reply(() => {
    const balances = generateBalances()
    return [200, { balances }]
})

mock.onGet('/api/crypto/spot/orders/open').reply(() => {
    return [200, { orders: getOpenOrdersByPair() }]
})

mock.onGet('/api/crypto/spot/orders/history').reply((config) => {
    const { pair } = config.params || {}
    let orders = generateOrderHistory()

    if (pair) {
        orders = getOrderHistoryByPair(orders, pair)
    }

    return [200, { orders }]
})

mock.onGet('/api/crypto/spot/trades/history').reply((config) => {
    const { pair } = config.params || {}
    let trades = generateTradeHistory()

    if (pair) {
        trades = getTradeHistoryByPair(trades, pair)
    }

    return [200, { trades }]
})

mock.onGet('/api/crypto/portfolio/overview').reply(async (config) => {
    await sleep(500)
    const { dateRange = '24h' } = config.params || {}
    const overview = generatePortfolioOverview(dateRange)
    return [200, overview]
})

mock.onGet('/api/crypto/portfolio/chart').reply(async (config) => {
    await sleep(300)
    const { dateRange = '24h' } = config.params || {}
    const chartData = generatePortfolioChart(dateRange)
    return [200, { data: chartData, dateRange }]
})

mock.onGet('/api/crypto/portfolio/assets').reply(async (config) => {
    await sleep(400)
    const {
        pageIndex = 1,
        pageSize = 10,
        sortKey,
        sortOrder,
        query,
    } = config.params || {}

    let data = generatePortfolioAssets()
    let total = data.length

    if (query) {
        data = wildCardSearch(data, query, 'symbol')
        total = data.length
    }

    if (sortKey && sortOrder) {
        if (sortKey === 'symbol' || sortKey === 'name') {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(sortBy(sortKey, sortOrder === 'desc', parseInt as Primer))
        }
    }

    data = paginate(data, pageSize, pageIndex)

    return [
        200,
        {
            data: data,
            total: total,
        },
    ]
})

mock.onGet('/api/crypto/portfolio/transactions').reply(async (config) => {
    await sleep(600)
    const {
        pageIndex = 1,
        pageSize = 10,
        sortKey,
        sortOrder,
        query,
    } = config.params || {}

    let data = generateTransactionHistory(pageIndex) as any
    let total = data.length

    if (query) {
        data = wildCardSearch(data as any, query, 'asset')
        total = data.length
    }

    if (sortKey && sortOrder) {
        if (
            sortKey === 'asset' ||
            sortKey === 'type' ||
            sortKey === 'status' ||
            sortKey === 'txHash'
        ) {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(sortBy(sortKey, sortOrder === 'desc', parseInt as Primer))
        }
    }

    data = paginate(data, pageSize, pageIndex)

    return [
        200,
        {
            data: data,
            total: total,
        },
    ]
})

mock.onGet('/api/crypto/portfolio/trades').reply(async (config) => {
    await sleep(500)
    const {
        pageIndex = 1,
        pageSize = 10,
        sortKey,
        sortOrder,
        query,
    } = config.params || {}

    let data = generateTradeHistoryData(pageIndex)
    let total = data.length

    if (query) {
        data = wildCardSearch(data, query, 'pair')
        total = data.length
    }

    if (sortKey && sortOrder) {
        if (
            sortKey === 'pair' ||
            sortKey === 'side' ||
            sortKey === 'type' ||
            sortKey === 'status'
        ) {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(sortBy(sortKey, sortOrder === 'desc', parseInt as Primer))
        }
    }

    data = paginate(data, pageSize, pageIndex)

    return [
        200,
        {
            data: data,
            total: total,
        },
    ]
})

mock.onGet('/api/crypto/networks').reply(() => {
    const networks = getAvailableNetworks()
    return [200, { networks }]
})

mock.onGet(/\/api\/crypto\/deposit\/address\/\w+/).reply((config) => {
    const urlParts = config.url?.split('/')
    const network = urlParts?.[urlParts.length - 1]

    if (!network) {
        return [400, { message: 'Network not specified' }]
    }

    const address = generateWalletAddress(network)
    return [200, { address, network }]
})

mock.onGet('/api/crypto/dashboard').reply(async (config) => {
    await sleep(400)
    const { timeRange = '3m' } = config.params || {}
    const dashboardData = getCryptoDashboardData(timeRange)
    return [200, dashboardData]
})

mock.onGet('/api/crypto/dashboard/chart').reply(async (config) => {
    await sleep(300)
    const { timeRange = '3m' } = config.params || {}
    const chartData = getDashboardChartData(timeRange)
    return [200, { data: chartData, timeRange }]
})

mock.onGet('/api/crypto/dashboard/watchlist').reply(async () => {
    await sleep(350)
    const watchlist = getDashboardWatchlist()
    return [200, { data: watchlist }]
})

mock.onGet('/api/crypto/dashboard/transactions').reply(async (config) => {
    await sleep(400)
    const { type } = config.params || {}
    const transactions = getDashboardTransactions(type)
    return [200, { data: transactions }]
})

mock.onGet('/api/crypto/fiat-currencies').reply(async () => {
    await sleep(200)
    const currencies = getFiatCurrencies()
    return [200, { data: currencies }]
})
