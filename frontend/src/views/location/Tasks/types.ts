export type Member = {
    id: string
    name: string
    email: string
    img: string
    permissionRole: string
    status: string
}

export type Task = {
    id: string
    subject: string
    columnId: string
    description: string
    cover: string
    members: Member[]
    tags: string[]
    priority: string
    dueDate: string
}

export type Group = {
    id: string
    name: string
    color: string
}

export type GroupId = string

export type GroupType = 'Group'

export type TaskType = 'Task'

export interface GroupDragData {
    type: GroupType
    group: Group
}

export interface TaskDragData {
    type: TaskType
    task: Task
}

export type ProjectMeta = {
    id: string
    title: string
    description: string
    participantMembers: Member[]
    allMembers: Member[]
}

export type GetTasksResponse = {
    groups: Group[]
    tasks: Task[]
    projectMeta: ProjectMeta
}
