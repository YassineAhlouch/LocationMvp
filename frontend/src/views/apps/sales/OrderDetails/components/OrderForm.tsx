import { useEffect, useMemo, useState } from 'react'
import { Form } from '@/components/ui/Form'
import CustomerSection from './CustomerSection'
import ProductSection from './ProductSection'
import OrderSummarySection from './OrderSummarySection'
import ShippingSection from './ShippingSection'
import StatusSection from './StatusSection'
import NotesSection from './NotesSection'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    orderFormValidationSchema,
    OrderFormSchema,
    getDefaultFormValues,
    cleanFormData,
    orderToFormData,
} from '../utils'
import { calculateOrderSummary } from '../utils'
import type { OrderFormProps, OrderFormData, Customer } from '../types'

const OrderForm = ({ mode, onSubmit, initialData }: OrderFormProps) => {
    const [, setOriginalFormData] = useState<OrderFormData | null>(null)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    )

    const form = useForm<OrderFormSchema>({
        resolver: zodResolver(orderFormValidationSchema),
        defaultValues: getDefaultFormValues(),
        mode: 'onChange',
    })

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = form

    const watchedValues = watch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const products = watch('products') || []

    const calculatedValues = useMemo(() => {
        if (products.length === 0) {
            return {
                subtotal: 0,
                discountAmount: 0,
                taxAmount: 0,
                total: 0,
            }
        }

        return calculateOrderSummary(
            products,
            watchedValues.discount || 0,
            watchedValues.discountType || 'percentage',
            watchedValues.taxRate || 0,
            watchedValues.shippingCost || 0,
        )
    }, [
        products,
        watchedValues.discount,
        watchedValues.discountType,
        watchedValues.taxRate,
        watchedValues.shippingCost,
    ])

    useEffect(() => {
        if (products.length > 0) {
            setValue('subtotal', calculatedValues.subtotal)
            setValue('total', calculatedValues.total)
        }
    }, [calculatedValues, setValue, products.length])

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            const formData = orderToFormData(initialData)
            reset(formData)
            setOriginalFormData(formData)
            setSelectedCustomer(initialData.customer)
        } else {
            const defaultData = getDefaultFormValues()
            reset(defaultData)
            setOriginalFormData(defaultData)
        }
    }, [mode, initialData, reset])

    const handleFormSubmit = async (data: OrderFormData) => {
        try {
            const cleanedData = cleanFormData(data)
            await onSubmit(cleanedData)

            setOriginalFormData(cleanedData)
        } catch (error) {
            console.error('Form submission error:', error)
        } finally {
            //
        }
    }

    return (
        <FormProvider {...form}>
            <Form
                id="order-form"
                onSubmit={handleSubmit(handleFormSubmit, async (e) => {
                    console.log('e', e, form.getValues())
                })}
                className="space-y-6"
            >
                <CustomerSection
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    onSelectCustomer={setSelectedCustomer}
                    initialCustomer={
                        mode === 'edit' && initialData
                            ? initialData.customer
                            : null
                    }
                />
                <ProductSection
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                />
                <OrderSummarySection
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    calculatedValues={calculatedValues}
                />
                <ShippingSection
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    customerAddress={selectedCustomer?.address}
                />
                {mode === 'edit' && (
                    <StatusSection
                        control={control}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                        mode={mode}
                    />
                )}
                <NotesSection control={control} errors={errors} watch={watch} />
            </Form>
        </FormProvider>
    )
}

export default OrderForm
