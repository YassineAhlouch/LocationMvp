import ApiService from './ApiService'

export async function apiGetProjects<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/projects',
        method: 'get',
    })
}

export async function apiGetProject<T, U extends Record<string, unknown>>({
    id,
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/projects/${id}`,
        method: 'get',
        params,
    })
}

export async function apiGetScrumBoards<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/projects/scrum-board',
        method: 'get',
    })
}

export async function apiGetProjectMembers<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/projects/scrum-board/members',
        method: 'get',
    })
}

export async function apiGetProjectTasks<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/projects/tasks',
        method: 'get',
    })
}

export async function apiGetProjectTask<T, U extends Record<string, unknown>>({
    id,
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/projects/tasks/${id}`,
        method: 'get',
        params,
    })
}

export async function apiGetProjectSettings<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/projects/settings',
        method: 'get',
    })
}

export async function apiGetProjectAuditLog<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/projects/audit-log',
        method: 'get',
        params,
    })
}

// Timeline API functions
export async function apiGetTimelineProjects<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/projects/timeline',
        method: 'get',
    })
}

export async function apiGetProjectTimeline<
    T,
    U extends Record<string, unknown>,
>({ projectId, ...params }: U & { projectId: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/projects/timeline/${projectId}`,
        method: 'get',
        params,
    })
}

// Dashboard API functions
export async function apiGetProjectDashboard<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/projects/dashboard',
        method: 'get',
    })
}
