import { create } from 'zustand'

type DateRange = {
    startDate: Date
    endDate: Date
}

type SubscriptionAnalyticsState = {
    dateRange: DateRange
    setDateRange: (dateRange: DateRange) => void
}

const currentDate = new Date()
const defaultStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 6,
    1,
) // 6 months ago
const defaultEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
) // current month

export const useSubscriptionAnalyticsStore = create<SubscriptionAnalyticsState>(
    (set) => ({
        dateRange: {
            startDate: defaultStartDate,
            endDate: defaultEndDate,
        },
        setDateRange: (dateRange) => set({ dateRange }),
    }),
)
