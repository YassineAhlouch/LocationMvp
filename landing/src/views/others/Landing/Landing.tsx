import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getLandingPageContent } from './content-data'
import LandingClient from './components/LandingClient'

const Landing = () => {
    const { i18n } = useTranslation()
    const language = i18n.resolvedLanguage ?? i18n.language
    const content = useMemo(
        () => getLandingPageContent(language),
        [language],
    )

    return <LandingClient content={content} />
}

export default Landing
