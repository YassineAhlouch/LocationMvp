import { motion } from 'motion/react'
import type { LandingPricing } from '../types'

/**
 * Exact port of the Colonia template "plans-v1" section (pricing).
 * Source: landinginspriationdesign/index.html — https://colonia-template.webflow.io/
 *
 * Centered intro ("Flexible Plans" tag / "Pick Your Perfect Plan" heading /
 * grey-01 sub-text) above three pricing cards in the template's CMS list
 * wrappers (`w-dyn-list`): light grey Side cards with the light `button-03`
 * CTA ("Get Starter" — the template shows the same label on the Impact plan)
 * and the dark-orange artwork card (`bg-transparent`) with the dark
 * `button-01` CTA and the orange dot. Prices are left-aligned `text-h1`; the
 * middle card's price carries `pricing-amount` (white). The template's grid
 * node id stays on the third list wrapper so the template's ≤991px two-column
 * span keeps working (rules in _colonia-plans.css). CTAs keep the app's
 * #contact target (the template links its product sub-pages). All styling
 * lives in src/assets/styles/others/_colonia-plans.css.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
})

/* template design assets, one icon per card position */
const PLAN_ICONS = [
    '/img/landing/pricing-icon-starter.svg',
    '/img/landing/pricing-icon-growth.svg',
    '/img/landing/pricing-icon-impact.svg',
]

/* the template's grid-placement node id (third card list wrapper) */
const THIRD_LIST_ID =
    'w-node-_19bed93d-0b56-515f-edf1-625be73ff8e1-e87441d3'

const PricingCard = ({
    plan,
    index,
    delay,
}: {
    plan: LandingPricing['plans'][number]
    index: number
    delay: number
}) => {
    const dark = Boolean(plan.dark)
    return (
        <motion.div
            className={`pricing-item${dark ? ' bg-transparent' : ''}`}
            {...rise(delay)}
        >
            <div className="pricing-item-top">
                <img
                    src={PLAN_ICONS[index]}
                    loading="lazy"
                    alt=""
                    className="pricing-item-icon"
                />
                <div className="pricing-info-box">
                    <h3 className={`text-h4${dark ? ' text-light' : ''}`}>
                        {plan.name}
                    </h3>
                    <p
                        className={`paragraph-03 ${
                            dark ? 'text-light' : 'text-grey-01'
                        }`}
                    >
                        {plan.description}
                    </p>
                </div>
                {/* sibling of the info-box in the template (no CSS rules) */}
                <div className="pricing-item-middle">
                    <div
                        className={`text-h1${dark ? ' pricing-amount' : ''}`}
                        dir="ltr"
                    >
                        {plan.price}
                    </div>
                </div>
            </div>
            <motion.div
                className={`vratical-divider${dark ? ' _02' : ''}`}
                aria-hidden="true"
                {...rise(delay + 0.05)}
            />
            <div className="pricing-item-bottom">
                {plan.features.map((feature) => (
                    <div
                        key={`${plan.name}-${feature}`}
                        className="included-item-list"
                    >
                        <img
                            src={
                                dark
                                    ? '/img/landing/plans-dot-light.svg'
                                    : '/img/landing/plans-dot.svg'
                            }
                            loading="lazy"
                            alt=""
                            className="dot-icon"
                        />
                        <div
                            className={`paragraph-02${
                                dark ? ' text-light' : ''
                            }`}
                        >
                            {feature}
                        </div>
                    </div>
                ))}
            </div>
            <motion.div
                className={`vratical-divider${dark ? ' _02' : ''}`}
                aria-hidden="true"
                {...rise(delay + 0.1)}
            />
            <div className="pricing-item-button">
                <a
                    href="#contact"
                    className={`w-inline-block ${
                        dark ? 'button-01' : 'button-03'
                    }`}
                >
                    {dark ? <div className="button-dot" /> : null}
                    {/* two stacked labels — Webflow's hover roll */}
                    <div className="button-text-wrap">
                        <div className="paragraph-03">{plan.cta}</div>
                        <div className="paragraph-03">{plan.cta}</div>
                    </div>
                </a>
            </div>
        </motion.div>
    )
}

const Pricing = ({ content }: { content: LandingPricing }) => (
    <section id="pricing" className="plans-v1">
        <div className="colonia-container">
            <div className="plans-v1-wrap">
                <div className="plans-v1-top">
                    <motion.div className="tag-wrap" {...rise(0.05)}>
                        <img
                            src="/img/landing/tag-plans.svg"
                            loading="lazy"
                            alt=""
                            className="tag-icon"
                        />
                        <div className="teg text-grey-02">{content.tag}</div>
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
                <div className="plans-v1-bottom">
                    {content.plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className="w-dyn-list"
                            id={index === 2 ? THIRD_LIST_ID : undefined}
                        >
                            <div role="list" className="w-dyn-items">
                                <div role="listitem" className="w-dyn-item">
                                    <PricingCard
                                        plan={plan}
                                        index={index}
                                        delay={0.1 + index * 0.1}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
)

export default Pricing
