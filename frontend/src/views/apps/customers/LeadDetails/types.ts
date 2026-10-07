export type Note = {
    id: string
    title: string
    author: string
    category: string
    content: string
    tags: string[]
}
export type Lead = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img: string
    role: string
    lastOnline: number
    status: string
    location: string
    title: string
    birthday: string
    phoneNumber: string
    dialCode: string
    address: string
    postcode: string
    city: string
    country: string
    totalSpending: number
    tags: string[]
    probability: string
    company: string
    companySize: string
    leadStatus: string
    owner: string
    lastActivity: string
    source: string
    industry: string
    engagementScore: number
    website: string
    notes: Array<Note>
    tickets: Array<{
        id: string
        type: string
        subject: string
        description: string
        date: string
        agent: string
        agentAvatar: string
        agentInitials: string
        status: string
        priority: string
        tags: string[]
        attachments: string[]
    }>
}

export type Deal = {
    id: string
    name: string
    type: string
    status: string
    value: string
    closeDate: string
    probability: number
    stage: number
    totalStages: number
    owner: string
    ownerAvatar: string
    ownerInitials: string
    products: string[]
    lastUpdated: string
    description: string
    notes: string
    history: {
        date: string
        action: string
        type: string
        user: string
    }[]
    documents: {
        name: string
        date: string
        type: string
    }[]
    contacts: {
        name: string
        role: string
        email: string
    }[]
}
