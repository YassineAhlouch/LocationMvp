import { motion } from 'motion/react'
import type { LandingTestimonials } from '../types'

/**
 * Exact port of the Colonia template "testimonials" section.
 * Source: landinginspriationdesign/index.html — https://colonia-template.webflow.io/
 *
 * A centered 400px intro ("Trusted Voices" tag / "Client Stories" heading /
 * grey-01 sub-text) above five top-aligned cards in a five-column grid. Each
 * card is the template's `testimonials-main` (grey-light, radius-normal) over
 * two hidden rotated dark-orange cards that fade in on hover (the template's
 * IX2 interaction, reproduced as a CSS hover). Quote text carries the template
 * verbatim — including its wrapping quote marks. The template's grid node ids
 * stay on the card wrappers so the `align-self: start` pins and the ≤991px
 * two-column span (last card) keep working; rules live in
 * src/assets/styles/others/_colonia-testimonials.css. On hover each card
 * reveals its own "Testimonials Bg" orange artwork (`testimonials-hover-bg`)
 * over the grey surface while the text flips white, with the rotated
 * dark-orange cards still peeking behind — the template's full IX2 hover,
 * reproduced with a CSS hover.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
})

/* the template's grid-placement node ids (one per card wrapper) */
const NODE_IDS = [
    'w-node-c3ef3619-75f5-97e7-25e7-dea3ac6ceaf4-ac6ceae4',
    'w-node-c3ef3619-75f5-97e7-25e7-dea3ac6ceafe-ac6ceae4',
    'w-node-c3ef3619-75f5-97e7-25e7-dea3ac6ceb08-ac6ceae4',
    'w-node-c3ef3619-75f5-97e7-25e7-dea3ac6ceb12-ac6ceae4',
    'w-node-c3ef3619-75f5-97e7-25e7-dea3ac6ceb1c-ac6ceae4',
]

const Testimonials = ({ content }: { content: LandingTestimonials }) => (
    <section id="testimonials" className="testimonials">
        <div className="colonia-container">
            <div className="testimonials-wrap">
                <div className="testimonials-top">
                    <motion.div className="tag-wrap" {...rise(0.05)}>
                        <img
                            src="/img/landing/tag-testimonials.svg"
                            loading="lazy"
                            alt=""
                            className="tag-icon"
                        />
                        <div className="teg text-grey-02">{content.tag}</div>
                    </motion.div>
                    <div className="title-wrap">
                        <motion.div className="heading-wrap" {...rise(0.15)}>
                            <h2 className="text-h3">{content.heading}</h2>
                        </motion.div>
                        <div className="sub-heading-wrap">
                            <motion.p
                                className="paragraph-02 text-grey-01"
                                {...rise(0.25)}
                            >
                                {content.subtext}
                            </motion.p>
                        </div>
                    </div>
                </div>
                <div className="testimonials-bottom">
                    {content.items.map((item, index) => (
                        <div
                            key={item.attribution}
                            className="testimonials-list-wrap"
                            id={NODE_IDS[index]}
                        >
                            <motion.div
                                className="testimonials-main"
                                {...rise(0.1 + index * 0.08)}
                            >
                                <div className="testimonials-main-inner">
                                    <p className="paragraph-02">
                                        {item.quote}
                                    </p>
                                    <p className="paragraph-03 text-grey-01">
                                        {item.attribution}
                                    </p>
                                </div>
                                {/* the card's hover artwork layer: fades in
                                    over the grey card while the text flips
                                    white; template's "Testimonials Bg.avif" */}
                                <img
                                    src="/img/landing/testimonials-hover-bg.avif"
                                    loading="lazy"
                                    alt=""
                                    aria-hidden="true"
                                    className="testimonials-hover-bg"
                                />
                            </motion.div>
                            {/* the template's hidden rotated back cards,
                                revealed by the hover fade above */}
                            <div className="testimonials-hover" aria-hidden="true" />
                            <div className="testimonials-hover _02" aria-hidden="true" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
)

export default Testimonials
