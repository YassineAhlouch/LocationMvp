import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { LandingModules } from "../types";
import { localeImageSuffix } from "./localeImage";

/**
 * Exact port of the doublevdrive template "features-v1" section.
 *
 * The markup mirrors the Webflow DOM one-to-one (features-v1 → container →
 * features-v1-wrap → features-v1-top/-bottom) and every style lives in
 * `src/assets/styles/others/_doublevdrive-features.css` (design tokens are shared
 * with the hero port). Card images are custom mockups of the real dashboard
 * cards (public/img/landing/feature-1..6.avif), generated at the same aspect
 * ratios as the template assets they replace. Localized variants ship as
 * feature-1..6-fr.avif and feature-1..6-ar.avif (RTL, Noto Sans Arabic) and
 * are picked below from the active language so the images match the copy.
 */

/* The template sizes its six card images through four variants,
   cycled 1, 2, 1, 3, 4, 4 down the grid. */
const CARD_IMAGE_CLASSES = [
    "features-v1-image-1",
    "features-v1-image-2",
    "features-v1-image-1",
    "features-v1-image-3",
    "features-v1-image-4",
    "features-v1-image-4",
] as const;

/* Scroll-in animation mirroring the template's Webflow interactions. */
const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
});

/* Image suffix per active language — the FR/AR sets render the same card
   mockups with localized labels (ar ships RTL). */
const Modules = ({ content }: { content: LandingModules }) => {
    const { i18n } = useTranslation();
    const imageSuffix = localeImageSuffix(
        i18n.resolvedLanguage ?? i18n.language,
    );
    return (
        <section id="features" className="features-v1" dir="ltr">
            <div className="doublevdrive-container">
                <div className="features-v1-wrap">
                    <div className="features-v1-top">
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
                    <div className="features-v1-bottom">
                        {content.items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="features-v1-list"
                                {...rise(0.05 + index * 0.06)}
                            >
                                <div
                                    className={`features-v1-list-top ${
                                        CARD_IMAGE_CLASSES[
                                            index % CARD_IMAGE_CLASSES.length
                                        ]
                                    }`}
                                >
                                    <img
                                        src={`/img/landing/feature-${index + 1}${imageSuffix}.avif`}
                                        loading="lazy"
                                        alt={item.title}
                                        className="features-v1-image"
                                    />
                                </div>
                                <div className="features-v1-list-bottom">
                                    <div className="paragraph-02">
                                        {item.title}
                                    </div>
                                    <div className="paragraph-03 text-grey-01">
                                        {item.description}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Modules;
