export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    accessTokenPersistStrategy: 'localStorage' | 'sessionStorage' | 'cookies'
    enableMock: boolean
    activeNavTranslation: boolean
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/apps/dashboard',
    unAuthenticatedEntryPath: '/sign-in',
    // French is the agency's working language; English and Arabic remain
    // selectable from the header switcher.
    locale: 'fr',
    accessTokenPersistStrategy: 'localStorage',
    enableMock: true,
    activeNavTranslation: true,
}

export default appConfig
