import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { LandingImpactTracking } from "../types";
import { localeImageBase, localeImageSuffix } from "./localeImage";

/**
 * Exact port of the doublevdrive template "resources" section.
 *
 * A centered intro column (Business Performance tag, "Performance Tracking"
 * heading, sub-heading) sits above the 627px-tall `resources-image-box`: the
 * tracking dashboard screenshot (`resources-main-{en,fr,ar}.png`, picked per
 * active language, 16px top radius) covering a full-bleed warm gradient mat
 * (`fit-cover.avif`) that peeks through the 20px side/top padding. Below it,
 * `resources-box-wrap` shows the two insight cards (Fleet Utilization /
 * Revenue vs Expenses), each carrying a wide chart illustration
 * (`resources-inner*.avif`, max 500px, with -fr/-ar localized variants like
 * the feature grid; the template originals are kept as
 * `resources-inner-example*.avif`) over a white `resources-box-bottom` with
 * the title and description. All styling lives in
 * src/assets/styles/others/_doublevdrive-resources.css.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
});

const ImpactTracking = ({ content }: { content: LandingImpactTracking }) => {
    const { i18n } = useTranslation();
    const imageBase = localeImageBase(i18n.resolvedLanguage ?? i18n.language);
    const imageSuffix = localeImageSuffix(
        i18n.resolvedLanguage ?? i18n.language,
    );

    /** Section illustration per card id, localized like the feature grid. */
    const CARD_IMAGES: Record<string, string> = {
        survey: `/img/landing/resources-inner${imageSuffix}.avif`,
        emissions: `/img/landing/resources-inner-2${imageSuffix}.avif`,
    };
    return (
        <section id="impact-tracking" dir="ltr" className="resources">
            <div className="doublevdrive-container container-v3">
                <div className="resources-wrap">
                    <div className="resources-top">
                        <motion.div className="tag-wrap" {...rise(0.05)}>
                            <img
                                src="/img/landing/tag-resources.svg"
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
                    <div className="resources-bottom">
                        <motion.div
                            className="resources-image-box"
                            {...rise(0.05)}
                        >
                            <div className="resources-image">
                                <img
                                    src={`/img/landing/resources-main-${imageBase}.png`}
                                    loading="lazy"
                                    alt="Impact tracking dashboard"
                                    className="resources-images"
                                />
                            </div>
                            <div className="resources-image-bg">
                                <img
                                    src="/img/landing/fit-cover.avif"
                                    loading="lazy"
                                    alt="Resources Card Image Bg"
                                    className="fit-cover"
                                />
                            </div>
                        </motion.div>
                        <div className="resources-box-wrap">
                            {content.cards.map((card, index) => (
                                <motion.div
                                    key={card.id}
                                    className="resources-box-inner"
                                    {...rise(0.05 + index * 0.1)}
                                >
                                    <div className="resources-box-top">
                                        <img
                                            src={
                                                CARD_IMAGES[card.id] ??
                                                CARD_IMAGES.survey
                                            }
                                            loading="lazy"
                                            alt={card.title}
                                            className="resources-inner-image"
                                        />
                                    </div>
                                    <div className="resources-box-bottom">
                                        <div className="paragraph-02">
                                            {card.title}
                                        </div>
                                        <div className="paragraph-03 text-grey-01">
                                            {card.description}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImpactTracking;
