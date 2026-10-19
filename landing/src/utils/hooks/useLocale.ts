import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isRtlLanguage } from '@/locales'
import type { Direction } from '@/@types/theme'

function useLocale(): { locale: string; direction: Direction } {
    const { i18n } = useTranslation()
    const locale = i18n.resolvedLanguage ?? i18n.language
    const direction: Direction = isRtlLanguage(locale) ? 'rtl' : 'ltr'

    useEffect(() => {
        document.documentElement.lang = locale
        document.documentElement.dir = direction
    }, [locale, direction])

    return { locale, direction }
}

export default useLocale
