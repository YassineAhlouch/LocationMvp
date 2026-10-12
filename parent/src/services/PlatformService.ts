import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type {
    AgencyPayload,
    AgencyPayment,
    AgencyPaymentPayload,
    Brand,
    CarCategory,
    CarModel,
    Currency,
    CurrencyPayload,
    InvoiceTemplate,
    Paginated,
    PlatformAgency,
    PlatformInvoice,
    PlatformRole,
    PlatformStats,
    PlatformUser,
    UserPayload,
} from '@/@types/platform'

type ListParams = Record<string, unknown>

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export async function apiGetPlatformStats() {
    return ApiService.fetchDataWithAxios<PlatformStats>({
        url: endpointConfig.dashboardStats,
        method: 'get',
    })
}

/* ------------------------------------------------------------------ */
/* Invoices                                                            */
/* ------------------------------------------------------------------ */

export async function apiGetInvoices(params?: ListParams) {
    return ApiService.fetchDataWithAxios<Paginated<PlatformInvoice>>({
        url: endpointConfig.invoices,
        method: 'get',
        params,
    })
}

/* ------------------------------------------------------------------ */
/* Agencies                                                            */
/* ------------------------------------------------------------------ */

export async function apiGetAgencies(params?: ListParams) {
    return ApiService.fetchDataWithAxios<Paginated<PlatformAgency>>({
        url: endpointConfig.agencies,
        method: 'get',
        params,
    })
}

export async function apiCreateAgency(data: AgencyPayload) {
    return ApiService.fetchDataWithAxios<PlatformAgency>({
        url: endpointConfig.agencies,
        method: 'post',
        data,
    })
}

export async function apiUpdateAgency(id: number, data: AgencyPayload) {
    return ApiService.fetchDataWithAxios<PlatformAgency>({
        url: `${endpointConfig.agencies}/${id}`,
        method: 'patch',
        data,
    })
}

/* ------------------------------------------------------------------ */
/* Subscription payments                                               */
/* ------------------------------------------------------------------ */

export async function apiGetAgencyPayments(params?: ListParams) {
    return ApiService.fetchDataWithAxios<Paginated<AgencyPayment>>({
        url: endpointConfig.agencyPayments,
        method: 'get',
        params,
    })
}

export async function apiCreateAgencyPayment(data: AgencyPaymentPayload) {
    return ApiService.fetchDataWithAxios<AgencyPayment>({
        url: endpointConfig.agencyPayments,
        method: 'post',
        data,
    })
}

