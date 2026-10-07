import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import type {
    SalesDashboardStore,
    TimeRange,
    ComparisonPeriod,
    SalesDashboardApiParams,
} from '../types'

dayjs.extend(quarterOfYear)

const getDateRanges = (
    timeRange: TimeRange,
    comparisonPeriod: ComparisonPeriod,
) => {
    const now = dayjs()
    let current: { start: Date; end: Date }
    let comparison: { start: Date; end: Date }

    switch (timeRange) {
        case 'thisWeek':
            current = {
                start: now.startOf('week').toDate(),
                end: now.endOf('week').toDate(),
            }
            break
        case 'thisMonth':
            current = {
                start: now.startOf('month').toDate(),
                end: now.endOf('month').toDate(),
            }
            break
        case 'thisQuarter':
            current = {
                start: now.startOf('quarter').toDate(),
                end: now.endOf('quarter').toDate(),
            }
            break
        case 'thisYear':
            current = {
                start: now.startOf('year').toDate(),
                end: now.endOf('year').toDate(),
            }
            break
        default:
            current = {
                start: now.startOf('month').toDate(),
                end: now.endOf('month').toDate(),
            }
    }

    switch (comparisonPeriod) {
        case 'lastWeek':
            comparison = {
                start: now.subtract(1, 'week').startOf('week').toDate(),
                end: now.subtract(1, 'week').endOf('week').toDate(),
            }
            break
        case 'lastMonth':
            comparison = {
                start: now.subtract(1, 'month').startOf('month').toDate(),
                end: now.subtract(1, 'month').endOf('month').toDate(),
            }
            break
        case 'lastQuarter':
            comparison = {
                start: now.subtract(1, 'quarter').startOf('quarter').toDate(),
                end: now.subtract(1, 'quarter').endOf('quarter').toDate(),
            }
            break
        case 'lastYear':
            comparison = {
                start: now.subtract(1, 'year').startOf('year').toDate(),
                end: now.subtract(1, 'year').endOf('year').toDate(),
            }
            break
        default:
            comparison = {
                start: now.subtract(1, 'month').startOf('month').toDate(),
                end: now.subtract(1, 'month').endOf('month').toDate(),
            }
    }

    return { current, comparison }
}

const getComparisonPeriodForTimeRange = (
    timeRange: TimeRange,
): ComparisonPeriod => {
    switch (timeRange) {
        case 'thisWeek':
            return 'lastWeek'
        case 'thisMonth':
            return 'lastMonth'
        case 'thisQuarter':
            return 'lastQuarter'
        case 'thisYear':
            return 'lastYear'
        default:
            return 'lastMonth'
    }
}

export const useSalesDashboardStore = create<SalesDashboardStore>()(
    subscribeWithSelector((set, get) => ({
        timeRange: 'thisMonth',
        comparisonPeriod: 'lastMonth',
        comparisonEnabled: true,

        setTimeRange: (range: TimeRange) => {
            const newComparisonPeriod = getComparisonPeriodForTimeRange(range)
            set({
                timeRange: range,
                comparisonPeriod: newComparisonPeriod,
            })
        },

        setComparisonPeriod: (period: ComparisonPeriod) => {
            set({ comparisonPeriod: period })
        },

        setComparisonEnabled: (enabled: boolean) => {
            set({ comparisonEnabled: enabled })
        },

        getDateRanges: () => {
            const { timeRange, comparisonPeriod } = get()
            return getDateRanges(timeRange, comparisonPeriod)
        },

        getApiParams: (): SalesDashboardApiParams => {
            const { timeRange, comparisonPeriod, comparisonEnabled } = get()
            const dateRanges = getDateRanges(timeRange, comparisonPeriod)

            return {
                timeRange,
                comparisonPeriod: comparisonEnabled
                    ? comparisonPeriod
                    : comparisonPeriod, // Always include for API consistency
                startDate: dayjs(dateRanges.current.start).format('YYYY-MM-DD'),
                endDate: dayjs(dateRanges.current.end).format('YYYY-MM-DD'),
                comparisonStartDate: dayjs(dateRanges.comparison.start).format(
                    'YYYY-MM-DD',
                ),
                comparisonEndDate: dayjs(dateRanges.comparison.end).format(
                    'YYYY-MM-DD',
                ),
            }
        },
    })),
)
