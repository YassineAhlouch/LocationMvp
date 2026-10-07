import ApiService from './ApiService'

// Leave Calendar APIs
export async function apiGetLeaveCalendarEvents<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/leaves/calendar',
        method: 'get',
    })
}

// Leave Statistics APIs
export async function apiGetLeaveStatistics<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/leaves/statistics',
        method: 'get',
    })
}

// Leave Requests APIs
export async function apiGetLeaveRequests<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/leaves/requests',
        method: 'get',
        params,
    })
}

// Employee Leave Detail APIs
export async function apiGetEmployeeLeaveDetail<T>({
    employeeId,
    eventId,
}: {
    employeeId: string
    eventId: string
}) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/hrm/leaves/employee/${employeeId}/${eventId}`,
        method: 'get',
    })
}

// Payroll API methods
export async function apiGetPayrollData<T>(params: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/payroll',
        method: 'get',
        params,
    })
}

export async function apiExportPayrollReport<T>(
    params: Record<string, unknown>,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/payroll/export',
        method: 'get',
        params,
        responseType: 'blob',
    })
}

// Attendance API methods
export async function apiGetAttendanceData<T>(params: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/attendance',
        method: 'get',
        params,
    })
}

export async function apiGetPeriodAttendanceData<T>(
    params: Record<string, unknown>,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/attendance/period',
        method: 'get',
        params,
    })
}

// Employee Management API methods
export async function apiGetEmployees<T>(params: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/employees',
        method: 'get',
        params,
    })
}

export async function apiGetEmployee<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/hrm/employees/${id}`,
        method: 'get',
    })
}

export async function apiGetDepartments<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/departments',
        method: 'get',
    })
}

export async function apiGetRolesByDepartments<T>(departments: string[]) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/roles',
        method: 'get',
        params: { departments: departments.join(',') },
    })
}

// Announcements API methods
export async function apiGetAnnouncements<T>(params: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/announcements',
        method: 'get',
        params,
    })
}

export async function apiGetAnnouncementCategories<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/announcements/categories',
        method: 'get',
    })
}

export async function apiGetAnnouncementsList<T>(
    params: Record<string, unknown>,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/announcements/list',
        method: 'get',
        params,
    })
}

export async function apiGetPinnedAnnouncements<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/announcements/pinned',
        method: 'get',
    })
}

export async function apiGetHrmDashboard<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrm/dashboard',
        method: 'get',
    })
}
