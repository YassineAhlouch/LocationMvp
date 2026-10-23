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
    | 'pending'
    | 'confirmed'
    | 'reserved'
    | 'active'
    | 'completed'
    | 'cancelled'
    | 'no_show'
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

/** State of a single payment row (mirrors App\Enums\PaymentRecordStatus). */
export type PaymentRecordStatus = 'paid' | 'pending' | 'refunded'

export type ExtrasPricingType = 'fixed' | 'daily'

/** Extra from the agency catalog (snapshot source for reservation_extras). */
export type Extra = {
    id: number
    name: string
    description: string | null
    pricing_type: ExtrasPricingType
    default_price: number
}

/** Payload to record a payment on the ledger (mirrors the payments API). */
export type PaymentRecordPayload = {
    amount: number
    method: PaymentMethod
    status?: PaymentRecordStatus
    payment_date?: string | null
    reference?: string | null
    notes?: string | null
}

/** A payment row on the ledger (mirrors App\Http\Resources\PaymentResource). */
export type Payment = {
    id: number
    reservation_id: number
    /** Present on the agency-wide ledger; omitted on the per-reservation list. */
    reservation?: {
        id: number
        reservation_number: string
        primary_client: { id: number; full_name: string } | null
    } | null
    payment_date: string | null
    amount: number
    method: PaymentMethod
    reference: string | null
    status: PaymentRecordStatus
    notes: string | null
    created_by?: { id: number; full_name: string } | null
    created_at?: string | null
    updated_at?: string | null
}

/** Totals, per-status counts and daily trend behind the payments page. */
export type PaymentOverview = {
    period: { from: string; to: string }
    totals: { paid: number; pending: number; refunded: number; net: number }
    counts: { paid: number; pending: number; refunded: number; total: number }
    trend: {
        labels: string[]
        paid: number[]
        pending: number[]
        refunded: number[]
    }
}

/** Dry-run quote from the booking engine (mirrors pricing/quote response). */
export type PricingQuote = {
    car_id: number
    pickup_datetime: string
    expected_return_datetime: string
    base_daily_price: number
    daily_rate: number
    deposit_amount: number
    tax_rate: number
    currency: string
    rental_days: number
    rate_subtotal: number
    duration_discount: number
    duration_tier: number | null
    extras_total: number
    subtotal: number
    discount_amount: number
    tax_amount: number
    total_amount: number
}

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

/**
 * Lifetime summary, 12-month revenue/expense trend and the latest records
 * behind the car details overview (CarQueryService::overview).
 */
export type CarOverview = {
    stats: {
        reservations: {
            total: number
            by_status: Partial<Record<ReservationStatus, number>>
            active: number
            upcoming: number
            booked_days: number
            last_pickup_at: string | null
        }
        revenue: {
            paid: number
            pending: number
            refunded: number
            net: number
        }
        expenses: {
            paid: number
            pending: number
            total: number
            count: number
            overdue_count: number
            by_type: Array<{ type: ExpenseType; amount: number; count: number }>
        }
        net: number
        timeline: {
            labels: string[]
            revenue: number[]
            expenses: number[]
        }
    }
    recent_reservations: Reservation[]
    recent_expenses: Expense[]
}

/**
 * One normalised entry in a car's merged audit trail
 * (CarQueryService::history): the vehicle's own activity or a business
 * change recorded against one of its reservations.
 */
export type CarHistoryEntry =
    | {
          id: string
          source: 'car'
          action: string
          description: string | null
          user: { id: number; full_name: string } | null
          created_at: string | null
      }
    | {
          id: string
          source: 'reservation'
          reservation: {
              id: number
              reservation_number: string
          } | null
          change_type: ReservationChangeType
          field_name: string
          old_value: string | null
          new_value: string | null
          reason: string | null
          user: { id: number; full_name: string } | null
          created_at: string | null
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
        full_name: string
        phone: string | null
    } | null
    secondary_client: {
        id: number
        full_name: string
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
    /** Car condition snapshots; the pickup is taken on activation, the return on completion. */
    inspections?: ReservationInspection[]
    created_by?: { id: number; first_name: string; last_name: string } | null
    created_at?: string | null
    updated_at?: string | null
}

/** One blocking booking returned by the car-availability probe. */
export type CarAvailabilityConflict = {
    reservation_number: string
    status: ReservationStatus
    pickup_datetime: string | null
    expected_return_datetime: string | null
}

/**
 * Which cars a requested window is already holding. A car is absent from
 * both maps while it is free for the whole window.
 */
export type CarAvailability = {
    unavailable_car_ids: number[]
    conflicts: Record<number, CarAvailabilityConflict[]>
}

export type ReservationInspectionType = 'pickup' | 'return'

