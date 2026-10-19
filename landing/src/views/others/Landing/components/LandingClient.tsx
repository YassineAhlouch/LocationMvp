import { useThemeStore } from '@/store/themeStore'
import useLocale from '@/utils/hooks/useLocale'
import Navigation from './NavigationBar'
import HeroContent from './HeroContent'
import BentoFeature from './BentoFeature'
import TechFeature from './TechFeature'
import Modules from './Modules'
import CallToAction from './CallToAction'
import Footer from './Footer'
import type { Tab } from './NavList'
import type { LandingPageContent } from '../types'

type Props = { content: LandingPageContent }

export default function LandingClient({ content }: Props) {
    const mode = useThemeStore((t) => t.mode)
    const setMode = useThemeStore((t) => t.setMode)
    const schema = useThemeStore((t) => t.themeSchema)
    const setSchema = useThemeStore((t) => t.setSchema)
    const { direction } = useLocale()

    const resolvedMode =
        mode === 'system'
            ? ((window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? 'dark'
                  : 'light') as 'dark' | 'light')
            : (mode as 'dark' | 'light')

    const navMenu: Tab[] = content.nav.items.map((item) => ({
        title: item.title,
        value: item.value,
        to: item.anchor,
    }))

    return (
        <main className="bg-white dark:bg-gray-900">
            <Navigation
                toggleMode={() =>
                    setMode(resolvedMode === 'light' ? 'dark' : 'light')
                }
                mode={resolvedMode}
                navMenu={navMenu}
                direction={direction}
            />
            <HeroContent
                content={content.hero}
                showcase={content.showcase}
            />
            <BentoFeature
                mode={resolvedMode}
                themeSchema={schema}
                onThemeChange={setSchema}
                setMode={setMode}
                content={content.bento}
            />
            <TechFeature stackList={content.tech.stack} content={content.tech} />
            <Modules content={content.modules} />
            <CallToAction content={content.cta} />
            <Footer content={content.footer} />
        </main>
    )
}
