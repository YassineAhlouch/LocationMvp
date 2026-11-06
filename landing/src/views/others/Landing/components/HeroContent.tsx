import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router";
import type { ReactNode } from "react";
import type { LandingHero } from "../types";
import { localeImageBase } from "./localeImage";

/**
 * Exact port of the doublevdrive template hero section.
 *
 * The markup mirrors the Webflow DOM one-to-one (home-hero → home-hero-bg →
 * home-hero-container → hero-wrap → home-hero-top/bottom) and every style
 * lives in `src/assets/styles/others/_doublevdrive-hero.css` untouched. Images are
 * the extracted template assets already shipped in public/img/landing. The
 * inline title badges keep their template frame (gradient rounds + shadows)
 * but the glyphs were swapped for the fleet product: title-icon-01 carries
 * the brand mark (logo.svg medallion, white) and title-icon-02 a car icon;
 * template originals remain as title-icon-0{1,2}-example.avif/.svg.
 *
 * Navigation is NOT rendered here on purpose: the template's navbar
 * (.home-nav-02) is position:none/overlaid, and the app renders its fixed
 * floating navbar from LandingClient instead — identical pill, same visuals.
 */

/* Page-load animation mirroring the template's Webflow interactions:
   slight rise + blur → sharp, staggered top-to-bottom (easeOutQuad-ish). */
const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const rise = (delay: number, y = 24) => ({
    initial: { opacity: 0, y, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
});

/**
 * The hero's CTAs are content-driven (locale hrefs): internal paths like
 * /contact navigate in-SPA, plain hashes (#tour) keep the anchor jump.
 */
const LandingCta = ({
    href,
    className,
    children,
}: {
    href: string;
    className?: string;
    children: ReactNode;
}) =>
    href.startsWith("/") ? (
        <RouterLink to={href} className={className}>
            {children}
        </RouterLink>
    ) : (
        <a href={href} className={className}>
            {children}
        </a>
    );

const HeroContent = ({ content }: { content: LandingHero }) => {
    const { i18n } = useTranslation();
    const imageBase = localeImageBase(i18n.resolvedLanguage ?? i18n.language);
    return (
        <section className="home-hero" dir="ltr">
            <div className="home-hero-bg">
                <div className="home-hero-container">
                    {/* In-flow navbar slot — the template's .home-nav-02.
                    The real navbar is fixed (see NavigationBar); this empty
                    spacer keeps the hero geometry identical to the template. */}
                    <div className="home-nav-02" aria-hidden="true" />
                    <div className="hero-wrap">
                        <div className="home-hero-top">
                            <div className="home-hero-top-01">
                                <motion.div
                                    className="hero-tag-wrap"
                                    {...rise(0.05)}
                                >
                                    <img
                                        src="/img/landing/tag-hero.svg"
                                        loading="lazy"
                                        alt=""
                                        className="tag-icon"
                                    />
                                    <div className="teg text-grey-02">
                                        {content.badge}
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="hero-heading"
                                    {...rise(0.15)}
                                >
                                    <div className="hero-first-heading-wrap">
                                        <h1>{content.heading.top.before}</h1>
                                        <div className="hero-title-icon">
                                            <img
                                                src="/img/landing/title-icon-01.svg"
                                                loading="lazy"
                                                alt=""
                                                className="title-icon-01"
                                            />
                                            <img
                                                src="/img/landing/title-icon-02.svg"
                                                loading="lazy"
                                                alt=""
                                                className="title-icon-02"
                                            />
                                        </div>
                                        <h1>{content.heading.top.after}</h1>
                                    </div>
                                    <div className="hero-sec-heading-wrap">
                                        <h1>{content.heading.bottom.before}</h1>
                                        <div className="spcial-heading">
                                            <h1 className="spcial-h1">
                                                {
                                                    content.heading.bottom
                                                        .emphasis
                                                }
                                            </h1>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="hero-sub-heading"
                                    {...rise(0.25)}
                                >
                                    <p className="paragraph-02 text-grey-01">
                                        {content.subtext}
                                    </p>
                                </motion.div>
                            </div>
                            <motion.div
                                className="home-hero-top-02"
                                {...rise(0.35)}
                            >
                                <LandingCta
                                    href={content.secondaryCta.href}
                                    className="button-03 w-inline-block"
                                >
                                    <div className="button-text-wrap">
                                        <div className="paragraph-03">
                                            {content.secondaryCta.label}
                                        </div>
                                        <div
                                            className="paragraph-03"
                                            aria-hidden
                                        >
                                            {content.secondaryCta.label}
                                        </div>
                                    </div>
                                </LandingCta>
                                <LandingCta
                                    href={content.primaryCta.href}
                                    className="button-01 w-inline-block"
                                >
                                    <div className="button-dot" />
                                    <div className="button-text-wrap">
                                        <div className="paragraph-03">
                                            {content.primaryCta.label}
                                        </div>
                                        <div
                                            className="paragraph-03"
                                            aria-hidden
                                        >
                                            {content.primaryCta.label}
                                        </div>
                                    </div>
                                </LandingCta>
                            </motion.div>
                        </div>
                        <div className="home-hero-bottom">
                            <div className="hero-dashboard-wrap">
                                <motion.img
                                    //src="/img/landing/hero-dashboard.avif"
                                    src={`/img/landing/dashboard-preview-${imageBase}.png`}
                                    loading="lazy"
                                    alt="dashboard"
                                    className="hero-dashboard"
                                    {...rise(0.45, 40)}
                                />
                            </div>
                            <motion.img
                                src="/img/landing/hero-dashboard-bg.avif"
                                loading="lazy"
                                alt="Hero Image BG"
                                className="hero-dashboard-bg"
                                {...rise(0.5, 0)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroContent;
