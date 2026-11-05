import { useState } from 'react'
import { Link } from 'react-scroll'
import classNames from '@/utils/classNames'

export type AnchorTab = {
    title: string
    value: string
    to: string
}

export type LinkTab = {
    title: string
    value: string
    href: string
}

export type Tab = LinkTab | AnchorTab

/**
 * Static pill list: no tab reordering and no shared-layout chip.
 * (The former reorder-on-hover/click + flying layoutId highlight made the
 * fixed navbar re-flow on every interaction — visible as the bar blinking
 * during smooth scrolls — so activation is a plain highlight now.)
 */
const NavList = ({
    tabs,
    tabClassName,
    onTabClick,
    onDark = false,
}: {
    tabs: Tab[]
    tabClassName?: string
    onTabClick?: () => void
    mode?: 'vertical' | 'horizontal'
    onDark?: boolean
}) => {
    const [active, setActive] = useState<Tab | null>(null)

    return (
        <>
            {tabs.map((tab) => (
                <button
                    key={tab.title}
                    onClick={() => {
                        setActive(tab)
                        onTabClick?.()
                    }}
                    className={classNames(
                        'relative block px-4 py-2 rounded-lg col-p3 whitespace-nowrap transition-colors',
                        onDark
                            ? 'text-[#f8f8f8]/80 hover:text-white'
                            : 'text-[#5c5c5c] hover:text-[#171717] dark:text-[#b3b3b3] dark:hover:text-white',
                        active?.value === tab.value &&
                            (onDark
                                ? 'bg-white/10 text-white'
                                : 'bg-gray-100 text-[#171717] dark:bg-gray-700 dark:text-white'),
                        tabClassName,
                    )}
                >
                    {(tab as AnchorTab).to ? (
                        <Link
                            to={(tab as AnchorTab).to}
                            className="relative block font-medium z-10"
                            smooth
                            duration={500}
                        >
                            {tab.title}
                        </Link>
                    ) : (
                        <a
                            href={(tab as LinkTab).href}
                            className="relative block font-medium z-10"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {tab.title}
                        </a>
                    )}
                </button>
            ))}
        </>
    )
}

export default NavList
