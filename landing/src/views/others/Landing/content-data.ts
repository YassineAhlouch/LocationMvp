import en from '@/locales/lang/en.json'
import fr from '@/locales/lang/fr.json'
import ar from '@/locales/lang/ar.json'
import { defaultLanguage } from '@/locales'
import type { LandingPageContent } from './types'

const resources: Record<string, { landing: LandingPageContent }> = {
    en: { landing: en.landing as LandingPageContent },
    fr: { landing: fr.landing as LandingPageContent },
    ar: { landing: ar.landing as LandingPageContent },
}

export const getLandingPageContent = (
    language: string,
): LandingPageContent =>
    resources[language]?.landing ?? resources[defaultLanguage].landing
