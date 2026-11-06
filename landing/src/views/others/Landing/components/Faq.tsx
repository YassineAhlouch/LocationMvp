import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link as RouterLink } from "react-router";
import classNames from "@/utils/classNames";
import type { LandingPageContent, LandingFaqQuestion } from "../types";

/**
 * Exact port of the doublevdrive template faq section (`<section class=faq>`).
 *
 * The template's anatomy carries the app's content unchanged: a centered 470px
 * intro (tag row with the 16px quote glyph + teg grey-02 text, text-h3 heading
 * and the paragraph-02 grey-01 sub-heading), then a 660px column of grey
 * accordions (`faq-list`, radius-slim, each a `faq-question` flex row with the
 * 22px chevron artwork and a height-animated `faq-answers` box whose
 * `faq-answer-text` paragraph holds the answer). Keeping the app's behaviour:
 * one row open at a time and the chevron flipping 180°. The template's IX2
 * height animation maps to the existing motion/react height toggle, and rows
 * get the shared blur-rise entrance (rows widen the in-view margin to 200px
 * below the fold so fast scrolls can't skip the stagger). The app's dark
 * demo-CTA card stays below the rows (app content the template doesn't
 * carry); its `cta-icon.svg` badge keeps the template's white rounded-square
 * design but the glyph is now a car (template original kept as
 * cta-icon-example.avif/.svg). Rules live in
 * src/assets/styles/others/_doublevdrive-faq.css.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
});

const Question = ({
    question,
    answer,
    isOpen,
    onToggle,
}: {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}) => (
    <div className="faq-list" aria-expanded={isOpen} onClick={onToggle}>
        <div className="faq-question">
            <div className="paragraph-02">{question}</div>
            {/* the template's 22px chevron artwork, flipped open */}
            <div className="faq-icon-box">
                <img
                    src="/img/landing/faq-icon.svg"
                    alt=""
                    aria-hidden="true"
                    className={classNames(
                        "faq-icon transition-transform duration-200",
                        isOpen && "rotate-180",
                    )}
                />
            </div>
        </div>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="faq-answers"
                >
                    <p className="paragraph-03 faq-answer-text">{answer}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const Faq = ({ content }: { content: LandingPageContent }) => {
    const faq = content.faq;
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section id="faq" className="faq">
            <div className="doublevdrive-container">
                <div className="faq-wrap">
                    <div className="faq-top">
                        <motion.div className="tag-wrap" {...rise(0.05)}>
                            <img
                                src="/img/landing/tag-faq.svg"
                                loading="lazy"
                                alt=""
                                className="tag-icon"
                            />
                            <div className="teg text-grey-02">{faq.tag}</div>
                        </motion.div>
                        <div className="title-wrap">
                            <motion.div
                                className="heading-wrap"
                                {...rise(0.15)}
                            >
                                <h2 className="text-h3">{faq.heading}</h2>
                            </motion.div>
                            <motion.div {...rise(0.25)}>
                                <p className="paragraph-02 text-grey-01">
                                    {faq.subheading}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                    <div className="faq-bottom">
                        <div className="faq-collection-list">
                            {faq.questions.map(
                                (item: LandingFaqQuestion, index: number) => (
                                    <motion.div
                                        key={item.question}
                                        {...rise(0.2 + index * 0.05)}
                                        viewport={{
                                            once: true,
                                            margin: "0px 0px 200px 0px",
                                        }}
                                    >
                                        <Question
                                            question={item.question}
                                            answer={item.answer}
                                            isOpen={openIndex === index}
                                            onToggle={() =>
                                                setOpenIndex(
                                                    openIndex === index
                                                        ? -1
                                                        : index,
                                                )
                                            }
                                        />
                                    </motion.div>
                                ),
                            )}

                            {/* Demo CTA */}
                            <div className="col-card bg-[#171717] dark:bg-[#232323] p-6 sm:p-8 mt-4">
                                <img
                                    src="/img/landing/cta-icon.svg"
                                    alt=""
                                    aria-hidden="true"
                                    className="h-[50px] w-[50px]"
                                />
                                <p className="col-h5 mt-4">
                                    <span className="text-white">
                                        {content.faq.cta.title}{" "}
                                    </span>
                                    <span className="text-[#f8f8f8]/60 font-medium">
                                        {content.faq.cta.accent}
                                    </span>
                                </p>
                                <p className="mt-2 col-p3 text-[#f8f8f8]/70">
                                    {content.faq.cta.text}
                                </p>
                                <RouterLink
                                    to="/contact"
                                    className="col-btn col-btn-white col-p3 mt-5 w-fit dark:text-[#171717]!"
                                >
                                    {content.faq.cta.button}
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Faq;
