import { create } from 'zustand'
import type { Scenario } from '../types'

export type ForecastState = {
    scenario: Scenario
    dateRange: string
}

type ForecastAction = {
    setScenario: (scenario: Scenario) => void
    setDateRange: (dateRange: string) => void
}

const initialState: ForecastState = {
    scenario: 'expected',
    dateRange: 'next-6-month',
}

export const useForecastStore = create<ForecastState & ForecastAction>(
    (set) => ({
        ...initialState,
        setScenario: (scenario: Scenario) => set({ scenario }),
        setDateRange: (dateRange: string) => set({ dateRange }),
    }),
)
