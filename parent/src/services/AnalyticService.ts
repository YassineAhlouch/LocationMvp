import ApiService from './ApiService'

export async function apiGetRevenueForecast<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/forecast/revenue',
        method: 'get',
        params,
    })
}

export async function apiGetUserGrowthForecast<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/forecast/user-growth',
        method: 'get',
        params,
    })
}

export async function apiGetChurnRetentionForecast<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/forecast/churn-retention',
        method: 'get',
        params,
    })
}

export async function apiGetSubscriptionForecast<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/forecast/subscriptions',
        method: 'get',
        params,
    })
}

export async function apiGetRevenueTrends<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/revenue/trends',
        method: 'get',
        params,
    })
}

export async function apiGetRevenueBreakdown<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/revenue/breakdown',
        method: 'get',
        params,
    })
}

export async function apiGetAllRevenueTrends<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/revenue/trends/all',
        method: 'get',
        params,
    })
}

export async function apiGetSubscriberTrends<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/subscription/trends',
        method: 'get',
        params,
    })
}

export async function apiGetLifecycleData<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/subscription/lifecycle',
        method: 'get',
        params,
    })
}

export async function apiGetSubscriberPersonas<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/subscription/personas',
        method: 'get',
        params,
    })
}

// Reports API functions
export async function apiGetRevenueReport<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/reports/revenue',
        method: 'get',
        params,
    })
}

export async function apiGetUserReport<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/reports/users',
        method: 'get',
        params,
    })
}

export async function apiGetUsageReport<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/reports/usage',
        method: 'get',
        params,
    })
}

export async function apiGetReports<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/reports',
        method: 'get',
        params,
    })
}

export async function apiGetAnalyticDashboard<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/analytic/dashboard',
        method: 'get',
    })
}
