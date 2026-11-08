import type { JSX } from 'react'
import type { ReactNode } from 'react'
import { useLocaleStore } from '@/store/localeStore'
import { useTranslation } from '@/utils/hooks/useTranslation'
import en from './content-en'
import fr from './content-fr'
import ar from './content-ar'
import {
    DEFAULT_SECTION,
    isSectionId,
    type DocsContent,
    type DocsLang,
    type SectionData,
    type SectionId,
    type StatusRowData,
    type Tone,
} from './types'

/* ------------------------------------------------------------------ *
 * Language resolution
 * ------------------------------------------------------------------ */

const DOCS: Record<DocsLang, DocsContent> = { en, fr, ar }

const DOCS_LANGS: DocsLang[] = ['en', 'fr', 'ar']

const normalizeLang = (lang: string): DocsLang => {
    const short = lang.split('-')[0]
    return DOCS_LANGS.includes(short as DocsLang) ? (short as DocsLang) : 'en'
}

const useDocs = () => {
    const currentLang = useLocaleStore((state) => state.currentLang)
    const lang = normalizeLang(currentLang)
    return { lang, content: DOCS[lang] }
}

/* ------------------------------------------------------------------ *
 * Sidebar
 * ------------------------------------------------------------------ */

export type SideNavItem = { id: SectionId; label: string }

export type SideNavGroup = { title: string; items: SideNavItem[] }

export const useSidebar = (): SideNavGroup[] => {
    const { content } = useDocs()
    const group = (title: string, ids: SectionId[]): SideNavGroup => ({
        title,
        items: ids.map((id) => ({ id, label: content.sections[id].title })),
    })
    return [
        group(content.groups.gettingStarted, ['introduction', 'first-steps']),
        group(content.groups.areas, [
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
        ]),
        group(content.groups.statuses, [
            'status-reservations',
            'status-cars',
            'status-money',
            'status-people',
        ]),
        group(content.groups.flow, ['lifecycle']),
    ]
}

/* ------------------------------------------------------------------ *
 * Visual atoms
 * ------------------------------------------------------------------ */

const CHIP_CLASS: Record<Tone, string> = {
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    emerald:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    sky: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    violet:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    indigo:
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
    gray: 'bg-gray-200 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300',
}

const Chip = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
    <span
        className={`inline-block whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${CHIP_CLASS[tone]}`}
    >
        {children}
    </span>
)

const useStatusLabel = () => {
    const { t } = useTranslation()
    return (row: StatusRowData) =>
        row.labelKey ? t(row.labelKey, { defaultValue: row.value }) : row.value
}

