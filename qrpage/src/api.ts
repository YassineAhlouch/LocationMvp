import type { ContactPayload, LandingCar, ReservationPayload } from './types'
import i18n from './i18n'
/**
 * Public landing bindings — the two unauthenticated endpoints the printed
 * QR codes open, at /api/v1/landing. VITE_API_ROOT lets the page point at a
 * remote API when it is not served from the backend origin.
 */
const API_ROOT = (import.meta.env.VITE_API_ROOT ?? '/api/v1').replace(
    /\/+$/,
    '',
)

/** Carries status + the 422 field messages so the form can render them. */
export class ApiError extends Error {
    readonly status: number
    readonly fieldErrors: Record<string, string>

    constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.fieldErrors = fieldErrors
    }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response

    try {
        response = await fetch(`${API_ROOT}${path}`, {
            headers: { Accept: 'application/json' },
            ...init,
        })
    } catch {
        throw new ApiError(0, i18n.t('api.unreachable'))
    }

    const body: unknown = await response.json().catch(() => null)

    if (!response.ok) {
        if (response.status === 422 && body && typeof body === 'object') {
            const errors = (body as { errors?: Record<string, string[]> }).errors ?? {}

            throw new ApiError(
                422,
                i18n.t('api.invalid_fields'),
                Object.fromEntries(
                    Object.entries(errors).map(([field, messages]) => [
                        field,
                        messages[0],
                    ]),
                ),
            )
        }

        throw new ApiError(
            response.status,
            i18n.t('api.server_error'),
        )
    }

    return body as T
}

/**
 * The fleet a QR advertises: either a saved poster (?qr={slug}) or an
 * ad-hoc slug selection (?cars={slug,slug}).
 */
export function fetchLandingCars(params: {
    qr?: string
    cars?: string[]
}): Promise<LandingCar[]> {
    const search = new URLSearchParams()

    if (params.qr) {
        search.set('qr', params.qr)
    } else if (params.cars && params.cars.length > 0) {
        search.set('cars', params.cars.join(','))
    }

    return request<LandingCar[]>(`/landing/cars?${search.toString()}`)
}

/** Lead creation — staff turn it into a real reservation later. */
export function sendLandingReservation(payload: ReservationPayload): Promise<{
    message: string
    id: number
}> {
    return request('/landing/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
}

/** Agency onboarding lead from the builder home. */
export function sendLandingContact(payload: ContactPayload): Promise<{
    message: string
    id: number
}> {
    return request('/landing/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
}
