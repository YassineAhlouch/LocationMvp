export type TimeRange = 'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear'
export type ComparisonPeriod =
    | 'lastWeek'
    | 'lastMonth'
    | 'lastQuarter'
    | 'lastYear'

export type ChartDataPoint = {
    date: string
    value: number
    label: string
    estimated?: number
    gap?: number
}

export type CustomerSegmentData = {
    chartData: Array<{
        date: string
        label: string
        newCustomers: number
        returningCustomers: number
    }>
    newCustomers: {
        total: number
        percentage: number
        change: number
    }
    returningCustomers: {
        total: number
        percentage: number
        change: number
    }
    totalCustomers: number
    retentionRate: number
    revenueSplit: {
        newPercentage: number
        returningPercentage: number
    }
    repeatPurchaseRatio: number
}

export type RevenueOrderData = {
    date: string
    revenue: number
    orders: number
    orderCount: number
    formattedDate: string
}

export type PopularProduct = {
    id: string
    name: string
    sales: number
    relativePerformance: number
}

export type CategorySalesData = {
    name: string
    value: number
    color: string
}

export type TrafficSource = {
    name: string
    count: number
    percentageChange: number
}

export type TrafficAnalysisData = {
    value: number
    change: number
    chartData: ChartDataPoint[]
    comparisonData?: ChartDataPoint[]
    sources: TrafficSource[]
    bounceRate: {
        value: number
        change: number
    }
}

export type SupportingMetric = {
    value: number
    change: number
    chartData: ChartDataPoint[]
    comparisonData?: ChartDataPoint[]
    avgItemsPerTransaction?: number
}

export type SalesDashboardData = {
    metrics: {
        conversionRate: {
            value: number
            change: number
        }
        customerAcquisitionCost: {
            value: number
            change: number
        }
        averageRevenue: {
            value: number
            change: number
        }
        expenseTotal: {
            value: number
            change: number
        }
    }
    revenueTrend: {
        current: RevenueOrderData[]
        previous: RevenueOrderData[]
        total: number
        change: number
        totalOrders: number
        ordersChange: number
    }
    topSellingCategories: CategorySalesData[]
    supportingMetrics: {
        averageOrderValue: SupportingMetric
        customerSegment: CustomerSegmentData
        totalSessions: TrafficAnalysisData
    }
    topCampaigns: CampaignData[]
}

export type CampaignChannel =
    | 'google'
    | 'facebook'
    | 'tiktok'
    | 'instagram'
    | 'email'
export type CampaignStatus = 'Active' | 'Paused' | 'Learning'
export type CampaignCategory =
    | 'search'
    | 'display'
    | 'video'
    | 'social'
    | 'email'
    | 'retargeting'

export type CampaignData = {
    id: string
    name: string
    category: CampaignCategory
    channel: CampaignChannel
    spend: number
    revenue: number
    roas: number
    status: CampaignStatus
}

export type SalesDashboardResponse = {
    success: boolean
    data: SalesDashboardData
    meta: {
        timeRange: TimeRange
        comparisonPeriod: ComparisonPeriod
        generatedAt: string
    }
}

export type SalesDashboardApiParams = {
    timeRange: TimeRange
    comparisonPeriod: ComparisonPeriod
    startDate: string
    endDate: string
    comparisonStartDate: string
    comparisonEndDate: string
}

export type SalesDashboardStore = {
    timeRange: TimeRange
    comparisonPeriod: ComparisonPeriod
    comparisonEnabled: boolean
    setTimeRange: (range: TimeRange) => void
    setComparisonPeriod: (period: ComparisonPeriod) => void
    setComparisonEnabled: (enabled: boolean) => void
    getDateRanges: () => {
        current: { start: Date; end: Date }
        comparison: { start: Date; end: Date }
    }
    getApiParams: () => SalesDashboardApiParams
}

export type RevenueOrderChartProps = {
    currentPeriodData: ChartDataPoint[]
    previousPeriodData: ChartDataPoint[]
    height?: number
}

export type SupportingMetricChartProps = {
    data: ChartDataPoint[]
    type: 'bar' | 'line'
    showComparison?: boolean
    averageLine?: boolean
}

export type SalesDashboardHeaderProps = {
    userName?: string
    currentDate: Date
}

export type ErrorState = {
    type: 'network' | 'server' | 'validation' | 'empty'
    message: string
    retryable: boolean
    fallbackData?: Partial<SalesDashboardData>
}
