export type SignInCredential = {
    email: string
    password: string
    device_name?: string
}

export type SignInResponse = {
    token: string
    expires_at: string
    user: User
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

/**
 * Mirrors the Laravel UserResource returned by /auth/login, /auth/me and
 * the users module. Fields are optional because the template constructs
 * bare user objects and merges partial payloads from several sources
 * (mock auth, firebase OAuth, localStorage rehydration).
 */
export type User = {
    id?: number
    first_name?: string | null
    last_name?: string | null
    full_name?: string | null
    email?: string | null
    phone?: string | null
    avatar?: string | null
    is_active?: boolean
    role?: {
        id: number
        name: string
        permissions: string[]
    } | null
    agency?: {
        id: number
        name: string
    } | null
    last_login_at?: string | null
    created_at?: string | null

    // Compatibility fields the template renders in the profile dropdown.
    userId?: string | null
    userName?: string | null
    authority?: string[]
}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}