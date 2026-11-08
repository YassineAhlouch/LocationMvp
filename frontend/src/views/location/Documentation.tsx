import { useEffect, useState } from 'react'
import { SectionView, useSidebar } from './documentation/sections'
import { DEFAULT_SECTION, isSectionId, type SectionId } from './documentation/types'

const readSection = (): SectionId => {
    if (typeof window === 'undefined') {
        return DEFAULT_SECTION
    }
    const id = window.location.hash.replace(/^#\/?docs\/?/, '')
    return isSectionId(id) ? id : DEFAULT_SECTION
}

const NavLink = ({ id, label, active }: { id: SectionId; label: string; active: boolean }) => (
    <a
        href={`#/docs/${id}`}
        onClick={() => {
            window.location.hash = `#/docs/${id}`
        }}
        className={`cursor-pointer font-semibold ltr:border-l rtl:border-r px-4 h-6 mb-4 flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-100 ltr:-ml-px rtl:-mr-px text-sm ${
            active
                ? 'border-primary text-primary hover:text-primary'
                : 'border-transparent'
        }`}
    >
        {label}
    </a>
)

const NavGroups = ({ groups, active }: { groups: ReturnType<typeof useSidebar>; active: SectionId }) => (
    <>
        {groups.map((group) => (
            <div key={group.title} className="mb-6">
                <div className="mb-4 heading-text font-bold text-xs uppercase tracking-wider">
                    {group.title}
                </div>
                <div className="ltr:border-l rtl:border-r border-gray-200 dark:border-gray-600">
                    {group.items.map((item) => (
                        <NavLink
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            active={active === item.id}
                        />
                    ))}
                </div>
            </div>
        ))}
    </>
)

const Documentation = () => {
    const groups = useSidebar()
    const [section, setSection] = useState(readSection)
    const [navOpen, setNavOpen] = useState(false)

    useEffect(() => {
        const onHash = () => setSection(readSection())
        window.addEventListener('hashchange', onHash)
        return () => window.removeEventListener('hashchange', onHash)
    }, [])

    return (
        <div className="mx-auto w-full max-w-[1200px] px-6 py-8 lg:flex lg:gap-12">
            <aside className="lg:w-[240px] shrink-0">
                <div className="lg:sticky lg:top-[calc(3.5rem+2rem)]">
                    <div className="hidden lg:block">
                        <NavGroups groups={groups} active={section} />
                    </div>
                    <div className="lg:hidden">
                        <button
                            onClick={() => setNavOpen((open) => !open)}
                            className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                        >
                            <span className="text-base">☰</span>Navigation
                        </button>
                        {navOpen && (
                            <div className="mb-4">
                                <NavGroups groups={groups} active={section} />
                            </div>
                        )}
                    </div>
                </div>
            </aside>
            <main className="w-full min-w-0">
                <SectionView id={section} />
            </main>
        </div>
    )
}

export default Documentation
