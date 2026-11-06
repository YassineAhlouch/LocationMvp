import { motion } from "motion/react";
import type { LandingProfitability, LandingProfitHighlight } from "../types";

/**
 * Exact port of the doublevdrive template "benefits" section.
 *
 * A centered intro column (tag, one-line heading, sub-heading) sits above a
 * 4-column grid of eight cards. Each card is a 5px-padded `benefits-list-wrap`
 * around a grey `benefits-list-main` holding the orange icon tile, title and
 * description. On hover (~0.5s ease) the gradient ring — `.benefits-list-bg`,
 * the template's --sf-img-26 pattern (benefits-hover.avif) — fades in around
 * the card and the tile's gradient crossfades from the light
 * `.benefits-icon-01` to the deep red `.benefits-icon-02`; the card interior
 * itself doesn't change. The glyph images fill the whole 50px tile (the
 * template's global img sizing) with their artwork drawn centered in the
 * 24×25 viewBoxes. All styling lives in
 * src/assets/styles/others/_doublevdrive-benefits.css.
 *
 * The vehicle performance preview below the grid is an app extra kept from
 * the previous design.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
});

const BenefitCard = ({
    item,
    index,
}: {
    item: LandingProfitHighlight;
    index: number;
}) => (
    <motion.div className="benefits-list-wrap" {...rise(0.15 + index * 0.05)}>
        <div className="benefits-list-main">
            <div className="benefits-list-icon-wrap">
                <div className="benefits-icon-01" />
                <div className="benefits-icon-02" />
                <img
                    src={`/img/landing/benefit-glyph-${index + 1}.svg`}
                    loading="lazy"
                    alt=""
                    className="benefits-icon"
                />
            </div>
            <div className="benefits-list-bottom">
                <div className="paragraph-02">{item.title}</div>
                <div className="paragraph-03 text-grey-01">
                    {item.description}
                </div>
            </div>
        </div>
        {/* gradient ring revealed on hover (template: transparent SVG img
           carrying the --sf-img-26 background pattern) */}
        <div className="benefits-list-bg">
            <img
                src="/img/landing/benefits-hover.avif"
                loading="lazy"
                alt="Benefits BG"
                className="fit-cover"
            />
        </div>
    </motion.div>
);

const Profitability = ({ content }: { content: LandingProfitability }) => (
    <>
        <section id="profitability" dir="ltr" className="benefits">
            <div className="doublevdrive-container container-v3">
                <div className="benefits-wrap">
                    <motion.div className="benefits-top" {...rise(0.05)}>
                        <div className="tag-wrap">
                            <img
                                src="/img/landing/tag-benefits.svg"
                                loading="lazy"
                                alt=""
                                className="tag-icon"
                            />
                            <div className="teg text-grey-02">
                                {content.tag}
                            </div>
                        </div>
                        <div className="title-wrap">
                            <motion.div
                                className="heading-wrap mobile-heading"
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
                    </motion.div>
                    <div className="benefits-bottom">
                        {content.highlights.map((item, index) => (
                            <BenefitCard
                                key={item.id}
                                item={item}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    </>
);

export default Profitability;
