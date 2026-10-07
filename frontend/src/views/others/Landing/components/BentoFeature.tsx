import { useRef } from 'react'
import LifeCycleConnector from './LifeCycleConnector'
import AiChip from '@/components/svg/AiChip'
import MCP from '@/components/svg/MCP'
import Code from '@/components/svg/Code'
import { motion } from 'motion/react'
import classNames from '@/utils/classNames'
import presetThemeSchemaConfig from '@/configs/preset-theme-schema.config'
import Tag from '@/components/ui/Tag'
import ThemeBrandSkeleton from './ThemeBrandSkeleton'
import DocSkeleton from './DocSkeleton'
import type { LandingBento } from '../types'
import type { Mode } from '../types'

const ThemeBrandSkeletonSvg = ThemeBrandSkeleton as React.FC<{
    height?: number
    width?: number | string
    className?: string
}>
const DocSkeletonSvg = DocSkeleton as React.FC<{
    width?: number
    height?: number
    className?: string
}>

const BentoFeature = ({
    mode,
    themeSchema,
    onThemeChange,
    content,
}: {
    mode: Mode
    themeSchema: string
    onThemeChange: (theme: string) => void
    setMode: (mode: Mode) => void
    content: LandingBento
}) => {
    const normalizedMode =
        mode === 'system'
            ? typeof window !== 'undefined' &&
              window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            : mode

    const horizontalContainerRef = useRef<HTMLDivElement>(null)
    const horizontalDiv1Ref = useRef<HTMLDivElement>(null)
    const horizontalDiv2Ref = useRef<HTMLDivElement>(null)

    const renderSlashPattern = () => (
        <div
            className="h-full w-full text-gray-100 dark:text-gray-800 absolute inset-0"
            style={{
                backgroundImage:
                    'repeating-linear-gradient(125deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)',
            }}
        />
    )

    const renderDashedLine = (className: string) => (
        <svg
            width="100%"
            height={1}
            className={classNames('absolute w-full', className)}
        >
            <line
                x1={0}
                y1={0.5}
                x2="100%"
                y2={0.5}
                className="stroke-gray-300 dark:stroke-gray-700"
                strokeDasharray="4 6"
                strokeLinecap="round"
            />
        </svg>
    )

    return (
        <section
            id="features"
            className="border-t border-gray-200 dark:border-gray-700"
        >
            <div className="max-w-7xl mx-auto border-r border-l border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-12 py-12 lg:py-24 px-4 lg:px-0">
                    <div className="col-span-1" />
                    <div className="col-span-10">
                        <h3 className="max-w-2xl mx-auto lg:mx-0 leading-snug">
                            <span>{content.heading.primary} </span>
                            <span className="text-slate-400 font-medium">
                                {content.heading.secondary}
                            </span>
                        </h3>
                    </div>
                    <div className="col-span-1" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 pb-24">
                    <div className="hidden lg:block lg:col-span-1 relative">
                        {renderDashedLine('top-0')}
                        {renderSlashPattern()}
                        {renderDashedLine('bottom-0')}
                    </div>
                    <div className="col-span-1 lg:col-span-10">
                        <div className="relative px-px flex flex-col lg:grid gap-px border border-gray-200 dark:border-gray-700 lg:auto-rows-fr grid-cols-1 lg:grid-cols-10 bg-gray-200 dark:bg-gray-700 border-l border-r lg:border-l-0 lg:border-r-0">
                            {/* AI chip card */}
                            <div className="relative flex flex-col justify-start lg:justify-between gap-8 p-6 lg:p-8 lg:col-span-4 z-0 bg-white dark:bg-gray-900">
                                <div className="flex flex-col gap-2">
                                    <h5>{content.cards.ai.title}</h5>
                                    <p>{content.cards.ai.description}</p>
                                </div>
                                <div className="flex items-center w-full lg:h-full py-8 lg:py-16 justify-center">
                                    <div className="flex w-full max-w-[280px] lg:max-w-full items-center justify-between gap-4 lg:gap-6 relative">
                                        <div className="z-10 h-14 w-14 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-800">
                                            <AiChip width={30} height={30} />
                                        </div>
                                        <div className="z-10 h-20 w-20 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-800">
                                            <MCP width={36} height={36} />
                                        </div>
                                        <div className="z-10 h-14 w-14 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-800">
                                            <Code width={26} height={26} />
                                        </div>
                                        <div
                                            ref={horizontalContainerRef}
                                            className="absolute top-1/2 lg:top-1/2 left-1/2 lg:left-0 w-full h-full lg:h-1 -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 lg:-translate-y-1/2"
                                        >
                                            <div className="flex flex-col lg:flex-row justify-between h-full lg:h-auto">
                                                <div ref={horizontalDiv1Ref} />
                                                <div ref={horizontalDiv2Ref} />
                                            </div>
                                            <LifeCycleConnector
                                                duration={5}
                                                containerRef={
                                                    horizontalContainerRef
                                                }
                                                fromRef={horizontalDiv1Ref}
                                                toRef={horizontalDiv2Ref}
                                            />
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] h-[220px] z-0 pointer-events-none">
                                            <svg
                                                className="w-full h-full"
                                                viewBox="0 0 480 300"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <motion.circle
                                                    cx={240}
                                                    cy={150}
                                                    r={130.5}
                                                    className="stroke-2 stroke-gray-200 dark:stroke-gray-700"
                                                    strokeDasharray="6 6"
                                                    style={{
                                                        originX: '50%',
                                                        originY: '50%',
                                                    }}
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 20,
                                                        repeat: Infinity,
                                                        ease: 'linear',
                                                    }}
                                                />
                                                <motion.circle
                                                    cx={240}
                                                    cy={150}
                                                    r={85.5}
                                                    className="stroke-2 stroke-gray-200 dark:stroke-gray-700"
                                                    strokeDasharray="6 6"
                                                    style={{
                                                        originX: '50%',
                                                        originY: '50%',
                                                    }}
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 45,
                                                        repeat: Infinity,
                                                        ease: 'linear',
                                                    }}
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Theming card */}
                            <div className="relative flex flex-col justify-start lg:justify-between gap-4 p-6 lg:p-8 lg:col-span-6 z-0 bg-white dark:bg-gray-900">
                                <div className="flex flex-col gap-2">
                                    <h5>{content.cards.theming.title}</h5>
                                    <p>{content.cards.theming.description}</p>
                                </div>
                                <div className="relative pt-4">
                                    <div className="flex justify-center">
                                        <div
                                            className="inline-flex h-50 w-full max-w-[380px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                            style={{
                                                maskImage:
                                                    'linear-gradient(to bottom, black 80%, transparent 100%)',
                                                WebkitMaskImage:
                                                    'linear-gradient(to bottom, black 80%, transparent 100%)',
                                            }}
                                        >
                                            <ThemeBrandSkeletonSvg
                                                height={290}
                                                width="100%"
                                                className="shrink-0"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-8 z-10 relative mt-4">
                                        <div className="inline-flex rounded-lg justify-center">
                                            <div className="flex items-center gap-4 justify-center bg-white dark:bg-gray-800 p-2">
                                                {Object.entries(
                                                    presetThemeSchemaConfig,
                                                ).map(([key, value]) => (
                                                    <button
                                                        key={key}
                                                        className={classNames(
                                                            'h-6 w-6 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 ring-offset-2 dark:ring-offset-gray-900 transition-all hover:scale-110',
                                                            themeSchema === key
                                                                ? 'ring-2 ring-primary scale-110'
                                                                : 'hover:ring-2',
                                                        )}
                                                        style={
                                                            {
                                                                backgroundColor:
                                                                    value[
                                                                        normalizedMode as
                                                                            | 'light'
                                                                            | 'dark'
                                                                    ].primary ||
                                                                    '',
                                                                '--tw-ring-color':
                                                                    value[
                                                                        normalizedMode as
                                                                            | 'light'
                                                                            | 'dark'
                                                                    ].primary ||
                                                                    '',
                                                            } as React.CSSProperties
                                                        }
                                                        onClick={() =>
                                                            onThemeChange(key)
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Docs card */}
                            <div className="relative flex flex-col justify-between gap-8 p-8 lg:col-span-6 z-0 bg-white dark:bg-gray-900">
                                <div className="flex items-center gap-4 py-8 relative overflow-hidden">
                                    <div className="absolute inset-0 z-0 pointer-events-none">
                                        <svg
                                            width="100%"
                                            height="100%"
                                            className="text-gray-300 dark:text-gray-800 absolute inset-0"
                                        >
                                            <defs>
                                                <pattern
                                                    id="localization-dots"
                                                    width="10"
                                                    height="10"
                                                    patternUnits="userSpaceOnUse"
                                                >
                                                    <rect
                                                        x="5.5"
                                                        y="5.5"
                                                        width="1"
                                                        height="1"
                                                        fill="currentColor"
                                                    />
                                                </pattern>
                                            </defs>
                                            <rect
                                                width="100%"
                                                height="100%"
                                                fill="url(#localization-dots)"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mx-auto p-[2px] rounded-lg shadow-lg bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 z-10 max-w-full">
                                        <DocSkeletonSvg
                                            width={290}
                                            height={200}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                    {[
                                        {
                                            cls: 'absolute z-20 top-20 left-4 lg:left-12',
                                            anim: {
                                                y: [0, -8, 0],
                                                x: [0, 4, 0],
                                                rotate: [0, 2, 0],
                                            },
                                            dur: 7,
                                        },
                                        {
                                            cls: 'absolute z-20 bottom-12 left-2 lg:left-8',
                                            anim: {
                                                y: [0, -10, 0],
                                                x: [0, -3, 0],
                                                rotate: [0, -2, 0],
                                            },
                                            dur: 8,
                                            delay: 1,
                                        },
                                        {
                                            cls: 'absolute z-20 top-16 right-8 lg:right-24',
                                            anim: {
                                                y: [0, -12, 0],
                                                x: [0, -5, 0],
                                                rotate: [0, 1.5, 0],
                                            },
                                            dur: 7.5,
                                            delay: 0.5,
                                        },
                                        {
                                            cls: 'absolute z-20 bottom-18 right-4 lg:right-16',
                                            anim: {
                                                y: [0, -9, 0],
                                                x: [0, 4, 0],
                                                rotate: [0, -1, 0],
                                            },
                                            dur: 9,
                                            delay: 2,
                                        },
                                    ].map(({ cls, anim, dur, delay }, i) => (
                                        <motion.div
                                            key={i}
                                            className={cls}
                                            animate={anim}
                                            transition={{
                                                duration: dur,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                                delay: delay ?? 0,
                                            }}
                                            style={{ willChange: 'transform' }}
                                        >
                                            <Tag
                                                className={classNames(
                                                    'bg-white dark:bg-gray-800 shadow-lg p-2 font-medium text-xs lg:text-sm',
                                                )}
                                            >
                                                {
                                                    content.cards.docs
                                                        .floatingTags[i]?.label
                                                }
                                            </Tag>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-2 relative z-10">
                                    <h5>{content.cards.docs.title}</h5>
                                    <p>{content.cards.docs.description}</p>
                                </div>
                            </div>
                            {/* i18n card */}
                            <div className="relative flex flex-col justify-between gap-4 p-8 lg:col-span-4 z-0 bg-white dark:bg-gray-900 overflow-hidden">
                                <div className="relative">
                                    <div className="absolute inset-0 z-0 pointer-events-none">
                                        <svg
                                            width="100%"
                                            height="100%"
                                            className="text-gray-300 dark:text-gray-800 absolute inset-0"
                                        >
                                            <defs>
                                                <pattern
                                                    id="i18n-dots"
                                                    width="10"
                                                    height="10"
                                                    patternUnits="userSpaceOnUse"
                                                >
                                                    <rect
                                                        x="5.5"
                                                        y="5.5"
                                                        width="1"
                                                        height="1"
                                                        fill="currentColor"
                                                    />
                                                </pattern>
                                            </defs>
                                            <rect
                                                width="100%"
                                                height="100%"
                                                fill="url(#i18n-dots)"
                                            />
                                        </svg>
                                    </div>
                                    <div className="relative z-10 flex flex-col gap-4 items-center justify-center py-6 flex-1">
                                        {(
                                            [
                                                { className: 'ml-4 lg:ml-10' },
                                                { className: 'mr-6 lg:mr-14' },
                                                { className: 'ml-4 lg:ml-10' },
                                                { className: 'mr-8 lg:mr-20' },
                                            ] as const
                                        ).map((layout, i) => {
                                            const item =
                                                content.cards.i18n.locales[i]
                                            return (
                                                <div
                                                    key={item.code}
                                                    className={classNames(
                                                        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-sm flex items-center gap-2 w-fit transition-transform hover:scale-105',
                                                        layout.className,
                                                        item.code === 'SA'
                                                            ? 'flex-row-reverse'
                                                            : '',
                                                    )}
                                                >
                                                    <div className="relative w-6 h-6 shrink-0 rounded-full overflow-hidden border border-gray-100 dark:border-gray-600">
                                                        <img
                                                            src={item.flag}
                                                            alt={item.code}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                        {item.text}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 relative z-10">
                                    <h5>{content.cards.i18n.title}</h5>
                                    <p>{content.cards.i18n.description}</p>
                                </div>
                            </div>
                            {/* Mobile responsive card */}
                            <div className="relative flex flex-col justify-between gap-4 col-span-10 p-8 z-0 bg-white dark:bg-gray-900">
                                <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-8 lg:gap-0">
                                    <div className="flex items-center h-full">
                                        <div className="flex flex-col gap-2">
                                            <h5>
                                                {content.cards.responsive.title}
                                            </h5>
                                            <p>
                                                {
                                                    content.cards.responsive
                                                        .description
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative flex justify-center items-center">
                                        <div className="p-2 border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-700 rounded-3xl max-w-55 lg:max-w-55 lg:absolute">
                                            <div className="relative bg-white dark:bg-black dark:border-gray-700 border border-gray-200 rounded-[20px] overflow-hidden max-h-75 lg:max-h-80">
                                                <img
                                                    src="/img/landing/mobile.png"
                                                    alt="Mobile view"
                                                    width={220}
                                                    height={440}
                                                    className="rounded-2xl"
                                                />
                                            </div>
                                        </div>
                                        <div className="absolute z-10 inset-x-0 bottom-0 h-24 w-full bg-linear-to-b from-transparent via-white to-white dark:via-gray-900 dark:to-gray-900 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block lg:col-span-1 relative">
                        {renderDashedLine('top-0')}
                        {renderSlashPattern()}
                        {renderDashedLine('bottom-0')}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BentoFeature
