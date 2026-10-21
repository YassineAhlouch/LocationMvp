import type { KpiDetail, KpiMetricKey, KpiDetailOf } from '@/@types/location'

/**
 * Everything a metric module gets: the payload for the selected period, the
 * payload for the comparison period (only fetched when the comparison is
 * switched on), and whether the current period is still in flight.
 */
export type KpiModuleProps<K extends KpiDetail> = {
    detail: K | null
    previous: KpiDetailOf<K['metric']> | null
    loading: boolean
}

/** Resolve the module props for a metric key. */
export type KpiModuleFor<K extends KpiMetricKey> = KpiModuleProps<KpiDetailOf<K>>