/** Car areas photographed and checked during an inspection. */
export type InspectionArea =
    | 'front'
    | 'rear'
    | 'left'
    | 'right'
    | 'interior'
    | 'dashboard'

export type InspectionCondition = 'ok' | 'minor' | 'damage'

export type ReservationInspectionArea = {
    condition: InspectionCondition
    notes?: string | null
}

export type ReservationInspectionPhoto = {
    id: number
    area: InspectionArea
    image: string
    notes: string | null
}

/** Car condition snapshot taken at handover (pickup) or on return (mirrors ReservationInspectionResource). */
export type ReservationInspection = {
    id: number
    type: ReservationInspectionType
    mileage: number | null
    fuel_level: number | null
    condition_notes: string | null
    areas: Partial<Record<InspectionArea, ReservationInspectionArea>>
    photos: ReservationInspectionPhoto[]
    inspector: { id: number; full_name: string } | null
    inspected_at: string | null
}

/** Lightweight reservation projection for the calendar (ReservationCalendarResource). */
export type ReservationCalendarItem = {
    id: number
    reservation_number: string
    status: ReservationStatus
    payment_status: PaymentStatus
    pickup_datetime: string
    expected_return_datetime: string
    rental_days: number
    total_amount: number
    car: { id: number; registration_number: string } | null
    primary_client: { id: number; full_name: string } | null
}

export type ReservationChangeType =
    | 'creation'
    | 'status_change'
    | 'extension'
    | 'discount'
    | 'date_change'
    | 'manual_edit'
    | 'pricing_update'
    | 'payment'

/** Append-only audit entry for a reservation (app/Resources/ReservationChangeResource). */
export type ReservationChange = {
    id: number
    field_name: string
    change_type: ReservationChangeType
    old_value: string | null
    new_value: string | null
    reason: string | null
    created_by: { id: number; full_name: string } | null
    created_at: string
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
    /**
     * Lifecycle status. On create only the startup statuses (pending default,
     * confirmed, reserved) are legal; on edit any state-machine target is
     * accepted and enforced server-side.
     */
    status?: ReservationStatus
    /** Audit reason accompanying a status change made from the edit form. */
    status_reason?: string | null
    /** Optional first payments recorded on the ledger with the reservation. */
    payment?: {
        amount: number
        method: PaymentMethod
        status?: PaymentRecordStatus
        payment_date?: string
        reference?: string | null
        notes?: string | null
    }
    /** Optional first payments (several instalments allowed). */
    payments?: PaymentRecordPayload[]
    extras?: Array<
        | { extra_id: number; quantity: number }
        | {
              name: string
              description?: string | null
              pricing_type: ExtrasPricingType
              quantity: number
              unit_price: number
          }
    >
}

/** Stable key mapping an invoice layout to its renderer. */
export type InvoiceTemplateSlug = 'classic' | 'atlas'

/** Invoice/contract layout an agency is assigned (App\Models\InvoiceTemplate). */
export type InvoiceTemplate = {
    id: number
    slug: InvoiceTemplateSlug
    name: string
    is_active: boolean
}

/** A unit an agency prices and invoices in (App\Models\Currency). */
export type Currency = {
    id: number
    code: string
    name: string
    symbol: string
    decimals: number
}

/** Agency letterhead + mileage policy (mirrors App\Http\Resources\AgencyResource). */
export type Agency = {
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
    invoice_template: InvoiceTemplate
    currency: Currency | null
}

/**
 * Platform subscription standing for the signed-in agency (mirrors the
 * /v1/subscription payload). `locked` means an invoice is past due and the
 * workspace is read-only until it is paid.
 */
export type Subscription = {
    locked: boolean
    outstanding_amount: number
    currency: {
        code: string
        symbol: string
        decimals: number
    } | null
    next_due_date: string | null
    invoices: SubscriptionInvoice[]
}

export type SubscriptionInvoice = {
    id: number
    amount: number
    period: string | null
    due_date: string | null
    paid_at: string | null
    status: 'pending' | 'overdue' | 'paid'
    reference: string | null
}

/** Vehicle identity/specs printed on the contract (distinct from Reservation.car). */
export type ReservationContractCar = {
    id: number | null
    registration_number: string | null
    brand: string | null
    model: string | null
    category: string | null
    year: number | null
    color: string | null
    transmission_type: TransmissionType | null
    fuel_type: FuelType | null
}

/**
 * Printable rental contract/invoice payload from
 * GET /v1/reservations/{id}/contract.
 */
