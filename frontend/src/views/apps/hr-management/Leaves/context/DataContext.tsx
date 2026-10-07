import { createContext } from 'react'
import type {
    LeaveCalendarEvent,
    LeaveStatistics,
    EmployeeLeaveDetail,
} from '../types'
import type { FullCalendarEvent } from '@/components/shared/FullCalendar'

type DataContextProps = {
    // Calendar Data
    calendarEvents: LeaveCalendarEvent[] | undefined
    calendarLoading: boolean
    calendarError: unknown

    // Statistics Data
    statistics: LeaveStatistics | undefined
    statisticsLoading: boolean
    statisticsError: unknown

    // Actions
    createLeaveRequest: (data: Record<string, unknown>) => Promise<void>
    createHoliday: (data: Record<string, unknown>) => Promise<void>
    getEmployeeLeaveDetail: (
        employeeId: string,
        eventId: string,
    ) => Promise<EmployeeLeaveDetail | null>
    updateEvent: (event: FullCalendarEvent) => Promise<void>
}

const DataContext = createContext<DataContextProps>({
    calendarEvents: undefined,
    calendarLoading: false,
    calendarError: undefined,
    statistics: undefined,
    statisticsLoading: false,
    statisticsError: undefined,
    createLeaveRequest: async () => {},
    createHoliday: async () => {},
    getEmployeeLeaveDetail: async () => null,
    updateEvent: async () => {},
})

export default DataContext
