import { Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import SectionCard from './SectionCard'
import FormFieldWrapper from './FormFieldWrapper'
import { currencies } from '../utils'
import type { FormSectionBaseProps } from '../types'

const InvoiceDetailsSection = ({ control, errors }: FormSectionBaseProps) => {
    const currencyOptions = currencies.map((currency) => ({
        value: currency.code,
        label: `${currency.code} - ${currency.name}`,
        symbol: currency.symbol,
    }))

    return (
        <SectionCard
            title="Invoice Details"
            description="Basic invoice information and settings"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormFieldWrapper
                    label="Invoice Number"
                    error={errors.invoiceNumber?.message}
                    required
                >
                    <Controller
                        name="invoiceNumber"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="INV-001234"
                                autoComplete="off"
                                readOnly
                                disabled
                            />
                        )}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="Currency"
                    error={errors.currency?.message}
                    required
                >
                    <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={currencyOptions}
                                value={currencyOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value || 'USD')
                                }
                                placeholder="Select currency"
                            />
                        )}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="Issue Date"
                    error={errors.issueDate?.message}
                    required
                >
                    <Controller
                        name="issueDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date) => {
                                    if (date) {
                                        field.onChange(
                                            date.toISOString().split('T')[0],
                                        )
                                    }
                                }}
                                placeholder="Select issue date"
                                inputFormat="DD MMM YYYY"
                            />
                        )}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="Due Date"
                    error={errors.dueDate?.message}
                    required
                >
                    <Controller
                        name="dueDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date) => {
                                    if (date) {
                                        field.onChange(
                                            date.toISOString().split('T')[0],
                                        )
                                    }
                                }}
                                placeholder="Select due date"
                                inputFormat="DD MMM YYYY"
                            />
                        )}
                    />
                </FormFieldWrapper>
            </div>
        </SectionCard>
    )
}

export default InvoiceDetailsSection
