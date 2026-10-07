import { create } from 'zustand'
import type { Member } from '../types'

type TaskDialogState = {
    open: boolean
    id: string
}

export type TasksState = {
    allMembers: Member[]
    taskDialog: TaskDialogState
}

type TasksAction = {
    setAllMembers: (members: Member[]) => void
    setTaskDialog: (payload: TaskDialogState) => void
}

const initialState: TasksState = {
    allMembers: [],
    taskDialog: {
        open: false,
        id: '',
    },
}

export const useTasksStore = create<TasksState & TasksAction>((set) => ({
    ...initialState,
    setAllMembers: (members) => set({ allMembers: members }),
    setTaskDialog: (payload) => set({ taskDialog: payload }),
}))
