---
description: Step-by-step guide for creating a new page/view in Eyris — view file, route registration, navigation, mock data.
alwaysApply: false
---

# Create a New Page

Create a new page/view in the Eyris template. The user will provide a page name and description. Follow these steps exactly.

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

- [ ] Route resolves in the browser at `/<kebab-case-name>`
- [ ] Navigation highlights the correct item (if added to nav)
- [ ] Page title and layout match the rest of the app
- [ ] Dark mode renders correctly
- [ ] TypeScript has no errors
