# Eyris — Project Overview

Eyris is a modern React admin template built with TypeScript, Vite, and Tailwind CSS. It provides a comprehensive foundation for building admin dashboards and management interfaces with a focus on modularity, robust architecture, and developer experience.

## Tech Stack

| Layer | Library | Version | Notes |
|---|---|---|---|
| Framework | React | 19 | Concurrent features, `use()` hook |
| Language | TypeScript | 5+ | Strict mode throughout |
| Build | Vite | 7 | Path alias `@/` → `src/` |
| Styling | Tailwind CSS | 4 | Custom design tokens via CSS custom properties |
| Routing | React Router | 7 | Client-side, lazy-loaded routes |
| Client state | Zustand | 5 | Client-side UI state only — never server data |
| Server data | SWR | 2 | All API/server data fetching and caching |
| Forms | React Hook Form + Zod | latest | Schema-validated forms |
| Tables | TanStack React Table | 8 | Sorting, filtering, pagination |
| Charts | Recharts | 3 | All charting and data visualization |
| Animation | Framer Motion (motion) | 12 | Transitions and micro-interactions |
| Rich text | TipTap | 3 | Extensible rich text editor |
| Date | dayjs | 1 | Date formatting and arithmetic |
| HTTP | Axios | 1 | With mock adapter for development |
| i18n | react-i18next | 16 | Multi-language + RTL support |
| DnD | DND Kit | 6 | Drag and drop |
| Icons | Self-built library | — | SVG icons under `src/icons/` |

## Folder Structure

```
src/
├── @types/                 TypeScript type definitions
│     auth.ts               SignInCredential, User, Token, AuthResult
│     common.tsx            CommonProps, TypeAttributes (ControlSize, Status, etc.)
│     navigation.ts         NavigationTree, nav item types
│     routes.tsx            Route, Meta, RouteAccessType
│     theme.ts              ThemeConfig, LayoutType
│
├── assets/
│     styles/               Tailwind entry + CSS custom properties (design tokens)
│
├── auth/
│     AuthContext.ts         React context: Auth type definition
│     AuthProvider.tsx       Provides signIn, signUp, signOut, user, authenticated
│     useAuth.ts             Hook — useAuth() → { user, authenticated, signIn, signUp, signOut, oAuthSignIn }
│
├── components/
│     ui/                    Core UI library (Button, Input, Select, Dialog, Table, Card, Badge, …)
│     shared/                Higher-level: DataTable, Chart, RichTextEditor, EmptyState, ConfirmDialog, Loading, …
│     template/              App shell: Header, SideNav, Footer, ThemeConfigurator, LanguageSelector
│     layouts/               AuthLayout, PostLoginLayout
│     route/                 AllRoutes, ProtectedRoute, AuthOnlyRoute, PublicRoute, AuthorityGuard
│     svg/                   SVG illustration components
│
├── configs/
│     app.config.ts          API prefix, entry paths, locale, mock toggle, token strategy
│     theme.config.ts        Default layout type, control size, direction, mode
│     routes.config/         All route definitions with authority + meta
│     navigation.config/     Sidebar navigation tree
│     endpoint.config.ts     API endpoint paths
│     preset-theme-schema.config.ts   Theme presets
│
├── constants/               Application-wide constants (camelCase.constant.ts)
│
├── icons/                   Self-built SVG icon library
│
├── locales/                 i18n translation files, organised by language
│
├── mock/
│     MockAdapter.ts         Axios mock adapter (enabled via app.config.ts enableMock)
│     fakeApi/               Per-feature mock handlers
│     data/                  Static mock data objects
│
├── services/
│     AuthService.ts         apiSignIn, apiSignUp, apiSignOut, apiForgotPassword, apiResetPassword
│     ApiService.ts          Axios instance + interceptors
│     CommonService.ts       Shared API utilities
│     OAuthServices.ts       OAuth provider integration
│
├── store/
│     authStore.ts           User session, token, signedIn flag
│     themeStore.ts          Layout type, mode (light/dark), direction (ltr/rtl), schema
│     localeStore.ts         Active language
│     routeKeyStore.ts       Current route key for nav highlight
│
├── utils/                   Pure utilities and custom hooks (camelCase.ts)
│
└── views/                   Page components — all lazy-loaded via React.lazy
      auth/                  SignIn, SignUp, ForgotPassword, ResetPassword, OtpVerification
      Home.tsx               Home page
      …                      Feature pages added by developer
```

