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
