import dayjs from 'dayjs'
import DataContext from '../context/DataContext'
import useSWR from 'swr'
import {
    apiGetLeaveCalendarEvents,
    apiGetLeaveStatistics,
    apiGetEmployeeLeaveDetail,
} from '@/services/HrmService'
import sleep from '@/utils/sleep'
import type {
    LeaveCalendarEvent,
    LeaveStatistics,
    EmployeeLeaveDetail,
} from '../types'
import { getLeaveTypeColor } from '@/mock/data/hrmData'
import type { ReactNode } from 'react'
import type { FullCalendarEvent } from '@/components/shared/FullCalendar'

type TableQueries = {
    pageIndex: number
    pageSize: number
    query: string
    sortOrder: string
    sortKey: string
    status?: string
    type?: string
}

type LeaveContextProps = {
    children: ReactNode
    tableQueries?: TableQueries
}

export const LeaveContext = ({ children }: LeaveContextProps) => {
    const {
        data: calendarEvents,
        error: calendarError,
        isLoading: calendarLoading,
        mutate: mutateCalendarEvents,
    } = useSWR(
        '/api/hrm/leaves/calendar',
        () => apiGetLeaveCalendarEvents<LeaveCalendarEvent[]>(),
        {
            revalidateOnFocus: false,
        },
    )

    const {
        data: statistics,
        error: statisticsError,
        isLoading: statisticsLoading,
        mutate: mutateStatistics,
    } = useSWR(
        '/api/hrm/leaves/statistics',
        () => apiGetLeaveStatistics<LeaveStatistics>(),
        {
            revalidateOnFocus: false,
        },
    )

    const updateEvent = async (event: FullCalendarEvent) => {
        const newCalendarEvents = calendarEvents!.map((calendarEvent) =>
            calendarEvent.id === event.id
                ? { ...event, employees: calendarEvent.employees }
                : calendarEvent,
        )
        mutateCalendarEvents(newCalendarEvents as LeaveCalendarEvent[], false)
    }

    const createLeaveRequest = async (data: Record<string, unknown>) => {
        await sleep(500)
        console.log('createLeaveRequest', data)
    }

    const createHoliday = async (data: Record<string, unknown>) => {
        await sleep(500)

        try {
            const newHoliday: LeaveCalendarEvent = {
                id: dayjs().valueOf(),
                startDate: data.startDate as string,
                endDate: (data.endDate as string) || (data.startDate as string),
                title: (data.title as string) || 'Public Holiday',
                color: getLeaveTypeColor('publicHoliday'),
                description:
                    (data.description as string) ||
                    `Public Holiday - ${data.title}`,
                type: 'holiday',
                employees: [],
            }

            if (calendarEvents) {
                const updatedEvents = [...calendarEvents, newHoliday]
                mutateCalendarEvents(updatedEvents, false)
            }

            console.log('Holiday created:', data)
        } catch (error) {
            console.error('Failed to create holiday:', error)
        }
    }

    const getEmployeeLeaveDetail = async (
        employeeId: string,
        eventId: string,
    ): Promise<EmployeeLeaveDetail | null> => {
        try {
            const response =
                await apiGetEmployeeLeaveDetail<EmployeeLeaveDetail>({
                    employeeId,
                    eventId,
                })
            return response
        } catch {
            return null
        }
    }

    const contextValue = {
        calendarEvents,
        calendarLoading,
        calendarError,
        statistics,
        statisticsLoading,
        statisticsError,
        createLeaveRequest,
        createHoliday,
        getEmployeeLeaveDetail,
        mutateCalendarEvents,
        mutateStatistics,
        updateEvent,
    }

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    )
}

export default LeaveContext
