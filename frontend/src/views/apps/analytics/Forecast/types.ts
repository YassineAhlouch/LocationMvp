export type Scenario = 'best-case' | 'expected' | 'worst-case'

export type DateRange = {
    startDate: Date
    endDate: Date
}

export type RevenueForecastData = {
    primaryMetric: {
        value: number
        label: string
        period: string
    }
    chartData: Array<{
        month: string
        newMRR: number
        churnedMRR: number
    }>
    parameters: {
        startingMRR: number
        netNewMRR: number
        churnRate: number
        expansionMRR: number
    }
    description: string
}

export type UserGrowthForecastData = {
    primaryMetric: {
        value: number
        label: string
        period: string
    }
    chartData: Array<{
        month: string
        newUsers: number
        churnedUsers: number
    }>
    parameters: {
        startingUsers: number
        newUsers: number
        churnedUsersRate: number
        netNewUsers: number
    }
    description: string
}

export type ChurnRetentionForecastData = {
    primaryMetric: {
        value: number
        label: string
        period: string
    }
    chartData: Record<
        string,
        {
            size: number
            periods: Array<{ percentage: number; value: number } | null>
        }
    >
    parameters: {
        currentRetention: number
        targetRetention: number
        churnTrend: 'improving' | 'stable' | 'declining'
    }
    description: string
}

export type SubscriptionForecastData = {
    primaryMetric: {
        value: number
        label: string
        period: string
    }
    chartData: Array<{
        month: string
        free: number
        pro: number
        enterprise: number
    }>
    parameters: {
        conversionRate: number
        upgradeRate: number
        downgradeRate: number
        planMix: { free: number; pro: number; enterprise: number }
    }
    description: string
}

export type ForecastCardProps = {
    dateRange: DateRange
    scenario: Scenario
}

export type PrimaryMetricProps = {
    value?: number
    label: string
    period: string
    loading?: boolean
    format?: 'currency' | 'number' | 'percentage'
}

export type ParametersListProps = {
    parameters: Record<string, unknown>
}

export type ForcastApiParams = {
    startDate: string
    endDate: string
    scenario: Scenario
}
