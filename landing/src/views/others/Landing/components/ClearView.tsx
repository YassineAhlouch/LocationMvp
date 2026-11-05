import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { LandingClearView } from '../types'
import { localeImageBase } from './localeImage'

/**
 * App-specific "Clear View" section, placed right after the values block.
 * Six module cards (01 Reservations … 06 Public booking page and QR code)
 * pile up while scrolling, each carrying a short description and a localized
 * app screenshot from public/img/clearview (en/fr/ar naming like the
 * hero/features assets; `task` only ships in EN, so it falls back for fr/ar,
 * and AR payments uses its `paiment-ar.png` filename).
 *
 * Section chrome follows the Features section (Modules.tsx): same
 * `colonia-container`, the same centered 536px intro (tag → h2/title-wrap →
 * sub-heading) with h3-scale typography, section-level padding — and no
 * background banner: the cards sit on the plain page surface with just a
 * hairline border (no box-shadow). Each card hosts its screenshot the
 * resources way: the `.cv-imgwrap` stage with the warm `fit-cover.avif` mat
 * behind (`cv-imgwrap-mat`), the transparent-edged capture over it keeping
 * its natural aspect. The pile pins center each card on the screen
 * height (`top: max(calc(50vh - 378px), 118px)` / `-338px` variants
 * alternating
 * so the previous card keeps a strip peeking above the newcomer), z-indexes
 * increase with DOM order (set inline; the template's z-cycling only works
 * for a 3-step pile) and on ≤479px the intro and cards go static. All
 * styling lives in src/assets/styles/others/_colonia-clearview.css.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
})

/** The cards' transform is reserved for the stacking (no y movement). */
const fade = (delay: number) => ({
    initial: { opacity: 0, filter: 'blur(10px)' },
    whileInView: { opacity: 1, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
})

/** Screenshot per module id, localized like the hero/features assets. */
const shotFor = (id: string, base: 'en' | 'fr' | 'ar') => {
    switch (id) {
        case 'reservations':
            return `/img/clearview/reservation-${base}.png`
        case 'fleet':
            return `/img/clearview/vehicule-${base}.png`
        case 'payments':
            return base === 'ar'
                ? '/img/clearview/paiment-ar.png'
                : `/img/clearview/payment-${base}.png`
        case 'reports':
            return `/img/clearview/performance-client-${base}.png`
        case 'tasks':
            /* only the EN capture exists — keep it for every language */
            return '/img/clearview/task-en.png'
        case 'booking':
            return `/img/clearview/callendar-${base}.png`
        default:
            return ''
    }
}

const ClearView = ({ content }: { content: LandingClearView }) => {
    const { i18n } = useTranslation()
    const imageBase = localeImageBase(i18n.resolvedLanguage ?? i18n.language)

    return (
        <section className="clearview">
            <div className="colonia-container">
                <div className="clearview-wrap">
                    <div className="clearview-top">
                        <motion.div className="tag-wrap" {...rise(0.05)}>
                            <img
                                src="/img/landing/tag-features.svg"
                                loading="lazy"
                                alt=""
                                className="tag-icon"
                            />
                            <div className="teg text-grey-02">
                                {content.tag}
                            </div>
                        </motion.div>
                        <div className="title-wrap">
                            <motion.div
                                className="heading-wrap"
                                {...rise(0.15)}
                            >
                                <h2 className="text-h3">{content.heading}</h2>
                            </motion.div>
                            <div className="sub-heading-wrap">
                                <motion.p
                                    className="paragraph-02 text-grey-01"
                                    {...rise(0.25)}
                                >
                                    {content.subheading}
                                </motion.p>
                            </div>
                        </div>
                    </div>
                    <div className="clearview-bottom">
                        {content.items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className={`clearview-card ${
                                    index % 2 ? 'cv-pin-b' : 'cv-pin-a'
                                }`}
                                style={{ zIndex: index + 1 }}
                                {...fade(0.04 * index)}
                            >
                                <div className="cv-head">
                                    <div className="cv-num">{item.number}</div>
                                    <div className="cv-head-txt">
                                        <h3 className="cv-title">
                                            {item.title}
                                        </h3>
                                        <p className="paragraph-03 text-grey-01">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="cv-imgwrap">
                                    <img
                                        className="cv-imgwrap-mat fit-cover"
                                        src="/img/landing/fit-cover.avif"
                                        loading="lazy"
                                        alt=""
                                    />
                                    <img
                                        className="cv-shot"
                                        src={shotFor(item.id, imageBase)}
                                        alt={item.title}
                                        loading="lazy"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ClearView
