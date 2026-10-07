---
inclusion: always
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
