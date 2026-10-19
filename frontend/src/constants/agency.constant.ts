/**
 * SWR key for the signed-in user's agency. Shared by the hydrator (which keeps
 * the displayed currency in sync) and the currency settings screen (which
 * revalidates it after a change), so both hit the same cache entry.
 */
export const AGENCY_SWR_KEY = '/v1/agency'

/**
 * Fallback used before the agency has loaded, or when the platform has not
 * assigned one yet: the Moroccan dirham, the app's historical unit.
 */
export const DEFAULT_CURRENCY = {
    id: 0,
    code: 'MAD',
    name: 'Moroccan Dirham',
    symbol: 'DH',
    decimals: 2,
}
