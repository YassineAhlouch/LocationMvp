import i18n from '@/locales'

/**
 * Public landing bindings — the unauthenticated agency-onboarding lead
 * endpoint at /api/v1/landing/contacts (LandingController::storeContact —
 * throttled, staff contact the agency back). VITE_API_ROOT lets the page
 * point at a remote API when it is not served from the backend origin.
 */
const API_ROOT = (import.meta.env.VITE_API_ROOT ?? '/api/v1').replace(
    /\/+$/,
    '',
)

/** Carries status + the 422 field messages so the form can render them. */
export class ApiError extends Error {
    readonly status: number
    readonly fieldErrors: Record<string, string>

    constructor(
        status: number,
        message: string,
        fieldErrors: Record<string, string> = {},
    ) {
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
        throw new ApiError(
            0,
            i18n.t('landing.contactPage.errors.unreachable') as string,
        )
    }

    const body: unknown = await response.json().catch(() => null)

    if (!response.ok) {
        if (response.status === 422 && body && typeof body === 'object') {
            const errors =
                (body as { errors?: Record<string, string[]> }).errors ?? {}

            throw new ApiError(
                422,
                i18n.t('landing.contactPage.errors.invalidFields') as string,
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
            i18n.t('landing.contactPage.errors.server') as string,
        )
    }

    return body as T
}

/** Agency onboarding lead — staff turn it into a real contact later. */
export function sendLandingContact(payload: {
    full_name: string
    agency_name: string | null
    phone: string
    email: string | null
    message: string | null
}): Promise<{
    message: string
    id: number
}> {
    return request('/landing/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
}