export async function apiUpdateAgencyPayment(
    id: number,
    data: Partial<AgencyPaymentPayload>,
) {
    return ApiService.fetchDataWithAxios<AgencyPayment>({
        url: `${endpointConfig.agencyPayments}/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteAgencyPayment(id: number) {
    return ApiService.fetchDataWithAxios<null>({
        url: `${endpointConfig.agencyPayments}/${id}`,
        method: 'delete',
    })
}

export async function apiPayAgencyPayment(id: number) {
    return ApiService.fetchDataWithAxios<AgencyPayment>({
        url: `${endpointConfig.agencyPayments}/${id}/pay`,
        method: 'post',
    })
}

export async function apiUnpayAgencyPayment(id: number) {
    return ApiService.fetchDataWithAxios<AgencyPayment>({
        url: `${endpointConfig.agencyPayments}/${id}/unpay`,
        method: 'post',
    })
}

/* ------------------------------------------------------------------ */
/* Users + roles                                                       */
/* ------------------------------------------------------------------ */

export async function apiGetUsers(params?: ListParams) {
    return ApiService.fetchDataWithAxios<Paginated<PlatformUser>>({
        url: endpointConfig.users,
        method: 'get',
        params,
    })
}

export async function apiCreateUser(data: UserPayload) {
    return ApiService.fetchDataWithAxios<PlatformUser>({
        url: endpointConfig.users,
        method: 'post',
        data,
    })
}

export async function apiUpdateUser(id: number, data: Partial<UserPayload>) {
    return ApiService.fetchDataWithAxios<PlatformUser>({
        url: `${endpointConfig.users}/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiGetRoles() {
    return ApiService.fetchDataWithAxios<PlatformRole[]>({
        url: endpointConfig.roles,
        method: 'get',
    })
}

export async function apiGetInvoiceTemplates() {
    return ApiService.fetchDataWithAxios<InvoiceTemplate[]>({
        url: endpointConfig.invoiceTemplates,
        method: 'get',
    })
}

/* ------------------------------------------------------------------ */
/* Fleet catalog                                                       */
/* ------------------------------------------------------------------ */

export async function apiGetBrands(params?: ListParams) {
    return ApiService.fetchDataWithAxios<Paginated<Brand>>({
        url: endpointConfig.brands,
        method: 'get',
        params,
    })
}

export async function apiCreateBrand(data: { name: string }) {
    return ApiService.fetchDataWithAxios<Brand>({
        url: endpointConfig.brands,
        method: 'post',
        data,
    })
}

export async function apiUpdateBrand(id: number, data: { name: string }) {
    return ApiService.fetchDataWithAxios<Brand>({
        url: `${endpointConfig.brands}/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteBrand(id: number) {
    return ApiService.fetchDataWithAxios<null>({
        url: `${endpointConfig.brands}/${id}`,
        method: 'delete',
    })
}

export async function apiGetModels(params?: ListParams) {
    return ApiService.fetchDataWithAxios<Paginated<CarModel>>({
        url: endpointConfig.models,
        method: 'get',
        params,
    })
}

export async function apiCreateModel(data: { brand_id: number; name: string }) {
    return ApiService.fetchDataWithAxios<CarModel>({
        url: endpointConfig.models,
        method: 'post',
        data,
    })
}

export async function apiUpdateModel(
    id: number,
    data: { brand_id?: number; name?: string },
) {
    return ApiService.fetchDataWithAxios<CarModel>({
        url: `${endpointConfig.models}/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteModel(id: number) {
    return ApiService.fetchDataWithAxios<null>({
        url: `${endpointConfig.models}/${id}`,
        method: 'delete',
    })
}

export async function apiGetCategories(params?: ListParams) {
    return ApiService.fetchDataWithAxios<Paginated<CarCategory>>({
        url: endpointConfig.categories,
        method: 'get',
        params,
    })
}

export async function apiCreateCategory(data: {
    name: string
    description?: string | null
}) {
    return ApiService.fetchDataWithAxios<CarCategory>({
        url: endpointConfig.categories,
        method: 'post',
        data,
    })
}

export async function apiUpdateCategory(
    id: number,
    data: { name?: string; description?: string | null },
) {
    return ApiService.fetchDataWithAxios<CarCategory>({
        url: `${endpointConfig.categories}/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteCategory(id: number) {
    return ApiService.fetchDataWithAxios<null>({
        url: `${endpointConfig.categories}/${id}`,
        method: 'delete',
    })
}

/* ------------------------------------------------------------------ */
/* Currencies                                                          */
/* ------------------------------------------------------------------ */

export async function apiGetCurrencies(params?: ListParams) {
    return ApiService.fetchDataWithAxios<Paginated<Currency>>({
        url: endpointConfig.currencies,
        method: 'get',
        params,
    })
}

export async function apiCreateCurrency(data: CurrencyPayload) {
    return ApiService.fetchDataWithAxios<Currency>({
        url: endpointConfig.currencies,
        method: 'post',
        data,
    })
}

export async function apiUpdateCurrency(
    id: number,
    data: Partial<CurrencyPayload>,
) {
    return ApiService.fetchDataWithAxios<Currency>({
        url: `${endpointConfig.currencies}/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteCurrency(id: number) {
    return ApiService.fetchDataWithAxios<null>({
        url: `${endpointConfig.currencies}/${id}`,
        method: 'delete',
    })
}
