import { z } from 'zod'

export const invoiceValidationSchema = z.object({
    invoiceNumber: z.string().min(1, 'Invoice number is required'),
    issueDate: z.string().min(1, 'Issue date is required'),
    dueDate: z.string().min(1, 'Due date is required'),
    currency: z.string().min(1, 'Currency is required'),
    customerId: z.string().min(1, 'Customer is required'),
    customerName: z.string().min(1, 'Customer name is required'),
    customerEmail: z.string().email('Valid email is required'),
    customerPhone: z.string().min(1, 'Phone number is required'),
    billingAddress: z.object({
        addressLine1: z.string().min(1, 'Address line 1 is required'),
        addressLine2: z.string().optional(),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        country: z.string().min(1, 'Country is required'),
    }),
    items: z
        .array(
            z.object({
                id: z.string(),
                name: z.string().min(1, 'Item name is required'),
                description: z.string().optional(),
                img: z.string().optional(),
                quantity: z.number().min(1, 'Quantity must be at least 1'),
                unitPrice: z.number().min(0, 'Unit price must be positive'),
                total: z.number(),
                productId: z.string().optional(),
            }),
        )
        .min(1, 'At least one item is required'),
    subtotal: z.number(),
    taxRate: z.number().min(0).max(100, 'Tax rate must be between 0-100%'),
    taxAmount: z.number(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().min(0, 'Discount must be positive'),
    discountAmount: z.number(),
    total: z.number(),
    notes: z.string().optional(),
    terms: z.string().optional(),
})

export type InvoiceFormSchema = z.infer<typeof invoiceValidationSchema>
