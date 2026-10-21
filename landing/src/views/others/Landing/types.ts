export type LandingNavItem = {
    title: string
    value: string
    anchor: string
}

export type LandingHeroTab = {
    value: string
    label: string
    description: string
}

export type LandingHero = {
    headingLines: string[]
    subtext: string
    primaryCta: { label: string; href: string }
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
    stack: LandingTechItem[]
}

export type LandingModuleItem = {
    id: string
    title: string
    description: string
    icon: string
}

export type LandingModules = {
    heading: string
    subheading: string
    items: LandingModuleItem[]
}

export type LandingShowcaseStatus =
    | 'confirmed'
    | 'pickedUp'
    | 'paid'
    | 'pending'
    | 'returned'
    | 'available'
    | 'onRent'
    | 'maintenance'

export type LandingShowcaseStat = {
    label: string
    value: string
    hint: string
}

export type LandingShowcase = {
    statuses: Record<LandingShowcaseStatus, string>
    reservations: {
        eyebrow: string
        title: string
        badge: string
        columns: {
            reference: string
            customer: string
            vehicle: string
            dates: string
            status: string
        }
        stats: LandingShowcaseStat[]
        rows: {
            id: string
            customer: string
            vehicle: string
            dates: string
            status: LandingShowcaseStatus
        }[]
    }
    fleet: {
        eyebrow: string
        title: string
        badge: string
        items: {
            name: string
            plate: string
            status: LandingShowcaseStatus
            rate: string
            fuel: string
        }[]
    }
    payments: {
        eyebrow: string
        title: string
        badge: string
        stats: LandingShowcaseStat[]
        columns: { recent: string; period: string }
        rows: {
            id: string
            customer: string
            amount: string
            method: string
            status: LandingShowcaseStatus
        }[]
    }
    reports: {
        eyebrow: string
        title: string
        badge: string
        stats: LandingShowcaseStat[]
        chart: { title: string; trend: string }
        months: string[]
    }
}

export type LandingPricingPlan = {
    id: string
    name: string
    description: string
    price: string
    originalPrice: string
    period: string
    note: string
    saving: string
    badge: string
    highlighted: boolean
    ctaLabel: string
}

export type LandingPricing = {
    eyebrow: string
    heading: string
    subheading: string
    promo: string
    features: string[]
    plans: LandingPricingPlan[]
    note: string
    footnote: string
}

export type LandingFaqQuestion = {
    question: string
    answer: string
}

export type LandingFaqCategory = {
    id: string
    title: string
    questions: LandingFaqQuestion[]
}

export type LandingFaq = {
    eyebrow: string
    heading: string
    subheading: string
    categories: LandingFaqCategory[]
}

export type LandingCta = {
    title: string
    subtitle: string
    ctaLabel: string
    ctaHref: string
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
    modules: LandingModules
    showcase: LandingShowcase
    pricing: LandingPricing
    faq: LandingFaq
    cta: LandingCta
    footer: LandingFooter
}

export type Mode = 'light' | 'dark' | 'system'
