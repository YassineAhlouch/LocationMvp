import type { FullCalendarEvent } from '@/components/shared/FullCalendar'

export type LeaveType = 'holiday' | 'annualLeave' | 'sickLeave' | 'casualLeave'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export type LeaveCalendarEvent = {
    id: number
    startDate: string
    endDate: string
    title: string
    color: string
    description: string
    type: LeaveType
    disabled?: boolean
    employees: {
        id: string
        name: string
        title: string
        status: LeaveStatus
    }[]
}

export type EmployeeLeaveDetail = {
    id: string
    name: string
    title: string
    reason?: string
    status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
    appliedAt: string
    approvedAt?: string
    halfDay?: boolean
    startDate: string
    endDate: string
    doc?: {
        id: string
        name: string
        url: string
        type: string
    }[]
}

export type LeaveStatistics = {
    totalRequests: {
        value: number
        change: string
        trend: 'up' | 'down'
    }
    approvalRate: {
        value: number
        change: string
        trend: 'up' | 'down'
    }
    onLeaveToday: {
        value: number
        departments: string
    }
    upcomingLeaves: {
        value: number
        period: string
    }
}

export type LeaveRequest = {
    id: string
    employee: {
        id: string
        name: string
        title: string
        avatar?: string
    }
    type: 'annualLeave' | 'sickLeave' | 'casualLeave' | 'holiday'
    startDate: string
    endDate: string
    duration: string
    reason?: string
    status: LeaveStatus
    appliedAt: string
}

export type updateEventPayload = FullCalendarEvent &
    Omit<LeaveCalendarEvent, 'employees'>
