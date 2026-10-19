export type LandingNavItem = {
    title: string
    value: string
    anchor?: string
    hrefPattern?: string
}

export type LandingHeroTab = {
    value: string
    label: string
    description: string
}

export type LandingHero = {
    headingLines: [string, string]
    subtext: string
    primaryCta: string
    secondaryCta: { label: string; href: string }
    tabs: LandingHeroTab[]
}

export type LandingBentoCard = {
    title: string
    description: string
}

export type LandingBentoDocTag = {
    label: string
}

export type LandingBentoLocale = {
    flag: string
    text: string
    code: string
}

export type LandingBento = {
    heading: { primary: string; secondary: string }
    cards: {
        ai: LandingBentoCard
        theming: LandingBentoCard
        docs: LandingBentoCard & { floatingTags: LandingBentoDocTag[] }
        i18n: LandingBentoCard & { locales: LandingBentoLocale[] }
        responsive: LandingBentoCard
    }
}

export type LandingTechItem = {
    id: string
    image: string
    title: string
}

export type LandingTech = {
    heading: { primary: string; secondary: string }
    viteStack: LandingTechItem[]
    nextStack: LandingTechItem[]
}

export type LandingDemoItem = {
    id: string
    name: string
    path: string
}

export type LandingDemoCategory = {
    id: string
    name: string
    items: LandingDemoItem[]
}

export type LandingDemos = {
    heading: string
    subheading: string
    categories: LandingDemoCategory[]
}

export type LandingComponents = {
    heading: string
    subheading: string
}

export type LandingCta = {
    title: string
    subtitle: string
    purchaseLabel: string
    purchaseHref: string
    logoSrc: string
}

export type LandingFooter = {
    copyright: string
    brandText: string
}

export type LandingNav = {
    items: LandingNavItem[]
}

export type LandingPageContent = {
    nav: LandingNav
    hero: LandingHero
    bento: LandingBento
    tech: LandingTech
    demos: LandingDemos
    components: LandingComponents
    cta: LandingCta
    footer: LandingFooter
}

export type Mode = 'light' | 'dark' | 'system'
export type Framework = 'vite' | 'next'
