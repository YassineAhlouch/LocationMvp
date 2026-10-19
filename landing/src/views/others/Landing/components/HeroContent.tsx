import { useState } from 'react'
import Button from '@/components/ui/Button'
import ComponentsShowcase from './ComponentsShowcase'
import VersatileLayoutShowcase from './VersatileLayoutShowcase'
import { motion, AnimatePresence } from 'motion/react'
import HeroTab from './HeroTab'
import useDemoUrl from '../hooks/useDemoUrl'
import { LiChevronLeft, LiChevronRight } from '@/icons'
import type { LandingHero } from '../types'
import type { Mode, Framework } from '../types'

const HeroContent = ({
    mode,
    onThemeChange,
    themeSchema,
    framework,
    content,
}: {
    mode: Mode
    onThemeChange: (theme: string) => void
    themeSchema: string
    framework: Framework
    content: LandingHero
}) => {
    const [selectedTab, setSelectedTab] = useState(content.tabs[0].value)
    const url = useDemoUrl(framework)

    const currentIndex = content.tabs.findIndex(
        (tab) => tab.value === selectedTab,
    )
    const currentTab = content.tabs[currentIndex]

    const handlePrev = () =>
        setSelectedTab(
            content.tabs[
                (currentIndex - 1 + content.tabs.length) % content.tabs.length
            ].value,
        )
    const handleNext = () =>
        setSelectedTab(
            content.tabs[(currentIndex + 1) % content.tabs.length].value,
        )

    return (
        <section className="flex min-h-screen flex-col items-center justify-between mb-6 md:mb-24 relative">
            <svg
                width="100%"
                height="100%"
                className="text-gray-300 dark:text-gray-800 mask-t-from-50% mask-b-from-80% absolute inset-0"
            >
                <defs>
                    <pattern
                        id="hero-pattern"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect
                            x="5.5"
                            y="5.5"
                            width="1"
                            height="1"
                            fill="currentColor"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hero-pattern)" />
            </svg>
            <div className="flex flex-col min-h-screen justify-between pt-40 lg:pt-20 xl:pt-40 relative overflow-hidden w-full">
                <div className="max-w-7xl mx-auto px-4 lg:px-0">
                    <h1 className="flex flex-col text-center text-3xl md:text-6xl gap-1 leading-tight tracking-tight">
                        <span>{content.headingLines[0]}</span>
                        <span>{content.headingLines[1]}</span>
                    </h1>
                    <motion.p className="text-center mt-6 text-base md:text-lg max-w-3xl mx-auto relative z-10 font-normal">
                        {content.subtext}
                    </motion.p>
                    <motion.div className="flex items-center gap-2 justify-center mt-6 relative z-10">
                        <Button
                            asElement="a"
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {content.primaryCta}
                        </Button>
                        <Button
                            asElement="a"
                            href={content.secondaryCta.href}
                            target="_blank"
                            rel="noreferrer"
                            variant="solid"
                        >
                            {content.secondaryCta.label}
                        </Button>
                    </motion.div>
                </div>
                <div>
                    <div className="border-t border-gray-200 dark:border-gray-700 md:mt-10 xl:mt-20">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-12">
                                <div className="col-span-1" />
                                <div className="col-span-10 border-r border-l border-dashed border-gray-200 dark:border-gray-700 pb-12">
                                    {/* Mobile nav */}
                                    <div className="md:hidden flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                        <div className="flex items-center justify-between w-full p-4">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <div className="font-bold heading-text text-lg">
                                                        {currentTab.label}
                                                    </div>
                                                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                                                        {currentTab.description}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={handlePrev}
                                                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <LiChevronLeft className="text-xl" />
                                                </button>
                                                <button
                                                    onClick={handleNext}
                                                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <LiChevronRight className="text-xl" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Desktop tabs */}
                                    <div className="hidden md:flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 lg:divide-x divide-gray-200 dark:divide-gray-700">
                                        {content.tabs.map((tab) => (
                                            <HeroTab
                                                key={tab.label}
                                                label={tab.label}
                                                value={tab.value}
                                                description={tab.description}
                                                isActive={
                                                    selectedTab === tab.value
                                                }
                                                onClick={() =>
                                                    setSelectedTab(tab.value)
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-1" />
                            </div>
                        </div>
                    </div>
                    <div className="px-4">
                        <div className="max-w-7xl lg:mx-auto px-2 lg:px-4 border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-700 rounded-lg relative">
                            <div className="flex flex-1 gap-2 py-1 lg:py-2.5">
                                <div className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#ED6A5E] hidden md:block" />
                                <div className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#F4BF4E] hidden md:block" />
                                <div className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#61C655] hidden md:block" />
                            </div>
                            <div className="bg-white dark:bg-black dark:border-gray-700 border border-gray-200 rounded-lg h-58 md:h-100 lg:h-145 xl:h-175 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {selectedTab === 'production-apps' && (
                                        <motion.div
                                            key="production-apps"
                                            initial={{
                                                opacity: 0,
                                                y: 5,
                                                scale: 0.97,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: 5,
                                                scale: 0.97,
                                            }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            {mode === 'light' && (
                                                <img
                                                    className="rounded-lg"
                                                    src="/img/landing/production-ready-light.webp"
                                                    alt="Eyris production apps"
                                                />
                                            )}
                                            {mode === 'dark' && (
                                                <img
                                                    className="rounded-lg"
                                                    src="/img/landing/production-ready-dark.webp"
                                                    alt="Eyris production apps"
                                                />
                                            )}
                                        </motion.div>
                                    )}
                                    {selectedTab === 'components-blocks' && (
                                        <motion.div
                                            key="components-blocks"
                                            initial={{
                                                opacity: 0,
                                                y: 5,
                                                scale: 0.95,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: 5,
                                                scale: 0.95,
                                            }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <ComponentsShowcase
                                                onThemeChange={onThemeChange}
                                                themeSchema={themeSchema}
                                                mode={mode}
                                            />
                                        </motion.div>
                                    )}
                                    {selectedTab === 'ai-ready-mcp' && (
                                        <motion.div
                                            key="ai-ready-mcp"
                                            initial={{
                                                opacity: 0,
                                                y: 5,
                                                scale: 0.95,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: 5,
                                                scale: 0.95,
                                            }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            {mode === 'light' && (
                                                <img
                                                    className="rounded-lg"
                                                    src="/img/landing/ai-ready-light.webp"
                                                    alt="Eyris AI ready"
                                                />
                                            )}
                                            {mode === 'dark' && (
                                                <img
                                                    className="rounded-lg"
                                                    src="/img/landing/ai-ready-dark.webp"
                                                    alt="Eyris AI ready"
                                                />
                                            )}
                                        </motion.div>
                                    )}
                                    {selectedTab === 'versatile-layouts' && (
                                        <VersatileLayoutShowcase mode={mode} />
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-20 md:h-40 w-full bg-linear-to-b from-transparent via-white to-white dark:via-gray-900/50 dark:to-gray-900 scale-[1.1] pointer-events-none z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroContent
