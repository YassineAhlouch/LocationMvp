export type Client = {
    id: string
    name: string
    contactPerson: string
    email: string
    phone: string
    companyWebsite: string
    logo: string
    address: string
}

export type SkateHolder = {
    id: string
    name: string
    role: string
    email: string
    img: string
}

export type Person = {
    id: string
    name: string
    email: string
    img: string
}

export type Milestone = {
    id: string
    title: string
    description: string
    status: string
    dueDate: string
    checked: boolean
}

export type Attachment = {
    id: string
    name: string
    uploadedBy: string
    uploadedAt: string
    url: string
    type: string
}

export type Comment = {
    id: string
    name: string
    src: string
    message: string
    date: string
    replies: Array<{
        id: string
        name: string
        src: string
        message: string
        date: string
    }>
    reactions?: Array<{ emoji: string; count: number; reacted: boolean }>
}

export type Activity = {
    type: string
    dateTime: number
    userName: string
    userImg: string
    comment: string
}

export type Project = {
    id: string
    name: string
    client: Client
    status: string
    startDate: string
    dueDate: string
    progress: number
    favorite: boolean
    img: string
    description: string
    members: Array<Person>
    tasks: {
        total: number
        completed: number
    }
    priority: string
    detailDescription: string
    stakeholders: Array<SkateHolder>
    milestones: Array<Milestone>
    attachments: Array<Attachment>
    comments: Array<Comment>
    activity: Array<Activity>
    projectType: string
}

export type GetProjectDetailsResponse = Project
