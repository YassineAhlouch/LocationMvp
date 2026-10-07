import type { Order, OrderFormData, Customer, Address } from '../types'
import { defaultOrderFormValues } from './constants'

/**
 * Transform Order data to OrderFormData for form initialization
 */
export const orderToFormData = (order: Order): OrderFormData => {
    return {
        customerId: order.customer.id,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phoneNumber,
        products: order.products,
        subtotal: order.subtotal,
        discount: order.discount,
        discountType: order.discountType,
        tax: order.tax,
        taxRate: order.taxRate,
        shippingCost: order.shippingCost,
        total: order.total,
        shippingAddress: order.shippingAddress,
        shippingMethod: order.shippingMethod,
        status: order.status,
        statusDate: order.statusDate,
        trackingNumber: order.trackingNumber || '',
        cancellationReason: order.cancellationReason || '',
        internalNotes: order.internalNotes,
        customerNotes: order.customerNotes,
    }
}

export const calculateProductTotal = (
    unitPrice: number,
    quantity: number,
): number => {
    return Math.round(unitPrice * quantity * 100) / 100 // Round to 2 decimal places
}

export const getDefaultFormValues = (): OrderFormData => {
    return { ...defaultOrderFormValues }
}

export const populateShippingFromCustomer = (customer: Customer): Address => {
    if (!customer.address) {
        return {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        }
    }

    return {
        addressLine1: customer.address.addressLine1,
        addressLine2: customer.address.addressLine2 || '',
        city: customer.address.city,
        state: customer.address.state,
        postalCode: customer.address.postalCode,
        country: customer.address.country,
    }
}

export const cleanFormData = (formData: OrderFormData): OrderFormData => {
    const cleaned = { ...formData }

    if (!cleaned.internalNotes?.trim()) {
        cleaned.internalNotes = ''
    }

    if (!cleaned.customerNotes?.trim()) {
        cleaned.customerNotes = ''
    }

    if (!cleaned.shippingAddress.addressLine2?.trim()) {
        cleaned.shippingAddress.addressLine2 = ''
    }

    if (!cleaned.trackingNumber?.trim()) {
        cleaned.trackingNumber = undefined
    }

    if (!cleaned.cancellationReason?.trim()) {
        cleaned.cancellationReason = undefined
    }

    return cleaned
}

/**
 * Get form values with proper defaults based on mode
 */
export const getFormValuesForMode = (
    mode: 'create' | 'edit',
    orderData?: Order | null,
): OrderFormData => {
    if (mode === 'edit' && orderData) {
        return orderToFormData(orderData)
    }
    return getDefaultFormValues()
}
