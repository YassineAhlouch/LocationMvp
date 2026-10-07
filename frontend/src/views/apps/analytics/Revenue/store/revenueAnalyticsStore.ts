import { create } from 'zustand'
import dayjs from 'dayjs'
import type {
    MetricType,
    ComparisonMode,
    DateRange,
    DateRangePreset,
} from '../types'

type RevenueAnalyticsState = {
    dateRange: DateRange | null
    selectedPreset: DateRangePreset | null
    selectedMetric: MetricType
    comparisonMode: ComparisonMode
    setDateRange: (range: DateRange | null) => void
    setSelectedPreset: (preset: DateRangePreset) => void
    setSelectedMetric: (metric: MetricType) => void
    setComparisonMode: (mode: ComparisonMode) => void
}

const getDateRangeFromPreset = (preset: DateRangePreset): DateRange => {
    const now = dayjs()
    let startDate: dayjs.Dayjs

    switch (preset) {
        case '7D':
            startDate = now.subtract(7, 'day')
            break
        case '30D':
            startDate = now.subtract(30, 'day')
            break
        case '90D':
            startDate = now.subtract(90, 'day')
            break
        case '1Y':
            startDate = now.subtract(1, 'year')
            break
        default:
            startDate = now.subtract(30, 'day')
    }

    return {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: now.format('YYYY-MM-DD'),
    }
}

export const useRevenueAnalyticsStore = create<RevenueAnalyticsState>(
    (set) => ({
        dateRange: getDateRangeFromPreset('30D'),
        selectedPreset: '30D',
        selectedMetric: 'mrr',
        comparisonMode: 'sameLastYear',

        setDateRange: (range: DateRange | null) => {
            set({ dateRange: range })
        },

        setSelectedPreset: (preset: DateRangePreset) => {
            const newDateRange = getDateRangeFromPreset(preset)
            set({
                selectedPreset: preset,
                dateRange: newDateRange,
            })
        },

        setSelectedMetric: (metric: MetricType) => {
            set({ selectedMetric: metric })
        },

        setComparisonMode: (mode: ComparisonMode) => {
            set({ comparisonMode: mode })
        },
    }),
)
