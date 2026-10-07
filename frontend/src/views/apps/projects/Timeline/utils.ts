import dayjs from 'dayjs'
import { colors } from '@/constants/colors.constant'
import type { TimelineTask } from './types'

export const calculateProjectProgress = (tasks: TimelineTask[]): number => {
    if (tasks.length === 0) return 0

    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0)
    return Math.round(totalProgress / tasks.length)
}

export const validateTaskDates = (
    task: TimelineTask,
    newStart: Date,
    newEnd: Date,
    allTasks: TimelineTask[],
): { isValid: boolean; error?: string } => {
    // Check if start date is before end date
    if (newStart >= newEnd) {
        return {
            isValid: false,
            error: 'Start date must be before end date',
        }
    }

    // Check dependencies
    if (task.dependencies && task.dependencies.length > 0) {
        for (const depId of task.dependencies) {
            const dependency = allTasks.find((t) => t.id === depId)
            if (dependency && newStart < dependency.end) {
                return {
                    isValid: false,
                    error: `Task cannot start before dependency "${dependency.name}" ends`,
                }
            }
        }
    }

    return { isValid: true }
}

export const getTaskStatusColor = (status: string): string => {
    switch (status) {
        case 'Completed':
            return colors.emerald.bg
        case 'In Progress':
            return colors.blue.bg
        case 'Under Review':
            return colors.purple.bg
        case 'To Do':
            return colors.yellow.bg
        default:
            return colors.blue.bg
    }
}

export const getPriorityColor = (priority: string): string => {
    switch (priority) {
        case 'High':
            return `${colors.red.iconBg} ${colors.red.iconText}`
        case 'Medium':
            return `${colors.yellow.iconBg} ${colors.yellow.iconText}`
        case 'Low':
            return `${colors.emerald.iconBg} ${colors.emerald.iconText}`
        default:
            return `${colors.gray.iconBg} ${colors.gray.iconText}`
    }
}

export const getBarColor = (id: string) => {
    switch (id) {
        case 'sprint-006':
            return {
                wrapperClass: 'fill-[#05aed3]',
                progressClass: 'fill-[#62c5f3]',
            }
        case 'sprint-007':
            return {
                wrapperClass: 'fill-[#8C62FF]',
                progressClass: 'fill-[#7b4dcf]',
            }
        case 'sprint-008':
            return {
                wrapperClass: 'fill-[#fbc13e]',
                progressClass: 'fill-[#fdd582]',
            }
        default:
            return {
                wrapperClass: 'fill-[#286cf0]',
                progressClass: 'fill-[#286cf0]',
            }
    }
}

export const getContrast = (id: string): 'light' | 'dark' => {
    switch (id) {
        case 'sprint-006':
            return 'light'
        case 'sprint-007':
            return 'dark'
        case 'sprint-008':
            return 'light'
        default:
            return 'light'
    }
}

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export const calculateDuration = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

export const getStartEndDateForProject = (
    tasks: TimelineTask[],
    projectId: string,
): [Date, Date] => {
    const projectTasks = tasks.filter((t) => t.project === projectId)

    if (projectTasks.length === 0) {
        // If no child tasks, return current project dates
        const project = tasks.find((t) => t.id === projectId)
        return project ? [project.start, project.end] : [new Date(), new Date()]
    }

    let start = dayjs(projectTasks[0].start).toDate()
    let end = dayjs(projectTasks[0].end).toDate()

    for (let i = 0; i < projectTasks.length; i++) {
        const task = projectTasks[i]
        const taskStart = dayjs(task.start).toDate()
        const taskEnd = dayjs(task.end).toDate()
        if (start.getTime() > taskStart.getTime()) {
            start = taskStart
        }
        if (end.getTime() < taskEnd.getTime()) {
            end = taskEnd
        }
    }

    return [start, end]
}

export const permissionRoleMap: Record<string, string> = {
    owner: 'Owner',
    viewer: 'Viewer',
    editor: 'Editor',
}
