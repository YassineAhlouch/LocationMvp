/**
 * SWR key for the signed-in staff member's own profile. The settings page
 * reads it and revalidates it after a save, so the store and the form never
 * drift from the server.
 */
export const PROFILE_SWR_KEY = '/v1/profile'
