import type { TableQueries } from '@/@types/common'

export type ViewMode = 'list' | 'period'

export type AttendanceStatus =
    | 'present'
    | 'absent'
    | 'late'
    | 'on_leave'
    | 'remote'

export type AttendanceRecord = {
    id: string
    employee: {
        id: string
        name: string
        department: string
        role: string
        avatar?: string
    }
    date: string // YYYY-MM-DD format
    checkIn?: string // HH:MM format
    checkOut?: string // HH:MM format
    totalHours?: string // e.g., "8h 30m"
    status: AttendanceStatus
    markedBy: 'system' | 'admin' | 'employee' | 'biometric'
    notes?: string
}

export type AttendanceMetrics = {
    presentToday: number
    absentToday: number
    lateArrivals: number
    attendanceRate: number // percentage
}

export type GetAttendanceResponse = {
    records: AttendanceRecord[]
    metrics: AttendanceMetrics
    total: number
}

export type PeriodAttendanceRecord = {
    employee: {
        id: string
        name: string
        department: string
        role: string
        avatar?: string
    }
    attendance: Record<string, AttendanceStatus>
    presentPercentage: number
}

export type MarkAttendanceRequest = {
    employeeId: string
    date: string
    checkIn?: string
    checkOut?: string
    status: AttendanceStatus
    notes?: string
}

export type AttendanceRequestParams = TableQueries & {
    date: string
    status?: string
}
