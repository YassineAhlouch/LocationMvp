import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n, {
    LANGUAGES,
    LANGUAGE_LABELS,
    type LanguageCode,
} from '../i18n'

/**
 * Compact language menu for the floating header (fr / en / ar), like the
 * marketing landing's selector: a globe pill that opens the three options
 * and persists the choice (localStorage + <html lang/dir> handled in i18n).
 */
const LanguageSelector = () => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)

    const current = (i18n.resolvedLanguage ?? 'fr') as LanguageCode

    useEffect(() => {
        if (!open) {
            return
        }

        const onClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', onClickOutside)

        return () => {
            document.removeEventListener('mousedown', onClickOutside)
        }
    }, [open])

    const choose = (code: LanguageCode) => {
        void i18n.changeLanguage(code)
        setOpen(false)
    }

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={t('header.language')}
                className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-900"
            >
                🌐 {current.toUpperCase()}
            </button>
            {open && (
                <div className="absolute end-0 top-full z-40 mt-2 w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-[0_0_24px_rgba(34,42,53,0.08)]">
                    {LANGUAGES.map((code) => (
                        <button
                            key={code}
                            type="button"
                            onClick={() => choose(code)}
                            className={`flex w-full items-center justify-between px-4 py-2 text-sm transition hover:bg-gray-50 ${
                                code === current
                                    ? 'font-semibold text-[#135EF7]'
                                    : 'text-gray-700'
                            }`}
                        >
                            {LANGUAGE_LABELS[code]}
                            {code === current && ' ✓'}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LanguageSelector
