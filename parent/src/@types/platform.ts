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
    users_count?: number
    cars_count?: number
    created_at: string | null
    updated_at: string | null
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
