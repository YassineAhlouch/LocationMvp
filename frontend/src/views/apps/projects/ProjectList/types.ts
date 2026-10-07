export type Project = {
    id: string
    name: string
    client: string
    status: string
    startDate: string
    dueDate: string
    progress: number
    favorite: boolean
    description: string
    img: string
    members: {
        id: string
        name: string
        email: string
        img: string
    }[]
    tasks: {
        total: number
        completed: number
    }
    priority: string
}

export type ActionPayload =
    | {
          type: 'favorite'
          id: string
          value: boolean
      }
    | {
          type: 'delete'
          id: string
      }
    | {
          type: 'add'
          project: Project
      }
    | {
          type: 'statusChange'
          id: string
          status: string
      }

export type Projects = Project[]

export type GetProjectListResponse = Projects
