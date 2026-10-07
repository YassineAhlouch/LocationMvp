export type Column = {
    id: string
    name: string
    color: string
}

export type Task = {
    id: string
    subject: string
    columnId: string
    description: string
    cover: string
    members: {
        id: string
        name: string
        email: string
        img: string
    }[]
    tags: string[]
    priority: string
    attachmentCount: number
    taskCount: number
    commentCount: number
    dueDate: string
}

export type ColumnId = string

export type ColumnType = 'Column'

export interface ColumnDragData {
    type: ColumnType
    column: Column
}

export type TaskType = 'Task'

export interface TaskDragData {
    type: TaskType
    task: Task
}

type Member = {
    id: string
    name: string
    email: string
    img: string
    permissionRole: string
    status: string
}

export type ProjectMeta = {
    id: string
    title: string
    description: string
    participantMembers: Member[]
    allMembers: Member[]
}

export type GetScrumboardResponse = {
    columns: Column[]
    tasks: Task[]
    projectMeta: ProjectMeta
}
