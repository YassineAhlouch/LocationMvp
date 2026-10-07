export type User = {
    id: string
    name: string
    email: string
    img: string
}

export type TaskCategory = {
    label: string
    count: number
}

export type TaskDistribution = {
    total: number
    projectCount: number
    categories: TaskCategory[]
}

export type MetricData = {
    label: string
    total: number
    trend: number
}

export type ChartDataPoint = {
    month: string
    planned: number
    actual: number
}

export type PerformanceData = {
    projectId: string
    timeRange: string
    metric: MetricData
    chartData: ChartDataPoint[]
}

export type ProgressMetric = {
    label: string
    percentage: number
    trend: number
    segments: number[]
}

export type ProgressData = {
    metrics: ProgressMetric[]
}

export type TaskMeta = {
    status: string
    priority: string
    description?: string
    assignee: User[]
}

export type TimelineTask = {
    id: string
    name: string
    start: Date
    end: Date
    progress: number
    type: 'task' | 'milestone' | 'project'
    project?: string
    hideChildren?: boolean
    meta: TaskMeta
    styles?: {
        backgroundColor?: string
        progressColor?: string
    }
}

export type TimelineData = {
    tasks: TimelineTask[]
}

export type Project = {
    id: string
    name: string
    dueDate: string
    members: User[]
    status: string
    progress: number
    img?: string
}

export type ProjectListData = {
    list: Project[]
}

export type DashboardData = {
    taskDistribution: TaskDistribution
    performance: PerformanceData
    progress: ProgressData
    timeline: TimelineData
    projects: ProjectListData
}
