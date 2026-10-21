import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import Container from '@/components/shared/Container'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import PeriodPicker, {
    currentMonthRange,
    previousPeriod,
} from '@/components/shared/PeriodPicker'
import Skeleton from '@/components/ui/Skeleton'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import classNames from '@/utils/classNames'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import {
    PAGE_CONTAINER_GUTTER_X,
    PAGE_CONTAINER_GUTTER_Y,
} from '@/constants/theme.constant'
import { apiGetKpiDetail } from '@/services/LocationService'
import useTranslation from '@/utils/hooks/useTranslation'
import { LiArrowLeft } from '@/icons'
import { rangeToQuery } from '../reports/shared'
import { money } from '../shared'
import { findKpi } from './registry'
import type { DateRange } from '@/components/shared/PeriodPicker'
import type { KpiDetail } from '@/@types/location'

/**
 * The drill-down behind one dashboard card. The page is generic: the registry
 * knows which metric it is, the module knows how to render it, and the shell
 * owns the period picker, the previous-period request and the heading.
 */
const KpiDetailPage = () => {
    const { metric } = useParams<{ metric: string }>()
    const { t } = useTranslation()

    const entry = useMemo(() => findKpi(metric), [metric])

    const [range, setRange] = useState<DateRange>(currentMonthRange)
    const [detail, setDetail] = useState<KpiDetail | null>(null)
    const [previous, setPrevious] = useState<KpiDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const period = useMemo(() => rangeToQuery(range), [range])
    const comparison = useMemo(
        () => (entry?.comparable ? rangeToQuery(previousPeriod(range)) : null),
        [entry, range],
    )

    const load = useCallback(() => {
        if (!entry) {
            setLoading(false)
            return
        }

        setLoading(true)

        apiGetKpiDetail(entry.key, period)
            .then(setDetail)
            .catch(() => setDetail(null))
            .finally(() => setLoading(false))
    }, [entry, period])

    useEffect(() => {
        load()
    }, [load])

    useEffect(() => {
        if (!entry?.comparable || !comparison) {
            setPrevious(null)
            return
        }

        apiGetKpiDetail(entry.key, comparison)
            .then(setPrevious)
            .catch(() => setPrevious(null))
    }, [entry, comparison])

    const changePct = useMemo(() => {
        if (!entry?.comparable || !detail || !previous) {
            return null
        }

        const before = Number(previous.headline.value)
        const now = Number(detail.headline.value)

        if (!before) {
            return now > 0 ? 100 : 0
        }

        return ((now - before) / Math.abs(before)) * 100
    }, [detail, entry?.comparable, previous])

    if (!entry) {
        return (
            <>
                <div className="border-b border-gray-200 bg-white py-4 dark:border-gray-800 dark:bg-gray-900 sm:py-6">
                    <Container className={PAGE_CONTAINER_GUTTER_X}>
                        <Link
                            to={`${APPS_PREFIX_PATH}/dashboard`}
                            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                        >
                            <LiArrowLeft className="text-base shrink-0" />
                            {t('kpi.backToDashboard', 'Back to the dashboard')}
                        </Link>
                        <h3 className="font-bold">
                            {t(
                                'kpi.unknown.title',
                                'This drill-down does not exist',
                            )}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {t(
                                'kpi.unknown.description',
                                'The link may be stale — every dashboard card has a drill-down page of its own.',
                            )}
                        </p>
                    </Container>
                </div>

                <Container
                    className={classNames(
                        PAGE_CONTAINER_GUTTER_X,
                        PAGE_CONTAINER_GUTTER_Y,
                    )}
                >
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <Link to={`${APPS_PREFIX_PATH}/dashboard`}>
                            <Button variant="solid">
                                {t(
                                    'kpi.backToDashboard',
                                    'Back to the dashboard',
                                )}
                            </Button>
                        </Link>
                    </div>
                </Container>
            </>
        )
    }

    const Component = entry.Component

    return (
        <>
            {/* Header band: separated from the analysis below by a rule, the
                same shape the list pages use. */}
            <div className="border-b border-gray-200 bg-white py-4 dark:border-gray-800 dark:bg-gray-900 sm:py-6">
                <Container className={PAGE_CONTAINER_GUTTER_X}>
                    <Link
                        to={`${APPS_PREFIX_PATH}/dashboard`}
                        className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                    >
                        <LiArrowLeft className="text-base shrink-0" />
                        {t('kpi.backToDashboard', 'Back to the dashboard')}
                    </Link>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <h3
                                    className={classNames(
                                        'font-bold',
                                        entry.tone,
                                    )}
                                >
                                    {t(entry.title, entry.key)}
                                </h3>
                                {loading ? (
                                    <Skeleton width={80} height={22} />
                                ) : (
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {formatHeadline(detail, entry.key)}
                                    </span>
                                )}
                                {!loading && changePct !== null && (
                                    <GrowShrinkTag
                                        value={changePct}
                                        suffix="%"
                                        showIcon={true}
                                    />
                                )}
                            </div>
                            <p className="mt-1 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
                                {t(
                                    entry.description,
                                    t('kpi.purpose', 'Card drill-down'),
                                )}
                            </p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                {t('kpi.periodLabel', 'Period: {{from}} → {{to}}', {
                                    from: detail?.period.from ?? period.from,
                                    to: detail?.period.to ?? period.to,
                                })}
                            </p>
                        </div>
                        <PeriodPicker
                            value={range}
                            onChange={setRange}
                            className="w-full shrink-0 justify-between sm:w-auto sm:justify-center"
                        />
                    </div>
                </Container>
            </div>

            <Container
                className={classNames(PAGE_CONTAINER_GUTTER_X, PAGE_CONTAINER_GUTTER_Y)}
            >
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center py-20">
                            <Spinner size={32} />
                        </div>
                    }
                >
                    <Component
                        detail={detail as never}
                        previous={previous as never}
                        loading={loading}
                    />
                </Suspense>
            </Container>
        </>
    )
}

/**
 * The headline the card shows, re-read from the drill-down payload. Each
 * metric carries its own shape, so the value is picked by key rather than
 * typed here — keeping the module free to render its own richer strip.
 */
const formatHeadline = (detail: KpiDetail | null, key: string): string => {
    if (!detail) {
        return '—'
    }

    const value = Number(detail.headline.value)

    switch (key) {
        case 'occupancy':
            return `${(value * 100).toFixed(1)}%`
        case 'net-revenue':
        case 'expenses':
        case 'outstanding':
            return money(value)
        default:
            return String(value)
    }
}

export default KpiDetailPage
