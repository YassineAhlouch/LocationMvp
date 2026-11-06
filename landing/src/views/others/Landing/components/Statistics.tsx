import { motion } from "motion/react";
import { Link as RouterLink } from "react-router";
import type { LandingPageContent, LandingStatSlot } from "../types";

/**
 * Exact port of the doublevdrive template "values" section.
 *
 * A sticky left column (tag → heading → sub-heading → "Learn More" button)
 * sits beside four sticky white rows that pile up while scrolling, each with
 * a paragraph, a static digit-reel counter and a label. The counter reels do
 * NOT animate (the template bakes them: `upper` strips read the last digit,
 * `lower` strips the first); only the rows fade/blur in on scroll. The orange
 * glow behind the section is values-bg.svg, extracted from the template.
 * All styling lives in src/assets/styles/others/_doublevdrive-values.css.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
});

const Slot = ({ slot }: { slot: LandingStatSlot }) =>
    slot.type === "reel" ? (
        <div className={`statistics-number-box ${slot.variant}`}>
            {[...slot.strip].map((digit, i) => (
                <div className="text-h1" key={i}>
                    {digit}
                </div>
            ))}
        </div>
    ) : (
        <h1
            className={
                slot.size === "h1" ? "text-h1 text-grey-01" : "text-grey-01"
            }
        >
            {slot.text}
        </h1>
    );

const Statistics = ({ content }: { content: LandingPageContent }) => {
    const statistics = content.statistics;

    return (
        <section className="values" dir="ltr">
            <div className="values-main-bg">
                <div className="doublevdrive-container values-container">
                    <div className="values-wrap">
                        <div className="values-left">
                            <motion.div className="tag-wrap" {...rise(0.05)}>
                                <img
                                    src="/img/landing/tag-values.svg"
                                    loading="lazy"
                                    alt=""
                                    className="tag-icon"
                                />
                                <div className="teg text-grey-02">
                                    {statistics.tag}
                                </div>
                            </motion.div>
                            <div className="title-wrap">
                                <motion.div
                                    className="heading-wrap mobile-heading"
                                    {...rise(0.15)}
                                >
                                    <h2 className="text-h3">
                                        {statistics.heading}
                                    </h2>
                                </motion.div>
                                <div className="sub-heading-wrap">
                                    <motion.p
                                        className="paragraph-02 text-grey-01"
                                        {...rise(0.25)}
                                    >
                                        {statistics.subheading}
                                    </motion.p>
                                </div>
                            </div>
                            <motion.div className="button-wrap" {...rise(0.35)}>
                                <RouterLink
                                    to="/contact"
                                    className="button-01 w-inline-block"
                                >
                                    <div className="button-dot" />
                                    <div className="button-text-wrap">
                                        <div className="paragraph-03">
                                            {statistics.buttonLabel}
                                        </div>
                                        <div className="paragraph-03">
                                            {statistics.buttonLabel}
                                        </div>
                                    </div>
                                </RouterLink>
                            </motion.div>
                        </div>
                        <div className="values-right">
                            {statistics.items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="values-list-wrap"
                                    {...rise(0.05 + index * 0.08)}
                                >
                                    <div className="values-list-left">
                                        <p className="paragraph-01 text-grey-01">
                                            {item.text}
                                        </p>
                                    </div>
                                    <div className="values-list-right">
                                        <div className="values-list-right-wrap">
                                            <div className="statistics-number-wrap">
                                                {item.slots.map((slot, i) => (
                                                    <Slot key={i} slot={slot} />
                                                ))}
                                            </div>
                                            <div className="paragraph-01 values-text">
                                                {item.label}
                                            </div>
                                        </div>
                                        {/* dot texture + hover highlight; in the
                                           template these are the shared
                                           --sf-img-20/21 background patterns */}
                                        <div className="values-list-bg-1">
                                            <img
                                                src="/img/landing/values-dots.avif"
                                                loading="lazy"
                                                alt="Dot BG"
                                                className="fit-cover"
                                            />
                                        </div>
                                        <div className="values-list-hover">
                                            <img
                                                src="/img/landing/values-hover.avif"
                                                loading="lazy"
                                                alt="Dot BG"
                                                className="fit-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="values-list-bg">
                                        <img
                                            src="/img/landing/values-row.avif"
                                            loading="lazy"
                                            alt="Image BG"
                                            className="fit-cover"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="values-bg-wrap">
                    <img
                        src="/img/landing/values-bg.svg"
                        loading="lazy"
                        alt=""
                        className="values-bg"
                    />
                </div>
            </div>
        </section>
    );
};

export default Statistics;
