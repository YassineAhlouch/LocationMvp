import ApiService from './ApiService'

export async function apiGetCustomersList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/customers',
        method: 'get',
        params,
    })
}

export async function apiGetCustomer<T, U extends Record<string, unknown>>({
    id,
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/customers/${id}`,
        method: 'get',
        params,
    })
}

export async function apiGetCustomerStatistics<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: `/customer/statistics`,
        method: 'get',
    })
}

export async function apiGetCustomerLog<T, U extends Record<string, unknown>>({
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/customer/log`,
        method: 'get',
        params,
    })
}

export async function apiGetCustomerDocuments<
    T,
    U extends Record<string, unknown>,
>({ ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/customer/documents`,
        method: 'get',
        params,
    })
}

export async function apiGetDeals<T, U extends Record<string, unknown>>({
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/customer/deals`,
        method: 'get',
        params,
    })
}
export async function apiGetLeadsList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/leads',
        method: 'get',
        params,
    })
}

export async function apiGetLead<T, U extends Record<string, unknown>>({
    id,
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/leads/${id}`,
        method: 'get',
        params,
    })
}

export async function apiGetNotes<T, U extends Record<string, unknown>>({
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/lead/notes`,
        method: 'get',
        params,
    })
}

export async function apiGetHelpdeskTickets<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/helpdesk/tickets',
        method: 'get',
        params,
    })
}
export async function apiGetHelpdeskTicket<
    T,
    U extends Record<string, unknown>,
>({ id, ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/helpdesk/tickets/${id}`,
        method: 'get',
        params,
    })
}
export async function apiGetCrmDashboard<T, U extends Record<string, unknown>>(
    params?: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crm/dashboard',
        method: 'get',
        params,
    })
}
