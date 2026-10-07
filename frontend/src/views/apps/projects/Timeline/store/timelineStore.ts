import { create } from 'zustand'
import type { TimelineTask } from '../types'

export type TimelineState = {
    selectedSprint: string
    selectedTask: TimelineTask | null
}

type TimelineAction = {
    setSelectedSprint: (sprint: string) => void
    setSelectedTask: (task: TimelineTask) => void
}

const initialState: TimelineState = {
    selectedSprint: '',
    selectedTask: null,
}

export const useTimelineStore = create<TimelineState & TimelineAction>(
    (set) => ({
        ...initialState,
        setSelectedSprint: (sprint: string) => {
            set({ selectedSprint: sprint })
        },
        setSelectedTask: (task: TimelineTask) => {
            set({ selectedTask: task })
        },
    }),
)
