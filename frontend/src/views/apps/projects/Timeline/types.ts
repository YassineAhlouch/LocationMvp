import type { Task } from '@/components/shared/Gantt/types'

type Member = {
    id: string
    name: string
    email: string
    img: string
    permissionRole: string
    status: string
}

export type TaskMeta = {
    meta: {
        assignee?: {
            id: string
            name: string
            img?: string
        }[]
        priority: 'Low' | 'Medium' | 'High'
        status: 'To Do' | 'In Progress' | 'Under Review' | 'Completed'
        description?: string
    }
}

export type TimelineTask = Task & TaskMeta

export type ProjectMember = {
    id: string
    name: string
    email: string
    img?: string
    role?: string
}

export type TimelineProject = {
    id: string
    title: string
    description: string
    participantMembers: Member[]
    allMembers: Member[]
}

export type GetProjectTimelineResponse = {
    projects: TimelineProject
    tasks: TimelineTask[]
    members: ProjectMember[]
    sprints: { value: string; label: string }[]
    total: number
}

export type TimelineDataContextType = {
    projects?: TimelineProject
    sprints?: { value: string; label: string }[]
    tasks?: TimelineTask[]
    selectedTask?: TimelineTask
    isLoading: boolean
    error?: Error
    updateTask: (tasks: TimelineTask[]) => void
    updateProject: (
        callback: (data: TimelineProject) => TimelineProject,
    ) => void
    refetch: () => void
}
