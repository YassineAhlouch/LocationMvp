/**
 * Shapes returned by the /api/v1/platform area. These mirror the Laravel
 * API resources one-for-one (PlatformAgencyResource, UserResource, etc.).
 */

export type Paginated<T> = {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
}

export type PlatformAgency = {
    id: number
    name: string
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    country: string | null
    ice: string | null
    rc: string | null
    logo: string | null
    daily_mileage_allowance: number
    extra_mileage_fee_per_km: number
    is_active: boolean
    currency?: {
        id: number
        code: string
        name: string
        symbol: string
        decimals: number
    } | null
    invoice_template?: {
        id: number
        slug: string
        name: string
    } | null
    users_count?: number
    cars_count?: number
    billing?: AgencyBillingSummary
    created_at: string | null
    updated_at: string | null
}

/**
 * Billing snapshot attached to each agency (PlatformAgencyResource). An
 * overdue invoice flips `has_overdue_payment` and locks the agency workspace.
 */
export type AgencyBillingSummary = {
    outstanding_amount: number
    has_overdue_payment: boolean
    next_due_date: string | null
}

export type AgencyPayload = {
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    country?: string | null
    ice?: string | null
    rc?: string | null
    daily_mileage_allowance?: number | null
    extra_mileage_fee_per_km?: number | null
    currency_id?: number | null
    invoice_template_id?: number | null
    is_active?: boolean
    admin?: {
        first_name: string
        last_name: string
        email: string
        password: string
        phone?: string | null
        role_id?: number | null
    }
}

export type PlatformRole = {
    id: number
    name: string
    description: string | null
    icon: string | null
    color: string | null
    permissions: string[]
    users_count?: number
    is_active: boolean
}

export type InvoiceTemplate = {
    id: number
    slug: string
    name: string
    is_active: boolean
}

export type PlatformUser = {
    id: number
    first_name: string | null
    last_name: string | null
    full_name: string | null
    email: string
    phone: string | null
    avatar: string | null
    role: {
        id: number | null
        name: string | null
        permissions: string[]
    }
    authority: string[]
    agency: {
        id: number | null
        name: string | null
    }
    is_active: boolean
    last_login_at?: string | null
    created_at?: string | null
}

export type UserPayload = {
    agency_id: number
    first_name: string
    last_name: string
    email: string
    phone?: string | null
    password?: string
    role_id: number
    is_active?: boolean
}

export type Brand = {
    id: number
    name: string
    models_count?: number
    created_at?: string | null
    updated_at?: string | null
}

export type CarModel = {
    id: number
    brand_id: number
    name: string
    brand?: {
        id: number | null
        name: string | null
    }
    created_at?: string | null
    updated_at?: string | null
}

export type CarCategory = {
    id: number
    name: string
    description: string | null
    cars_count?: number
    created_at?: string | null
    updated_at?: string | null
}

export type Currency = {
    id: number
    code: string
    name: string
    symbol: string
    decimals: number
    is_active: boolean
    agencies_count?: number
    created_at?: string | null
    updated_at?: string | null
}

export type CurrencyPayload = {
    code: string
    name: string
    symbol: string
    decimals?: number
    is_active?: boolean
}

/* ------------------------------------------------------------------ */
/* Subscription payments (platform -> agency invoices)                */
/* ------------------------------------------------------------------ */

export type PaymentStatus = 'pending' | 'overdue' | 'paid'

export type AgencyPayment = {
    id: number
    amount: number
    period: string | null
    due_date: string | null
    paid_at: string | null
    status: PaymentStatus
    reference: string | null
    notes: string | null
    agency: {
        id: number
        name: string
    } | null
    currency: {
        id: number
        code: string
        symbol: string
        decimals: number
    } | null
    recorded_by: {
        id: number
        name: string
    } | null
    created_at: string | null
    updated_at: string | null
}

export type AgencyPaymentPayload = {
    agency_id: number
    currency_id?: number | null
    amount: number
    period?: string | null
    due_date: string
    reference?: string | null
    notes?: string | null
}

/* ------------------------------------------------------------------ */
/* Dashboard + invoices                                               */
/* ------------------------------------------------------------------ */

export type PlatformStats = {
    agencies: {
        total: number
        active: number
        inactive: number
    }
    billing: {
        outstanding_total: number
        overdue_agencies: number
        collected_this_month: number
    }
    users: number
    cars: number
    clients: number
    reservations: number
    monthly_revenue: number
    recent_agencies: RecentAgency[]
}

export type RecentAgency = {
    id: number
    name: string
    city: string | null
    is_active: boolean
    users_count: number
    cars_count: number
    currency: {
        id: number
        code: string
        symbol: string
    } | null
    created_at: string | null
}

export type PlatformInvoice = {
    id: number
    reservation_number: string
    status: string
    payment_status: string
    agency: {
        id: number
        name: string
        email: string | null
        phone: string | null
        address: string | null
        city: string | null
        country: string | null
        currency: Currency | null
    }
    car: {
        id: number
        registration_number: string
        brand: string | null
        model: string | null
    }
    primary_client: InvoiceClient | null
    secondary_client: InvoiceClient | null
    pickup_location: string | null
    return_location: string | null
    pickup_datetime: string | null
    expected_return_datetime: string | null
    actual_return_datetime: string | null
    daily_rate: number
    rental_days: number
    subtotal: number
    discount_amount: number
    discount_reason: string | null
    tax_amount: number
    deposit_amount: number
    total_amount: number
    paid_amount: number | null
    balance_amount: number | null
    extras: InvoiceExtra[]
    payments: InvoicePayment[]
    created_at: string | null
}

export type InvoiceClient = {
    id: number
    full_name: string
    phone: string | null
    email: string | null
    cin: string | null
}

export type InvoiceExtra = {
    name: string
    quantity: number
    unit_price: number
    total_price: number
}

export type InvoicePayment = {
    id: number
    payment_date: string | null
    amount: number
    method: string | null
    reference: string | null
    status: string
    notes: string | null
}
