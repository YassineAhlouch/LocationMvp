/* eslint-disable @typescript-eslint/no-explicit-any */
import { mock } from '../MockAdapter'
import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import {
    generateMockForecastData,
    generateRevenueData,
    generateUserGrowthData,
    generateChurnRetentionData,
    generateSubscriptionData,
    generateRevenueTrendsData,
    generateAllRevenueTrendsData,
    generateRevenueBreakdownData,
    generateSubscriberTrendsData,
    generateLifecycleData,
    generateSubscriberPersonasData,
    generateUnifiedReportData,
    analyticDashboardData,
    type UnifiedReportRow,
} from '../data/analyticData'
import type { DateRange, Scenario } from '@/views/apps/analytics/Forecast/types'

const parseParams = (params: any) => {
    const currentDate = new Date()
    const defaultStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 6,
        1,
    )
    const defaultEndDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 6,
        1,
    )

    const dateRange: DateRange = {
        startDate: params?.startDate
            ? new Date(params.startDate)
            : defaultStartDate,
        endDate: params?.endDate ? new Date(params.endDate) : defaultEndDate,
    }
    const scenario: Scenario = params?.scenario || 'expected'

    return { dateRange, scenario }
}

const parseRevenueParams = (params: any) => {
    const currentDate = new Date()
    const defaultStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 12,
        1,
    )
    const defaultEndDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
    )

    const dateRange: DateRange = {
        startDate: params?.startDate
            ? new Date(params.startDate)
            : defaultStartDate,
        endDate: params?.endDate ? new Date(params.endDate) : defaultEndDate,
    }
    const metric = params?.metric || 'mrr'
    const includeComparison =
        params?.includeComparison === 'true' ||
        params?.includeComparison === true
    const comparisonType = params?.comparisonType || 'previousPeriod'

    return { dateRange, metric, includeComparison, comparisonType }
}

mock.onGet('/api/analytic/forecast').reply((config) => {
    const { dateRange, scenario } = parseParams(config.params)
    const data = generateMockForecastData(dateRange, scenario)

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, data])
        }, 800)
    })
})

mock.onGet('/api/analytic/forecast/revenue').reply((config) => {
    const { dateRange, scenario } = parseParams(config.params)
    const data = generateRevenueData(dateRange, scenario)

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, data])
        }, 600)
    })
})

mock.onGet('/api/analytic/forecast/user-growth').reply((config) => {
    const { dateRange, scenario } = parseParams(config.params)
    const data = generateUserGrowthData(dateRange, scenario)

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, data])
        }, 700)
    })
})

mock.onGet('/api/analytic/forecast/churn-retention').reply((config) => {
    const { dateRange, scenario } = parseParams(config.params)
    const data = generateChurnRetentionData(dateRange, scenario)

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, data])
        }, 650)
    })
})

mock.onGet('/api/analytic/forecast/subscriptions').reply((config) => {
    const { dateRange, scenario } = parseParams(config.params)
    const data = generateSubscriptionData(dateRange, scenario)

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, data])
        }, 750)
    })
})

mock.onGet('/api/analytic/revenue/trends').reply((config) => {
    const { dateRange, metric, includeComparison, comparisonType } =
        parseRevenueParams(config.params)
    const data = generateRevenueTrendsData(
        dateRange,
        metric,
        includeComparison,
        comparisonType,
    )

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, data])
        }, 600)
    })
})

mock.onGet('/api/analytic/revenue/trends/all').reply((config) => {
    const { dateRange, includeComparison, comparisonType } = parseRevenueParams(
        config.params,
    )
    const data = generateAllRevenueTrendsData(
        dateRange,
        includeComparison,
        comparisonType,
    )

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, data])
        }, 400)
    })
})

mock.onGet('/api/analytic/revenue/breakdown').reply((config) => {
    const { dateRange } = parseRevenueParams(config.params)
    const data = generateRevenueBreakdownData(dateRange)

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, data])
        }, 500)
    })
})

const parseSubscriptionParams = (params: any) => {
    const currentDate = new Date()
    const defaultStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 6,
        1,
    ) // 6 months ago
    const defaultEndDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
    ) // current month

    const dateRange: DateRange = {
        startDate: params?.startDate
            ? new Date(params.startDate)
            : defaultStartDate,
        endDate: params?.endDate ? new Date(params.endDate) : defaultEndDate,
    }

    return { dateRange }
}

mock.onGet('/api/analytic/subscription/trends').reply((config) => {
    const { dateRange } = parseSubscriptionParams(config.params)
    const data = generateSubscriberTrendsData(dateRange)

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, data])
        }, 600)
    })
})

mock.onGet('/api/analytic/subscription/lifecycle').reply((config) => {
    const { dateRange } = parseSubscriptionParams(config.params)
    const data = generateLifecycleData(dateRange)

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, data])
        }, 500)
    })
})

