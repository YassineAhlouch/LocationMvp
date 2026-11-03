import { motion } from 'motion/react'
import type { LandingTransparency } from '../types'

/**
 * Exact port of the Colonia template "transparency" section.
 * Source: landinginspriationdesign/index.html — https://colonia-template.webflow.io/
 *
 * The rounded dark-orange banner (same artwork as the works banner) holds a
 * centered white intro ("Full Transparency" tag, "Data Visibility" heading,
 * sub-heading) above the framed dashboard screenshot (transparency.avif,
 * max 550px). This replaces the former working contact form that occupied the
 * template's `transparency` slot (the form/Lead API lived only on the landing).
 * The section keeps the app's #contact id so the navigation, footer links and
 * the FAQ keep landing here. All styling lives in
 * src/assets/styles/others/_colonia-transparency.css.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
})

const Transparency = ({
    content,
}: {
    content: LandingTransparency
}) => (
    <section id="contact" className="transparency">
        <div className="transparency-section">
            <div className="colonia-container">
                <div className="transparency-wrap">
                    <div className="transparency-top">
                        <motion.div className="tag-wrap" {...rise(0.05)}>
                            <img
                                src="/img/landing/tag-transparency.svg"
                                loading="lazy"
                                alt=""
                                className="tag-icon"
                            />
                            <div className="teg text-light">
                                {content.tag}
                            </div>
                        </motion.div>
                        <div className="title-wrap">
                            <motion.div
                                className="heading-wrap"
                                {...rise(0.15)}
                            >
                                <h2 className="text-h3">
                                    {content.heading}
                                </h2>
                            </motion.div>
                            <div className="sub-heading-wrap">
                                <motion.p
                                    className="paragraph-02 whitespace-pre-line"
                                    {...rise(0.25)}
                                >
                                    {content.subtext}
                                </motion.p>
                            </div>
                        </div>
                    </div>
                    <div className="transparency-bottom">
                        <motion.img
                            src="/img/landing/transparency.avif"
                            loading="lazy"
                            width={1444}
                            height={1112}
                            alt="Data visibility"
                            className="transparency-image"
                            {...rise(0.3)}
                        />
                    </div>
                </div>
            </div>
            {/* interaction-hidden layer in the template — kept for DOM parity */}
            <div className="transparency-bg" aria-hidden="true" />
        </div>
    </section>
)

export default Transparency