## App Configuration

`src/configs/app.config.ts` — the central configuration file. Change these when setting up a real backend:

```typescript
const appConfig: AppConfig = {
    apiPrefix: '/api',                          // base path for all API calls
    authenticatedEntryPath: '/home',            // redirect here after sign-in
    unAuthenticatedEntryPath: '/sign-in',       // redirect here if not authenticated
    locale: 'en',
    accessTokenPersistStrategy: 'localStorage', // 'localStorage' | 'sessionStorage' | 'cookies'
    enableMock: true,                           // set false to hit a real API
    activeNavTranslation: true,
}
```

## Mock System

When `enableMock: true`, Axios requests are intercepted by `MockAdapter.ts` and served from `src/mock/fakeApi/`. Mock responses match real API shape. To connect to a real backend:

1. Set `enableMock: false` in `app.config.ts`
2. Point `apiPrefix` at your real API server
3. Update endpoint paths in `endpoint.config.ts`

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase.tsx | `UserTable.tsx` |
| Hooks | camelCase.ts with `use` prefix | `useUserData.ts` |
| Utilities | camelCase.ts | `formatDate.ts` |
| Types | camelCase.ts in `@types/` | `user.ts` |
| Constants | camelCase.constant.ts | `status.constant.ts` |
| Configs | camelCase.config.ts | `app.config.ts` |
| Store slices | camelCase + Store suffix | `filterStore.ts` |
| Services | PascalCase + Service suffix | `UserService.ts` |

---

# Eyris — Data Fetching & State Management

## The Core Rule

**SWR fetches server data. Zustand holds client UI state. Never mix them.**

| Concern | Tool | Examples |
|---|---|---|
| Server / API data | SWR | user list, order details, dashboard stats |
| UI state (client-only) | Zustand | sidebar open/closed, active tab, selected filters, theme |
| Component-local state | useState | form input, toggle, modal open |
| Form state | React Hook Form | form values, validation, submission |
| Derived / computed | `useMemo` in component | filtered list = SWR data + Zustand filters |

---

## SWR — Server Data

### Basic usage

```typescript
import useSWR from 'swr'
import { apiGetDashboardData } from '@/services/DataService'
import Loading from '@/components/shared/Loading'

const Dashboard = () => {
    const { data, error, isLoading, mutate } = useSWR(
        '/api/dashboard',
        apiGetDashboardData
    )

    if (error) return <div>Failed to load</div>

    return (
        <Loading loading={isLoading}>
            <div>{data?.value}</div>
        </Loading>
    )
}
```

### When to use SWR

- Any data that comes from a server / API
- Data that needs caching and automatic revalidation
- Data shared across multiple components (SWR deduplicates by key)
- Data that should refresh on window focus or reconnect

### SWR options worth knowing

```typescript
useSWR('/api/users', fetcher, {
    revalidateOnFocus: false,     // don't re-fetch when window regains focus
    refreshInterval: 30_000,      // poll every 30s
    revalidateOnMount: true,      // always fetch on first mount
    dedupingInterval: 2_000,      // suppress duplicate requests within 2s
})
```

### Optimistic updates with mutate

```typescript
const { data, mutate } = useSWR<User[]>('/api/users', apiGetUsers)

const handleDelete = async (id: string) => {
    // Update cache immediately (optimistic)
    mutate(data?.filter((u) => u.id !== id), false)
    // Then confirm with server
    await apiDeleteUser(id)
    // Revalidate to sync with server
    mutate()
}
```

---

## Custom SWR Hooks — Required for Shared Data

