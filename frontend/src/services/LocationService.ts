import ApiService from './ApiService'
import type {
    Brand,
    Car,
    CarCategory,
    CarModel,
    CarPayload,
    CarReport,
    Client,
    ClientPayload,
    DashboardSummary,
    DashboardTimeline,
    Expense,
    ExpensePayload,
    Paginated,
    PermissionModule,
    Reservation,
    ReservationPayload,
    Role,
    RolePayload,
    StaffUser,
    StaffUserPayload,
} from '@/@types/location'

/**
 * Car-rental module API bindings. Every call maps 1:1 to a Laravel
 * api/v1 route; responses are unwrapped by ApiService (response.data),
 * so a list endpoint resolves to { data: [], meta: {...} }.
 */

// ---- Dashboard -----------------------------------------------------------

export const apiGetDashboardSummary = (params?: {
    from?: string
    to?: string
}) =>
    ApiService.fetchDataWithAxios<DashboardSummary>({
        url: '/v1/dashboard/summary',
        method: 'get',
        params,
    })

export const apiGetDashboardTimeline = (params?: { months?: number }) =>
    ApiService.fetchDataWithAxios<DashboardTimeline>({
        url: '/v1/reports/timeline',
        method: 'get',
        params,
    })

export const apiGetCarReports = (params?: { from?: string; to?: string }) =>
    ApiService.fetchDataWithAxios<CarReport[]>({
        url: '/v1/reports/cars',
        method: 'get',
        params,
    })

// ---- Cars ----------------------------------------------------------------

export const apiGetCars = (params?: Record<string, unknown>) =>
    ApiService.fetchDataWithAxios<Paginated<Car>>({
        url: '/v1/cars',
        method: 'get',
        params,
    })

export const apiGetCar = (id: number) =>
    ApiService.fetchDataWithAxios<Car>({
        url: `/v1/cars/${id}`,
        method: 'get',
    })

export const apiCreateCar = (data: CarPayload) =>
    ApiService.fetchDataWithAxios<Car>({
        url: '/v1/cars',
        method: 'post',
        data,
    })

export const apiUpdateCar = (id: number, data: Partial<CarPayload>) =>
    ApiService.fetchDataWithAxios<Car>({
        url: `/v1/cars/${id}`,
        method: 'patch',
        data,
    })

export const apiDeleteCar = (id: number) =>
    ApiService.fetchDataWithAxios<{ message: string }>({
        url: `/v1/cars/${id}`,
        method: 'delete',
    })

/** Upload a gallery photo; the API returns the public URL to persist. */
export const apiUploadCarImage = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return ApiService.fetchDataWithAxios<{ url: string }, FormData>({
        url: '/v1/uploads',
        method: 'post',
        data: formData,
    })
}

// ---- Clients -------------------------------------------------------------

export const apiGetClients = (params?: Record<string, unknown>) =>
    ApiService.fetchDataWithAxios<Paginated<Client>>({
        url: '/v1/clients',
        method: 'get',
        params,
    })

export const apiGetClient = (id: number) =>
    ApiService.fetchDataWithAxios<Client>({
        url: `/v1/clients/${id}`,
        method: 'get',
    })

export const apiCreateClient = (data: ClientPayload) =>
    ApiService.fetchDataWithAxios<Client>({
        url: '/v1/clients',
        method: 'post',
        data,
    })

export const apiUpdateClient = (id: number, data: Partial<ClientPayload>) =>
    ApiService.fetchDataWithAxios<Client>({
        url: `/v1/clients/${id}`,
        method: 'patch',
        data,
    })

export const apiDeleteClient = (id: number) =>
    ApiService.fetchDataWithAxios<{ message: string }>({
        url: `/v1/clients/${id}`,
        method: 'delete',
    })

// ---- Reservations --------------------------------------------------------

export const apiGetReservations = (params?: Record<string, unknown>) =>
    ApiService.fetchDataWithAxios<Paginated<Reservation>>({
        url: '/v1/reservations',
        method: 'get',
        params,
    })

export const apiGetReservation = (id: number) =>
    ApiService.fetchDataWithAxios<Reservation>({
        url: `/v1/reservations/${id}`,
        method: 'get',
    })

