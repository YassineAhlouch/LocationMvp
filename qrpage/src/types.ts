/**
 * Public landing contracts — mirrors app/Http/Resources/LandingCarResource
 * and the StoreLandingReservationRequest validation. Contact-safe slices
 * only: no plates, no VIN.
 */

export type LandingAgency = {
    id: number
    name: string
    currency_code: string
    currency_symbol: string
}

export type LandingCar = {
    id: number
    slug: string | null
    brand: string | null
    model: string | null
    category: string | null
    year: number | null
    color: string | null
    seats_count: number | null
    doors_count: number | null
    transmission_type: 'manual' | 'automatic' | null
    fuel_type: 'diesel' | 'petrol' | 'hybrid' | 'electric' | null
    daily_price: number
    cover_image: string | null
    agency: LandingAgency
}

export type ReservationPayload = {
    car_id: number
    full_name: string
    phone: string
    email?: string | null
    pickup_datetime?: string | null
    expected_return_datetime?: string | null
    message?: string | null
}

/** "Open my agency account" lead from the builder home. */
export type ContactPayload = {
    full_name: string
    phone: string
    agency_name?: string | null
    email?: string | null
    message?: string | null
}
