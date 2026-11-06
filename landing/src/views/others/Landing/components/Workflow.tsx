import { motion } from "motion/react";
import type { LandingWorkflow } from "../types";

/**
 * Exact port of the doublevdrive template "works" section.
 *
 * A rounded dark-orange banner (`works-main`) carrying the template's vivid
 * gradient artwork holds a sticky light intro (`works-top`: white tag
 * "How It Works" + big h1 — the template has no sub-heading slot here, so the
 * localized `subtext` stays in the locales unused) and the `works-bottom`
 * column of white step cards. Each `work-card-wrap` carries one of the
 * template's `work-card-01/02/03` classes — sticky and rotated so the cards
 * pile up while scrolling; on ≤479px they go static (template rule).
 * The rental flow has six steps, so the three template classes cycle and the
 * card title follows the template's "Step N – Title" format.
 * All styling lives in src/assets/styles/others/_doublevdrive-works.css.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
});

/** The cards' transform is reserved for the template's rotation classes, so
    they only fade in with a blur (no y movement). */
const fade = (delay: number) => ({
    initial: { opacity: 0, filter: "blur(10px)" },
    whileInView: { opacity: 1, filter: "blur(0px)" },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
});

/** Template card classes cycle across the six rental steps. */
const CARD_CLASSES = ["work-card-01", "work-card-02", "work-card-03"];

const stepsArgs = (label: string, title: string, index: number) =>
    `${label} ${index + 1} – ${title}`;

const Workflow = ({ content }: { content: LandingWorkflow }) => (
    <section id="workflow" className="works">
        <div className="works-main">
            <div className="doublevdrive-container">
                <div className="works-wrap">
                    <div className="works-top">
                        <motion.div className="tag-wrap" {...rise(0.05)}>
                            <img
                                src="/img/landing/tag-works.svg"
                                loading="lazy"
                                alt=""
                                className="tag-icon"
                            />
                            <div className="teg text-light">{content.tag}</div>
                        </motion.div>
                        <motion.div className="heading-wrap" {...rise(0.15)}>
                            <h1 className="text-h1">{content.heading}</h1>
                        </motion.div>
                    </div>
                    <div className="works-bottom">
                        {content.steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className={`work-card-wrap ${
                                    CARD_CLASSES[index % CARD_CLASSES.length]
                                }`}
                                /* the template's work-card-01/02/03 pair
                                   z-index 1-3 with the rotation classes, but
                                   they cycle across six steps — steps 4-6
                                   would slip UNDER step 3 (z 3) again, so
                                   every card raises its own layer instead */
                                style={{ zIndex: index + 1 }}
                                {...fade(0.05 + (index % 3) * 0.12)}
                            >
                                <h2>
                                    {stepsArgs(
                                        content.stepLabel,
                                        step.title,
                                        index,
                                    )}
                                </h2>
                                <p className="paragraph-01 text-grey-01">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="works-bg-wrap" aria-hidden="true">
                <img
                    src="/img/landing/works-bg.avif"
                    loading="lazy"
                    alt=""
                    className="fit-cover"
                />
            </div>
        </div>
    </section>
);

export default Workflow;