export const apiCreateReservation = (data: ReservationPayload) =>
    ApiService.fetchDataWithAxios<Reservation>({
        url: '/v1/reservations',
        method: 'post',
        data,
    })

export const apiUpdateReservation = (
    id: number,
    data: Partial<ReservationPayload>,
) =>
    ApiService.fetchDataWithAxios<Reservation>({
        url: `/v1/reservations/${id}`,
        method: 'patch',
        data,
    })

export const apiConfirmReservation = (id: number) =>
    ApiService.fetchDataWithAxios<Reservation>({
        url: `/v1/reservations/${id}/confirm`,
        method: 'post',
    })

export const apiCancelReservation = (id: number, data?: { reason: string }) =>
    ApiService.fetchDataWithAxios<Reservation>({
        url: `/v1/reservations/${id}/cancel`,
        method: 'post',
        data,
    })

// ---- Expenses ------------------------------------------------------------

export const apiGetExpenses = (params?: Record<string, unknown>) =>
    ApiService.fetchDataWithAxios<Paginated<Expense>>({
        url: '/v1/expenses',
        method: 'get',
        params,
    })

export const apiGetExpense = (id: number) =>
    ApiService.fetchDataWithAxios<Expense>({
        url: `/v1/expenses/${id}`,
        method: 'get',
    })

export const apiCreateExpense = (data: ExpensePayload) =>
    ApiService.fetchDataWithAxios<Expense>({
        url: '/v1/expenses',
        method: 'post',
        data,
    })

export const apiUpdateExpense = (id: number, data: Partial<ExpensePayload>) =>
    ApiService.fetchDataWithAxios<Expense>({
        url: `/v1/expenses/${id}`,
        method: 'patch',
        data,
    })

// ---- Fleet catalog (drives form selects) ---------------------------------

export const apiGetBrands = () =>
    ApiService.fetchDataWithAxios<Paginated<Brand>>({
        url: '/v1/fleet/brands',
        method: 'get',
    })

export const apiGetModels = (params?: { brand_id?: number }) =>
    ApiService.fetchDataWithAxios<Paginated<CarModel>>({
        url: '/v1/fleet/models',
        method: 'get',
        params,
    })

export const apiGetCategories = () =>
    ApiService.fetchDataWithAxios<Paginated<CarCategory>>({
        url: '/v1/fleet/categories',
        method: 'get',
    })

// ---- Users & Roles (team) -------------------------------------------------

export const apiGetUsers = (params?: Record<string, unknown>) =>
    ApiService.fetchDataWithAxios<Paginated<StaffUser>>({
        url: '/v1/users',
        method: 'get',
        params,
    })

export const apiGetUser = (id: number) =>
    ApiService.fetchDataWithAxios<StaffUser>({
        url: `/v1/users/${id}`,
        method: 'get',
    })

export const apiCreateUser = (data: StaffUserPayload) =>
    ApiService.fetchDataWithAxios<StaffUser>({
        url: '/v1/users',
        method: 'post',
        data,
    })

export const apiUpdateUser = (id: number, data: Partial<StaffUserPayload>) =>
    ApiService.fetchDataWithAxios<StaffUser>({
        url: `/v1/users/${id}`,
        method: 'patch',
        data,
    })

export const apiGetRoles = (params?: Record<string, unknown>) =>
    ApiService.fetchDataWithAxios<Paginated<Role>>({
        url: '/v1/roles',
        method: 'get',
        params,
    })

/** The config/permissions.php catalog: [{ module, actions }]. */
export const apiGetPermissionCatalog = () =>
    ApiService.fetchDataWithAxios<PermissionModule[]>({
        url: '/v1/roles/permissions',
        method: 'get',
    })

export const apiCreateRole = (data: RolePayload) =>
    ApiService.fetchDataWithAxios<Role>({
        url: '/v1/roles',
        method: 'post',
        data,
    })

export const apiUpdateRole = (id: number, data: Partial<RolePayload>) =>
    ApiService.fetchDataWithAxios<Role>({
        url: `/v1/roles/${id}`,
        method: 'patch',
        data,
    })
