import type { ReactNode, CSSProperties, ComponentProps } from 'react'

export interface CommonProps {
    id?: string
    className?: string
    children?: ReactNode
    style?: CSSProperties
}

export type TableQueries = {
    total?: number
    pageIndex?: number
    pageSize?: number
    query?: string
    sortOrder: 'asc' | 'desc' | ''
    sortKey?: string | number
}

export type TranslationFn = (
    key: string,
    fallback?: string | Record<string, string | number>,
) => string

export type SvgProps = ComponentProps<'svg'>
