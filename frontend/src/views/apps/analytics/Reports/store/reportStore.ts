import { create } from 'zustand'

export type ReportsListState = {
    visibleColumns: string[]
}

type ReportsListAction = {
    setVisibleColumns: (visibleColumns: string[]) => void
}

const initialState: ReportsListState = {
    visibleColumns: [
        'plan',
        'customer',
        'email',
        'amount',
        'status',
        'featureUsed',
    ],
}

export const useReportsStore = create<ReportsListState & ReportsListAction>(
    (set) => ({
        ...initialState,
        setVisibleColumns: (visibleColumns: string[]) =>
            set({ visibleColumns }),
    }),
)
