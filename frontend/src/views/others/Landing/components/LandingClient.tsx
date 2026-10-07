import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useThemeStore } from '@/store/themeStore'
import Navigation from './NavigationBar'
import FrameworkSwitcher from './FrameworkSwitcher'
import HeroContent from './HeroContent'
import BentoFeature from './BentoFeature'
import TechFeature from './TechFeature'
import Demos from './Demos'
import Components from './Components'
import CallToAction from './CallToAction'
import Footer from './Footer'
import ViteLogo from '@/components/svg/logos/Vite'
import NextJsLogo from '@/components/svg/logos/NextJs'
import type { Tab } from './NavList'
import type { LandingPageContent } from '../types'
import type { Framework } from '../types'

type Props = { content: LandingPageContent }

export default function LandingClient({ content }: Props) {
    const mode = useThemeStore((t) => t.mode)
    const setMode = useThemeStore((t) => t.setMode)
    const schema = useThemeStore((t) => t.themeSchema)
    const setSchema = useThemeStore((t) => t.setSchema)

    const resolvedMode =
        mode === 'system'
            ? ((window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? 'dark'
                  : 'light') as 'dark' | 'light')
            : (mode as 'dark' | 'light')

    const [framework, setFramework] = useState<Framework>('next')
    const [switchedTo, setSwitchedTo] = useState<Framework | null>(null)
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const stackList =
        framework === 'next' ? content.tech.nextStack : content.tech.viteStack

    const navMenu: Tab[] = content.nav.items.map((item) =>
        item.anchor
            ? { title: item.title, value: item.value, to: item.anchor }
            : {
                  title: item.title,
                  value: item.value,
                  href: item.hrefPattern!.replace('{framework}', framework),
              },
    )

    const handleFrameworkChange = (f: Framework) => {
        setFramework(f)
        setSwitchedTo(f)
        if (toastTimer.current) clearTimeout(toastTimer.current)
        toastTimer.current = setTimeout(() => setSwitchedTo(null), 2200)
    }

    return (
        <main className="bg-white dark:bg-gray-900">
            <Navigation
                toggleMode={() =>
                    setMode(resolvedMode === 'light' ? 'dark' : 'light')
                }
                mode={resolvedMode}
                navMenu={navMenu}
                extra={
                    <FrameworkSwitcher
                        framework={framework}
                        onChange={handleFrameworkChange}
                    />
                }
            />
            <HeroContent
                mode={resolvedMode}
                themeSchema={schema}
                onThemeChange={setSchema}
                framework={framework}
                content={content.hero}
            />
            <BentoFeature
                mode={resolvedMode}
                themeSchema={schema}
                onThemeChange={setSchema}
                setMode={setMode}
                content={content.bento}
            />
            <TechFeature stackList={stackList} content={content.tech} />
            <Demos
                mode={resolvedMode}
                framework={framework}
                content={content.demos}
            />
            <Components framework={framework} content={content.components} />
            <CallToAction content={content.cta} />
            <Footer content={content.footer} />

            <AnimatePresence>
                {switchedTo && (
                    <motion.div
                        key={switchedTo}
                        initial={{ opacity: 0, y: -6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium shadow-lg pointer-events-none whitespace-nowrap"
                    >
                        {switchedTo === 'vite' ? (
                            <ViteLogo width={15} height={15} />
                        ) : (
                            <NextJsLogo
                                width={15}
                                height={15}
                                className="invert dark:invert-0"
                            />
                        )}
                        Now viewing {switchedTo === 'vite' ? 'Vite' : 'Next.js'}{' '}
                        version
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
