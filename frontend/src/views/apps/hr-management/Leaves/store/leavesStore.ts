import { create } from 'zustand'
import type { LeaveCalendarEvent } from '../types'

export type DialogState = {
    isOpen: boolean
    selectedDate?: Date
    selectedEvent?: LeaveCalendarEvent
    selectedEmployee?: string
}

export type CreateDialogState = {
    isOpen: boolean
    selectedDate?: Date
    activeTab: 'holiday' | 'leave'
}

export type LeavesState = {
    // Dialog states
    dialogs: {
        create: CreateDialogState
        leaveDetails: DialogState
    }
    // View states
    selectedView: 'calendars' | 'leaves'
    selectedTab: 'leaves' | 'requested'
    // Calendar state
    calendarDate: Date
}

type LeavesAction = {
    // Dialog actions
    openCreateDialog: (
        selectedDate?: Date,
        activeTab?: 'holiday' | 'leave',
    ) => void
    openLeaveDetailsDialog: (
        event: LeaveCalendarEvent,
        selectedEmployee?: string,
    ) => void
    closeAllDialogs: () => void
    setSelectedEmployee: (employeeId: string) => void
    setCreateDialogTab: (tab: 'holiday' | 'leave') => void

    // View actions
    setSelectedView: (view: 'calendars' | 'leaves') => void
    setSelectedTab: (tab: 'leaves' | 'requested') => void
    setCalendarDate: (date: Date) => void
}

const initialDialogState: DialogState = {
    isOpen: false,
    selectedDate: undefined,
    selectedEvent: undefined,
    selectedEmployee: undefined,
}

const initialCreateDialogState: CreateDialogState = {
    isOpen: false,
    selectedDate: undefined,
    activeTab: 'holiday',
}

const initialState: LeavesState = {
    dialogs: {
        create: initialCreateDialogState,
        leaveDetails: initialDialogState,
    },
    selectedView: 'calendars',
    selectedTab: 'leaves',
    calendarDate: new Date(),
}

export const useLeavesStore = create<LeavesState & LeavesAction>((set) => ({
    ...initialState,

    // Dialog actions
    openCreateDialog: (selectedDate, activeTab = 'holiday') =>
        set((state) => ({
            dialogs: {
                ...state.dialogs,
                create: {
                    isOpen: true,
                    selectedDate,
                    activeTab,
                },
            },
        })),

    openLeaveDetailsDialog: (event, selectedEmployee) =>
        set((state) => ({
            dialogs: {
                ...state.dialogs,
                leaveDetails: {
                    isOpen: true,
                    selectedDate: undefined,
                    selectedEvent: event,
                    selectedEmployee: selectedEmployee || '',
                },
            },
        })),

    closeAllDialogs: () =>
        set(() => ({
            dialogs: {
                create: initialCreateDialogState,
                leaveDetails: initialDialogState,
            },
        })),

    setSelectedEmployee: (employeeId) =>
        set((state) => ({
            dialogs: {
                ...state.dialogs,
                leaveDetails: {
                    ...state.dialogs.leaveDetails,
                    selectedEmployee: employeeId,
                },
            },
        })),

    setCreateDialogTab: (tab) =>
        set((state) => ({
            dialogs: {
                ...state.dialogs,
                create: {
                    ...state.dialogs.create,
                    activeTab: tab,
                },
            },
        })),

    // View actions
    setSelectedView: (view) => set(() => ({ selectedView: view })),
    setSelectedTab: (tab) => set(() => ({ selectedTab: tab })),
    setCalendarDate: (date) => set(() => ({ calendarDate: date })),
}))
