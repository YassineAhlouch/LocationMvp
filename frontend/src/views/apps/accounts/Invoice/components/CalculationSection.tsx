import { Controller } from 'react-hook-form'
import NumericInput from '@/components/shared/NumericInput'
import Select from '@/components/ui/Select'
import SectionCard from './SectionCard'
import FormFieldWrapper from './FormFieldWrapper'
import type { FormSectionBaseProps } from '../types'

type CalculationSectionProps = FormSectionBaseProps & {
    calculations: {
        subtotal: number
        taxAmount: number
        discountAmount: number
        total: number
    }
    currency: string
}

const CalculationSection = ({
    control,
    errors,
    currency,
}: CalculationSectionProps) => {
    const discountTypeOptions = [
        { value: 'percentage', label: 'Percentage (%)' },
        { value: 'fixed', label: 'Fixed Amount' },
    ]

    return (
        <SectionCard
            title="Calculations"
            description="Tax, discount, and total calculations"
        >
            <div className="mt-4">
                <FormFieldWrapper
                    label="Tax Rate (%)"
                    error={errors.taxRate?.message}
                >
                    <Controller
                        name="taxRate"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                {...field}
                                min={0}
                                max={100}
                                inputSuffix="%"
                                placeholder="0"
                            />
                        )}
                    />
                </FormFieldWrapper>
                <div className="flex gap-4">
                    <FormFieldWrapper label="Discount Type" className="flex-1">
                        <Controller
                            name="discountType"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={discountTypeOptions}
                                    value={discountTypeOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(
                                            option?.value || 'percentage',
                                        )
                                    }
                                    placeholder="Select type"
                                />
                            )}
                        />
                    </FormFieldWrapper>

                    <FormFieldWrapper
                        label="Discount Value"
                        error={errors.discountValue?.message}
                        className="flex-1"
                    >
                        <Controller
                            name="discountValue"
                            control={control}
                            render={({ field }) => {
                                const discountType =
                                    control._formValues.discountType
                                return (
                                    <NumericInput
                                        {...field}
                                        min={0}
                                        inputPrefix={
                                            discountType === 'fixed'
                                                ? currency === 'USD'
                                                    ? '$'
                                                    : currency
                                                : undefined
                                        }
                                        inputSuffix={
                                            discountType === 'percentage'
                                                ? '%'
                                                : undefined
                                        }
                                        placeholder="0"
                                    />
                                )
                            }}
                        />
                    </FormFieldWrapper>
                </div>
            </div>
        </SectionCard>
    )
}

export default CalculationSection
