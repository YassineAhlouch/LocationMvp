import { useState } from 'react'
import { motion } from 'motion/react'
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

const NavList = ({
    tabs: propTabs,
    tabClassName,
    onTabClick,
}: {
    tabs: Tab[]
    tabClassName?: string
    onTabClick?: () => void
    mode?: 'vertical' | 'horizontal'
}) => {
    const [active, setActive] = useState<Tab>(propTabs[0])
    const [show, setShow] = useState(false)

    const moveSelectedTabToTop = (idx: number) => {
        setShow(true)
        const newTabs = [...propTabs]
        const selectedTab = newTabs.splice(idx, 1)
        newTabs.unshift(selectedTab[0])
        setActive(newTabs[0])
        onTabClick?.()
    }

    return (
        <>
            {propTabs.map((tab, idx) => (
                <button
                    key={tab.title}
                    onClick={() => moveSelectedTabToTop(idx)}
                    onMouseEnter={() => moveSelectedTabToTop(idx)}
                    onMouseLeave={() => setShow(false)}
                    className={classNames(
                        'relative px-5 py-2 rounded-xl',
                        tabClassName,
                    )}
                >
                    {active.value === tab.value && (
                        <motion.div
                            layoutId="clickedbutton"
                            transition={{
                                type: 'spring',
                                bounce: 0.3,
                                duration: 0.6,
                            }}
                            className={classNames(
                                'absolute inset-0 rounded-lg',
                                show && 'bg-gray-100 dark:bg-gray-700',
                            )}
                        />
                    )}
                    {(tab as AnchorTab).to ? (
                        <Link
                            to={(tab as AnchorTab).to}
                            className="relative block heading-text font-medium z-10"
                            smooth
                            duration={500}
                        >
                            {tab.title}
                        </Link>
                    ) : (
                        <a
                            href={(tab as LinkTab).href}
                            className="relative block heading-text font-medium z-10"
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
