export type TimeHorizon = 'week' | 'month' | 'quarter'

export type TeamSelection = 'all' | string

export type Currency = 'USD' | 'EUR'

export type PipelineStages = {
    prospecting: boolean
    qualified: boolean
    negotiation: boolean
    closedWon: boolean
}

export type ViewPreferences = {
    applyProbabilityWeighting: boolean
    highlightStalledDeals: boolean
    currency: Currency
}

export type DashboardFilters = {
    timeHorizon: TimeHorizon
    teamSelection: TeamSelection
    pipelineStages: PipelineStages
    viewPreferences: ViewPreferences
}
export type TeamMember = {
    id: string
    name: string
    avatar: string
    initials: string
}

export type RevenueDataPoint = {
    period: string
    revenue: number
    forecast: number
    target: number
    previousRevenue?: number
    teamAverage?: number
}

export type RevenueData = {
    current: RevenueDataPoint[]
    previous: RevenueDataPoint[]
    target: number
}
export type FunnelStage = {
    stage: string
    count: number
    color: string
    conversionRate?: number
    value: number
    probability?: number
    averageAge?: number
}

export type PipelineData = {
    stages: FunnelStage[]
    totalValue: number
}

export type AtRiskReason = 'Stalled' | 'Competitor' | 'Budget'

export type AtRiskDeal = {
    reason: AtRiskReason
    count: number
    percentage: number
    deals: {
        id: string
        name: string
        value: number
        owner: string
    }[]
}

export type ActionPriority = 'urgent' | 'medium' | 'low'

export type Action = {
    id: string
    title: string
    description: string
    priority: ActionPriority
    dueDate: string
    overdueDays?: number
    completed: boolean
    company: string
}

export type GeoDataPoint = {
    region: string
    latitude: number
    longitude: number
    revenue: number
    deals: number
    averageAge?: number
}

export type VelocityTrendPoint = {
    period: string
    count: number
}

export type LeadSource = {
    name: string
    count: number
    percentageChange: number
}

export type VelocityData = {
    total: number
    percentageChange: number
    sources: LeadSource[]
    trend: VelocityTrendPoint[]
}

export type WinRateData = {
    winRate: number
    baseline?: number
    target: number
    totalDeals: number
    wonDeals: number
    lostDeals: number
    cycleLength: number
}

export type CrmDashboardData = {
    revenue: RevenueData
    pipeline: PipelineData
    atRisk: AtRiskDeal[]
    actions: Action[]
    geographic: GeoDataPoint[]
    leadVelocity: VelocityData
    winRate: WinRateData
}

export type RevenueChartProps = {
    data: RevenueData
    timeHorizon: TimeHorizon
    applyProbabilityWeighting: boolean
    highlightStalledDeals: boolean
    currency: Currency
    teamSelection: TeamSelection
    teamAverage?: number
}

export type PipelineFunnelProps = {
    data: PipelineData
    pipelineStages: PipelineStages
    applyProbabilityWeighting: boolean
    highlightStalledDeals: boolean
    currency: Currency
}

export type AtRiskDealsProps = {
    data: AtRiskDeal[]
    teamSelection: TeamSelection
}

export type ActionListProps = {
    data: Action[]
    timeHorizon: TimeHorizon
    onToggleComplete: (actionId: string) => void
}

export type GeographicMapProps = {
    data: GeoDataPoint[]
    currency: Currency
    highlightStalledDeals: boolean
}

export type LeadVelocityProps = {
    data: VelocityData
    timeHorizon: TimeHorizon
}

export type WinRateGaugeProps = {
    data: WinRateData
}

export type DashboardStore = {
    filters: DashboardFilters
    setTimeHorizon: (horizon: TimeHorizon) => void
    setTeamSelection: (team: TeamSelection) => void
    togglePipelineStage: (stage: keyof PipelineStages) => void
    setViewPreference: <K extends keyof ViewPreferences>(
        key: K,
        value: ViewPreferences[K],
    ) => void
    resetFilters: () => void
}

export type UseCrmDashboardReturn = {
    dashboardData: CrmDashboardData | null
    isLoading: boolean
    error: Error | null
    refresh: () => void
}
