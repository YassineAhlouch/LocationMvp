import { create } from 'zustand'

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
    }),
)
