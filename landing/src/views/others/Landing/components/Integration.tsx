import { motion } from 'motion/react'
import type { LandingIntegration } from '../types'

/**
 * Exact port of the Colonia template "integration" section.
 * Source: landinginspriationdesign/index.html — https://colonia-template.webflow.io/
 *
 * A centered intro ("Integration" tag, "Seamless Integrations" heading,
 * sub-heading) sits above the hub-and-spoke integration diagram (a custom
 * integration.avif: orange rounded hub with the white ANAS logo at the center
 * (palette matched to the template original), connected light-grey feature
 * tiles with orange icons and warm cream-to-orange connectors —
 * fleet/clients/pricing/qr on the left, payments/reports/contracts/tasks on
 * the right; earlier variants are
 * kept as integration-backup.avif (brand logos, blue hub) and
 * integration-backup2.avif (blue hub, white tiles). All styling lives in
 * src/assets/styles/others/_colonia-integration.css.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
})

const Integration = ({
    content,
}: {
    content: LandingIntegration
}) => (
    <section id="integration" className="integration">
        <div className="colonia-container">
            <div className="integration-wrap">
                <div className="integration-top">
                    <motion.div className="tag-wrap" {...rise(0.05)}>
                        <img
                            src="/img/landing/tag-integration.svg"
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
                                {content.subtext}
                            </motion.p>
                        </div>
                    </div>
                </div>
                <div className="integration-bottom">
                    <motion.img
                        src="/img/landing/integration.avif"
                        loading="lazy"
                        alt="Seamless integrations"
                        className="integration-image"
                        {...rise(0.3)}
                    />
                </div>
            </div>
        </div>
    </section>
)

export default Integration
