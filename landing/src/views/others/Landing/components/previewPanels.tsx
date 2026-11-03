import { useMemo } from 'react'
import { TbCarSuv } from 'react-icons/tb'
import type { ReactNode } from 'react'
import type { LandingShowcase } from '../types'

export const PanelHeader = ({
    eyebrow,
    title,
    badge,
}: {
    eyebrow: string
    title: string
    badge?: string
}) => (
    <div className="flex items-start justify-between gap-4">
        <div>
            <p className="col-p3 uppercase tracking-wide text-[#9d9d9d] dark:text-[#8a8a8a]">
                {eyebrow}
            </p>
            <p className="mt-1 col-h5 col-heading">{title}</p>
        </div>
        {badge ? (
            <span className="rounded-full bg-[#f8f8f8] dark:bg-[#2b2b2b] border border-[#ebebeb] dark:border-[#383838] px-2.5 py-1 col-p3 text-[#5c5c5c] dark:text-[#b3b3b3]">
                {badge}
            </span>
        ) : null}
    </div>
)

export const Stat = ({
    label,
    value,
    hint,
}: {
    label: string
    value: string
    hint: string
}) => (
    <div className="rounded-[14px] bg-[#f8f8f8] p-3 dark:bg-[#232323]">
        <p className="col-p3 text-[#9d9d9d] dark:text-[#8a8a8a]">{label}</p>
        <p className="mt-1 col-h5 col-heading">{value}</p>
        <p className="col-p3 text-emerald-600 dark:text-emerald-400">{hint}</p>
    </div>
)

/** Browser-window chrome wrapped around a product preview panel. */
export const PreviewFrame = ({ children }: { children: ReactNode }) => (
    <div className="max-w-7xl mx-auto rounded-[16px] bg-white dark:bg-[#1a1a1a] shadow-[0_24px_48px_-12px_rgba(23,23,23,0.14)] overflow-hidden border border-[#ebebeb] dark:border-[#383838]">
        <div className="flex items-center gap-1.5 border-b border-[#ebebeb] dark:border-[#383838] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ED6A5E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#F4BF4E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#61C655]" />
            <span className="mx-3 hidden h-5 flex-1 rounded-md bg-[#f1f1f1] sm:block dark:bg-[#262626]" />
        </div>
        {children}
    </div>
)

/** Vehicle performance preview — mirrors the actual reports columns. */
export const PerformancePreview = ({
    content,
}: {
    content: LandingShowcase
}) => (
    <div className="p-4 sm:p-6 lg:p-8">
        <PanelHeader
            eyebrow={content.vehiclePerformance.eyebrow}
            title={content.vehiclePerformance.title}
        />
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="hidden grid-cols-12 gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-gray-400 sm:grid dark:border-gray-700 dark:bg-gray-800/60">
                <span className="col-span-4">
                    {content.vehiclePerformance.columns.vehicle}
                </span>
                <span className="col-span-2">
                    {content.vehiclePerformance.columns.revenue}
                </span>
                <span className="col-span-2">
                    {content.vehiclePerformance.columns.expenses}
                </span>
                <span className="col-span-2">
                    {content.vehiclePerformance.columns.margin}
                </span>
                <span className="col-span-2 text-end">
                    {content.vehiclePerformance.columns.bookedDays}
                </span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {content.vehiclePerformance.rows.map((row) => (
                    <div
                        key={row.vehicle}
                        className="grid grid-cols-2 gap-2 px-3 py-2.5 text-sm sm:grid-cols-12 sm:items-center"
                    >
                        <span className="col-span-2 font-medium heading-text sm:col-span-4">
                            <span className="flex items-center gap-2">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                                    <TbCarSuv size={18} />
                                </span>
                                <span className="truncate">{row.vehicle}</span>
                            </span>
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 sm:col-span-2">
                            {row.revenue}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 sm:col-span-2">
                            {row.expenses}
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 sm:col-span-2">
                            {row.margin}
                        </span>
                        <span className="text-gray-500 text-end dark:text-gray-400 sm:col-span-2">
                            {row.bookedDays}
                        </span>
                    </div>
                ))}
            </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {content.reports.stats.map((stat) => (
                <Stat
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    hint={stat.hint}
                />
            ))}
        </div>
    </div>
)

