import { useEffect } from 'react'
import { Controller } from 'react-hook-form'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import Divider from '@/components/shared/Divider'
import NumericInput from '@/components/shared/NumericInput'
import FormFieldWrapper from './FormFieldWrapper'
import SectionCard from './SectionCard'
import formatCurrency from '@/utils/formatCurrency'

import { calculateOrderSummary, validateDiscount } from '../utils'
import type { OrderSummarySectionProps, DiscountType } from '../types'

const OrderSummarySection = ({
    control,
    errors,
    watch,
    setValue,
    calculatedValues,
}: OrderSummarySectionProps) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const products = watch?.('products') || []
    const discount = watch?.('discount') || 0
    const discountType = watch?.('discountType') || 'percentage'
    const taxRate = watch?.('taxRate') || 0
    const tax = watch?.('tax') || 0
    const shippingCost = watch?.('shippingCost') || 0

    const discountTypeOptions = [
        { value: 'percentage', label: 'Percentage (%)' },
        { value: 'fixed', label: 'Fixed Amount ($)' },
    ]

    useEffect(() => {
        if (products.length > 0) {
            const calculations = calculateOrderSummary(
                products,
                discount,
                discountType as DiscountType,
                taxRate,
                shippingCost,
            )

            setValue?.('subtotal', calculations.subtotal)

            setValue?.('tax', calculations.taxAmount)

            const finalTotal = calculations.total
            setValue?.('total', finalTotal)
        }
    }, [products, discount, discountType, taxRate, shippingCost, setValue, tax])

    const handleDiscountTypeChange = (value: DiscountType) => {
        setValue?.('discountType', value)
        setValue?.('discount', 0)
    }

    const validateDiscountInput = (value: number) => {
        const subtotal = calculatedValues.subtotal || 0
        const validation = validateDiscount(
            value,
            discountType as DiscountType,
            subtotal,
        )
        return validation.isValid ? true : validation.error
    }

    return (
        <SectionCard
            title="Order Summary"
            description="Review pricing, discounts, taxes, and total amount"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormFieldWrapper
                    label="Discount Type"
                    error={errors.discountType?.message}
                >
                    <Controller
                        name="discountType"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={discountTypeOptions}
                                value={discountTypeOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    handleDiscountTypeChange(option.value)
                                }
                                placeholder="Select discount type"
                            />
                        )}
                    />
                </FormFieldWrapper>
                <FormFieldWrapper
                    label={`Discount ${discountType === 'percentage' ? '(%)' : '($)'}`}
                    error={errors.discount?.message}
                    description={
                        discountType === 'percentage'
                            ? 'Enter percentage (0-100)'
                            : 'Enter fixed amount'
                    }
                >
                    <Controller
                        name="discount"
                        control={control}
                        rules={{
                            validate: validateDiscountInput,
                        }}
                        render={({ field }) => (
                            <NumericInput
                                value={field.value}
                                min="0"
                                max={
                                    discountType === 'percentage'
                                        ? '100'
                                        : undefined
                                }
                                placeholder={
                                    discountType === 'percentage'
                                        ? '0.0'
                                        : '0.00'
                                }
                                onValueChange={({ floatValue }) =>
                                    field.onChange(floatValue || 0)
                                }
                            />
                        )}
                    />
                </FormFieldWrapper>
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <FormFieldWrapper
                            label="Tax Rate (%)"
                            error={errors.taxRate?.message}
                            description="Tax will be calculated automatically based on this rate"
                        >
                            <Controller
                                name="taxRate"
                                control={control}
                                render={({ field }) => (
                                    <NumericInput
                                        value={field.value}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0.00"
                                        onValueChange={({ floatValue }) =>
                                            field.onChange(floatValue || 0)
                                        }
                                    />
                                )}
                            />
                        </FormFieldWrapper>
                    </div>
                </div>
            </div>
            <FormFieldWrapper
                label="Shipping Cost ($)"
                error={errors.shippingCost?.message}
                description="Enter shipping cost or leave blank if free shipping"
            >
                <Controller
                    name="shippingCost"
                    control={control}
                    render={({ field }) => (
                        <NumericInput
                            value={field.value}
                            min="0"
                            placeholder="0.00"
                            onValueChange={({ floatValue }) =>
                                field.onChange(floatValue || 0)
                            }
                        />
                    )}
                />
            </FormFieldWrapper>
            {products.length > 0 && (
                <Card
                    className="mt-4 my-7 bg-gray-100 dark:bg-gray-900"
                    bodyClass="space-y-2"
                >
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Subtotal:</span>
                        <span className="font-medium heading-text">
                            {formatCurrency(
                                calculatedValues.subtotal || 0,
                                'USD',
                                'en-US',
                                2,
                            )}
                        </span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-success">
                            <span className="font-medium">
                                Discount (
                                {discountType === 'percentage'
                                    ? `${discount}%`
                                    : 'Fixed'}
                                ):
                            </span>
                            <span className="font-medium">
                                -
                                {formatCurrency(
                                    calculatedValues.discountAmount || 0,
                                    'USD',
                                    'en-US',
                                    2,
                                )}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Tax:</span>
                        <span className="font-medium heading-text">
                            {formatCurrency(calculatedValues.taxAmount || 0)}
                        </span>
                    </div>
                    {shippingCost > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Shipping:</span>
                            <span className="font-medium heading-text">
                                {formatCurrency(
                                    shippingCost,
                                    'USD',
                                    'en-US',
                                    2,
                                )}
                            </span>
                        </div>
                    )}
                    <Divider className="my-3" />
                    <div className="flex justify-between ">
                        <span className="font-medium">Total:</span>
                        <span className="font-semibold heading-text text-base">
                            {formatCurrency(
                                calculatedValues.total || 0,
                                'USD',
                                'en-US',
                                2,
                            )}
                        </span>
                    </div>
                </Card>
            )}
        </SectionCard>
    )
}

export default OrderSummarySection
