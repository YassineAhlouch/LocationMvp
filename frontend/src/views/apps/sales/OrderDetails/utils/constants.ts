import { colors } from '@/constants/colors.constant'
import type {
    PaymentMethod,
    PaymentStatus,
    OrderStatus,
    ShippingMethod,
    DiscountType,
} from '../types'

export const paymentMethodOptions: Array<{
    value: PaymentMethod
    label: string
    description?: string
}> = [
    { value: 'cash', label: 'Cash', description: 'Cash payment' },
    {
        value: 'credit_card',
        label: 'Credit Card',
        description: 'Credit or debit card',
    },
    {
        value: 'bank_transfer',
        label: 'Bank Transfer',
        description: 'Direct bank transfer',
    },
    { value: 'check', label: 'Check', description: 'Check payment' },
]

// Payment status options
export const paymentStatusOptions: Array<{
    value: PaymentStatus
    label: string
    color: string
    description?: string
}> = [
    {
        value: 'unpaid',
        label: 'Unpaid',
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        description: 'No payment received',
    },
    {
        value: 'partial',
        label: 'Partial',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        description: 'Partial payment received',
    },
    {
        value: 'paid',
        label: 'Paid',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        description: 'Full payment received',
    },
]

export const orderStatusOptions: Array<{
    value: OrderStatus
    label: string
    color: string
    description?: string
}> = [
    {
        value: 'pending',
        label: 'Pending',
        color: colors.yellow.bg,
        description: 'Order is pending confirmation',
    },
    {
        value: 'confirmed',
        label: 'Confirmed',
        color: colors.blue.bg,
        description: 'Order has been confirmed',
    },
    {
        value: 'processing',
        label: 'Processing',
        color: colors.purple.bg,
        description: 'Order is being processed',
    },
    {
        value: 'shipped',
        label: 'Shipped',
        color: colors.cyan.bg,
        description: 'Order has been shipped',
    },
    {
        value: 'delivered',
        label: 'Delivered',
        color: colors.emerald.bg,
        description: 'Order has been delivered',
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
        color: colors.red.bg,
        description: 'Order has been cancelled',
    },
]

// Shipping method options
export const shippingMethodOptions: Array<{
    value: ShippingMethod
    label: string
    description?: string
    estimatedDays?: string
    cost?: number
}> = [
    {
        value: 'standard',
        label: 'Standard Shipping',
        description: 'Regular delivery',
        estimatedDays: '5-7 business days',
        cost: 9.99,
    },
    {
        value: 'express',
        label: 'Express Shipping',
        description: 'Faster delivery',
        estimatedDays: '2-3 business days',
        cost: 19.99,
    },
    {
        value: 'overnight',
        label: 'Overnight Shipping',
        description: 'Next day delivery',
        estimatedDays: '1 business day',
        cost: 39.99,
    },
]

// Discount type options
export const discountTypeOptions: Array<{
    value: DiscountType
    label: string
    symbol: string
}> = [
    { value: 'percentage', label: 'Percentage', symbol: '%' },
    { value: 'fixed', label: 'Fixed Amount', symbol: '$' },
]

export const defaultOrderFormValues = {
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    products: [],
    subtotal: 0,
    discount: 0,
    discountType: 'percentage' as DiscountType,
    tax: 0,
    taxRate: 0,
    shippingCost: 0,
    total: 0,
    shippingAddress: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    },
    shippingMethod: 'standard' as ShippingMethod,
    paymentStatus: 'unpaid' as PaymentStatus,
    paymentMethod: 'cash' as PaymentMethod,
    paymentDate: '',
    paymentAmount: 0,
    status: 'pending' as OrderStatus,
    statusDate: null,
    trackingNumber: '',
    cancellationReason: '',
    internalNotes: '',
    customerNotes: '',
}