When multiple components need the same server data, **create a custom hook**. SWR deduplicates by key — one network request regardless of how many components call the hook.

```typescript
// src/utils/hooks/useCustomers.ts
import useSWR from 'swr'
import { apiGetCustomers } from '@/services/CustomerService'
import type { Customer } from '@/@types/crm'

const useCustomers = () => {
    const { data, error, isLoading, mutate } = useSWR<Customer[]>(
        '/crm/customers',
        apiGetCustomers,
        { revalidateOnFocus: false }
    )

    return {
        customers: data ?? [],
        isLoading,
        error,
        refresh: mutate,
    }
}

export default useCustomers
```

Usage in multiple components — no duplicate requests:

```typescript
// CustomerTable.tsx — fetches once
const CustomerTable = () => {
    const { customers, isLoading } = useCustomers()
    return (
        <Loading loading={isLoading}>
            <DataTable columns={columns} data={customers} />
        </Loading>
    )
}

// CustomerCount.tsx — reuses same cache, no second request
const CustomerCount = () => {
    const { customers } = useCustomers()
    return <span>{customers.length}</span>
}
```

---

## Zustand — Client UI State Only

Zustand stores are **only** for state that:
- Never comes from or syncs with the server
- Needs to be shared across components (otherwise use local `useState`)
- Persists through navigation (theme, locale, sidebar state)

### Existing stores in this project

`src/store/`:
- `authStore` — user session, token, signedIn flag
- `themeStore` — layout type, mode (light/dark), direction (ltr/rtl), schema
- `localeStore` — active language
- `routeKeyStore` — current route key for nav highlight

### Creating a new store

```typescript
// src/store/filterStore.ts
import { create } from 'zustand'

interface FilterState {
    search: string
    status: string
    setSearch: (v: string) => void
    setStatus: (v: string) => void
    reset: () => void
}

const useFilterStore = create<FilterState>((set) => ({
    search: '',
    status: 'all',
    setSearch: (search) => set({ search }),
    setStatus: (status) => set({ status }),
    reset: () => set({ search: '', status: 'all' }),
}))

export default useFilterStore
```

---

## Combined Pattern — SWR + Zustand + useMemo

This is the standard pattern for list views with client-side filtering:

```typescript
import useSWR from 'swr'
import { useMemo } from 'react'
import { apiGetOrders } from '@/services/OrderService'
import useFilterStore from '@/store/filterStore'
import Loading from '@/components/shared/Loading'

const OrdersView = () => {
    // Server data via SWR
    const { data: orders, isLoading } = useSWR('/api/orders', apiGetOrders)

    // UI state via Zustand
    const { search, status } = useFilterStore()

    // Derived state via useMemo — never store derived data in Zustand
    const filtered = useMemo(() => {
        if (!orders) return []
        return orders.filter((o) => {
            const matchSearch = o.ref.toLowerCase().includes(search.toLowerCase())
            const matchStatus = status === 'all' || o.status === status
            return matchSearch && matchStatus
        })
    }, [orders, search, status])

    return (
        <Loading loading={isLoading}>
            <FilterBar />
            <OrderTable data={filtered} />
        </Loading>
    )
}
```

---

## Anti-Patterns — Never Do These

### 1. Never fetch in a Zustand store

```typescript
// WRONG
const useOrderStore = create((set) => ({
    orders: [],
    fetch: async () => {
        const data = await apiGetOrders()   // don't do this
        set({ orders: data })
    },
}))
```

### 2. Never fetch in useEffect

```typescript
// WRONG
const [orders, setOrders] = useState([])

useEffect(() => {
    apiGetOrders().then(setOrders)   // don't do this
}, [])
```

Both bypass SWR caching, deduplication, and revalidation. They also add extra complexity for loading/error states.

### 3. Never store server data in Zustand

```typescript
// WRONG — Zustand is not a cache
const useDataStore = create((set) => ({
    serverData: [],                  // don't store API responses here
    setServerData: (d) => set({ serverData: d }),
}))
```