export type ReservationContract = {
    reservation: Reservation
    agency: Agency | null
    car: ReservationContractCar | null
    primary_client: Client | null
    secondary_client: Client | null
    payments: Payment[]
    mileage: {
        distance: number | null
        allowance: number
        excess: number
        extra_fee: number
        daily_allowance: number
        fee_per_km: number
    }
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
    outstanding: { amount: number; reservations: number }
    today: { pickups: number; returns: number }
    attention: {
        total: number
        maintenance: number
        service_overdue: number
    }
    new_clients: number
}

export type DashboardTimeline = {
    months: string[]
    revenue: number[]
    expenses: number[]
}

// ---- Dashboard KPI drill-downs -------------------------------------------

/**
 * Slugs of the dashboard cards and of their drill-down pages. Mirrored by
 * the backend's App\Enums\KpiMetric — change both together.
 */
export type KpiMetricKey =
    | 'net-revenue'
    | 'expenses'
    | 'reservations'
    | 'occupancy'
    | 'outstanding'
    | 'today'
    | 'fleet-attention'
    | 'new-clients'

/** The segments behind a KPI: by method, type, booking status, source… */
export type KpiSegment = { key: string; value: number; count?: number }

/** A zero-filled day-by-day series (counts, not amounts). */
export type KpiSeries = { labels: string[]; count: number[] }

export type KpiPaymentRow = {
    id: number
    payment_date: string
    amount: number
    method: PaymentMethod | null
    status: PaymentRecordStatus
    reservation_number: string | null
    client: string | null
}

export type KpiExpenseRow = {
    id: number
    title: string | null
    type: ExpenseType | null
    status: ExpenseStatus | null
    amount: number
    due_date: string | null
    paid_date: string | null
    period_date: string | null
    car: string | null
}

export type KpiReservationRow = {
    id: number
    reservation_number: string | null
    status: ReservationStatus | null
    payment_status: PaymentStatus | null
    pickup_datetime: string | null
    expected_return_datetime: string | null
    total_amount: number
    car: string | null
    client: string | null
}

export type KpiOutstandingRow = KpiReservationRow & {
    paid_amount: number
    due_amount: number
}

export type KpiHandoverRow = KpiReservationRow & { kind: 'pickup' | 'return' }

export type KpiFleetRow = CarReport & {
    available_days: number
    utilization: number
}

export type KpiAttentionRow = {
    car_id: number
    registration_number: string
    brand: string | null
    model: string | null
    year: number | null
    daily_price: number
    status: CarStatus | null
    in_maintenance: boolean
    service_overdue: boolean
    current_mileage: number | null
    next_service_mileage: number | null
    service_gap: number
    last_maintenance_at: string | null
}

export type KpiClientRow = {
    id: number
    full_name: string | null
    phone: string | null
    email: string | null
    city: string | null
    source: ClientSource | null
    status: ClientStatus | null
    is_active: boolean
    reservations_count: number
    created_at: string | null
}

/** Fields every drill-down payload shares. */
type KpiPayload<M extends KpiMetricKey, H> = {
    metric: M
    period: { from: string; to: string }
    headline: H
    breakdown: KpiSegment[]
    rows_total: number
}

export type NetRevenueKpi = KpiPayload<
    'net-revenue',
    { value: number; paid: number; pending: number; refunded: number }
> & {
    trend: { labels: string[]; paid: number[]; pending: number[]; refunded: number[] }
    rows: KpiPaymentRow[]
}

export type ExpensesKpi = KpiPayload<
    'expenses',
    { value: number; paid: number; pending: number; overdue_count: number }
> & {
    trend: { labels: string[]; paid: number[]; pending: number[] }
    rows: KpiExpenseRow[]
}

export type ReservationsKpi = KpiPayload<
    'reservations',
    { value: number; currently_active: number }
> & {
    trend: KpiSeries
    rows: KpiReservationRow[]
}

export type OccupancyKpi = KpiPayload<
    'occupancy',
    {
        value: number
        booked_days: number
        available_days: number
        total_cars: number
    }
> & {
    trend: KpiSeries
    rows: KpiFleetRow[]
}

export type OutstandingKpi = KpiPayload<
    'outstanding',
    { value: number; reservations: number }
> & {
    rows: KpiOutstandingRow[]
}

export type TodayKpi = KpiPayload<
    'today',
    { value: number; pickups: number; returns: number }
> & {
    rows: KpiHandoverRow[]
}

export type FleetAttentionKpi = KpiPayload<
    'fleet-attention',
    { value: number; maintenance: number; service_overdue: number }
> & {
    rows: KpiAttentionRow[]
}

export type NewClientsKpi = KpiPayload<'new-clients', { value: number }> & {
    trend: KpiSeries
    rows: KpiClientRow[]
}

export type KpiDetail =
    | NetRevenueKpi
    | ExpensesKpi
    | ReservationsKpi
    | OccupancyKpi
    | OutstandingKpi
    | TodayKpi
    | FleetAttentionKpi
    | NewClientsKpi

