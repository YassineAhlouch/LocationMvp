import { motion } from 'motion/react'
import {
    TbEyeOff,
    TbFilePencil,
    TbListSearch,
    TbUsersGroup,
} from 'react-icons/tb'
import type { IconType } from 'react-icons'
import type { LandingProblems } from '../types'

/**
 * Colonia-fidelity port of the app's own "Why us" section (block `problems`).
 * The template has no equivalent section, so this composes its exact building
 * blocks: the shared centered intro (tag row with the 16px tag glyph + teg
 * text, title-wrap with the text-h3 heading whose second part is grey) and a
 * two-column grid of grey-light cards (radius-normal, template tokens) each
 * stacking the problem row above an inset white solution card whose icon is
 * the template's benefits gradient tile with its white shield-check artwork
 * (`why-check.svg`). Content copy stays the app's; rules live in
 * src/assets/styles/others/_colonia-why.css.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
})

const iconMap: Record<string, IconType> = {
    scattered: TbListSearch,
    admin: TbFilePencil,
    unclear: TbEyeOff,
    desync: TbUsersGroup,
}

const ProblemSolution = ({ content }: { content: LandingProblems }) => (
    <section id="why" className="why">
        <div className="colonia-container">
            <div className="why-top">
                <motion.div className="tag-wrap" {...rise(0.05)}>
                    <img
                        src="/img/landing/tag-why.svg"
                        loading="lazy"
                        alt=""
                        className="tag-icon"
                    />
                    <div className="teg text-grey-02">{content.tag}</div>
                </motion.div>
                <div className="title-wrap">
                    <motion.div className="heading-wrap" {...rise(0.15)}>
                        <h2 className="text-h3">
                            {content.heading.primary}{' '}
                            <span className="why-accent">
                                {content.heading.secondary}
                            </span>
                        </h2>
                    </motion.div>
                </div>
            </div>
            <div className="why-bottom">
                {content.items.map((item, index) => {
                    const Icon = iconMap[item.icon]

                    return (
                        <motion.div
                            key={item.id}
                            className="why-card"
                            {...rise(0.25 + (index % 2) * 0.1)}
                        >
                            {/* the problem */}
                            <div className="why-row">
                                <div className="why-icon-box">
                                    {Icon ? <Icon size={22} /> : null}
                                </div>
                                <div className="why-row-text">
                                    <div className="paragraph-02">
                                        {item.problemTitle}
                                    </div>
                                    <p className="paragraph-03 text-grey-01">
                                        {item.problemDescription}
                                    </p>
                                </div>
                            </div>
                            {/* its solution */}
                            <div className="why-solution">
                                <div className="why-solution-tile">
                                    <img
                                        src="/img/landing/why-check.svg"
                                        loading="lazy"
                                        alt=""
                                        aria-hidden="true"
                                        className="why-check"
                                    />
                                </div>
                                <div className="why-row-text">
                                    <div className="paragraph-02 why-solution-title">
                                        {item.solutionTitle}
                                    </div>
                                    <p className="paragraph-03 text-grey-01">
                                        {item.solutionDescription}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    </section>
)

export default ProblemSolution
