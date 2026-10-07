import type {
    Control,
    FieldErrors,
    UseFormWatch,
    UseFormSetValue,
} from 'react-hook-form'

export type Address = {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
}

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

export type InvoiceItem = {
    id: string
    name: string
    description?: string
    quantity: number
    unitPrice: number
    img?: string
    total: number
    productId?: string
}

export type Currency = {
    code: string
    symbol: string
    name: string
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export type DiscountType = 'percentage' | 'fixed'

export type Invoice = {
    id: string
    invoiceNumber: string
    issueDate: string
    dueDate: string
    currency: string
    customer: Customer
    billingAddress: Address
    items: InvoiceItem[]
    subtotal: number
    taxRate: number
    taxAmount: number
    discountType: DiscountType
    discountValue: number
    discountAmount: number
    total: number
    notes?: string
    terms?: string
    status: InvoiceStatus
    createdAt: string
    updatedAt: string
}

export type InvoiceFormData = {
    invoiceNumber: string
    issueDate: string
    dueDate: string
    currency: string
    customerId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    billingAddress: Address
    items: InvoiceItem[]
    subtotal: number
    taxRate: number
    taxAmount: number
    discountType: DiscountType
    discountValue: number
    discountAmount: number
    total: number
    notes?: string
    terms?: string
}

export type FormSectionBaseProps = {
    control: Control<InvoiceFormData>
    errors: FieldErrors<InvoiceFormData>
    watch?: UseFormWatch<InvoiceFormData>
    setValue?: UseFormSetValue<InvoiceFormData>
}

export type InvoicePreviewProps = {
    data: InvoiceFormData
    currency: Currency
}

export type GetCustomersListResponse = {
    list: Customer[]
    total: number
}

export type GetProductsListResponse = {
    list: Product[]
    total: number
}

export type Product = {
    id: string
    name: string
    productCode: string
    description: string
    slug: string
    img: string
    category: string
    price: number
    stock: number
    status: string
    stockPercentage: number
    taxRate: number
    costPerItem: number
    stockStatus: string
    allowBackorder: boolean
}

export type CreateInvoiceResponse = {
    invoice: Invoice
    message: string
}

export type UpdateInvoiceResponse = {
    invoice: Invoice
    message: string
}
