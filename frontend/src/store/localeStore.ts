import appConfig from '@/configs/app.config'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import i18n from 'i18next'
import { dateLocales } from '@/locales'
import dayjs from 'dayjs'
import { useThemeStore } from '@/store/themeStore'
import { THEME_ENUM } from '@/constants/theme.constant'

type LocaleState = {
    currentLang: string
    setLang: (payload: string) => void
}

const isRtlLang = (lang: string) => {
    const formattedLang = lang.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    return formattedLang === 'ar' || lang === 'ar' || lang.startsWith('ar')
}

export const useLocaleStore = create<LocaleState>()(
    devtools(
        persist(
            (set) => ({
                currentLang: appConfig.locale,
                setLang: (lang: string) => {
                    const formattedLang = lang.replace(
                        /-([a-z])/g,
                        function (g) {
                            return g[1].toUpperCase()
                        },
                    )

                    i18n.changeLanguage(formattedLang)

                    dateLocales[formattedLang]().then(() => {
                        dayjs.locale(formattedLang)
                    })

                    if (isRtlLang(lang)) {
                        useThemeStore.getState().setDirection(
                            THEME_ENUM.DIR_RTL,
                        )
                    } else {
                        useThemeStore.getState().setDirection(
                            THEME_ENUM.DIR_LTR,
                        )
                    }

                    return set({ currentLang: lang })
                },
            }),
            { name: 'locale' },
        ),
    ),
)
