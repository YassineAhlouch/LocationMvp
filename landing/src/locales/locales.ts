import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './lang/en.json'
import fr from './lang/fr.json'
import ar from './lang/ar.json'

export const supportedLanguages = [
    { label: 'English', value: 'en', flag: 'US' },
    { label: 'Français', value: 'fr', flag: 'FR' },
    { label: 'العربية', value: 'ar', flag: 'MA' },
]

export const defaultLanguage = 'en'

export const isRtlLanguage = (language: string) =>
    language === 'ar' || language.startsWith('ar')

const resources = {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
}

const storageKey = 'landing-language'

const getStoredLanguage = () => {
    if (typeof window === 'undefined') {
        return null
    }

    const queryLanguage = new URLSearchParams(window.location.search).get(
        'lang',
    )

    if (
        queryLanguage &&
        supportedLanguages.some((lang) => lang.value === queryLanguage)
    ) {
        return queryLanguage
    }

    return window.localStorage.getItem(storageKey)
}

i18n.use(initReactI18next).init({
    resources,
    lng: getStoredLanguage() ?? defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
        escapeValue: false,
    },
    showSupportNotice: false,
})

export const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)

    if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, language)
    }
}

export default i18n
