import { create } from 'zustand'
import type { ViewMode, AttendanceRecord } from '../types'

export type AttendanceState = {
    selectedDate: string
    viewMode: ViewMode
    selectedRows: AttendanceRecord[]
    selectedRecord: AttendanceRecord | null
    markAttendanceOpen: boolean
    deleteDialogOpen: boolean
}

type AttendanceAction = {
    setSelectedDate: (date: string) => void
    setViewMode: (mode: ViewMode) => void
    setSelectedRows: (rows: AttendanceRecord[]) => void
    addSelectedRow: (row: AttendanceRecord) => void
    removeSelectedRow: (rowId: string) => void
    clearSelectedRows: () => void
    setSelectedRecord: (record: AttendanceRecord | null) => void
    setMarkAttendanceOpen: (open: boolean) => void
    setDeleteDialogOpen: (open: boolean) => void
    resetState: () => void
}

const initialState: AttendanceState = {
    selectedDate: new Date().toISOString().split('T')[0],
    viewMode: 'list',
    selectedRows: [],
    selectedRecord: null,
    markAttendanceOpen: false,
    deleteDialogOpen: false,
}

export const useAttendanceStore = create<AttendanceState & AttendanceAction>()(
    (set) => ({
        ...initialState,
        setSelectedDate: (date) => set({ selectedDate: date }),
        setViewMode: (mode) => set({ viewMode: mode }),
        setSelectedRows: (rows) => set({ selectedRows: rows }),
        addSelectedRow: (row) =>
            set((state) => ({
                selectedRows: [...state.selectedRows, row],
            })),
        removeSelectedRow: (rowId) =>
            set((state) => ({
                selectedRows: state.selectedRows.filter(
                    (row) => row.id !== rowId,
                ),
            })),
        clearSelectedRows: () => set({ selectedRows: [] }),
        setSelectedRecord: (record) => set({ selectedRecord: record }),
        setMarkAttendanceOpen: (open) => set({ markAttendanceOpen: open }),
        setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),
        resetState: () => set(initialState),
    }),
)