### 4. Never compute derived state at store level

```typescript
// WRONG — filteredOrders should not live in Zustand
const useOrderStore = create((set, get) => ({
    orders: [],
    filteredOrders: [],              // don't pre-compute in store
    applyFilters: () => set({ filteredOrders: get().orders.filter(…) }),
}))
```

Use `useMemo` in the component instead. Keeps the store simple, computation co-located with render.

---

## Mock System

When `enableMock: true` in `app.config.ts`, API calls are intercepted:

| Component | Location | Purpose |
|---|---|---|
| Mock adapter | `src/mock/MockAdapter.ts` | Registers all fake API routes |
| Handlers | `src/mock/fakeApi/` | Per-feature request handlers |
| Data | `src/mock/data/` | Static mock data objects |

To add mock data for a new feature:
1. Create a handler in `src/mock/fakeApi/MyFeatureFakeApi.ts`
2. Register it in `src/mock/MockAdapter.ts`
3. Create static data in `src/mock/data/` if needed

---

# Eyris — Styling Rules

Eyris uses **Tailwind CSS 4** with a custom design token layer built on CSS custom properties. All tokens are defined in `src/assets/styles/tailwind/index.css`.

---

## Color Tokens — Semantic Names Only

Never use raw hex values or arbitrary Tailwind colors (`bg-blue-500`, `text-red-400`). Always use Eyris semantic token classes.

| Token class | Purpose |
|---|---|
| `bg-primary` / `text-primary` | Brand primary color |
| `bg-primary-deep` | Darker primary for hover/pressed states |
| `bg-primary-mild` | Lighter primary variant |
| `bg-primary-subtle` | Low-opacity primary tint (backgrounds, badges) |
| `text-error` / `bg-error-subtle` | Error and destructive states |
| `text-success` / `bg-success-subtle` | Success states |
| `text-warning` / `bg-warning-subtle` | Warning states |
| `text-info` / `bg-info-subtle` | Informational states |
| `bg-gray-50` … `bg-gray-950` | Gray scale for backgrounds and borders |
| `heading-text` | Adaptive dark/light emphasis text (see Typography) |

---

## Dark Mode

Prefer every component work in both light and dark mode. Semantic tokens adapt automatically. For non-semantic classes, always provide `dark:` variants.

```tsx
// Correct — semantic token adapts automatically
<div className="bg-primary-subtle text-primary">...</div>

// Correct — explicit dark override for non-semantic classes
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">...</div>

// Wrong — no dark override, will look broken in dark mode
<div className="bg-white text-gray-900">...</div>
```

---

## Typography — Pre-Configured, Do Not Override

Typography sizes and colors are globally configured in `src/assets/styles/tailwind/index.css` via the base layer. **Do not add explicit `text-*` size or color classes to heading elements** — they already have the correct styles applied.

### Heading hierarchy

| Tag | Use case | Applied style |
|---|---|---|
| `h4` | Page title — the main title of every view/page | `text-xl font-semibold text-gray-900 dark:text-gray-100` |
| `h5` | Section title — inside cards, panels, forms | `text-lg font-semibold text-gray-900 dark:text-gray-100` |
| `h6` | Subtitle / label — avatar+name, section indicator | `text-base font-medium text-gray-900 dark:text-gray-100` |
| `h3` | Empty state / illustrated feedback | `text-2xl font-semibold text-gray-900 dark:text-gray-100` |
| `h1`, `h2` | Error pages, hero screens only | `text-4xl/3xl font-semibold text-gray-900 dark:text-gray-100` |

```tsx
// Correct — h4 gets its size and color automatically
<h4>Customer List</h4>
<h5>Recent Orders</h5>

// Wrong — overriding what's already configured
<h4 className="text-xl font-semibold text-gray-900">Customer List</h4>
```

### Body text

Body text inherits `text-sm text-gray-500 dark:text-gray-400` from the base layer.

