import { create } from 'zustand'
import {
    currentMonthRange,
    type DateRange,
} from '@/components/shared/PeriodPicker'
import type { Member } from '../types'

type TaskDialogState = {
    open: boolean
    id: string
}

export type TasksState = {
    allMembers: Member[]
    taskDialog: TaskDialogState
    addTaskDialogOpen: boolean
    dateRange: DateRange
}

type TasksAction = {
    setAllMembers: (members: Member[]) => void
    setTaskDialog: (payload: TaskDialogState) => void
    setAddTaskDialogOpen: (open: boolean) => void
    setDateRange: (payload: DateRange) => void
}

const initialState: TasksState = {
    allMembers: [],
    taskDialog: {
        open: false,
        id: '',
    },
    addTaskDialogOpen: false,
    dateRange: currentMonthRange(),
}

export const useTasksStore = create<TasksState & TasksAction>((set) => ({
    ...initialState,
    setAllMembers: (members) => set({ allMembers: members }),
    setTaskDialog: (payload) => set({ taskDialog: payload }),
    setAddTaskDialogOpen: (open) => set({ addTaskDialogOpen: open }),
    setDateRange: (payload) => set({ dateRange: payload }),
}))
