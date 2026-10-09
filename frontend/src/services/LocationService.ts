import ApiService from './ApiService'
import type {
    Agency,
    Brand,
    Car,
    CarCategory,
    CarHistoryEntry,
    CarModel,
    CarOverview,
    CarPayload,
    CarReport,
    Client,
    ClientPayload,
    DashboardSummary,
    DashboardTimeline,
    Expense,
    ExpensePayload,
    Extra,
    InvoiceTemplate,
    Paginated,
    Payment,
    PaymentOverview,
    PaymentRecordPayload,
    PermissionModule,
    PricingQuote,
    Reservation,
    ReservationCalendarItem,
    ReservationChange,
    ReservationContract,
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

export const apiGetCarOverview = (id: number) =>
    ApiService.fetchDataWithAxios<CarOverview>({
        url: `/v1/cars/${id}/overview`,
        method: 'get',
    })

export const apiGetCarHistory = (id: number) =>
    ApiService.fetchDataWithAxios<CarHistoryEntry[]>({
        url: `/v1/cars/${id}/history`,
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

export const apiGetReservationCalendar = (params?: Record<string, unknown>) =>
    ApiService.fetchDataWithAxios<ReservationCalendarItem[]>({
        url: '/v1/reservations/calendar',
        method: 'get',
        params,
    })

export const apiGetReservationChanges = (id: number) =>
    ApiService.fetchDataWithAxios<ReservationChange[]>({
        url: `/v1/reservations/${id}/changes`,
        method: 'get',
    })

export const apiGetReservationContract = (id: number) =>
    ApiService.fetchDataWithAxios<ReservationContract>({
        url: `/v1/reservations/${id}/contract`,
        method: 'get',
    })

// ---- Agency --------------------------------------------------------------

export const apiGetAgency = () =>
    ApiService.fetchDataWithAxios<Agency>({
        url: '/v1/agency',
        method: 'get',
    })

export const apiUpdateAgency = (data: { invoice_template: InvoiceTemplate }) =>
    ApiService.fetchDataWithAxios<Agency>({
        url: '/v1/agency',
        method: 'patch',
        data,
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

export const apiMarkReservationNoShow = (
    id: number,
    data: { reason: string },
) =>
    ApiService.fetchDataWithAxios<Reservation>({
        url: `/v1/reservations/${id}/no-show`,
        method: 'post',
        data,
    })

export const apiActivateReservation = (
    id: number,
    data?: { pickup_mileage?: number; pickup_fuel_level?: number },
) =>
    ApiService.fetchDataWithAxios<Reservation>({
        url: `/v1/reservations/${id}/activate`,
        method: 'post',
        data,
    })

export const apiCompleteReservation = (
    id: number,
    data?: {
        return_mileage?: number
        return_fuel_level?: number
        reported_issues?: string
    },
) =>
    ApiService.fetchDataWithAxios<Reservation>({
        url: `/v1/reservations/${id}/complete`,
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

// ---- Extras catalog (drives reservation form extra pickers) --------------

export const apiGetExtras = (params?: Record<string, unknown>) =>
    ApiService.fetchDataWithAxios<Paginated<Extra>>({
        url: '/v1/extras',
        method: 'get',
        params,
    })

// ---- Payments ledger (per reservation) -------------------------------------

/** Payments index returns a bare array (no pagination wrapper). */
export const apiGetPayments = (reservationId: number) =>
    ApiService.fetchDataWithAxios<Payment[]>({
        url: `/v1/reservations/${reservationId}/payments`,
        method: 'get',
    })

export const apiCreatePayment = (
    reservationId: number,
    payload: PaymentRecordPayload,
) =>
    ApiService.fetchDataWithAxios<Payment>({
        url: `/v1/reservations/${reservationId}/payments`,
        method: 'post',
        data: payload,
    })

// ---- Payments ledger (agency-wide) -----------------------------------------

/** Every payment across reservations, paginated and filterable. */
export const apiGetPaymentsLedger = (params?: Record<string, unknown>) =>
    ApiService.fetchDataWithAxios<Paginated<Payment>>({
        url: '/v1/payments',
        method: 'get',
        params,
    })

/** Period totals, counts and daily trend for the payments page. */
export const apiGetPaymentsOverview = (params?: { from?: string; to?: string }) =>
    ApiService.fetchDataWithAxios<PaymentOverview>({
        url: '/v1/payments/overview',
        method: 'get',
        params,
    })

/** pending → paid: the transfer landed. */
export const apiConfirmPayment = (paymentId: number) =>
    ApiService.fetchDataWithAxios<Payment>({
        url: `/v1/payments/${paymentId}/confirm`,
        method: 'post',
    })

/** paid → refunded: money returned, reason mandatory (audit trail). */
export const apiRefundPayment = (paymentId: number, reason: string) =>
    ApiService.fetchDataWithAxios<Payment>({
        url: `/v1/payments/${paymentId}/refund`,
        method: 'post',
        data: { reason },
    })

/** Only pending rows are deletable — committed money is immutable. */
export const apiDeletePayment = (reservationId: number, paymentId: number) =>
    ApiService.fetchDataWithAxios<null>({
        url: `/v1/reservations/${reservationId}/payments/${paymentId}`,
        method: 'delete',
    })

// ---- Pricing quote (drives the live reservation total) ---------------------

export const apiQuoteReservation = (payload: {
    car_id: number
    pickup_datetime: string
    expected_return_datetime: string
    daily_rate?: number
    discount_amount?: number
}) =>
    ApiService.fetchDataWithAxios<PricingQuote>({
        url: '/v1/pricing/quote',
        method: 'post',
        data: payload,
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
