import ApiService from './ApiService'

export async function apiGetProductList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/products',
        method: 'get',
        params,
    })
}

export async function apiGetProduct<T, U extends Record<string, unknown>>({
    id,
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/products/${id}`,
        method: 'get',
        params,
    })
}

export async function apiGetOrderList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order-list',
        method: 'get',
        params,
    })
}

export async function apiGetOrder<T, U extends Record<string, unknown>>({
    id,
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/orders/${id}`,
        method: 'get',
        params,
    })
}

export async function apiGetOrderStatistic<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/order-statistics`,
        method: 'get',
        params,
    })
}

export async function apiGetSalesDashboardData<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/sales/dashboard-data',
        method: 'get',
        params,
    })
}