const StatusRows = ({ rows }: { rows: StatusRowData[] }) => {
    const label = useStatusLabel()
    return (
        <div>
            {rows.map((row, index) => (
                <div
                    key={row.value}
                    className={`flex items-start gap-3 py-3 ${
                        index !== rows.length - 1
                            ? 'border-b border-gray-100 dark:border-gray-800'
                            : ''
                    }`}
                >
                    <div className="w-32 shrink-0 pt-0.5">
                        <Chip tone={row.tone}>{label(row)}</Chip>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {row.meaning}
                        </p>
                        {row.moves && (
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                {row.moves.join(' · ')}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

const DocPage = ({ title, children }: { title: string; children: ReactNode }) => (
    <>
        <h3 className="mb-6 text-2xl font-bold heading-text">{title}</h3>
        <div className="prose dark:prose-invert max-w-[800px] prose-h5:mt-10">
            {children}
        </div>
    </>
)

type HowStep = { title: string; body: string }

const HowTo = ({ heading, steps }: { heading: string; steps: HowStep[] }) => (
    <>
        <h5 className="heading-text font-semibold">{heading}</h5>
        <div className="not-prose mt-4 space-y-4">
            {steps.map((step, index) => (
                <div key={step.title} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {index + 1}
                    </div>
                    <div>
                        <p className="text-sm font-semibold heading-text">
                            {step.title}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                            {step.body}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </>
)

/* ------------------------------------------------------------------ *
 * Section renderers
 * ------------------------------------------------------------------ */

const IntroductionView = ({ data }: { data: Extract<SectionData, { kind: 'introduction' }> }) => (
    <DocPage title={data.title}>
        <p>{data.paras[0]}</p>
        <p>{data.paras[1]}</p>
        <h5 className="heading-text font-semibold">{data.listHeading}</h5>
        <ul>
            {data.listItems.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
        <p>{data.outro}</p>
    </DocPage>
)

const StepsView = ({ data }: { data: Extract<SectionData, { kind: 'steps' }> }) => (
    <DocPage title={data.title}>
        <p>{data.intro}</p>
        <div className="not-prose mt-8 space-y-6">
            {data.steps.map((step, index) => (
                <div key={step.title} className="flex items-start gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {index + 1}
                    </div>
                    <div>
                        <p className="font-semibold heading-text">{step.title}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {step.body}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </DocPage>
)

const AreaView = ({
    data,
    labels,
}: {
    data: Extract<SectionData, { kind: 'area' }>
    labels: { howTo: string; goodToKnow: string }
}) => (
    <DocPage title={data.title}>
        <p>{data.intro}</p>
        {data.steps && <HowTo heading={labels.howTo} steps={data.steps} />}
        {data.notes && (
            <>
                <h5 className="heading-text font-semibold">
                    {labels.goodToKnow}
                </h5>
                <ul>
                    {data.notes.map((note) => (
                        <li key={note}>{note}</li>
                    ))}
                </ul>
            </>
        )}
    </DocPage>
)

const StatusesView = ({ data }: { data: Extract<SectionData, { kind: 'statuses' }> }) => (
    <DocPage title={data.title}>
        <p>{data.intro}</p>
        <div className="not-prose mt-8 max-w-[640px] space-y-8">
            {data.entities.map((entity) => (
                <div key={entity.heading}>
                    <h5 className="heading-text !mt-0 font-semibold">
                        {entity.heading}
                    </h5>
                    <StatusRows rows={entity.rows} />
                    {entity.note && (
                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                            {entity.note}
                        </p>
                    )}
                </div>
            ))}
        </div>
        {data.footnote && (
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                {data.footnote}
            </p>
        )}
    </DocPage>
)

const LifecycleView = ({
    data,
    lang,
}: {
    data: Extract<SectionData, { kind: 'lifecycle' }>
    lang: DocsLang
}) => {
    const arrow = lang === 'ar' ? '←' : '→'
    return (
        <>
            <h3 className="mb-6 text-2xl font-bold heading-text">{data.title}</h3>
            <div className="max-w-[800px]">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-4">
                    {data.flow.map((chipLabel, index) => (
                        <div
                            key={chipLabel}
                            className="flex items-center gap-x-3"
                        >
                            {index > 0 && (
                                <span className="text-gray-400 dark:text-gray-600 lg:text-lg">
                                    {arrow}
                                </span>
                            )}
                            <Chip tone="gray">{chipLabel}</Chip>
                        </div>
                    ))}
                </div>
                <div className="mt-6 max-w-[800px] space-y-4 text-sm text-gray-600 dark:text-gray-400">
                    {data.paras.map((para) => (
                        <p key={para}>{para}</p>
                    ))}
                </div>
            </div>
        </>
    )
}

/* ------------------------------------------------------------------ *
 * Public section view
 * ------------------------------------------------------------------ */

export const SectionView = ({ id }: { id: SectionId }): JSX.Element | null => {
    const { lang, content } = useDocs()
    const data: SectionData | undefined = content.sections[id]
    if (!data) {
        return null
    }
    switch (data.kind) {
        case 'introduction':
            return <IntroductionView data={data} />
        case 'steps':
            return <StepsView data={data} />
        case 'area':
            return <AreaView data={data} labels={content.labels} />
        case 'statuses':
            return <StatusesView data={data} />
        case 'lifecycle':
            return <LifecycleView data={data} lang={lang} />
        default:
            return null
    }
}

export { DEFAULT_SECTION, isSectionId }
export type { SectionId, DocsLang }
