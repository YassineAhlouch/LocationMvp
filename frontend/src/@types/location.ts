/**
 * Types mirroring the Laravel API resources (app/Http/Resources/*) and the
 * ReportingService summary payload — kept field-for-field so the UI can trust
 * the backend contract.
 */

export type Paginated<T> = {
    data: T[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

export type CarStatus =
    'available' | 'reserved' | 'rented' | 'maintenance' | 'inactive'
export type ReservationStatus =
    'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'partial' | 'paid'
export type ClientStatus = 'normal' | 'vip' | 'blacklist'
export type ClientSource =
    'facebook' | 'whatsapp' | 'referral' | 'phone' | 'walk_in' | 'other'
export type ExpenseStatus = 'pending' | 'paid' | 'overdue'
export type ExpenseType =
    | 'insurance'
    | 'maintenance'
    | 'repair'
    | 'tax'
    | 'oil_change'
    | 'tires'
    | 'inspection'
export type TransmissionType = 'manual' | 'automatic'
export type FuelType = 'diesel' | 'petrol' | 'hybrid' | 'electric'
export type PaymentMethod = 'cash' | 'card' | 'transfer'

export type Brand = {
    id: number
    name: string
}

export type CarModel = {
    id: number
    name: string
    brand_id: number
}

export type CarCategory = {
    id: number
    name: string
    description: string | null
}

export type CarImage = {
    id: number
    image: string
    is_primary: boolean
    sort_order: number
}

export type Car = {
    id: number
    registration_number: string
    vin: string | null
    brand: { id: number; name: string } | null
    model: { id: number; name: string } | null
    category: { id: number; name: string } | null
    year: number | null
    color: string | null
    seats_count: number | null
    doors_count: number | null
    transmission_type: TransmissionType | null
    fuel_type: FuelType | null
    daily_price: number | null
    purchase_price: number | null
    initial_mileage: number | null
    current_mileage: number | null
    current_fuel_level: number | null
    insurance_company: string | null
    insurance_policy_number: string | null
    insurance_expiry_date: string | null
    technical_inspection_expiry: string | null
    next_service_mileage: number | null
    last_maintenance_at: string | null
    status: CarStatus
    is_active: boolean
    notes: string | null
    images_count?: number
    images?: CarImage[]
    created_at?: string | null
    updated_at?: string | null
}

export type CarPayload = {
    brand_id: number
    model_id: number
    category_id: number
    registration_number: string
    vin?: string | null
    year?: number | null
    color?: string | null
    seats_count?: number | null
    doors_count?: number | null
    transmission_type?: TransmissionType | null
    fuel_type?: FuelType | null
    daily_price: number
    purchase_price?: number | null
    initial_mileage?: number | null
    current_mileage?: number | null
    current_fuel_level?: number | null
    insurance_company?: string | null
    insurance_policy_number?: string | null
    insurance_expiry_date?: string | null
    technical_inspection_expiry?: string | null
    next_service_mileage?: number | null
    last_maintenance_at?: string | null
    status?: 'available' | 'maintenance' | 'inactive'
    is_active?: boolean
    notes?: string | null
    images?: { image: string; is_primary?: boolean; sort_order?: number }[]
}

export type Client = {
    id: number
    full_name: string
    first_name: string
    last_name: string
    phone: string
    secondary_phone: string | null
    email: string | null
    cin: string | null
    passport_number: string | null
    driving_license_number: string | null
    driving_license_expiry: string | null
    birth_date: string | null
    birth_place: string | null
    nationality: string | null
    address: string | null
    city: string | null
    country: string | null
    notes: string | null
    source: ClientSource | null
    status: ClientStatus
    is_active: boolean
    last_reservation_at?: string | null
    created_at?: string | null
    updated_at?: string | null
}

export type ClientPayload = {
    first_name: string
    last_name: string
    phone: string
    secondary_phone?: string | null
    email?: string | null
    cin?: string | null
    passport_number?: string | null
    driving_license_number?: string | null
    driving_license_expiry?: string | null
    birth_date?: string | null
    birth_place?: string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    country?: string | null
    notes?: string | null
    source?: ClientSource | null
    status?: ClientStatus
    is_active?: boolean
}

export type Reservation = {
    id: number
    reservation_number: string
    status: ReservationStatus
    payment_status: PaymentStatus
    car: {
        id: number
        registration_number: string
        daily_price: number | null
    } | null
    primary_client: {
        id: number
        name: string
        phone: string | null
    } | null
    secondary_client: {
        id: number
        name: string
        phone: string | null
    } | null
    primary_driver: {
        name: string | null
        phone: string | null
        cin: string | null
        passport: string | null
        license: string | null
    }
    secondary_driver: {
        name: string | null
        phone: string | null
        cin: string | null
        passport: string | null
        license: string | null
    }
    pickup_location: string | null
    return_location: string | null
    pickup_datetime: string
    expected_return_datetime: string
    actual_return_datetime: string | null
    pickup_mileage: number | null
    return_mileage: number | null
    pickup_fuel_level: number | null
    return_fuel_level: number | null
    daily_rate: number
    rental_days: number
    subtotal: number
    discount_amount: number
    discount_reason: string | null
    tax_amount: number
    deposit_amount: number
    total_amount: number
    extras?: Array<{
        name: string
        pricing_type: 'daily' | 'fixed'
        quantity: number
        unit_price: number
        total_price: number
    }>
    remarks: string | null
    reported_issues: string | null
    created_by?: { id: number; first_name: string; last_name: string } | null
    created_at?: string | null
    updated_at?: string | null
}

export type ReservationPayload = {
    car_id: number
    primary_client_id: number
    secondary_client_id?: number | null
    primary_driver_name?: string | null
    primary_driver_phone?: string | null
    primary_driver_cin?: string | null
    primary_driver_passport?: string | null
    primary_driver_license?: string | null
    secondary_driver_name?: string | null
    secondary_driver_phone?: string | null
    secondary_driver_cin?: string | null
    secondary_driver_passport?: string | null
    secondary_driver_license?: string | null
    pickup_location?: string | null
    return_location?: string | null
    pickup_datetime: string
    expected_return_datetime: string
    daily_rate?: number | null
    discount_amount?: number | null
    discount_reason?: string | null
    deposit_amount?: number | null
    remarks?: string | null
    extras?: Array<{ extra_id: number; quantity: number }>
}

export type Expense = {
    id: number
    car: { id: number; registration_number: string } | null
    type: ExpenseType
    title: string
    description: string | null
    amount: number
    vendor: string | null
    start_date: string | null
    due_date: string | null
    paid_date: string | null
    attachment: string | null
    status: ExpenseStatus
    is_overdue: boolean
    created_by: { id: number; first_name: string; last_name: string } | null
    created_at?: string | null
    updated_at?: string | null
}

export type ExpensePayload = {
    car_id: number
    type: ExpenseType
    title: string
    description?: string | null
    amount: number
    vendor?: string | null
    start_date?: string | null
    due_date?: string | null
    paid_date?: string | null
    attachment?: string | null
    status?: 'pending' | 'paid'
}

export type DashboardSummary = {
    period: { from: string; to: string }
    revenue: { paid: number; pending: number; refunded: number; net: number }
    expenses: {
        paid: number
        pending: number
        total: number
        overdue_count: number
    }
    net: number
    reservations: {
        by_status: Record<ReservationStatus, number>
        total: number
        currently_active: number
    }
    fleet: {
        total_cars: number
        by_status: Record<CarStatus, number>
        currently_rented: number
    }
    occupancy: { booked_days: number; available_days: number; rate: number }
}

export type SelectOption<T = number | string> = { value: T; label: string }

export type UserRole = {
    id: number
    name: string
    permissions: string[]
}

export type AgencyBrief = {
    id: number
    name: string
}

export type StaffUser = {
    id: number
    first_name: string
    last_name: string
    full_name: string
    email: string
    phone: string | null
    avatar: string | null
    role: UserRole | null
    agency: AgencyBrief | null
    is_active: boolean
    last_login_at: string | null
    created_at: string | null
}

export type StaffUserPayload = {
    first_name: string
    last_name: string
    email: string
    phone?: string | null
    password?: string | null
    role_id: number
    is_active?: boolean
}

export type Role = {
    id: number
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    permissions: string[]
    users_count?: number
    is_active: boolean
    created_at?: string | null
    updated_at?: string | null
}

export type RolePayload = {
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    permissions: string[]
    is_active?: boolean
}

/** One entry of the config/permissions.php catalog served by RolesController@permissions. */
export type PermissionModule = {
    module: string
    actions: string[]
}
