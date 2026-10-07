export type LeadStatus = '' | 'Qualified' | 'Contacted' | 'Unqualified'

export type GetLeadsListResponse = {
    list: Lead[]
    total: number
}

export type Filter = {
    customerLabel: string[]
    probability: string
    leadStatus: LeadStatus
    createdDateFrom: string | null
    createdDateTo: string | null
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
}
