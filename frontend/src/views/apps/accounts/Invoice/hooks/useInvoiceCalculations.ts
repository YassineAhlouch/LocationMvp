import { useMemo } from 'react'
import type { InvoiceItem, DiscountType } from '../types'
import {
    calculateSubtotal,
    calculateTaxAmount,
    calculateDiscountAmount,
    calculateTotal,
} from '../utils'

type UseInvoiceCalculationsProps = {
    items: InvoiceItem[]
    taxRate: number
    discountType: DiscountType
    discountValue: number
}

type CalculationResults = {
    subtotal: number
    taxAmount: number
    discountAmount: number
    total: number
}

export const useInvoiceCalculations = ({
    items,
    taxRate,
    discountType,
    discountValue,
}: UseInvoiceCalculationsProps): CalculationResults => {
    return useMemo(() => {
        const subtotal = calculateSubtotal(items)
        const taxAmount = calculateTaxAmount(subtotal, taxRate)
        const discountAmount = calculateDiscountAmount(
            subtotal,
            discountType,
            discountValue,
        )
        const total = calculateTotal(subtotal, taxAmount, discountAmount)

        return {
            subtotal,
            taxAmount,
            discountAmount,
            total,
        }
    }, [items, taxRate, discountType, discountValue])
}
