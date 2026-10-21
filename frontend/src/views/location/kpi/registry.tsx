import { lazy } from 'react'
import type { ComponentType } from 'react'
import type { KpiMetricKey } from '@/@types/location'
import type { KpiModuleProps } from './types'
import type { KpiDetail } from '@/@types/location'

const NetRevenueModule = lazy(
    () => import('./modules/NetRevenueModule'),
)
const ExpensesModule = lazy(() => import('./modules/ExpensesModule'))
const ReservationsModule = lazy(
    () => import('./modules/ReservationsModule'),
)
const OccupancyModule = lazy(() => import('./modules/OccupancyModule'))
const OutstandingModule = lazy(() => import('./modules/OutstandingModule'))
const TodayModule = lazy(() => import('./modules/TodayModule'))
const FleetAttentionModule = lazy(
    () => import('./modules/FleetAttentionModule'),
)
const NewClientsModule = lazy(() => import('./modules/NewClientsModule'))

/**
 * One dashboard card's drill-down page. The registry is the single place that
 * knows how a card maps onto a page: its slug, the copy of the header and the
 * component that renders the analysis underneath.
 *
 * `comparable` marks the metrics where a period-over-period comparison means
 * something: revenue, expenses, reservations and signups do; a debt book, a
 * day's schedule and a fleet snapshot are stocks, so the shell skips the
 * second request for them.
 */
export type KpiRegistryEntry = {
    key: KpiMetricKey
    title: string
    description: string
    /** Tailwind tone shared with the card's icon on the dashboard. */
    tone: string
    /** Whether the shell fetches the previous period for a comparison. */
    comparable: boolean
    Component: ComponentType<KpiModuleProps<KpiDetail>>
}

export const kpiRegistry: KpiRegistryEntry[] = [
    {
        key: 'net-revenue',
        title: 'kpi.netRevenue.title',
        description: 'kpi.netRevenue.description',
        tone: 'text-emerald-600 dark:text-emerald-400',
        comparable: true,
        Component: NetRevenueModule as ComponentType<
            KpiModuleProps<KpiDetail>
        >,
    },
    {
        key: 'expenses',
        title: 'kpi.expenses.title',
        description: 'kpi.expenses.description',
        tone: 'text-rose-600 dark:text-rose-400',
        comparable: true,
        Component: ExpensesModule as ComponentType<KpiModuleProps<KpiDetail>>,
    },
    {
        key: 'reservations',
        title: 'kpi.reservations.title',
        description: 'kpi.reservations.description',
        tone: 'text-indigo-600 dark:text-indigo-400',
        comparable: true,
        Component: ReservationsModule as ComponentType<
            KpiModuleProps<KpiDetail>
        >,
    },
    {
        key: 'occupancy',
        title: 'kpi.occupancy.title',
        description: 'kpi.occupancy.description',
        tone: 'text-blue-600 dark:text-blue-400',
        comparable: true,
        Component: OccupancyModule as ComponentType<KpiModuleProps<KpiDetail>>,
    },
    {
        key: 'outstanding',
        title: 'kpi.outstanding.title',
        description: 'kpi.outstanding.description',
        tone: 'text-amber-600 dark:text-amber-400',
        comparable: false,
        Component: OutstandingModule as ComponentType<
            KpiModuleProps<KpiDetail>
        >,
    },
    {
        key: 'today',
        title: 'kpi.today.title',
        description: 'kpi.today.description',
        tone: 'text-cyan-600 dark:text-cyan-400',
        comparable: false,
        Component: TodayModule as ComponentType<KpiModuleProps<KpiDetail>>,
    },
    {
        key: 'fleet-attention',
        title: 'kpi.attention.title',
        description: 'kpi.attention.description',
        tone: 'text-orange-600 dark:text-orange-400',
        comparable: false,
        Component: FleetAttentionModule as ComponentType<
            KpiModuleProps<KpiDetail>
        >,
    },
    {
        key: 'new-clients',
        title: 'kpi.newClients.title',
        description: 'kpi.newClients.description',
        tone: 'text-purple-600 dark:text-purple-400',
        comparable: true,
        Component: NewClientsModule as ComponentType<
            KpiModuleProps<KpiDetail>
        >,
    },
]

const byKey = new Map(kpiRegistry.map((entry) => [entry.key, entry]))

/** Resolve a `:metric` route param, or undefined when it is not a known card. */
export const findKpi = (metric?: string): KpiRegistryEntry | undefined =>
    metric ? byKey.get(metric as KpiMetricKey) : undefined
