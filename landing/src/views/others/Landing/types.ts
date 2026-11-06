export type LandingNavItem = {
    title: string
    value: string
    /** In-page anchor id — smooth-scrolled with react-scroll (landing). */
    anchor?: string
    /** SPA route (react-router), e.g. /contact — renders as a plain link. */
    route?: string
}

export type LandingCtaLink = { label: string; href: string }

export type LandingHeroHeadingTop = {
    /** Text rendered before the inline title-icon pair (e.g. "Shrink Your"). */
    before: string
    /** Text rendered after the inline title-icon pair (e.g. "Footprint,"). */
    after: string
}

export type LandingHeroHeadingBottom = {
    /** Regular heading text next to the highlighted chip (e.g. "Grow Your"). */
    before: string
    /** Text inside the orange gradient chip (e.g. "Impact"). */
    emphasis: string
}

export type LandingHero = {
    badge: string
    heading: {
        top: LandingHeroHeadingTop
        bottom: LandingHeroHeadingBottom
    }
    subtext: string
    primaryCta: LandingCtaLink
    secondaryCta: LandingCtaLink
}

export type LandingModuleItem = {
    id: string
    title: string
    description: string
    /** Legacy icon key from the earlier app-styled layout (not used by the
     * template port — card images come from feature-*.avif). */
    icon?: string
}

export type LandingModules = {
    tag: string
    heading: string
    subheading: string
    items: LandingModuleItem[]
}

/** One module card of the app-specific "Clear View" section. */
export type LandingClearViewItem = {
    id: string
    /** Card label rendered as the template-style big number ("01"–"06"). */
    number: string
    title: string
    description: string
}

export type LandingClearView = {
    tag: string
    heading: string
    subheading: string
    items: LandingClearViewItem[]
}

export type LandingWorkflowStep = {
    id: string
    title: string
    description: string
}

export type LandingWorkflow = {
    tag: string
    heading: string
    subtext: string
    /** Localized "Step" word for the template's "Step N – Title" card heading. */
    stepLabel: string
    steps: LandingWorkflowStep[]
}

export type LandingProfitHighlight = {
    id: string
    title: string
    description: string
}

export type LandingProfitability = {
    tag: string
    heading: string
    subtext: string
    highlights: LandingProfitHighlight[]
}

export type LandingImpactCard = {
    id: string
    title: string
    description: string
}

export type LandingImpactTracking = {
    tag: string
    heading: string
    subtext: string
    cards: LandingImpactCard[]
}

export type LandingIntegration = {
    tag: string
    heading: string
    subtext: string
}

/** One info box of the contact page's top row (the template contact-top). */
export type LandingContactBox = {
    title: string
    text: string
    pill: string
    /** wa: → wa.me deep link using the rest as the prefilled message; else raw href. */
    href: string
}

/** The dedicated /contact page copy (template contact section + the lead form). */
export type LandingContactPage = {
    tag: string
    heading: string
    subtext: string
    boxes: LandingContactBox[]
    formIntro: {
        tag: string
        heading: string
        subtext: string
    }
    form: {
        fullName: string
        phFullName: string
        agency: string
        phAgency: string
        phone: string
        phPhone: string
        email: string
        phEmail: string
        message: string
        phMessage: string
        submit: string
        sending: string
    }
    successText: string
    errors: {
        name: string
        phone: string
        unexpected: string
        unreachable: string
        invalidFields: string
        server: string
    }
}

export type LandingPricingPlan = {
    name: string
    description: string
    price: string
    features: string[]
    cta: string
    /** the template's middle card (`bg-transparent` dark-orange artwork) */
    dark?: boolean
}

export type LandingPricing = {
    tag: string
    heading: string
    subtext: string
    plans: LandingPricingPlan[]
}

export type LandingFaqQuestion = {
    question: string
    answer: string
}

export type LandingFaq = {
    tag: string
    heading: string
    subheading: string
    questions: LandingFaqQuestion[]
    cta: { title: string; accent: string; text: string; button: string }
}

export type LandingTransparency = {
    tag: string
    heading: string
    /** Lines break at template-authentic points via whitespace-pre-line. */
    subtext: string
}

export type LandingFooter = {
    /** Each heading line: two text segments with the template's inline cta
     *  icon artwork between them. */
    headingLines: string[][]
    subtext: string
    cta: string
    copyright: string
}

/** One "slot" of the values counter:
 *  - reel: a static digit strip — `upper` boxes anchor the column flex-end
 *    (the strip's LAST digit shows), `lower` boxes anchor normally (FIRST
 *    digit shows, rendered grey), exactly like the template's baked rolls.
 *  - text: a plain suffix such as "K+", "%" or the smaller "." separator
 *    (which carries no .text-h1 class in the template). */
export type LandingStatSlot =
    | { type: 'reel'; variant: 'upper' | 'lower'; strip: string }
    | { type: 'text'; text: string; size: 'h1' | 'dot' }

export type LandingStatItem = {
    id: string
    /** Copy shown left of the statistic tile (values-list-left). */
    text: string
    slots: LandingStatSlot[]
    /** Label under the counter, e.g. "Businesses". */
    label: string
}

export type LandingStatistics = {
    tag: string
    heading: string
    subheading: string
    buttonLabel: string
    items: LandingStatItem[]
}

export type LandingTestimonialItem = {
    quote: string
    attribution: string
}

export type LandingTestimonials = {
    tag: string
    heading: string
    subtext: string
    items: LandingTestimonialItem[]
}

export type LandingPageContent = {
    nav: { items: LandingNavItem[] }
    hero: LandingHero
    modules: LandingModules
    statistics: LandingStatistics
    clearView: LandingClearView
    workflow: LandingWorkflow
    profitability: LandingProfitability
    impactTracking: LandingImpactTracking
    contactPage: LandingContactPage
    integration: LandingIntegration
    pricing: LandingPricing
    testimonials: LandingTestimonials
    faq: LandingFaq
    transparency: LandingTransparency
    footer: LandingFooter
}

export type Mode = 'light' | 'dark' | 'system'
