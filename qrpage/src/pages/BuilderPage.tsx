import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeCanvas } from 'qrcode.react'
import { ApiError, fetchLandingCars } from '../api'
import { formatDailyPrice } from '../format'
import AppHeader from '../components/AppHeader'
import DottedBackdrop from '../components/DottedBackdrop'
import ContactSection from '../components/ContactSection'

/** Same cap the landing API enforces on GET /api/v1/landing/cars. */
const MAX_CARS = 24

/**
 * Prefilled demo codes so the page demos itself: the visitor sees a working
 * link, QR and fleet immediately. Replace them with your own vehicle codes —
 * in the agency dashboard the items are picked from the fleet, not typed.
 */
const DEMO_SLUGS = ['1111-a-11', '1222-a-22']

type CheckResult = {
    found: Array<{ label: string; detail: string }>
    missing: string[]
}

/**
 * Home of the landing (: /r without target): a small generator an agency can
 * open straight from a browser to build a vehicle reservation link — paste
 * vehicle slugs, get /r?cars=…, a printable QR and a live preview of what a
 * customer will see. Contact-safe by design: slugs, never ids.
 */
const BuilderPage = () => {
    const { t } = useTranslation()
    const [slugs, setSlugs] = useState<string[]>(DEMO_SLUGS)
    const [checking, setChecking] = useState(false)
    const [check, setCheck] = useState<CheckResult | null>(null)
    const [checkError, setCheckError] = useState('')
    const [copied, setCopied] = useState(false)
    const [url, setUrl] = useState('')
    const qrBoxRef = useRef<HTMLDivElement | null>(null)

    // Debounced link so the QR canvas isn't rebuilt on every keystroke.
    const readySlugs = useMemo(
        () =>
            Array.from(
                new Set(
                    slugs
                        .map((slug) => slug.trim())
                        .filter(Boolean)
                        .slice(0, MAX_CARS),
                ),
            ),
        [slugs],
    )

    useEffect(() => {
        const link =
            readySlugs.length > 0
                ? `${window.location.origin}/r?cars=${readySlugs
                      .map(encodeURIComponent)
                      .join(',')}`
                : ''

        const timer = window.setTimeout(() => setUrl(link), 250)

        return () => {
            window.clearTimeout(timer)
        }
    }, [readySlugs])

    useEffect(() => {
        document.title = t('site.title')
    }, [t])

    /** QRCodeCanvas renders inside the preview box; pick it up for exports. */
    const qrCanvas = (): HTMLCanvasElement | null =>
        qrBoxRef.current?.querySelector('canvas') ?? null

    const setSlugAt = (index: number, value: string) => {
        setSlugs((current) =>
            current.map((slug, at) => (at === index ? value : slug)),
        )
    }

    const addRow = () => {
        setSlugs((current) => [...current, ''])
    }

    const removeRow = (index: number) => {
        setSlugs((current) => (current.length === 1 ? [''] : current.filter((_, at) => at !== index)))
    }

    const copyLink = async () => {
        if (!url) {
            return
        }

        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1500)
        } catch {
            // Clipboard is read-only in some contexts; the input is still
            // selectable so nothing else is required.
        }
    }

    const downloadQr = () => {
        const canvas = qrCanvas()

        if (!canvas || !url || canvas.width === 0) {
            return
        }

        const anchor = document.createElement('a')
        anchor.download = `qr-reservation-${readySlugs[0]}.png`
        anchor.href = canvas.toDataURL('image/png')
        anchor.click()
    }

    const printQr = () => {
        const canvas = qrCanvas()

        if (!canvas || !url || canvas.width === 0) {
            return
        }

        const printWindow = window.open(
            '',
            '_blank',
            'width=460,height=640',
        )
        if (!printWindow) {
            return
        }

        printWindow.document.write(
            `<!doctype html><title>QR réservation</title>` +
                `<body style="font-family:system-ui,sans-serif;text-align:center;padding:32px">` +
                `<h2 style="margin:0 0 8px">${t('builder.print_title')}</h2>` +
                `<img src="${canvas.toDataURL('image/png')}" style="width:300px;height:300px" /><br />` +
                `<code style="word-break:break-all;font-size:11px">${url}</code>` +
                `</body>`,
        )
        printWindow.document.close()
        printWindow.print()
    }

    const verifyLink = async () => {
        if (readySlugs.length === 0) {
            setCheck(null)
            setCheckError('')

            return
        }

        setChecking(true)
        setCheck(null)
        setCheckError('')

        try {
            const cars = await fetchLandingCars({ cars: readySlugs })
            const bookable = new Set(
                cars.map((car) => car.slug?.toLowerCase()).filter(Boolean),
            )

            setCheck({
                found: cars.map((car) => ({
                    label:
                        [car.brand, car.model]
                            .filter(Boolean)
                            .join(' ') || (car.slug ?? ''),
                    detail: [
                        car.year ? String(car.year) : null,
                        formatDailyPrice(
                            car.daily_price,
                            car.agency.currency_code,
                        ) + ' / jour',
                    ]
                        .filter(Boolean)
                        .join(' · '),
                })),
                missing: readySlugs.filter(
                    (slug) => !bookable.has(slug.toLowerCase()),
                ),
            })
        } catch (cause) {
            setCheckError(
                cause instanceof ApiError
                    ? cause.message
                    : t('api.unexpected'),
            )
        } finally {
            setChecking(false)
        }
    }

    return (
        <main className="min-h-dvh bg-white text-gray-900">
            <AppHeader />
            <section className="relative">
                <DottedBackdrop />
                <div className="relative flex flex-col items-center gap-4 px-4 pt-32 pb-10 text-center">
                    <span className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-500 backdrop-blur-sm">
                        {t('builder.badge')}
                    </span>
                    <h1 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
                        {t('builder.heading')}
                    </h1>
                    <p className="max-w-2xl text-base text-gray-500 md:text-lg">
                        {t('builder.sub')}
                    </p>
                </div>

                <div className="relative mx-auto max-w-3xl px-4 pb-16">
                    <div className="grid gap-6 md:grid-cols-[1fr_260px]">
                        {/* Form card */}
                        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_0_24px_rgba(34,42,53,0.04)]">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-sm font-semibold text-gray-900">
                                    {t('builder.vehicles', {
                                        count: readySlugs.length,
                                    })}
                                </h2>
                                <span className="rounded-full bg-[#135EF7]/10 px-2.5 py-1 text-xs font-semibold text-[#135EF7]">
                                    {t('builder.demo_badge')}
                                </span>
                            </div>

                            {slugs.map((slug, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(event) =>
                                            setSlugAt(
                                                index,
                                                event.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'builder.code_placeholder',
                                            { index: index + 1 },
                                        )}
                                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#135EF7]"
                                        spellCheck={false}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeRow(index)}
                                        className="rounded-lg px-2 text-gray-400 transition hover:text-red-500"
                                        aria-label="Retirer ce véhicule"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addRow}
                                disabled={readySlugs.length >= MAX_CARS}
                                className="w-fit rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-900 disabled:opacity-40"
                            >
                                {t('builder.add')}
                            </button>

                            <div className="mt-2 rounded-xl bg-gray-50 p-3">
                                <p className="text-xs font-semibold text-gray-500">
                                    {t('builder.link_label')}
                                </p>
                                <div className="mt-1 flex gap-2">
                                    <input
                                        readOnly
                                        value={url}
                                        placeholder={t(
                                            'builder.link_placeholder',
                                        )}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none"
                                        onFocus={(event) =>
                                            event.currentTarget.select()
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            void copyLink()
                                        }}
                                        disabled={!url}
                                        className="shrink-0 rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 disabled:opacity-40"
                                    >
                                        {copied ? t('builder.copied') : t('builder.copy')}
                                    </button>
                                    {url && (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="shrink-0 rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-900"
                                        >
                                            {t('builder.open')}
                                        </a>
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-gray-400">
                                    {t('builder.link_note')}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    void verifyLink()
                                }}
                                disabled={checking || readySlugs.length === 0}
                                className="w-fit rounded-xl bg-[#135EF7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4ede] disabled:opacity-40"
                            >
                                {checking
                                    ? t('builder.verifying')
                                    : t('builder.verify')}
                            </button>

                            {checkError && (
                                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {checkError}
                                </p>
                            )}

                            {check && (
                                <div className="rounded-xl border border-gray-200 p-3">
                                    <p className="text-xs font-semibold text-emerald-600">
                                        {t('builder.bookable', {
                                            count: check.found.length,
                                        })}
                                    </p>
                                    {check.found.length > 0 && (
                                        <ul className="mt-2 flex flex-col gap-1 text-sm text-gray-700">
                                            {check.found.map((car) => (
                                                <li
                                                    key={car.label}
                                                    className="flex justify-between gap-3"
                                                >
                                                    <span>
                                                        {car.label}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {car.detail}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {check.missing.length > 0 && (
                                        <p className="mt-2 text-xs text-amber-600">
                                            {t('builder.missing', {
                                                slugs: check.missing.join(
                                                    ', ',
                                                ),
                                            })}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* QR preview card — pinned to the right, sticky */}
                        <div className="flex h-fit flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_0_24px_rgba(34,42,53,0.04)] md:sticky md:top-24">
                            <p className="text-xs font-semibold text-gray-500">
                                {t('builder.qr_label')}
                            </p>
                            <div
                                ref={qrBoxRef}
                                className="flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-xl border border-gray-200"
                            >
                                {url ? (
                                    <QRCodeCanvas
                                        value={url}
                                        size={198}
                                        level="M"
                                        marginSize={2}
                                        bgColor="#ffffff"
                                        fgColor="#111827"
                                    />
                                ) : (
                                    <span className="px-4 text-center text-xs text-gray-400">
                                        {t('builder.qr_placeholder')}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={downloadQr}
                                disabled={!url}
                                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-900 disabled:opacity-40"
                            >
                                {t('builder.download')}
                            </button>
                            <button
                                type="button"
                                onClick={printQr}
                                disabled={!url}
                                className="w-full rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-40"
                            >
                                {t('builder.print')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <ContactSection />
            <footer className="border-t border-gray-200 px-6 py-8 text-center text-xs text-gray-400">
                {t('footer.builder', { year: new Date().getFullYear() })}
            </footer>
        </main>
    )
}

export default BuilderPage
