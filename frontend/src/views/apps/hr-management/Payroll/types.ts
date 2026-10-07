export type PayrollStatus = 'paid' | 'pending' | 'processing' | 'failed'

export type PayrollRecord = {
    id: string
    employee: {
        id: string
        name: string
        department: string
        avatar?: string
    }
    basicSalary: number
    allowances: number
    deductions: number
    netPay: number
    status: PayrollStatus
    payPeriod: string // YYYY-MM format
    processedAt?: string
    paySlipUrl?: string
}

export type PayrollMetrics = {
    totalPaid: number
    breakdown: {
        baseSalary: number
        bonuses: number
        overtime: number
        allowances: number
        deductions: number
    }
    summary: {
        deductions: number
        extras: number
        retentions: number
        additions: number
    }
}

export type PayrollChartData = {
    name: string
    value: number
    percentage: number
    color: string
}[]

export type GetPayrollResponse = {
    records: PayrollRecord[]
    metrics: PayrollMetrics
    total: number
}

export type PayrollRequestParams = {
    month: string
    pageIndex?: number
    pageSize?: number
    query?: string
    sortKey?: string
    sortOrder?: string
}

export type ExportPayrollParams = {
    month: string
    format: 'pdf' | 'excel' | 'csv'
}