| Element | When to use |
|---|---|
| `p` | Longer paragraphs, multi-line descriptions |
| `span` | Short inline text within a sentence or next to UI elements |
| `div` | Short standalone text blocks, labels, brief descriptions |

### `.heading-text` utility

Apply to any `p`, `span`, or `div` to make it slightly darker for emphasis, adapting to dark/light mode automatically. Equivalent to `text-gray-900 dark:text-gray-100`.

```tsx
<span className="heading-text font-medium">{user.name}</span>
```

---

## classNames — Conditional Styling

Use `classNames` from the `classnames` package for all conditional class composition. Never use template literals or string concatenation for class names.

```typescript
import classNames from 'classnames'

const cls = classNames(
    // Base classes
    'inline-flex items-center justify-center rounded-lg transition-colors',
    // Conditional — variant
    variant === 'solid' && 'bg-primary text-white hover:bg-primary-deep',
    variant === 'plain' && 'text-primary hover:bg-primary-subtle',
    // Conditional — state
    disabled && 'opacity-50 cursor-not-allowed',
    // Consumer override — always spread last
    className,
)
```

---

## Layout & Spacing

### Rules

- Use Tailwind's spacing scale (4px increments): `p-4` = 16px, `gap-6` = 24px
- Use `gap-*` for flex/grid children — not `mr-*` / `ml-*` / `mb-*` between siblings
- Use `space-y-*` for vertically stacked siblings

### Patterns

```tsx
// Flex row with gap
<div className="flex items-center gap-3">
    <Avatar />
    <span>{user.name}</span>
</div>

// Stacked children
<div className="space-y-4">
    <SectionA />
    <SectionB />
</div>

// Flex with grow + fixed
<div className="flex items-center gap-4">
    <div className="flex-1 min-w-0">Grows, truncatable</div>
    <div className="shrink-0">Fixed width</div>
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## Control Sizes

Consistent sizing system across all interactive controls (Button, Input, Select, etc.):

| Prop value | Height | Use case |
|---|---|---|
| `size="sm"` | 32px | Dense tables, compact toolbars |
| `size="md"` | 40px | Default — forms, general use |
| `size="lg"` | 48px | Prominent CTAs |

---

## Component Styling Pattern

Every component should follow this pattern:

```tsx
import classNames from 'classnames'
import type { CommonProps } from '@/@types/common'
import type { TypeAttributes } from '@/@types/common'

interface MyComponentProps extends CommonProps {
    variant?: 'primary' | 'secondary'
    size?: TypeAttributes.ControlSize
}

const MyComponent = ({
    variant = 'primary',
    size = 'md',
    className,
    children,
}: MyComponentProps) => {
    const cls = classNames(
        'inline-flex items-center rounded-lg transition-colors',
        variant === 'primary' && 'bg-primary text-white hover:bg-primary-deep',
        variant === 'secondary' && 'bg-primary-subtle text-primary',
        size === 'sm' && 'h-8 px-3 text-xs',
        size === 'md' && 'h-10 px-4 text-sm',
        size === 'lg' && 'h-12 px-5 text-base',
        className,
    )

    return <div className={cls}>{children}</div>
}
```

Key rules:
- Always extend `CommonProps` for base props (`className`, `style`, `id`, `children`)
- Use `TypeAttributes.ControlSize` for size props, `TypeAttributes.Status` for status
- Always spread incoming `className` last in `classNames()` — allows consumer override

---

## CSS Layer Architecture

The styling system is organized into three CSS layers:

```css
@layer theme {
    :root {
        --primary: #286cf0;
        --primary-deep: #1f56c0;
        --primary-mild: #4c86f4;
        --primary-subtle: #286cf01a;
        --error: #eb4137;
        --error-subtle: #eb41371a;
        --success: #00a85b;
        --success-subtle: #05eb7624;
        --info: #3380fa;
        --info-subtle: #2a85ff1a;
        --warning: #f59e0b;
        --warning-subtle: #ffd40045;
        --gray-50: #fafafa;
        /* ... through gray-950 */
    }

    .dark {
        --primary: #286cf0;
        /* Dark-adjusted values for all tokens */
    }
}

