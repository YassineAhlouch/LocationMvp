import { create } from 'zustand'
import type { Employee } from '../types'

export type EmployeeState = {
    selectedEmployees: string[]
    viewMode: 'grid' | 'list'
    showAddEmployee: boolean
    showBatchUpload: boolean
    showBulkEdit: boolean
    showBulkDelete: boolean
    editEmployee: Employee | null
    deleteEmployee: Employee | null
}

type EmployeeActions = {
    setSelectedEmployees: (ids: string[]) => void
    toggleEmployeeSelection: (id: string) => void
    clearSelection: () => void
    setViewMode: (mode: 'grid' | 'list') => void
    openAddEmployee: () => void
    openEditEmployee: (employee: Employee) => void
    closeAddEmployee: () => void
    openBatchUpload: () => void
    closeBatchUpload: () => void
    openBulkEdit: () => void
    closeBulkEdit: () => void
    openBulkDelete: () => void
    closeBulkDelete: () => void
    openDeleteEmployee: (employee: Employee) => void
    closeDeleteEmployee: () => void

    resetState: () => void
}

const initialState: EmployeeState = {
    selectedEmployees: [],
    viewMode: 'grid',
    showAddEmployee: false,
    showBatchUpload: false,
    showBulkEdit: false,
    showBulkDelete: false,
    editEmployee: null,
    deleteEmployee: null,
}

export const useEmployeeStore = create<EmployeeState & EmployeeActions>()(
    (set, get) => ({
        ...initialState,
        setSelectedEmployees: (ids) => set({ selectedEmployees: ids }),
        toggleEmployeeSelection: (id) => {
            const current = get().selectedEmployees
            const isSelected = current.includes(id)
            set({
                selectedEmployees: isSelected
                    ? current.filter((empId) => empId !== id)
                    : [...current, id],
            })
        },
        clearSelection: () => set({ selectedEmployees: [] }),
        setViewMode: (mode) => set({ viewMode: mode }),
        openAddEmployee: () =>
            set({ showAddEmployee: true, editEmployee: null }),
        openEditEmployee: (employee) =>
            set({ showAddEmployee: true, editEmployee: employee }),
        closeAddEmployee: () =>
            set({ showAddEmployee: false, editEmployee: null }),
        openBatchUpload: () => set({ showBatchUpload: true }),
        closeBatchUpload: () => set({ showBatchUpload: false }),
        openBulkEdit: () => set({ showBulkEdit: true }),
        closeBulkEdit: () => set({ showBulkEdit: false }),
        openBulkDelete: () => set({ showBulkDelete: true }),
        closeBulkDelete: () => set({ showBulkDelete: false }),
        openDeleteEmployee: (employee) => set({ deleteEmployee: employee }),
        closeDeleteEmployee: () => set({ deleteEmployee: null }),
        resetState: () => set(initialState),
    }),
)
