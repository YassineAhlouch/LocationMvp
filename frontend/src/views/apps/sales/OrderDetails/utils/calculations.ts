import type { OrderProduct, DiscountType } from '../types'

export const calculateSubtotal = (products: OrderProduct[]): number => {
    return products.reduce((sum, product) => {
        return sum + product.price * product.quantity
    }, 0)
}

export const calculateDiscountAmount = (
    subtotal: number,
    discount: number,
    discountType: DiscountType,
): number => {
    if (discount <= 0) return 0

    if (discountType === 'percentage') {
        return (subtotal * discount) / 100
    } else {
        return Math.min(discount, subtotal) // Fixed amount cannot exceed subtotal
    }
}

export const calculateTaxAmount = (
    taxableAmount: number,
    taxRate: number,
): number => {
    if (taxRate <= 0) return 0
    return (taxableAmount * taxRate) / 100
}

export const calculateOrderTotal = (
    subtotal: number,
    discountAmount: number,
    taxAmount: number,
    shippingCost: number,
): number => {
    const afterDiscount = subtotal - discountAmount
    return afterDiscount + taxAmount + shippingCost
}

export const calculateOrderSummary = (
    products: OrderProduct[],
    discount: number,
    discountType: DiscountType,
    taxRate: number,
    shippingCost: number,
) => {
    const subtotal = calculateSubtotal(products)
    const discountAmount = calculateDiscountAmount(
        subtotal,
        discount,
        discountType,
    )
    const taxableAmount = subtotal - discountAmount
    const taxAmount = calculateTaxAmount(taxableAmount, taxRate)
    const total = calculateOrderTotal(
        subtotal,
        discountAmount,
        taxAmount,
        shippingCost,
    )

    return {
        subtotal,
        discountAmount,
        taxAmount,
        total,
        taxableAmount,
    }
}

export const validateDiscount = (
    discount: number,
    discountType: DiscountType,
    subtotal: number,
): {
    isValid: boolean
    error?: string
} => {
    if (discount < 0) {
        return {
            isValid: false,
            error: 'Discount cannot be negative',
        }
    }

    if (discountType === 'percentage' && discount > 100) {
        return {
            isValid: false,
            error: 'Percentage discount cannot exceed 100%',
        }
    }

    if (discountType === 'fixed' && discount > subtotal) {
        return {
            isValid: false,
            error: 'Fixed discount cannot exceed subtotal',
        }
    }

    return { isValid: true }
}
