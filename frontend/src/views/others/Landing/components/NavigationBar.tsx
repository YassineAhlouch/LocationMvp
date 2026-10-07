import React, { useRef, useState } from 'react'
import { Link } from 'react-router'
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from 'motion/react'
import { TbMenu2 } from 'react-icons/tb'
import NavList from './NavList'
import Drawer from '@/components/ui/Drawer'
import classNames from '@/utils/classNames'
import type { Tab } from './NavList'
import type { Mode } from '../types'

type NavigationProps = {
    toggleMode: () => void
    mode: Mode
    navMenu: Tab[]
    extra?: React.ReactNode
}

const Navigation = ({ toggleMode, mode, navMenu, extra }: NavigationProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    })
    const [scrolled, setScrolled] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setScrolled(latest > 50)
    })

    return (
        <motion.div
            ref={ref}
            className="fixed inset-x-0 top-0 z-[30] w-full pointer-events-none max-w-7xl mx-auto"
        >
            <div className="w-full h-full pointer-events-auto">
                <NavBody
                    scrolled={scrolled}
                    mode={mode}
                    className="hidden lg:flex w-full items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <NavbarLogo mode={mode} />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <NavList tabs={navMenu} />
                    </div>
                    <div className="flex items-center gap-2">
                        {extra}
                        <ThemeToggle mode={mode} toggleMode={toggleMode} />
                    </div>
                </NavBody>

                <MobileNav
                    scrolled={scrolled}
                    mode={mode}
                    className="lg:hidden w-full flex items-center justify-between"
                >
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="p-1 text-neutral-600 dark:text-neutral-300"
                    >
                        <TbMenu2 size={24} />
                    </button>
                    <NavbarLogo mode={mode} />
                    <div className="flex items-center gap-1">
                        {extra}
                        <ThemeToggle mode={mode} toggleMode={toggleMode} />
                    </div>
                </MobileNav>

                <Drawer
                    title="Navigation"
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    width={250}
                    placement="left"
                >
                    <div className="flex flex-col gap-4">
                        <NavList
                            onTabClick={() => setIsDrawerOpen(false)}
                            tabs={navMenu}
                        />
                    </div>
                </Drawer>
            </div>
        </motion.div>
    )
}

const NavBody = ({
    children,
    className,
    scrolled,
    mode,
}: {
    children: React.ReactNode
    className?: string
    scrolled: boolean
    mode: Mode
}) => (
    <motion.div
        layout
        animate={{
            width: scrolled ? '50%' : '100%',
            y: scrolled ? 10 : 0,
            borderRadius: scrolled ? '10px' : '0px',
            backgroundColor: scrolled
                ? mode === 'dark'
                    ? 'rgb(0 0 0 / 33%)'
                    : 'rgba(255, 255, 255, 0.8)'
                : 'transparent',
            borderColor: 'rgba(200, 200, 200, 0.2)',
            boxShadow: scrolled
                ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
                : 'none',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 50 }}
        style={{ minWidth: '1000px' }}
        className={classNames(
            'relative mx-auto px-4 py-2 backdrop-blur-md transition-colors',
            scrolled
                ? 'dark:bg-neutral-900/80 border border-transparent dark:border-white/10'
                : 'dark:bg-transparent',
            className,
        )}
    >
        {children}
    </motion.div>
)

const MobileNav = ({
    children,
    className,
    scrolled,
    mode,
}: {
    children: React.ReactNode
    className?: string
    scrolled: boolean
    mode: Mode
}) => (
    <motion.div
        layout
        animate={{
            width: scrolled ? '90%' : '100%',
            y: scrolled ? 20 : 0,
            borderRadius: scrolled ? '12px' : '0px',
            backgroundColor: scrolled
                ? mode === 'dark'
                    ? 'rgb(0 0 0 / 33%)'
                    : 'rgba(255, 255, 255, 0.8)'
                : 'transparent',
            boxShadow: scrolled
                ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
                : 'none',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 50 }}
        className={classNames(
            'relative mx-auto px-4 py-2 backdrop-blur-md transition-colors',
            scrolled
                ? 'dark:bg-neutral-900/80 border border-transparent dark:border-white/10'
                : 'dark:bg-transparent',
            className,
        )}
    >
        {children}
    </motion.div>
)

const NavbarLogo = ({ mode }: { mode: Mode }) => (
    <Link to="/landing">
        {mode === 'light' && (
            <img
                src="/img/logo/logo-light-full.png"
                width={80}
                height={30}
                alt="logo"
            />
        )}
        {mode === 'dark' && (
            <img
                src="/img/logo/logo-dark-full.png"
                width={80}
                height={30}
                alt="logo"
            />
        )}
    </Link>
)

const SunIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 256 256"
    >
        <path d="M184,128a56,56,0,1,1-56-56A56,56,0,0,1,184,128Z" opacity="1" />
        <path d="M120,40V32a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-8-8A8,8,0,0,0,50.34,61.66Zm0,116.68-8,8a8,8,0,0,0,11.32,11.32l8-8a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l8-8a8,8,0,0,0-11.32-11.32l-8,8A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l8,8a8,8,0,0,0,11.32-11.32ZM40,120H32a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Zm88,88a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,128,208Zm96-88h-8a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Z" />
    </svg>
)

const MoonIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 256 256"
    >
        <path
            d="M210.69,158.18A88,88,0,1,1,97.82,45.31,96.08,96.08,0,0,0,192,160A96.78,96.78,0,0,0,210.69,158.18Z"
            opacity="1"
        />
        <path d="M240,96a8,8,0,0,1-8,8H216v16a8,8,0,0,1-16,0V104H184a8,8,0,0,1,0-16h16V72a8,8,0,0,1,16,0V88h16A8,8,0,0,1,240,96ZM144,56h8v8a8,8,0,0,0,16,0V56h8a8,8,0,0,0,0-16h-8V32a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16Zm72.77,97a8,8,0,0,1,1.43,8A96,96,0,1,1,95.07,37.8a8,8,0,0,1,10.6,9.06A88.07,88.07,0,0,0,209.14,150.33A8,8,0,0,1,216.77,153Zm-19.39,14.88c-1.79.09-3.59.14-5.38.14A104.11,104.11,0,0,1,88,64c0-1.79,0-3.59.14-5.38A80,80,0,1,0,197.38,167.86Z" />
    </svg>
)

const ThemeToggle = ({
    mode,
    toggleMode,
}: {
    mode: Mode
    toggleMode: () => void
}) => (
    <motion.button
        className="relative flex cursor-pointer items-center justify-center rounded-xl p-2 text-neutral-500 dark:text-neutral-400"
        onClick={toggleMode}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
        <div className="relative w-5 h-5">
            <AnimatePresence mode="sync" initial={false}>
                <motion.span
                    key={mode}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                    {mode === 'light' ? <MoonIcon /> : <SunIcon />}
                </motion.span>
            </AnimatePresence>
        </div>
        <span className="sr-only">Toggle theme</span>
    </motion.button>
)

export default Navigation
