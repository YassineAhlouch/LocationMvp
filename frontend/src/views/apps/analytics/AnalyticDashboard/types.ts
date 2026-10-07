// Analytics Dashboard Types

export type ArrData = {
    current: number // Current ARR in dollars
    changeVsLastMonth: {
        amount: number // Dollar change
        percentage: number // Percentage change
    }
    goalProgress: number // Percentage toward annual goal (0-100)
    sparklineData: Array<{
        date: string // YYYY-MM-DD format
        totalMrr: number // Total MRR (cumulative)
        netNewMrr: number // Net New MRR (gains - losses)
        churnContraction: number // Churn + Contraction (losses)
    }> // Last 90 days
    forecast: {
        eoyProjected: number // End of year projected ARR
        eoyTarget: number // End of year target ARR
        variance: number // Difference (projected - target)
    }
    // Recurring Revenue Health fields
    currentMrr: number // Current Monthly Recurring Revenue
    mrrVsLastMonth: number // MRR percentage change vs last month
    arrVsLastYear: number // ARR percentage change vs last year
    mrrMovers: {
        newSales: number // New Sales MRR
        expansion: number // Expansion MRR
        churn: number // Churn MRR (negative)
    }
}

export type ChannelsData = {
    trafficDominance: number // Percentage of traffic from top 3 channels
    vsLastWeek: number // Percentage change vs last week
    channels: Array<{
        name:
            | 'Organic Search'
            | 'Direct'
            | 'Social Media'
            | 'Paid Ads'
            | 'Referral'
        percentage: number // Share of total traffic
    }>
    metrics: Array<{
        icon: string // Emoji icon
        label: string // Metric label (Acquisition, Conversion, ROI)
        value: string // Metric value
        trend: number // Trend percentage
    }>
}

export type CashRunwayData = {
    cashOnHand: number // Current cash in dollars
    burnRate: number // Monthly burn rate in dollars
    runway: number // Months remaining
    runwayStatus: 'critical' | 'warning' | 'healthy' // Based on months remaining
    cashChartData?: Array<{
        label: string // Date label (e.g., "Dec 27", "Jan 3")
        value: number // Cash value for that period
    }>
    runwayChartData?: Array<{
        label: string // Date label (e.g., "Dec 27", "Jan 3")
        value: number // Runway value in months for that period
    }>
}

export type NetRevenueRetentionData = {
    current: number // Current NRR percentage
    monthlyData: Array<{
        month: string // YYYY-MM format
        nrr: number // NRR percentage
    }> // Last 12 months
    target: number // Target NRR (typically 100)
    changeFromLastMonth?: number // Percentage change from last month
    breakdown?: {
        startingArr: number // Starting ARR/MRR
        expansion: number // Expansion revenue
        contraction: number // Contraction revenue (includes churn)
    }
}

export type ChurnData = {
    logoChurn: number // Logo churn percentage
    revenueChurn: number // Revenue churn percentage
    logoChurnTarget: number // Target logo churn
    revenueChurnTarget: number // Target revenue churn
    logoChurnChange?: number // Change from last month
    revenueChurnChange?: number // Change from last month
    churnDrivers?: Array<{
        reason: string // Churn reason
        lostMrr: number // Lost MRR amount
        percentageOfTotal: number // Percentage of total churn
    }>
}

export type PlansData = {
    plans: Array<{
        name: string // Plan name (e.g., "Enterprise", "Pro", "Starter")
        monthlyPrice: number // Price in dollars
        revenuePercentage: number // Percentage of total revenue
        icon: string // Icon identifier for the plan
    }>
}

export type MrrWaterfallData = {
    startingMrr: number // MRR at start of period
    newSales: number // New MRR from new customers
    expansion: number // Additional MRR from existing customers
    churn: number // Lost MRR from churned customers (negative)
    contraction: number // Reduced MRR from downgrades (negative)
    endingMrr: number // MRR at end of period
    netChange: number // Total change (new + expansion - churn - contraction)
}

export type AtRiskAccountsData = {
    accounts: Array<{
        id: string
        companyName: string
        avatar?: string // Company logo URL
        healthScore: number // 0-100
        arr: number // Annual recurring revenue
        daysSinceLastLogin: number
        riskLevel: 'critical' | 'warning' // Based on health score
    }>
}

export type PlatformStabilityData = {
    uptime: number // Uptime percentage (0-100)
    errorRate: number // Error rate percentage
    totalRequests: number // Total requests in millions
    p95ResponseTime: number // P95 response time in ms
    uptimeTrend: number // Uptime trend percentage
    errorImpact: number // Error impact percentage
    utilization: number // Platform utilization percentage
    requestBreakdown: {
        successful: { count: number; percentage: number } // 2xx responses
        clientErrors: { count: number; percentage: number } // 4xx responses
        serverErrors: { count: number; percentage: number } // 5xx responses
        totalRequests: number // Total requests in billions
    }
}

export type LtvCacData = {
    current: number // Current LTV:CAC ratio
    monthlyData: Array<{
        month: string // YYYY-MM format
        ratio: number // LTV:CAC ratio
    }> // Last 12 months
    target: number // Target ratio (typically 3.0)
    explanation: string // Brief explanation of calculation
}

export type TrialFunnelData = {
    stages: Array<{
        name:
            | 'Website Visitor'
            | 'Trial Signup'
            | 'Activated User'
            | 'Paid Conversion'
        count: number // Number at this stage
        percentage: number // Percentage of previous stage (or total for first stage)
        conversionRate?: number // Conversion rate to next stage
        color: string // Hex color for visualization
        velocity: number // Time metric in seconds
        dropoffPercentage?: number // Percentage that dropped off from this stage
    }>
}

export type LeadSourcesData = {
    sources: Array<{
        channel: string // Channel name
        signups: number // Total signups
        paidConversions: number // Paid conversions
        conversionRate: number // Percentage (paidConversions / signups * 100)
        status: 'above_average' | 'average' | 'below_average' // Comparison to average
    }>
    avgConversionRate: number // Average conversion rate across all channels
}

export type AnalyticDashboardData = {
    arr: ArrData
    channels: ChannelsData
    cashRunway: CashRunwayData
    nrr: NetRevenueRetentionData
    churn: ChurnData
    plans: PlansData
    mrrWaterfall: MrrWaterfallData
    atRiskAccounts: AtRiskAccountsData
    platformStability: PlatformStabilityData
    ltvCac: LtvCacData
    trialFunnel: TrialFunnelData
    leadSources: LeadSourcesData
}
