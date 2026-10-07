import { create } from 'zustand'
import type {
    DashboardStore,
    DashboardFilters,
    TimeHorizon,
    TeamSelection,
    PipelineStages,
    ViewPreferences,
} from '../types'

const defaultFilters: DashboardFilters = {
    timeHorizon: 'month',
    teamSelection: 'all',
    pipelineStages: {
        prospecting: true,
        qualified: true,
        negotiation: true,
        closedWon: true,
    },
    viewPreferences: {
        applyProbabilityWeighting: false,
        highlightStalledDeals: false,
        currency: 'USD',
    },
}

export const useCrmDashboardStore = create<DashboardStore>((set) => ({
    filters: defaultFilters,

    setTimeHorizon: (horizon: TimeHorizon) =>
        set((state) => ({
            filters: { ...state.filters, timeHorizon: horizon },
        })),

    setTeamSelection: (team: TeamSelection) =>
        set((state) => ({
            filters: { ...state.filters, teamSelection: team },
        })),

    togglePipelineStage: (stage: keyof PipelineStages) =>
        set((state) => ({
            filters: {
                ...state.filters,
                pipelineStages: {
                    ...state.filters.pipelineStages,
                    [stage]: !state.filters.pipelineStages[stage],
                },
            },
        })),

    setViewPreference: <K extends keyof ViewPreferences>(
        key: K,
        value: ViewPreferences[K],
    ) =>
        set((state) => ({
            filters: {
                ...state.filters,
                viewPreferences: {
                    ...state.filters.viewPreferences,
                    [key]: value,
                },
            },
        })),

    resetFilters: () => set({ filters: defaultFilters }),
}))
