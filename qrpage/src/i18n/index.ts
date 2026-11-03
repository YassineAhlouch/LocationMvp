import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from './locales/fr'
import en from './locales/en'
import ar from './locales/ar'

export const LANGUAGES = ['fr', 'en', 'ar'] as const

export type LanguageCode = (typeof LANGUAGES)[number]

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
    fr: 'Français',
    en: 'English',
    ar: 'العربية',
}

const STORAGE_KEY = 'qrpage.language'

const initialLanguage = (): LanguageCode => {
    const saved = window.localStorage.getItem(STORAGE_KEY)

    if (saved && (LANGUAGES as readonly string[]).includes(saved)) {
        return saved as LanguageCode
    }

    const detected = navigator.language.slice(0, 2)

    if ((LANGUAGES as readonly string[]).includes(detected)) {
        return detected as LanguageCode
    }

    return 'fr'
}

/**
 * Right-to-left languages of the page (drives <html dir>).
 */
export const languageDirection = (code: string): 'rtl' | 'ltr' =>
    code === 'ar' ? 'rtl' : 'ltr'

if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        resources: {
            fr: { translation: fr },
            en: { translation: en },
            ar: { translation: ar },
        },
        lng: initialLanguage(),
        fallbackLng: 'fr',
        interpolation: { escapeValue: false },
    })
}

/** Persist + mirror the active language onto the document. */
const applyLanguage = (code: string) => {
    window.localStorage.setItem(STORAGE_KEY, code)
    document.documentElement.lang = code
    document.documentElement.dir = languageDirection(code)
}

applyLanguage(i18n.language)

i18n.on('languageChanged', (code) => {
    applyLanguage(code)
})

export default i18n