@layer base {
    body {
        @apply text-gray-500 dark:text-gray-400 text-sm bg-gray-100 dark:bg-gray-950 leading-normal;
    }

    h1 { @apply text-4xl font-semibold text-gray-900 dark:text-gray-100; }
    h2 { @apply text-3xl font-semibold text-gray-900 dark:text-gray-100; }
    h3 { @apply text-2xl font-semibold text-gray-900 dark:text-gray-100; }
    h4 { @apply text-xl font-semibold text-gray-900 dark:text-gray-100; }
    h5 { @apply text-lg font-semibold text-gray-900 dark:text-gray-100; }
    h6 { @apply text-base font-medium text-gray-900 dark:text-gray-100; }
}

@layer components {
    .heading-text {
        @apply text-gray-900 dark:text-gray-100;
    }
}
```

Do not add `@layer theme` tokens inline. If a new token is needed, add it to `src/assets/styles/tailwind/index.css`.

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

---

# Eyris — Routing System

## Route Configuration

All routes are defined in `src/configs/routes.config/routes.config.ts`. Each route is a `Route` object.

### Route type (`src/@types/routes.tsx`)

```typescript
type Route = {
    key: string                                                    // unique identifier, matches nav config key
    path: string                                                   // URL path
    component: LazyExoticComponent<(props: unknown) => JSX.Element> // always lazy-loaded
    authority?: string[]                                           // role-based access (empty = any authenticated user)
    access: RouteAccessType                                        // 'protected' | 'auth-only' | 'public'
    meta?: Meta                                                    // layout and container options
}

type RouteAccessType = 'protected' | 'auth-only' | 'public'

interface Meta {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    header?: PageHeaderProps
    footer?: boolean
    layout?: LayoutType
}
```

### Example route definition

```typescript
import { lazy } from 'react'

export const routes: Routes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
        access: 'protected',
    },
    {
        key: 'admin-panel',
        path: '/admin',
        component: lazy(() => import('@/views/admin/AdminPanel')),
        authority: ['admin'],
        access: 'protected',
        meta: {
            pageContainerType: 'contained',
        },
    },
]
```

---

## Route Access Types

| Type | Behavior | Use case |
|---|---|---|
| `'protected'` | Requires `authenticated === true`. Redirects to sign-in page if not authenticated. | Dashboard, settings, any logged-in page |
| `'auth-only'` | Only accessible when NOT authenticated. Redirects to `authenticatedEntryPath` if already signed in. | Sign-in, sign-up, forgot password |
| `'public'` | No restriction — accessible to everyone regardless of auth state. | Landing pages, public docs |

---

## Authority (Role-Based Access)

The `authority` array on each route controls role-based access through `AuthorityGuard`:

```typescript
// Any authenticated user can access
{ authority: [], access: 'protected' }

// Only users with 'admin' or 'superAdmin' role
{ authority: ['admin', 'superAdmin'], access: 'protected' }
```

`AuthorityGuard` (`src/components/route/AuthorityGuard.tsx`) compares the user's `authority` array against the route's `authority` array. If no role matches, it redirects to `/access-denied`.

---

## Lazy Loading — Required for All Routes

Every route component **must** be lazy-loaded using `React.lazy()`. This is enforced by the `Route` type which requires `LazyExoticComponent`.

```typescript
// Correct — lazy loaded
const CustomerList = lazy(() => import('@/views/customers/CustomerList'))

// Wrong — direct import breaks code splitting
import CustomerList from '@/views/customers/CustomerList'
```

---

## Route Helper Functions

`routes.config.ts` exports helpers to filter routes by access type:

```typescript
export const getRoutesByAccess = (accessType: RouteAccessType) =>
    routes.filter((route) => route.access === accessType)

