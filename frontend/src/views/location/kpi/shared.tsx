import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import Table from '@/components/ui/Table'
import classNames from '@/utils/classNames'
import { colors } from '@/constants/colors.constant'
import type { KpiSegment } from '@/@types/location'
import type { ReactNode } from 'react'

const { Tr, Th, Td, THead, TBody } = Table

/** A section of a drill-down page: title, optional subtitle, body. */
export const KpiSection = ({
    title,
    description,
    children,
}: {
    title: string
    description?: string
    children: ReactNode
}) => (
    <Card>
        <div className="mb-4">
            <h5>{title}</h5>
            {description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </p>
            )}
        </div>
        {children}
    </Card>
)

/** Table cells the figures columns use: right-aligned, like the rest of the module. */
export const KpiNumericTd = ({ children }: { children: ReactNode }) => (
    <Td className="text-right">{children}</Td>
)

/** Centered placeholder for an empty KPI table body. */
export const KpiEmpty = ({
    colSpan,
    message,
}: {
    colSpan: number
    message: string
}) => (
    <Tr>
        <Td colSpan={colSpan} className="text-center py-8 text-gray-400">
            {message}
        </Td>
    </Tr>
)

/** Centered block placeholder, for the sections that are not tables. */
export const KpiPlaceholder = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center p-8 text-sm text-gray-400">
        {message}
    </div>
)

export const KpiTableSkeleton = ({
    columns,
    rows = 4,
}: {
    columns: number
    rows?: number
}) => (
    <TBody>
        {Array.from({ length: rows }).map((_, index) => (
            <Tr key={index}>
                {Array.from({ length: columns }).map((__, column) => (
                    <Td key={column}>
                        <Skeleton width="70%" />
                    </Td>
                ))}
            </Tr>
        ))}
    </TBody>
)

/** The four-up metric strip, matching the dashboard/report statistic cards. */
export const KpiMetrics = ({
    items,
    loading,
}: {
    items: { key: string; label: string; value: string; tone?: string }[]
    loading: boolean
}) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
            <Card key={item.key} bodyClass="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.label}
                </p>
                {loading ? (
                    <Skeleton className="mt-2" width={90} height={24} />
                ) : (
                    <h5 className={classNames('mt-1', item.tone)}>
                        {item.value}
                    </h5>
                )}
            </Card>
        ))}
    </div>
)

/** The breakdown table that sits beside a breakdown chart. */
export const KpiBreakdownTable = ({
    segments,
    labelOf,
    format,
    labelHeader,
    valueHeader,
    countHeader,
    shareHeader,
}: {
    segments: KpiSegment[]
    /** Turn a raw segment key into something a human reads. */
    labelOf: (key: string) => string
    /** Formats `value`; counts are always plain numbers. */
    format?: (value: number) => string
    labelHeader: string
    valueHeader: string
    countHeader: string
    shareHeader: string
}) => {
    const total = segments.reduce((sum, segment) => sum + segment.value, 0)
    const formatter = format ?? ((value: number) => String(value))

    return (
        <Table compact hoverable={false}>
            <THead>
                <Tr className="bg-transparent">
                    <Th>{labelHeader}</Th>
                    <Th className="text-right">{valueHeader}</Th>
                    <Th className="text-right">{countHeader}</Th>
                    <Th className="text-right">{shareHeader}</Th>
                </Tr>
            </THead>
            <TBody>
                {segments.map((segment) => (
                    <Tr key={segment.key}>
                        <Td>{labelOf(segment.key)}</Td>
                        <Td className="text-right">{formatter(segment.value)}</Td>
                        <Td className="text-right">
                            {segment.count ?? '—'}
                        </Td>
                        <Td className="text-right">
                            {total > 0
                                ? `${((segment.value / total) * 100).toFixed(1)}%`
                                : '—'}
                        </Td>
                    </Tr>
                ))}
            </TBody>
        </Table>
    )
}

/**
 * Turn one of the option lists in `views/location/shared` into a key → label
 * lookup, so breakdown segments can be translated without a switch per metric.
 */
export const labelMap = <T extends string>(
    options: { value: T; label: string }[],
): ((key: string) => string) => {
    const lookup = new Map(options.map((option) => [option.value, option.label]))

    return (key: string) => lookup.get(key as T) ?? key
}

/** A share-of-total label for chart tooltips, e.g. "32.6%". */
export const percentage = (value: number, total: number) =>
    total > 0 ? `${((value / total) * 100).toFixed(1)}%` : '—'

/** Series colour, resolved from the shared palette. */
export const kpiColor = {
    paid: colors.emerald.chart,
    pending: colors.orange.chart,
    refunded: colors.rose.chart,
    booked: colors.blue.chart,
    free: colors.gray.chart,
    count: colors.blue.chart,
} as const
