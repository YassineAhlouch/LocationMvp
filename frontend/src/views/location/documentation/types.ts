export type DocsLang = 'en' | 'fr' | 'ar'

export type Tone =
    | 'amber'
    | 'emerald'
    | 'sky'
    | 'violet'
    | 'rose'
    | 'indigo'
    | 'gray'

export type HowStep = { title: string; body: string }

export type StatusRowData = {
    /** Raw system value — shown when no labelKey translation exists. */
    value: string
    /** Existing i18n key that renders the chip label in the app language. */
    labelKey?: string
    tone: Tone
    meaning: string
    /** Allowed next states, rendered under the meaning. */
    moves?: string[]
}

export type StatusEntity = {
    heading: string
    note?: string
    rows: StatusRowData[]
}

export type IntroductionSection = {
    kind: 'introduction'
    title: string
    paras: string[]
    listHeading: string
    listItems: string[]
    outro: string
}

export type StepsSection = {
    kind: 'steps'
    title: string
    intro: string
    steps: HowStep[]
}

export type AreaSection = {
    kind: 'area'
    title: string
    intro: string
    steps?: HowStep[]
    notes?: string[]
}

export type StatusesSection = {
    kind: 'statuses'
    title: string
    intro: string
    footnote?: string
    entities: StatusEntity[]
}

export type LifecycleSection = {
    kind: 'lifecycle'
    title: string
    flow: string[]
    paras: string[]
}

export type SectionData =
    | IntroductionSection
    | StepsSection
    | AreaSection
    | StatusesSection
    | LifecycleSection

export type SectionId =
    | 'introduction'
    | 'first-steps'
    | 'dashboard'
    | 'tasks'
    | 'reservations'
    | 'vehicles'
    | 'qr-landing'
    | 'clients'
    | 'payments'
    | 'expenses'
    | 'users-roles'
    | 'settings'
    | 'reports'
    | 'activity'
    | 'status-reservations'
    | 'status-cars'
    | 'status-money'
    | 'status-people'
    | 'lifecycle'

export type DocsContent = {
    groups: {
        gettingStarted: string
        areas: string
        statuses: string
        flow: string
    }
    labels: {
        howTo: string
        goodToKnow: string
    }
    sections: Record<SectionId, SectionData>
}

export const SECTION_IDS: SectionId[] = [
    'introduction',
    'first-steps',
    'dashboard',
    'tasks',
    'reservations',
    'vehicles',
    'qr-landing',
    'clients',
    'payments',
    'expenses',
    'users-roles',
    'settings',
    'reports',
    'activity',
    'status-reservations',
    'status-cars',
    'status-money',
    'status-people',
    'lifecycle',
]

export const DEFAULT_SECTION: SectionId = 'introduction'

export const isSectionId = (id: string): id is SectionId =>
    SECTION_IDS.includes(id as SectionId)