export const getProtectedRoutes = () => getRoutesByAccess('protected')
export const getAuthOnlyRoutes = () => getRoutesByAccess('auth-only')
export const getPublicRoutes = () => getRoutesByAccess('public')
```

---

## Navigation Configuration

Sidebar navigation is defined in `src/configs/navigation.config/index.ts`. Each nav item is a `NavigationTree` object.

### NavigationTree type (`src/@types/navigation.ts`)

```typescript
interface NavigationTree {
    key: string              // must match the route key
    path: string             // URL path (empty string for parent-only items)
    title: string            // display text
    translateKey: string     // i18n key for translation
    icon: string             // icon name from the icon library
    type: 'title' | 'collapse' | 'item'
    authority: string[]      // role-based visibility
    subMenu: NavigationTree[]
}
```

### Navigation item types

| Type | Behavior |
|---|---|
| `'item'` | A clickable nav link that navigates to `path` |
| `'collapse'` | A collapsible group that reveals `subMenu` children |
| `'title'` | A section header/divider that groups related items |

### Example

```typescript
import { NAV_ITEM_TYPE_ITEM, NAV_ITEM_TYPE_COLLAPSE } from '@/constants/navigation.constant'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'customers',
        path: '',
        title: 'Customers',
        translateKey: 'nav.customers',
        icon: 'customers',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'customers.list',
                path: '/customers/list',
                title: 'Customer List',
                translateKey: 'nav.customers.list',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]
```

### Key rules

- The nav item `key` must match the corresponding route `key` for active-state highlighting
- `authority` on nav items controls visibility — items are hidden if the user lacks the required role
- `subMenu` is always an array (empty `[]` for leaf items)

---

# Eyris — Creating a New Page

Follow these steps to add a new page/view to the Eyris template.

## Step 1 — Create the view file

Path: `src/views/<kebab-case-name>/<PascalCaseName>.tsx`

Requirements:
- Default export with PascalCase name matching the file name
- Page title uses `<h4>` — never h1/h2/h3 for page titles
- Section titles use `<h5>`
- Import UI components from `@/components/ui/*`
- Import shared components from `@/components/shared/*`
- Use SWR for any data fetching (not useEffect or Zustand)
- Wrap async content in `<Loading loading={isLoading}>`
- Use `classNames()` for all conditional class composition

```typescript
import useSWR from 'swr'
import Loading from '@/components/shared/Loading'

const <PascalCaseName> = () => {
    return (
        <div>
            <h4>Page Title</h4>
            {/* page content */}
        </div>
    )
}

export default <PascalCaseName>
```

## Step 2 — Register the route

File: `src/configs/routes.config/routes.config.ts`

Add to the `routes` array:

```typescript
{
    key: '<kebab-case-name>',
    path: '/<kebab-case-name>',
    component: lazy(() => import('@/views/<kebab-case-name>/<PascalCaseName>')),
    authority: [],
    access: 'protected',
    meta: {
        pageContainerType: 'default',
    },
}
```

## Step 3 — Add to navigation (optional)

File: `src/configs/navigation.config/index.ts`

Add a nav item if this page should appear in the sidebar:

```typescript
{
    key: '<kebab-case-name>',           // must match route key
    path: '/<kebab-case-name>',
    title: '<Display Name>',
    translateKey: 'nav.<camelCaseName>',
    icon: '<icon-name>',
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
}
```

## Step 4 — Add mock data (if the page fetches data)

1. Create a service function in `src/services/<FeatureName>Service.ts`:

```typescript
import ApiService from './ApiService'

export async function apiGet<FeatureName>() {
    return ApiService.fetchDataWithAxios<ResponseType>({
        url: '/api/<feature-name>',
        method: 'get',
    })
}
```

2. Add a mock handler in `src/mock/fakeApi/<FeatureName>FakeApi.ts`
3. Register the handler in `src/mock/MockAdapter.ts`

## Step 5 — Verify

- Route resolves in the browser at `/<kebab-case-name>`
- Navigation highlights the correct item (if added to nav)
- Page title and layout match the rest of the app
- Dark mode renders correctly
- TypeScript has no errors
