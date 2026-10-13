import { useEffect } from 'react'
import i18n from 'i18next'
import dayjs from 'dayjs'
import { dateLocales } from '@/locales'
import { useLocaleStore } from '@/store/localeStore'

const useLocale = () => {
    const currentLang = useLocaleStore((state) => state.currentLang)

    useEffect(() => {
        const formattedLang = currentLang.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase()
        })

        if (i18n.language !== currentLang) {
            i18n.changeLanguage(formattedLang)
        }

        if (dateLocales[formattedLang]) {
            dateLocales[formattedLang]().then(() => {
                dayjs.locale(formattedLang)
            })
        }
    }, [currentLang])

    return {
        locale: currentLang,
    }
}

export default useLocale
