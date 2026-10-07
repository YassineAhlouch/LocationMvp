export type Customer = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img: string
    phoneNumber: string
    dialCode: string
    address?: Address
}

export type Order = {
    id: string
    date: string
    customer: Customer
    status: number
    paymentMethod: string
    paymentStatus: string
    paymentIdentifier: string
    productCount: number
    totalAmount: number
}

type Address = {
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    postalCode: string
    country: string
}

export type Orders = Order[]

export type Product = {
    id: string
    name: string
    productCode: string
    img: string
    price: number
    quantity: number
}

export type GetOrderListResponse = {
    list: Orders
    total: number
}

export type OrderDetails = Order & {
    phone: string
    shippingAddress: Address
    billingAddress: Address
    shippingMethod: string
    paymentSummary: {
        subTotal: number
        tax: number
        deliveryFees: number
        total: number
        customerPayment: number
    }
    products: Array<Product>
}

export type GetOrderDetailsResponse = OrderDetails

export type GetOrderStatisticsResponse = {
    id: string
    label: string
    value: number
}[]
