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
