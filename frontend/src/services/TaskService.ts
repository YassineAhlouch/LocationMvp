import ApiService from './ApiService'

export async function apiGetTasks<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/v1/tasks',
        method: 'get',
    })
}

export async function apiGetTaskGroups<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/v1/tasks/groups',
        method: 'get',
    })
}

export async function apiGetTask<T, U extends Record<string, unknown>>({
    id,
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/v1/tasks/${id}`,
        method: 'get',
        params,
    })
}

export async function apiCreateTask<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/v1/tasks',
        method: 'post',
        data,
    })
}

export async function apiUpdateTask<T, U extends Record<string, unknown>>({
    id,
    ...data
}: U & { id: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/v1/tasks/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteTask<T, U extends Record<string, unknown>>({
    id,
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/v1/tasks/${id}`,
        method: 'delete',
        params,
    })
}

export async function apiCreateTaskGroup<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/v1/tasks/groups',
        method: 'post',
        data,
    })
}

export async function apiUpdateTaskGroup<T, U extends Record<string, unknown>>({
    id,
    ...data
}: U & { id: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/v1/tasks/groups/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteTaskGroup<T>({ id }: { id: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/v1/tasks/groups/${id}`,
        method: 'delete',
    })
}
