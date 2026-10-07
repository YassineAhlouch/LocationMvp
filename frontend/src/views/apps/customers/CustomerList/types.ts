export type Filter = {
    customerLabel: string[]
    status: string
    dateRange: [string, string]
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
}

export type GetCustomersListResponse = {
    list: Customer[]
    total: number
}
