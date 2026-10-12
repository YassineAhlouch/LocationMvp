import type { AxiosError } from 'axios'

type LaravelErrorBody = {
    message?: string
    errors?: Record<string, string[]>
}

/**
 * Turns an axios error from the Laravel API into a single, human-readable
 * message: the first validation error when present, otherwise the server
 * message, otherwise the fallback.
 */
export function apiErrorMessage(
    error: unknown,
    fallback = 'Something went wrong. Please try again.',
): string {
    const axiosError = error as AxiosError<LaravelErrorBody>
    const body = axiosError?.response?.data

    if (body?.errors) {
        const first = Object.values(body.errors)[0]
        if (first?.[0]) {
            return first[0]
        }
    }

    return body?.message || axiosError?.message || fallback
}

export default apiErrorMessage
