import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCurrentMonth } from '../utils'

export type PayrollStore = {
    selectedMonth: string
    setSelectedMonth: (month: string) => void
}

export const usePayrollStore = create<PayrollStore>()(
    persist(
        (set) => ({
            selectedMonth: getCurrentMonth(),
            setSelectedMonth: (month: string) => set({ selectedMonth: month }),
        }),
        {
            name: 'payroll-store',
            partialize: (state) => ({ selectedMonth: state.selectedMonth }),
        },
    ),
)