/** The payload behind one card, narrowed to its metric. */
export type KpiDetailOf<K extends KpiMetricKey> = Extract<KpiDetail, { metric: K }>

export type CarReport = {
    car_id: number
    registration_number: string
    brand: string | null
    model: string | null
    image: string | null
    revenue: number
    expenses: number
    margin: number
    booked_days: number
}

export type ClientReport = {
    client_id: number
    full_name: string | null
    phone: string | null
    email: string | null
    status: ClientStatus | null
    reservations: number
    booked_days: number
    revenue: number
    average_spend: number
    last_rental: string | null
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

// ---- Car financing & profitability ---------------------------------------

export type InstallmentStatus = 'pending' | 'paid' | 'overdue'

export type CarInstallment = {
    id: number
    financing_id: number
    car_id: number
    installment_number: number
    due_date: string | null
    amount: number
    paid_amount: number | null
    paid_date: string | null
    status: InstallmentStatus
    is_overdue: boolean
    reference: string | null
    created_at?: string | null
    updated_at?: string | null
}

export type CarFinancing = {
    id: number
    car_id: number
    purchase_date: string | null
    purchase_price: number
    down_payment: number
    financed_amount: number
    installment_amount: number
    installments_count: number
    first_due_date: string | null
    lender: string | null
    notes: string | null
    installments?: CarInstallment[]
    created_at?: string | null
    updated_at?: string | null
}

export type CarFinancingPayload = {
    purchase_date: string
    purchase_price: number
    down_payment: number
    financed_amount?: number | null
    installment_amount: number
    installments_count: number
    first_due_date: string
    lender?: string | null
    notes?: string | null
}

export type CarStatisticsKpis = {
    total_revenue: number
    total_expenses: number
    installments_paid: number
    down_payment: number
    purchase_price: number
    operating_profit: number
    net_cash_position: number
    days_in_service: number
    profit_per_day: number
    utilization_rate: number
    payback_percent: number
    is_profitable: boolean
    is_paid_off: boolean
    remaining_to_payback: number
}

export type CarFinancingProgress = {
    has_financing: boolean
    purchase_date: string | null
    purchase_price: number
    down_payment: number
    financed_amount: number
    installment_amount: number
    installments_count: number
    installments_paid_count: number
    installments_paid_amount: number
    installments_remaining_amount: number
    progress_percent: number
    payback_percent: number
    lender: string | null
    next_installment: {
        id: number
        installment_number: number
        due_date: string | null
        amount: number
        status: InstallmentStatus
    } | null
}

export type CarMonthlySeriesPoint = {
    month: string
    revenue: number
    expenses: number
    installments: number
    net: number
}

export type CarUtilization = {
    days_in_service: number
    available_days: number
    rented_days: number
    maintenance_days: number
    idle_days: number
    rate: number
}

export type CarExpensesByType = {
    type: ExpenseType
    amount: number
    paid: number
    count: number
}

/** Payload of GET /api/v1/cars/{car}/statistics (CarStatisticsService). */
export type CarStatistics = {
    period: { months: number; from: string; to: string }
    kpis: CarStatisticsKpis
    financing_progress: CarFinancingProgress
    monthly_series: CarMonthlySeriesPoint[]
    utilization: CarUtilization
    expenses_by_type: CarExpensesByType[]
    financing: CarFinancing | null
    installments: CarInstallment[]
}

/** One append-only audit row (GET /api/v1/activity-logs). */
export type ActivityLog = {
    id: number
    module: string
    action: string
    entity_type: string
    entity_id: number
    description: string | null
    old_values: Record<string, unknown> | null
    new_values: Record<string, unknown> | null
    ip_address: string | null
    user_agent: string | null
    user: {
        id: number | null
        full_name: string | null
    }
    created_at: string | null
}

/** The `data` JSON of an in-app notification (see NotificationDispatcher). */
export type AppNotificationData = {
    title?: string
    body?: string
    sent_by?: {
        id: number
        first_name: string
        last_name: string
    }
    reservation_id?: number
    reservation_number?: string
    amount?: number
    method?: string | null
}

/** One inbox row (GET /api/v1/notifications). */
export type AppNotification = {
    id: string
    type: string
    data: AppNotificationData
    read: boolean
    read_at: string | null
    created_at: string | null
}

/** POST /api/v1/notifications — exactly one audience shape must be sent. */
export type AppNotificationPayload = {
    title: string
    body: string
    send_to_all?: boolean
    user_ids?: number[]
    role_ids?: number[]
}

export type CarFinancingPayloadUpdate = Partial<CarFinancingPayload>

export type MarkInstallmentPaidPayload = {
    paid_date?: string
    reference?: string | null
    paid_amount?: number | null
}
