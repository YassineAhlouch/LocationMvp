import { LayoutType } from './theme'
import type { LazyExoticComponent, ReactNode, JSX } from 'react'

export type PageHeaderProps = {
    title?: string | ReactNode | LazyExoticComponent<() => JSX.Element>
    description?: string | ReactNode
    contained?: boolean
    extraHeader?: string | ReactNode | LazyExoticComponent<() => JSX.Element>
}

export interface Meta {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    header?: PageHeaderProps
    footer?: boolean
    layout?: LayoutType
}

export type RouteAccessType = 'protected' | 'auth-only' | 'public'

export type Route = {
    key: string
    path: string
    component: LazyExoticComponent<(props: unknown) => JSX.Element>
    authority?: string[] // Optional since public routes don't need it
    access: RouteAccessType
    meta?: Meta
}

export type Routes = Route[]
