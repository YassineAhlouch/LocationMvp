/**
 * Language base ('en' | 'fr' | 'ar') for locale-suffixed landing images —
 * hero dashboard previews render as dashboard-preview-{base}.png and the
 * features grid appends `-fr`/`-ar` suffixes for non-EN sets. Anything not
 * starting with `fr`/`ar` falls back to EN.
 */
const localeBase = (language: string): 'en' | 'fr' | 'ar' => {
    if (language.startsWith('fr')) return 'fr'
    if (language.startsWith('ar')) return 'ar'
    return 'en'
}

/** Suffix used by the features grid assets (empty for EN). */
export const localeImageSuffix = (language: string) => {
    const base = localeBase(language)
    return base === 'en' ? '' : `-${base}`
}

/** Base language key for images that already carry it in the filename. */
export const localeImageBase = (language: string) => localeBase(language)
