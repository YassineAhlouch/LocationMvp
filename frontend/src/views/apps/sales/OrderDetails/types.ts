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

export type GetCustomersListResponse = {
    list: Customer[]
    total: number
}

export interface Product {
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

export interface OrderProduct {
    id: string
    name: string
    img: string
    price: number
    quantity: number
    stock: number
    total: number
    allowBackorder?: boolean
}

export interface Order {
    id: string
    orderNumber: string
    date: string
    customer: Customer
    products: OrderProduct[]
    subtotal: number
    discount: number
    discountType: 'percentage' | 'fixed'
    tax: number
    taxRate: number
    shippingCost: number
    total: number
    shippingAddress: Address
    shippingMethod: string
    status: OrderStatus
    statusDate?: Date | null
    trackingNumber?: string
    cancellationReason?: string
    internalNotes: string
    customerNotes: string
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
}

// Form Data Types
export interface OrderFormData {
    customerId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    products: OrderProduct[]
    subtotal: number
    discount: number
    discountType: 'percentage' | 'fixed'
    tax: number
    taxRate: number
    shippingCost: number
    total: number
    shippingAddress: Address
    shippingMethod: string
    status?: OrderStatus
    statusDate?: Date | null
    trackingNumber?: string
    cancellationReason?: string
    internalNotes?: string
    customerNotes?: string
}

// Component Props Types
export interface OrderFormProps {
    mode: FormMode
    orderId?: string
    onSubmit: (data: OrderFormData) => Promise<void>
    onSaveDraft?: (data: OrderFormData) => Promise<void>
    initialData?: Order | null
}

export interface FormSectionBaseProps {
    control: Control<OrderFormData>
    errors: FieldErrors<OrderFormData>
    watch?: UseFormWatch<OrderFormData>
    setValue?: UseFormSetValue<OrderFormData>
}

export interface OrderSummarySectionProps extends FormSectionBaseProps {
    calculatedValues: {
        subtotal: number
        discountAmount: number
        taxAmount: number
        total: number
    }
}

export interface ShippingSectionProps extends FormSectionBaseProps {
    customerAddress?: Address
}

export interface PaymentSectionProps extends FormSectionBaseProps {
    orderTotal: number
}

export interface StatusSectionProps extends FormSectionBaseProps {
    mode: FormMode
}

export type NotesSectionProps = FormSectionBaseProps

// Modal Props Types
export interface CustomerModalProps {
    isOpen: boolean
    onClose: () => void
    onCustomerCreated: (customer: Customer) => void
}

// Utility Types
export type FormMode = 'create' | 'edit'

export type PaymentStatus = 'paid' | 'unpaid' | 'partial'

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'

export type DiscountType = 'percentage' | 'fixed'

export type ShippingMethod = 'standard' | 'express' | 'overnight'

export type PaymentMethod = 'cash' | 'credit_card' | 'bank_transfer' | 'check'

// API Response Types
export interface GetCustomersResponse {
    list: Customer[]
    total: number
}

export interface GetProductsResponse {
    list: Product[]
    total: number
}

export interface CreateOrderResponse {
    order: Order
    message: string
}

export interface UpdateOrderResponse {
    order: Order
    message: string
}

export type GetOrderDetailsResponse = Order
