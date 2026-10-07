import { useEffect } from 'react'
import { invoiceValidationSchema } from '../validation'
import {
    generateInvoiceNumber,
    getCurrentDate,
    getDefaultDueDate,
    createEmptyItem,
    updateItemTotal,
} from '../utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useInvoiceCalculations } from './useInvoiceCalculations'
import type { InvoiceFormData } from '../types'

type UseInvoiceFormProps = {
    initialData?: Partial<InvoiceFormData>
    mode?: 'create' | 'edit'
}

export const useInvoiceForm = ({
    initialData,
    mode = 'create',
}: UseInvoiceFormProps = {}) => {
    const defaultValues: InvoiceFormData = {
        invoiceNumber: mode === 'create' ? generateInvoiceNumber() : '',
        issueDate: getCurrentDate(),
        dueDate: getDefaultDueDate(getCurrentDate()),
        currency: 'USD',
        customerId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',

        billingAddress: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        },
        items: [createEmptyItem()],
        subtotal: 0,
        taxRate: 0,
        taxAmount: 0,
        discountType: 'percentage',
        discountValue: 0,
        discountAmount: 0,
        total: 0,
        notes: '',
        terms: 'Payment is due within 30 days of invoice date.',
        ...initialData,
    }

    const form = useForm<InvoiceFormData>({
        defaultValues,
        resolver: zodResolver(invoiceValidationSchema),
        mode: 'onChange',
    })

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        getValues,
        formState: { errors, isSubmitting },
    } = form

    const watchedItems = watch('items')
    const watchedTaxRate = watch('taxRate')
    const watchedDiscountType = watch('discountType')
    const watchedDiscountValue = watch('discountValue')
    const watchedIssueDate = watch('issueDate')

    const calculations = useInvoiceCalculations({
        items: watchedItems || [],
        taxRate: watchedTaxRate || 0,
        discountType: watchedDiscountType || 'percentage',
        discountValue: watchedDiscountValue || 0,
    })

    useEffect(() => {
        setValue('subtotal', calculations.subtotal)
        setValue('taxAmount', calculations.taxAmount)
        setValue('discountAmount', calculations.discountAmount)
        setValue('total', calculations.total)
    }, [calculations, setValue])

    useEffect(() => {
        if (watchedIssueDate && mode === 'create') {
            const newDueDate = getDefaultDueDate(watchedIssueDate)
            setValue('dueDate', newDueDate)
        }
    }, [watchedIssueDate, setValue, mode])

    const addItem = () => {
        const currentItems = getValues('items')
        const newItem = createEmptyItem()
        setValue('items', [...currentItems, newItem])
    }

    const removeItem = (index: number) => {
        const currentItems = getValues('items')
        if (currentItems.length > 1) {
            const updatedItems = currentItems.filter((_, i) => i !== index)
            setValue('items', updatedItems)
        }
    }

    const updateItem = (
        index: number,
        updatedItem: Partial<(typeof watchedItems)[0]>,
    ) => {
        const currentItems = getValues('items')
        const newItems = [...currentItems]
        newItems[index] = updateItemTotal({
            ...newItems[index],
            ...updatedItem,
        })
        setValue('items', newItems)
    }

    const reorderItems = (activeIndex: number, overIndex: number) => {
        const currentItems = getValues('items')
        const newItems = [...currentItems]
        const [reorderedItem] = newItems.splice(activeIndex, 1)
        newItems.splice(overIndex, 0, reorderedItem)
        setValue('items', newItems)
    }

    const resetForm = (data?: Partial<InvoiceFormData>) => {
        reset({
            ...defaultValues,
            ...data,
        })
    }

    return {
        control,
        handleSubmit,
        reset: resetForm,
        setValue,
        watch,
        getValues,
        errors,
        isSubmitting,
        calculations,
        addItem,
        removeItem,
        updateItem,
        reorderItems,
        formData: watch(),
    }
}
