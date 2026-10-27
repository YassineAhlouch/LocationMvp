/**
 * URLs printed inside every QR code. The public landing page (built later)
 * shows either the saved poster behind its slug — /r/{slug} — or an ad-hoc
 * selection, read with GET /api/v1/landing/cars?cars=slug,slug — vehicle ids
 * never appear in printed links.
 */

/** Override per environment when the landing is served elsewhere. */
const LANDING_BASE_URL =
    (import.meta.env as Record<string, string | undefined>).VITE_LANDING_URL ??
    window.location.origin

/**
 * Mirror of the backend slug derivation (ASCII slug, dash-separated) so the
 * create form previews the link a poster will get from its name.
 */
export const slugifyName = (name: string): string =>
    name
        .trim()
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

/** The landing page of a saved poster: /r/{slug}. Edited cars keep the link. */
export const buildQrLandingUrl = (qrSlug: string): string =>
    `${LANDING_BASE_URL}/r/${qrSlug}`

/** Ad-hoc selection: the query carries the selected vehicles' slugs. */
export const buildSelectionLandingUrl = (carSlugs: string[]): string => {
    if (carSlugs.length === 0) {
        return LANDING_BASE_URL
    }

    return `${LANDING_BASE_URL}/r?cars=${carSlugs.join(',')}`
}
