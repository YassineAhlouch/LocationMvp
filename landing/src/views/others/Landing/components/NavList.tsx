import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { Link } from "react-scroll";
import { motion } from "motion/react";
import classNames from "@/utils/classNames";

export type AnchorTab = {
    title: string;
    value: string;
    to: string;
};

export type LinkTab = {
    title: string;
    value: string;
    href: string;
};

/** SPA navigation tab (react-router) — used by nav items carrying a `route`
 *  like the Contact pill (AnchorsTab stays for the landing's sections). */
export type RouteTab = {
    title: string;
    value: string;
    route: string;
};

export type Tab = LinkTab | AnchorTab | RouteTab;

/**
 * Static pill list: no tab reordering and no scroll-driven springs — the bar
 * itself must never re-flow (that used to look like the fixed navbar
 * blinking). Two deliberate animations remain:
 *
 *  - a subtle hover background on each pill (pure CSS `transition-colors`,
 *    compositing only), and
 *  - the ACTIVE "square" highlight rendered as a `motion.span` with a shared
 *    `layoutId` inside the active pill only — clicking another pill makes the
 *    square fly across the bar (transform-only, so no sibling re-layout).
 *
 * `layoutIdPrefix` keeps the desktop bar and the mobile drawer independent
 * (they co-exist while a drawer is open; a duplicate layoutId would make the
 * chip animate between the two lists).
 */
const NavList = ({
    tabs,
    tabClassName,
    onTabClick,
    onDark = false,
    /** Initially-highlighted pill (e.g. the Contact page marks Contact). */
    activeValue,
    layoutIdPrefix = "nav",
}: {
    tabs: Tab[];
    tabClassName?: string;
    onTabClick?: () => void;
    mode?: "vertical" | "horizontal";
    onDark?: boolean;
    activeValue?: string;
    layoutIdPrefix?: string;
}) => {
    const [active, setActive] = useState<Tab | null>(
        activeValue
            ? (tabs.find((tab) => tab.value === activeValue) ?? null)
            : null,
    );

    return (
        <>
            {tabs.map((tab) => {
                const isActive = (active?.value ?? activeValue) === tab.value;

                return (
                    <button
                        key={tab.title}
                        onClick={() => {
                            setActive(tab);
                            onTabClick?.();
                        }}
                        className={classNames(
                            "relative block px-4 py-2 rounded-lg col-p3 whitespace-nowrap transition-colors",
                            onDark
                                ? "text-[#f8f8f8]/80 hover:text-white hover:bg-white/[0.07]"
                                : "text-[#5c5c5c] hover:text-[#171717] hover:bg-gray-100/60 dark:text-[#b3b3b3] dark:hover:text-white dark:hover:bg-white/[0.06]",
                            isActive &&
                                (onDark
                                    ? "text-white"
                                    : "text-[#171717] dark:text-white"),
                            tabClassName,
                        )}
                    >
                        {isActive ? (
                            <motion.span
                                layoutId={`${layoutIdPrefix}-active-pill`}
                                className={classNames(
                                    "absolute inset-0 rounded-lg",
                                    onDark
                                        ? "bg-white/10"
                                        : "bg-gray-100 dark:bg-gray-700",
                                )}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 40,
                                }}
                            />
                        ) : null}
                        {(tab as RouteTab).route ? (
                            <RouterLink
                                to={(tab as RouteTab).route}
                                className="relative block font-medium z-10"
                            >
                                {tab.title}
                            </RouterLink>
                        ) : (tab as AnchorTab).to ? (
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
                );
            })}
        </>
    );
};

export default NavList;
