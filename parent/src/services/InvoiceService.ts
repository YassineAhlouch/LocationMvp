import ApiService from './ApiService'

export async function apiGetInvoiceList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/invoices',
        method: 'get',
        params,
    })
}

export async function apiGetInvoice<T, U extends Record<string, unknown>>({
    id,
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/invoices/${id}`,
        method: 'get',
        params,
    })
}

export async function apiCreateInvoice<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/invoices',
        method: 'post',
        data,
    })
}

export async function apiUpdateInvoice<T, U extends Record<string, unknown>>({
    id,
    ...data
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/invoices/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteInvoice<T, U extends Record<string, unknown>>({
    id,
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/invoices/${id}`,
        method: 'delete',
        params,
    })
}

export async function apiSendInvoice<T, U extends Record<string, unknown>>({
    id,
    ...data
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/invoices/${id}/send`,
        method: 'post',
        data,
    })
}

export async function apiGetInvoiceStatistics<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: `/invoice/statistics`,
        method: 'get',
    })
}
