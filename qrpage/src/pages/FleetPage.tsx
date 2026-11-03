import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import { ApiError, fetchLandingCars } from '../api'
import i18n from '../i18n'
import type { LandingCar } from '../types'
import AppHeader from '../components/AppHeader'
import CarCard from '../components/CarCard'
import ReservationDialog from '../components/ReservationDialog'
import DottedBackdrop from '../components/DottedBackdrop'

type Target = { qr?: string; cars?: string[] }

/**
 * The QR encodes one of two targets:
 *  - a saved poster page → /r/{slug}          (cars resolved server-side)
 *  - an ad-hoc selection  → /r?cars={slugs}   (vehicle slugs, never ids)
 */
function resolveTarget(): Target | null {
    const { pathname, search } = window.location
    const params = new URLSearchParams(search)

    if (pathname.startsWith('/r/')) {
        const slug = decodeURIComponent(
            pathname.slice(3).replace(/\/+$/, ''),
        ).trim()

        return slug ? { qr: slug } : null
    }

    if (pathname === '/r' || pathname === '/') {
        const cars = (params.get('cars') ?? '')
            .split(',')
            .map((slug) => slug.trim())
            .filter(Boolean)

        return cars.length > 0 ? { cars } : null
    }

    return null
}

const slugApiError = (cause: unknown) =>
    cause instanceof ApiError ? cause.message : i18n.t('fleet.unexpected')

const loadingCard = (key: number) => (
    <div
        key={key}
        className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white"
    >
        <div className="aspect-[16/10] bg-gray-200" />
        <div className="flex flex-col gap-2 p-4">
            <div className="h-4 w-2/3 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-100" />
            <div className="mt-3 h-10 w-full rounded-xl bg-gray-100" />
        </div>
    </div>
)

/** Full-page message block for empty/error states. */
const StatusBlock = ({
    emoji,
    title,
    text,
    retry,
    onRetry,
}: {
    emoji: string
    title: string
    text: string
    retry?: boolean
    onRetry?: () => void
}) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col items-center gap-2 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-3xl">
            {emoji}
        </span>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-900">
            {title}
        </h2>
        <p className="max-w-sm text-sm text-gray-500">{text}</p>
        {retry && (
            <button
                type="button"
                onClick={onRetry}
                className="mt-3 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-900"
            >
                {t('fleet.retry')}
            </button>
        )}
    </div>
)}

/**
 * Public page a printed QR opens: the advertised rentable fleet, a card per
 * car and the reservation-request modal. Everything rides the public API —
 * the agency name comes from each car itself.
 */
const FleetPage = () => {
    const { t } = useTranslation()
    const target = useMemo(resolveTarget, [])
    const [cars, setCars] = useState<LandingCar[]>([])
    const [loading, setLoading] = useState(target !== null)
    const [error, setError] = useState('')
    const [attempt, setAttempt] = useState(0)
    const [selected, setSelected] = useState<LandingCar | null>(null)

    useEffect(() => {
        if (!target) {
            return
        }

        let alive = true
        setLoading(true)
        setError('')

        fetchLandingCars(target)
            .then((result) => {
                if (alive) {
                    setCars(result)
                    document.title = `${result[0]?.agency.name ?? 'DoubleDrive'} — ${t(
                        'fleet.doc_suffix',
                    )}`
                }
            })
            .catch((cause) => {
                if (alive) {
                    setError(slugApiError(cause))
                }
            })
            .finally(() => {
                if (alive) {
                    setLoading(false)
                }
            })

        return () => {
            alive = false
        }
    }, [target, attempt, t])

    // Cross-agency posters are rare: the first agency names the page.
    const agencies = useMemo(
        () => [...new Set(cars.map((car) => car.agency.name))],
        [cars],
    )

    let content: ReactNode | null = null

    if (loading) {
        content = (
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => loadingCard(index))}
            </div>
        )
    } else if (error) {
        content = (
            <StatusBlock
                emoji="📡"
                title={t('fleet.error_title')}
                text={error}
                retry
                onRetry={() => setAttempt((current) => current + 1)}
            />
        )
    } else if (cars.length === 0) {
        content = (
            <StatusBlock
                emoji="🅿️"
                title={t('fleet.empty_title')}
                text={t('fleet.empty_text')}
            />
        )
    } else {
        content = (
            <div
                id="vehicules"
                className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3"
            >
                {cars.map((car) => (
                    <CarCard
                        key={car.id}
                        car={car}
                        onReserve={(candidate) => setSelected(candidate)}
                    />
                ))}
            </div>
        )
    }

    return (
        <main className="min-h-dvh bg-white text-gray-900">
            <AppHeader ctaLabel={t('header.create_link')} ctaHref="/" />
            <section className="relative">
                <DottedBackdrop />
                <div className="relative flex flex-col items-center gap-4 px-4 pt-32 pb-10 text-center">
                    <span className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-500 backdrop-blur-sm">
                        {t('fleet.badge')}
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                        {agencies[0] ?? 'DoubleDrive'}
                        {agencies.length > 1
                            ? ` ${t('fleet.plus_agencies')}`
                            : ''}
                    </h1>
                    <p className="max-w-2xl text-base text-gray-500 md:text-lg">
                        {t('fleet.subtitle')}
                    </p>
                    {cars.length > 0 && (
                        <span className="rounded-full bg-[#135EF7]/10 px-3 py-1 text-xs font-semibold text-[#135EF7]">
                            {t('fleet.available', { count: cars.length })}
                        </span>
                    )}
                </div>
                {content}
                <ReservationDialog
                    car={selected}
                    onClose={() => setSelected(null)}
                />
            </section>
            <footer className="border-t border-gray-200 px-6 py-8 text-center text-xs text-gray-400">
                {t('fleet.footer', { year: new Date().getFullYear(), name: agencies[0] ?? 'DoubleDrive' })}
            </footer>
        </main>
    )
}

export default FleetPage
