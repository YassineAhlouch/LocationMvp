/**
 * SWR key for the agency's platform subscription standing. Shared by the
 * banner (which reads it) and the HTTP error interceptor (which revalidates
 * it after a 402 payment_required), so both stay in sync.
 */
export const SUBSCRIPTION_SWR_KEY = '/v1/subscription'
