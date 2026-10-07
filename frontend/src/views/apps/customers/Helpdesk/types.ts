export type Ticket = {
    id: string
    subject: string
    customer: {
        id: string
        name: string
        img: string
    }
    assignee: {
        id: string
        name: string
        img: string
    }
    status: string
    priority: string
    category: string
    channel: string
    pinned: boolean
    tags: string[]
    createdAt: string
    updatedAt: string
}

export type Tickets = Ticket[]

export type Messages = {
    id: string
    user: {
        id: string
        name: string
        img?: string
    }
    type: 'private' | 'public'
    createdDate: string
    content: string
    attachments: Array<{
        id: string
        name: string
        type: string
    }>
    sender: string
}

export type TicketDetails = {
    id: string
    messages: Array<Messages>
    project: string
    linkedTickes: Array<{
        id: string
        subject: string
        status: string
        priority: string
        category: string
    }>
    dueDate: string
    subject: string
    customer: {
        id: string
        name: string
        img: string
    }
    assignee: {
        id: string
        name: string
        img: string
    }
    status: string
    priority: string
    category: string
    channel: string
    tags: string[]
    pinned: boolean
    createdAt: string
    updatedAt: string
}

export type Filter = {
    status: string[]
    priority: string[]
    category: string[]
    query: string
}

export type EditableTicketDetails = Pick<
    TicketDetails,
    | 'priority'
    | 'status'
    | 'dueDate'
    | 'category'
    | 'subject'
    | 'assignee'
    | 'project'
>

export type GetHelpdeskTicketsResponse = {
    list: Ticket[]
    total: number
}