/** Kanban board preview shared by the tasks section and the product tour. */
export const TasksBoardView = ({ columns }: {
    columns: {
        id: string
        title: string
        items: { id: string; title: string }[]
    }[]
}) => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {columns.map((column) => (
            <div
                key={column.id}
                className="rounded-[14px] bg-[#f8f8f8] p-3 dark:bg-[#232323] border border-[#ebebeb] dark:border-[#383838]"
            >
                <div className="flex items-center justify-between px-1">
                    <span className="col-p2 col-heading">
                        {column.title}
                    </span>
                    <span className="rounded-full bg-white dark:bg-[#2e2e2e] px-2 py-0.5 col-p3 text-[#5c5c5c] dark:text-[#b3b3b3] border border-[#ebebeb] dark:border-[#3a3a3a]">
                        {column.items.length}
                    </span>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                    {column.items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-[10px] bg-white dark:bg-[#1f1f1f] px-3 py-2.5 col-p3 text-[#5c5c5c] dark:text-[#b3b3b3] border border-[#ebebeb] dark:border-[#333]"
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
)

const MODULE_COUNT = 21

const FINDER_SIZE = 7

const inFinderArea = (x: number, y: number) => {
    const size = MODULE_COUNT

    return (
        (x < FINDER_SIZE && y < FINDER_SIZE) ||
        (x > size - FINDER_SIZE - 1 && y < FINDER_SIZE) ||
        (x < FINDER_SIZE && y > size - FINDER_SIZE - 1)
    )
}

const finderPattern = (localX: number, localY: number) =>
    localX === 0 ||
    localX === 6 ||
    localY === 0 ||
    localY === 6 ||
    (localX >= 2 && localX <= 4 && localY >= 2 && localY <= 4)

/**
 * Decorative module matrix: finder patterns + dashed timing lines + a
 * deterministic filler so the illustration is stable between renders.
 */
const useQrMatrix = () =>
    useMemo(() => {
        const size = MODULE_COUNT
        const matrix: boolean[][] = []

        for (let y = 0; y < size; y++) {
            const row: boolean[] = []

            for (let x = 0; x < size; x++) {
                if (inFinderArea(x, y)) {
                    let localX = x
                    let localY = y

                    if (x > size - FINDER_SIZE - 1) {
                        localX = x - (size - FINDER_SIZE)
                    }
                    if (y > size - FINDER_SIZE - 1) {
                        localY = y - (size - FINDER_SIZE)
                    }

                    row.push(finderPattern(localX, localY))
                } else if (x === 6 || y === 6) {
                    row.push((x + y) % 2 === 0)
                } else {
                    const value =
                        Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
                    row.push(value - Math.floor(value) > 0.55)
                }
            }

            matrix.push(row)
        }

        return matrix
    }, [])

/** Stylized (non-scannable) QR illustration used across QR visuals. */
export const QrArt = ({ className }: { className?: string }) => {
    const modules = useQrMatrix()
    const size = MODULE_COUNT * 4 + 8

    return (
        <svg
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <rect
                width={size}
                height={size}
                rx={10}
                className="fill-white dark:fill-gray-100"
            />
            {modules.map((row, y) =>
                row.map((filled, x) =>
                    filled ? (
                        <rect
                            key={`${x}-${y}`}
                            x={x * 4 + 4}
                            y={y * 4 + 4}
                            width={4}
                            height={4}
                            rx={1}
                            className="fill-gray-900"
                        />
                    ) : null,
                ),
            )}
        </svg>
    )
}
