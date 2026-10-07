export type DateRange = {
    startDate: Date
    endDate: Date
}

export type SubscriberTrend = {
    date: string
    newSubscribers: number
    unsubscribers: number
    netGrowth: number
}

export type SubscriberMetrics = {
    totalSubscribers: number
    totalGrowth: number
    avgMonthlyGrowth: number
    churnRate: number
    // Additional detailed metrics
    activeSubscribers: {
        value: number
        percentage: number
        total: number
    }
    newSubscribers: {
        value: number
        percentage: number
        total: number
    }
    churnedSubscribers: {
        value: number
        percentage: number
        total: number
    }
}

export type LifecycleStage =
    | 'trial'
    | 'active'
    | 'engaged'
    | 'churned'
    | 'reactivated'

export type LifecycleStageData = {
    stage: LifecycleStage
    count: number
    percentage: number
    trend: 'up' | 'down' | 'neutral'
}

export type EngagementLevel = 'low' | 'medium' | 'high'

export type SubscriptionPlan = 'Basic' | 'Pro' | 'Enterprise'

export type SubscriberPersona = {
    id: string
    name: string
    email: string
    img?: string
    plan: SubscriptionPlan
    subscribeDuration: string
    accumulatedAmount: number
    avgPageViews: number
    engagement: EngagementLevel
    joinDate: string
    lastActive: string
    isHighValue: boolean
    isRecent: boolean
}

// API Response Types
export type GetSubscriberTrendsResponse = {
    trends: SubscriberTrend[]
    metrics: SubscriberMetrics
}

export type GetLifecycleDataResponse = LifecycleStageData[]

export type GetSubscriberPersonasResponse = {
    recent: SubscriberPersona[]
    highValue: SubscriberPersona[]
    list?: SubscriberPersona[] // For paginated results
    total?: number
    pageIndex?: number
    pageSize?: number
}

// Component Props Types
export type SubscriberMetricsProps = {
    metrics: SubscriberMetrics
    loading?: boolean
}

export type SubscriberChartProps = {
    data: SubscriberTrend[]
    loading?: boolean
}

export type SubscriberPersonaTableProps = {
    recentSubscribers: SubscriberPersona[]
    highValueSubscribers: SubscriberPersona[]
    loading?: boolean
}
