export type ReportRecord = {
    id: string
    date: string
    plan: string
    customer: string
    amount: number
    paymentMethod: string
    status: string
    country: string
    countryCode: string
    userId: string
    name: string
    email: string
    signupDate: string
    lastActive: string
    mrrRange: string
    autoRenewal: boolean
    featureUsed: string[]
    count: number
    device: string
    timestamp: string
}

export type GetReportsResponse = {
    list: ReportRecord[]
    total: number
    pageIndex: number
    pageSize: number
}