mock.onGet('/api/analytic/subscription/personas').reply((config) => {
    const { dateRange } = parseSubscriptionParams(config.params)
    const {
        pageIndex = 1,
        pageSize = 10,
        sortOrder,
        sortKey,
        query,
        type = 'all',
    } = config.params

    const rawData = generateSubscriberPersonasData(dateRange)

    let data =
        type === 'recent'
            ? rawData.recent
            : type === 'highValue'
              ? rawData.highValue
              : [...rawData.recent, ...rawData.highValue]

    let total = data.length

    if (sortKey && sortOrder) {
        if (sortKey === 'name' || sortKey === 'plan' || sortKey === 'email') {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else if (
            sortKey === 'accumulatedAmount' ||
            sortKey === 'avgPageViews'
        ) {
            data.sort(sortBy(sortKey, sortOrder === 'desc', parseInt as Primer))
        } else if (sortKey === 'joinDate' || sortKey === 'lastActive') {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    new Date(a as string).getTime(),
                ),
            )
        }
    }

    if (query) {
        data = wildCardSearch(data, query, 'name')
        total = data.length
    }

    // Apply pagination
    const paginatedData = paginate(data, pageSize, pageIndex)

    const responseData = {
        recent: type === 'recent' ? [] : rawData.recent,
        highValue: type === 'highValue' ? [] : rawData.highValue,
        list: paginatedData,
        total: total,
        pageIndex: parseInt(pageIndex),
        pageSize: parseInt(pageSize),
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, responseData])
        }, 700)
    })
})

const parseReportParams = (params: any) => {
    const currentDate = new Date()
    const defaultStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 3,
        1,
    )
    const defaultEndDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
    )
    const dateRange: DateRange = {
        startDate: params?.startDate
            ? new Date(params.startDate)
            : defaultStartDate,
        endDate: params?.endDate ? new Date(params.endDate) : defaultEndDate,
    }

    return {
        dateRange,
        pageIndex: parseInt(params?.pageIndex) || 1,
        pageSize: parseInt(params?.pageSize) || 10,
        sortOrder: params?.sortOrder || '',
        sortKey: params?.sortKey || '',
        query: params?.query || '',
    }
}

mock.onGet('/api/analytic/dashboard').reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, analyticDashboardData])
        }, 400)
    })
})

mock.onGet('/api/analytic/reports').reply((config) => {
    const { dateRange, pageIndex, pageSize, sortOrder, sortKey, query } =
        parseReportParams(config.params)

    let data = generateUnifiedReportData(dateRange)

    let total = data.length

    if (sortKey && sortOrder) {
        if (
            sortKey === 'customer' ||
            sortKey === 'plan' ||
            sortKey === 'paymentMethod' ||
            sortKey === 'status' ||
            sortKey === 'email' ||
            sortKey === 'device' ||
            sortKey === 'country' ||
            sortKey === 'mrrRange'
        ) {
            data.sort((a, b) => {
                const aVal = String(
                    a[sortKey as keyof UnifiedReportRow] || '',
                ).toUpperCase()
                const bVal = String(
                    b[sortKey as keyof UnifiedReportRow] || '',
                ).toUpperCase()
                if (sortOrder === 'desc') {
                    return bVal.localeCompare(aVal)
                }
                return aVal.localeCompare(bVal)
            })
        } else if (sortKey === 'featureUsed') {
            data.sort((a, b) => {
                const aVal = Array.isArray(a.featureUsed)
                    ? a.featureUsed.join(', ')
                    : ''
                const bVal = Array.isArray(b.featureUsed)
                    ? b.featureUsed.join(', ')
                    : ''
                if (sortOrder === 'desc') {
                    return bVal.localeCompare(aVal)
                }
                return aVal.localeCompare(bVal)
            })
        } else if (sortKey === 'amount') {
            data.sort((a, b) => {
                const aVal = Number(a.amount || 0)
                const bVal = Number(b.amount || 0)
                if (sortOrder === 'desc') {
                    return bVal - aVal
                }
                return aVal - bVal
            })
        } else if (sortKey === 'signupDate' || sortKey === 'lastActive') {
            data.sort((a, b) => {
                const aVal = new Date(
                    (a[sortKey as keyof UnifiedReportRow] as string) || 0,
                ).getTime()
                const bVal = new Date(
                    (b[sortKey as keyof UnifiedReportRow] as string) || 0,
                ).getTime()
                if (sortOrder === 'desc') {
                    return bVal - aVal
                }
                return aVal - bVal
            })
        }
    }

    if (query) {
        const list = data as unknown as Array<
            Record<string, string | number | boolean>
        >
        data = wildCardSearch(list, query) as unknown as UnifiedReportRow[]
        total = data.length
    }

    // Apply pagination
    const paginatedData = paginate(data, pageSize, pageIndex)

    const responseData = {
        list: paginatedData,
        total: total,
        pageIndex: pageIndex,
        pageSize: pageSize,
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, responseData])
        }, 500)
    })
})
