import type { InvoiceItem, Currency, Customer, Address } from './types'

export const currencies: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
]

export const getCurrencyByCode = (code: string): Currency => {
    return (
        currencies.find((currency) => currency.code === code) || currencies[0]
    )
}

export const calculateLineTotal = (
    quantity: number,
    unitPrice: number,
): number => {
    return Number((quantity * unitPrice).toFixed(2))
}

export const calculateSubtotal = (items: InvoiceItem[]): number => {
    return Number(items.reduce((sum, item) => sum + item.total, 0).toFixed(2))
}

export const calculateTaxAmount = (
    subtotal: number,
    taxRate: number,
): number => {
    return Number((subtotal * (taxRate / 100)).toFixed(2))
}

export const calculateDiscountAmount = (
    subtotal: number,
    discountType: 'percentage' | 'fixed',
    discountValue: number,
): number => {
    if (discountType === 'percentage') {
        return Number((subtotal * (discountValue / 100)).toFixed(2))
    }
    return Number(discountValue.toFixed(2))
}

export const calculateTotal = (
    subtotal: number,
    taxAmount: number,
    discountAmount: number,
): number => {
    return Number((subtotal + taxAmount - discountAmount).toFixed(2))
}

export const generateInvoiceNumber = (): string => {
    const prefix = 'INV'
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')
    return `${prefix}-${timestamp}${random}`
}

export const getCurrentDate = (): string => {
    return new Date().toISOString().split('T')[0]
}

export const getDefaultDueDate = (
    issueDate: string,
    daysToAdd: number = 30,
): string => {
    const date = new Date(issueDate)
    date.setDate(date.getDate() + daysToAdd)
    return date.toISOString().split('T')[0]
}

export const formatAddress = (address: Address): string => {
    const parts = [
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.state,
        address.postalCode,
        address.country,
    ].filter(Boolean)

    return parts.join(', ')
}

export const populateBillingFromCustomer = (customer: Customer): Address => {
    if (customer.address) {
        return { ...customer.address }
    }

    return {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    }
}

export const createEmptyItem = (): InvoiceItem => ({
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0,
    productId: undefined,
})

export const updateItemTotal = (item: InvoiceItem): InvoiceItem => ({
    ...item,
    total: calculateLineTotal(item.quantity, item.unitPrice),
})
