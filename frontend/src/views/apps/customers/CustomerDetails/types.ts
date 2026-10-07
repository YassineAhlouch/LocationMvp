export type Purchase = {
    id: string
    date: string
    product: string
    quantity: number
    amount: number
    status: string
    paymentMethod: string
}

export type Note = {
    id: string
    title: string
    author: string
    category: string
    content: string
    tags: string[]
}
export type Customer = {
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
    purchases: Array<Purchase>
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

export type Subscription = {
    id: string
    name: string
    status: string
    startDate: string
    renewalDate: string
    value: string
    annualValue: string
    monthlyValue: string
    billingCycle: string
    products: string[]
    seats?: number
    totalSeats?: number
    description: string
    paymentMethod: string
    autoRenew: boolean
    invoices: {
        number: string
        date: string
        amount: string
        status: string
    }[]
    history: {
        date: string
        action: string
        user: string
        type: string
    }[]
    contacts: {
        name: string
        role: string
        email: string
    }[]
    documents: {
        name: string
        date: string
        type: string
    }[]
}
