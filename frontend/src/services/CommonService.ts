import ApiService from './ApiService'

export async function apiGetSearchResult<T>(params: { query: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/search/query',
        method: 'get',
        params,
    })
}

export async function apiGetTenantList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/tenants',
        method: 'get',
    })
}
