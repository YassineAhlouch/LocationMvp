// HR Dashboard Types

export type TurnoverData = {
    currentRate: number
    targetRate: number
    variance: number
    monthlyData: Array<{
        month: string
        rate: number
        voluntaryLeavers: number
        avgHeadcount: number
    }>
}

export type JobLevelData = {
    total: number
    levels: Array<{
        name: string
        count: number
        percentage: number
    }>
}

export type PayrollData = {
    ytdTotal: number
    monthlyData: Array<{
        month: string
        baseSalary: number
        bonuses: number
        overtime: number
        taxes: number
        total: number
    }>
    variance: {
        amount: number
        percentage: number
        trend: 'up' | 'down'
    }
}

export type EmployeeQualityData = {
    companyAvgScore: number
    previousScore: number
    trend: 'up' | 'down'
    departments: Array<{
        name: string
        avgScore: number
        employeeCount: number
        color: string
    }>
}

export type ActionCategory = 'schedule' | 'system' | 'employees'
export type ActionType =
    | 'leave_request'
    | 'offer_approval'
    | 'training_notification'
    | 'interview'
    | 'meeting'
    | 'performance_review'
    | 'onboarding'
    | 'system_update'
    | 'policy_change'
    | 'birthday'
    | 'work_anniversary'
export type ActionStatus = 'pending' | 'urgent' | 'overdue'

export type ActionItem = {
    id: string
    category: ActionCategory
    type: ActionType
    employee?: {
        id: string
        name: string
        avatar?: string
        title?: string
    }
    title: string
    description?: string
    time: string
    deadline: string
    status: ActionStatus
    actions?: Array<'approve' | 'deny' | 'renew' | 'view'>
}

export type ActionsData = {
    events: ActionItem[]
}

export type IssueType =
    | 'missing_document'
    | 'expiring_visa'
    | 'incomplete_training'
    | 'expired_certification'
export type IssueUrgency = 'warning' | 'critical' | 'overdue'

export type ComplianceIssue = {
    id: string
    employee: {
        id: string
        name: string
        email: string
        avatar?: string
        department: string
    }
    issueType: IssueType
    description: string
    deadline: string
    daysRemaining: number
    urgency: IssueUrgency
    actions: Array<'approve_late' | 'incorporate' | 'view_profile'>
}

export type ComplianceData = {
    issues: ComplianceIssue[]
    total: number
    summary: {
        warning: number
        critical: number
        overdue: number
    }
}

export type HrmDashboardData = {
    turnover: TurnoverData
    jobLevel: JobLevelData
    payroll: PayrollData
    employeeQuality: EmployeeQualityData
    actions: ActionsData
    compliance: ComplianceData
}
