import Button from '@/components/ui/Button'
import type { LandingCta } from '../types'

const DashedVLine = () => (
    <svg width={1} height="100%" className="text-gray-200 dark:text-gray-800">
        <line
            x1="0.5"
            y1={0}
            x2="0.5"
            y2="100%"
            stroke="currentColor"
            strokeDasharray="4 6"
            strokeLinecap="round"
        />
    </svg>
)

const DashedHLine = () => (
    <svg width="100%" height={1} className="text-gray-200 dark:text-gray-800">
        <line
            x1={0}
            y1="0.5"
            x2="100%"
            y2="0.5"
            stroke="currentColor"
            strokeDasharray="4 6"
            strokeLinecap="round"
        />
    </svg>
)

const CallToAction = ({ content }: { content: LandingCta }) => (
    <section id="cta" className="border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto border-r border-l border-gray-200 dark:border-gray-700 relative">
            <div className="absolute inset-0">
                <div className="absolute inset-x-[0.5px] inset-y-0 flex justify-evenly">
                    {Array.from({ length: 22 }).map((_, i) => (
                        <DashedVLine key={i} />
                    ))}
                </div>
                <div className="absolute inset-x-0 inset-y-[0.5px] flex flex-col justify-evenly">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <DashedHLine key={i} />
                    ))}
                </div>
            </div>
            <div className="py-10 z-10">
                <div className="flex items-center justify-center text-center">
                    <div className="max-w-[450px] mx-auto py-20 z-10">
                        <img
                            src={content.logoSrc}
                            alt="Logo"
                            width={58}
                            height={58}
                            className="mx-auto mb-4 max-w-[58px]"
                        />
                        <div className="bg-white dark:bg-gray-900">
                            <h3 className="max-w-200 leading-snug flex flex-col text-center">
                                <span>{content.title}</span>
                                <span className="text-slate-400 font-medium">
                                    {content.subtitle}
                                </span>
                            </h3>
                            <div className="flex justify-center gap-2 mt-6">
                                <Button
                                    asElement="a"
                                    href={content.purchaseHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    variant="subtle"
                                >
                                    {content.purchaseLabel}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
)

export default CallToAction
