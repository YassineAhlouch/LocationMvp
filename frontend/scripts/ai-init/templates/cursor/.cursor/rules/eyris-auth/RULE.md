---
description: Eyris authentication system — useAuth hook, AuthProvider, sign-in/sign-out flow, token storage, route protection, AuthService API.
alwaysApply: false
---

# Eyris — Authentication System

## Overview

Authentication is managed by `AuthProvider` which wraps the entire app and exposes auth state through React context. The `useAuth()` hook is the primary interface for components.

---

## useAuth() Hook

```typescript
import useAuth from '@/auth/useAuth'

const { authenticated, user, signIn, signUp, signOut, oAuthSignIn } = useAuth()
```

### Return type

```typescript
type Auth = {
    authenticated: boolean
    user: User
    signIn: (values: SignInCredential) => AuthResult
    signUp: (values: SignUpCredential) => AuthResult
    signOut: () => void
    oAuthSignIn: (callback: (payload: OauthSignInCallbackPayload) => void) => void
}
```

### Key types (`src/@types/auth.ts`)

```typescript
type SignInCredential = {
    email: string
    password: string
}

type SignUpCredential = {
    userName: string
    email: string
    password: string
}

type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    email?: string | null
    authority?: string[]
}

type Token = {
    accessToken: string
    refereshToken?: string
}

type AuthResult = Promise<{
    status: 'success' | 'failed' | ''
    message: string
}>
```

---

## Sign-In Flow

1. Component calls `signIn({ email, password })`
2. `AuthProvider` calls `apiSignIn()` from `AuthService`
3. On success: stores token via `setToken()`, sets `sessionSignedIn(true)`, optionally sets user
4. Redirects to `authenticatedEntryPath` (or a redirect URL from query params)

```typescript
// In a sign-in form component
const { signIn } = useAuth()

const onSubmit = async (values: SignInCredential) => {
    const result = await signIn(values)
    if (result.status === 'failed') {
        setError(result.message)
    }
    // On success, AuthProvider handles redirect automatically
}
```

## Sign-Out Flow

1. Component calls `signOut()`
2. `AuthProvider` calls `apiSignOut()` from `AuthService`
3. Clears token, clears user, sets `sessionSignedIn(false)`
4. Navigates to `unAuthenticatedEntryPath` (default: `/sign-in`)

---

## Token Storage

Controlled by `accessTokenPersistStrategy` in `src/configs/app.config.ts`:

| Strategy | Storage | Use case |
|---|---|---|
| `'localStorage'` | `localStorage` | Default — persists across tabs and sessions |
| `'sessionStorage'` | `sessionStorage` | Cleared when browser tab closes |
| `'cookies'` | HTTP cookies | Server-readable, better for SSR |

The token is managed through `useToken()` from `src/store/authStore.ts`.

---

## Route Protection

Three route access types control what users can see:

| Component | Access type | Behavior |
|---|---|---|
| `ProtectedRoute` | `'protected'` | Requires authentication. Redirects to sign-in if not authenticated. |
| `AuthOnlyRoute` | `'auth-only'` | Only accessible when NOT authenticated. Redirects to `authenticatedEntryPath` if signed in. |
| `PublicRoute` | `'public'` | No restriction — accessible to all users. |

### Authority Guard

On top of authentication, `AuthorityGuard` checks role-based access:

```typescript
// In route config
{
    key: 'admin-panel',
    path: '/admin',
    component: lazy(() => import('@/views/admin/AdminPanel')),
    authority: ['admin', 'superAdmin'],  // only these roles can access
    access: 'protected',
}
```

- **Empty `authority` array** `[]` — any authenticated user can access
- **Populated array** — user's `authority` must include at least one matching role
- **No match** — redirects to `/access-denied`

---

## AuthService API

All auth API calls are in `src/services/AuthService.ts`:

| Function | Purpose |
|---|---|
| `apiSignIn(data: SignInCredential)` | Authenticate user, returns token + user |
| `apiSignUp(data: SignUpCredential)` | Register new user, returns token + user |
| `apiSignOut()` | Invalidate session |
| `apiForgotPassword(data: ForgotPassword)` | Request password reset email |
| `apiResetPassword(data: ResetPassword)` | Set new password |

Endpoints are defined in `src/configs/endpoint.config.ts`.

---

## Auth Views

Pre-built auth pages in `src/views/auth/`:
- `/sign-in` — email/password sign-in
- `/sign-up` — registration
- `/forgot-password` — password reset request
- `/reset-password` — set new password
- `/otp-verification` — OTP code entry
