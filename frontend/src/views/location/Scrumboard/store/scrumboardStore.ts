import { create } from 'zustand'
import {
    currentMonthRange,
    type DateRange,
} from '@/components/shared/PeriodPicker'

type ColumnDialogState = {
    open: boolean
    type: 'edit' | 'add' | ''
}
export type ScrumboardState = {
    selectedTask: string
    selectedColumn: string
    taskDialogOpen: boolean
    addTaskDialogOpen: boolean
    deleteColumnDialogOpen: boolean
    columnDialog: ColumnDialogState
    query: string
    displayedColumns: string[]
    dateRange: DateRange
}

type ScrumboardAction = {
    setSelectedTask: (id: string) => void
    setSelectedColumn: (id: string) => void
    setTaskDialogOpen: (open: boolean) => void
    setAddTaskDialogOpen: (open: boolean) => void
    setDeleteColumnDialogOpen: (open: boolean) => void
    setColumnDialog: (payload: ColumnDialogState) => void
    setQuery: (payload: string) => void
    setDisplayedColumns: (payload: string[]) => void
    setDateRange: (payload: DateRange) => void
}

const initialState: ScrumboardState = {
    selectedTask: '',
    selectedColumn: '',
    taskDialogOpen: false,
    addTaskDialogOpen: false,
    deleteColumnDialogOpen: false,
    columnDialog: {
        open: false,
        type: '',
    },
    query: '',
    displayedColumns: [],
    dateRange: currentMonthRange(),
}

export const useScrumboardStore = create<ScrumboardState & ScrumboardAction>(
    (set) => ({
        ...initialState,
        setSelectedTask: (id) => set(() => ({ selectedTask: id })),
        setSelectedColumn: (id) => set(() => ({ selectedColumn: id })),
        setTaskDialogOpen: (open) => set(() => ({ taskDialogOpen: open })),
        setAddTaskDialogOpen: (open) =>
            set(() => ({ addTaskDialogOpen: open })),
        setDeleteColumnDialogOpen: (open) =>
            set(() => ({ deleteColumnDialogOpen: open })),
        setColumnDialog: (payload) => set(() => ({ columnDialog: payload })),
        setQuery: (payload) => set(() => ({ query: payload })),
        setDisplayedColumns: (payload) =>
            set(() => ({ displayedColumns: payload })),
        setDateRange: (payload) => set(() => ({ dateRange: payload })),
    }),
)
