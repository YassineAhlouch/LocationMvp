import { useEffect, useState } from 'react'
import LanguageSelector from './LanguageSelector'

type AppHeaderProps = {
    /** Action shown on the right, e.g. the builder CTA on the fleet page. */
    ctaLabel?: string
    ctaHref?: string
}

/**
 * Floating navigation mirroring the marketing landing: full-width and
 * transparent over the hero, collapsing into the glassy rounded pill once
 * the page scrolls.
 */
const AppHeader = ({ ctaLabel, ctaHref }: AppHeaderProps) => {
    const [scrolled, setScrolled] = useState(
        typeof window === 'undefined' ? false : window.scrollY > 60,
    )

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60)
        }

        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    return (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-4">
            <nav
                className={`pointer-events-auto mt-3 flex w-full items-center justify-between rounded-2xl border border-gray-200/60 bg-white/80 px-4 py-2 shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_16px_68px_rgba(47,48,55,0.05)] backdrop-blur-md transition-all duration-300 ${
                    scrolled ? 'max-w-4xl' : 'max-w-7xl'
                }`}
            >
                <a
                    href="/"
                    className="inline-flex items-center"
                    aria-label="DoubleDrive"
                >
                    <img
                        src="/logo/logo-light-full.svg"
                        alt="DoubleDrive"
                        className="h-8 w-auto"
                    />
                </a>
                <div className="flex items-center gap-2">
                    <LanguageSelector />
                    {ctaLabel && ctaHref && (
                        <a
                            href={ctaHref}
                            className="rounded-xl bg-[#135EF7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4ede]"
                        >
                            {ctaLabel}
                        </a>
                    )}
                </div>
            </nav>
        </div>
    )
}

export default AppHeader
