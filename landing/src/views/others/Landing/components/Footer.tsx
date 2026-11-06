import { Fragment } from "react";
import { motion } from "motion/react";
import { Link as RouterLink } from "react-router";
import type { LandingFooter } from "../types";

/**
 * Exact port of the Colonia template footer section (`<section class=footer>`).
 * Source: landinginspriationdesign/index.html — https://colonia-template.webflow.io/
 *
 * A rounded orange `footer-main` artwork card holds a centered 680px column:
 * the two-line white h1-scale heading (each line = two h2 segments with the
 * template's inline `cta-icon` artwork between them — badge kept, glyphs
 * swapped for the brand medallion and a car; template originals kept as
 * footer-cta-icon-0{1,2}-example.avif/.svg), the tilted "Email Box"
 * artwork with its red glow, and a centered subtext + `button-01` pill whose
 * label rolls up on hover (the template's duplicated-label hover). A
 * `footer-bottom` row under the column carries the logo + copyright line
 * (`logo-light-full.svg` rebuilt as the gradient badge + white wordmark to
 * match the navbar logo; original kept as logo-light-full-example.svg).
 * Content copy is the template's; the CTA targets the app's `#contact` anchor,
 * and the scroll-rise motion mirrors the other Colonia ports. Rules live in
 * src/assets/styles/others/_colonia-footer.css.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
});

/* the template's inline heading icons (one artwork per heading line) */
const CTA_ICONS = [
    "/img/landing/footer-cta-icon-1.svg",
    "/img/landing/footer-cta-icon-2.svg",
];

const Footer = ({
    content,
    ctaHref = "#contact",
    ctaRoute,
}: {
    content: LandingFooter;
    /** CTA target (the landing keeps its #contact banner anchor; the
     *  contact page routes visitors back to "/#contact"). */
    ctaHref?: string;
    /** SPA target for the CTA pill (route wins over `ctaHref`). */
    ctaRoute?: string;
}) => {
    /* the CTA pill navigates in-SPA when a route is given (/contact) */
    const ctaLabel = (
        <>
            <div className="button-dot" />
            <div className="button-text-wrap">
                <div className="paragraph-03">{content.cta}</div>
                <div className="paragraph-03">{content.cta}</div>
            </div>
        </>
    );

    return (
        <section className="footer">
            <div className="footer-main">
                <div className="colonia-container">
                    <div className="footer-wrap">
                        <div className="footer-top">
                            <div className="footer-top-01">
                                {content.headingLines.map(
                                    (parts, lineIndex) => (
                                        <motion.div
                                            key={lineIndex}
                                            className="footer-top-01-1"
                                            {...rise(lineIndex * 0.1 + 0.05)}
                                        >
                                            {parts.map((part, partIndex) => (
                                                <Fragment key={partIndex}>
                                                    {partIndex > 0 && (
                                                        <img
                                                            src={
                                                                CTA_ICONS[
                                                                    lineIndex
                                                                ]
                                                            }
                                                            loading="lazy"
                                                            alt=""
                                                            aria-hidden="true"
                                                            className="cta-icon"
                                                        />
                                                    )}
                                                    <h2 className="text-light footer-title">
                                                        {part}
                                                    </h2>
                                                </Fragment>
                                            ))}
                                        </motion.div>
                                    ),
                                )}
                            </div>
                            <div className="footer-top-02">
                                {/* the template's IX2 ride lives on the wrap — keeping the
                                motion there preserves the css rotate(2.02deg) tilt */}
                                <motion.div
                                    className="footer-top-02-wrap"
                                    {...rise(0.25)}
                                >
                                    <img
                                        src="/img/landing/cta-box.avif"
                                        loading="lazy"
                                        alt=""
                                        aria-hidden="true"
                                        className="cta-box"
                                    />
                                </motion.div>
                            </div>
                            <motion.div
                                className="footer-top-03"
                                {...rise(0.35)}
                            >
                                <p className="paragraph-02 text-light">
                                    {content.subtext}
                                </p>
                                {ctaRoute ? (
                                    <RouterLink
                                        to={ctaRoute}
                                        className="button-01 w-inline-block"
                                    >
                                        {ctaLabel}
                                    </RouterLink>
                                ) : (
                                    <a
                                        href={ctaHref}
                                        className="button-01 w-inline-block"
                                    >
                                        {ctaLabel}
                                    </a>
                                )}
                            </motion.div>
                        </div>
                        <div className="footer-bottom">
                            <RouterLink
                                to="/"
                                className="footer-logo-wrap w-inline-block"
                            >
                                <img
                                    src="/img/logo/logo-light-full.svg"
                                    loading="lazy"
                                    alt="Double V Drive"
                                    className="footer-logo"
                                />
                            </RouterLink>
                            <div className="paragraph-03 text-light">
                                {content.copyright}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Footer;
