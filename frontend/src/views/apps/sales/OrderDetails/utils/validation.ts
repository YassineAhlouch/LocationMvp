import { z } from 'zod'

const addressSchema = z.object({
    addressLine1: z.string().min(1, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
})

export const orderProductSchema = z.object({
    id: z.string().min(1, 'Product ID is required'),
    name: z.string().min(1, 'Product name is required'),
    img: z.string(),
    price: z.number().min(0, 'Unit price must be positive'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    stock: z.number().min(0, 'Stock level must be positive'),
    total: z.number().min(0, 'Total must be positive'),
    allowBackorder: z.boolean().optional(),
})

// Main order form validation schema
export const orderFormValidationSchema = z
    .object({
        customerId: z.string().min(1, 'Customer is required'),
        customerName: z.string().min(1, 'Customer name is required'),
        customerEmail: z.string({ message: 'Invalid email format' }),
        customerPhone: z.string().min(1, 'Customer phone is required'),

        products: z
            .array(orderProductSchema)
            .min(1, 'At least one product is required'),

        // Order Summary
        subtotal: z.number().min(0, 'Subtotal must be positive'),
        discount: z.number().min(0, 'Discount must be positive'),
        discountType: z.enum(['percentage', 'fixed']),
        tax: z.number().min(0, 'Tax must be positive'),
        taxRate: z
            .number()
            .min(0)
            .max(100, 'Tax rate must be between 0 and 100'),
        shippingCost: z.number().min(0, 'Shipping cost must be positive'),
        total: z.number().min(0, 'Total must be positive'),

        // Shipping Information
        shippingAddress: addressSchema,
        shippingMethod: z.string().min(1, 'Shipping method is required'),

        // Status Information (optional for create mode, required for edit mode)
        status: z
            .enum([
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
            ])
            .optional(),
        statusDate: z.date().optional().nullable(),
        trackingNumber: z.string().optional(),
        cancellationReason: z
            .string()
            .max(500, 'Cancellation reason cannot exceed 500 characters')
            .optional(),

        // Notes
        internalNotes: z
            .string()
            .max(1000, 'Internal notes cannot exceed 1000 characters')
            .optional()
            .or(z.literal('')),
        customerNotes: z
            .string()
            .max(500, 'Customer notes cannot exceed 500 characters')
            .optional()
            .or(z.literal('')),
    })
    .refine(
        (data) => {
            if (data.discountType === 'percentage' && data.discount > 100) {
                return false
            }
            if (
                data.discountType === 'fixed' &&
                data.discount > data.subtotal
            ) {
                return false
            }
            return true
        },
        {
            message: 'Invalid discount amount for selected discount type',
            path: ['discount'],
        },
    )
    .refine(
        (data) => {
            const hasStockIssues = data.products.some(
                (product) =>
                    product.quantity > product.stock && !product.allowBackorder,
            )
            return !hasStockIssues
        },
        {
            message: 'Some products have insufficient stock',
            path: ['products'],
        },
    )
    .refine(
        (data) => {
            // Tracking number is required when status is shipped
            if (
                data.status === 'shipped' &&
                (!data.trackingNumber || data.trackingNumber.trim() === '')
            ) {
                return false
            }
            return true
        },
        {
            message: 'Tracking number is required when order status is shipped',
            path: ['trackingNumber'],
        },
    )
    .refine(
        (data) => {
            // Status date is required when status is shipped or delivered
            if (
                (data.status === 'shipped' || data.status === 'delivered') &&
                (!data.statusDate || data.statusDate === null)
            ) {
                return false
            }
            return true
        },
        {
            message: 'Cancellation reason is required when order is cancelled',
            path: ['cancellationReason'],
        },
    )

export const productSearchSchema = z.object({
    query: z.string().min(1, 'Search query is required'),
    category: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
})

export const customerSearchSchema = z.object({
    query: z.string().min(1, 'Search query is required'),
    status: z.string().optional(),
})

export type OrderFormSchema = z.infer<typeof orderFormValidationSchema>
export type ProductSearchSchema = z.infer<typeof productSearchSchema>
export type CustomerSearchSchema = z.infer<typeof customerSearchSchema>
export type AddressSchema = z.infer<typeof addressSchema>
export type OrderProductSchema = z.infer<typeof orderProductSchema>
