import { useEffect, useMemo } from 'react'
import { Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import FormFieldWrapper from './FormFieldWrapper'
import SectionCard from './SectionCard'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import classNames from '@/utils/classNames'
import { countryList } from '@/constants/countries.constant'
import { LiRefresh, LiTruckDash, LiAirplane, LiRocket } from '@/icons'
import type { ShippingSectionProps, ShippingMethod } from '../types'
import type { ReactNode } from 'react'

const shippingMethodOptions: Array<{
    value: ShippingMethod
    label: string
    description?: string
    estimatedDays?: string
    icon: ReactNode
    cost?: number
}> = [
    {
        value: 'standard',
        label: 'Standard Shipping',
        description: 'Regular delivery',
        estimatedDays: '5-7 days',
        icon: <LiTruckDash />,
        cost: 9.99,
    },
    {
        value: 'express',
        label: 'Express Shipping',
        description: 'Faster delivery',
        estimatedDays: '2-3 days',
        icon: <LiAirplane />,
        cost: 19.99,
    },
    {
        value: 'overnight',
        label: 'Overnight Shipping',
        description: 'Next day delivery',
        estimatedDays: '1 day',
        icon: <LiRocket />,
        cost: 39.99,
    },
]

const ShippingSection = ({
    control,
    errors,
    watch,
    setValue,
    customerAddress,
}: ShippingSectionProps) => {
    const watchedShippingMethod = watch?.('shippingMethod')
    const watchedCustomerId = watch?.('customerId')

    useEffect(() => {
        if (customerAddress && watchedCustomerId) {
            setValue?.('shippingAddress', customerAddress)
        }
    }, [customerAddress, watchedCustomerId, setValue])

    useEffect(() => {
        if (watchedShippingMethod && setValue) {
            const selectedMethod = shippingMethodOptions.find(
                (method) => method.value === watchedShippingMethod,
            )
            if (selectedMethod?.cost !== undefined) {
                setValue('shippingCost', selectedMethod.cost)
            }
        }
    }, [watchedShippingMethod, setValue])

    const handleAutoFillFromCustomer = () => {
        if (customerAddress) {
            setValue?.('shippingAddress', customerAddress)
        }
    }

    const countryListOptions = useMemo(() => {
        return countryList.map((country) => ({
            value: country.value,
            label: country.label,
            img: country.value,
        }))
    }, [])

    return (
        <SectionCard
            title="Shipping Information"
            description="Configure delivery address and shipping method"
            extra={
                customerAddress && (
                    <div className="flex md:justify-end">
                        <Button
                            variant="subtle"
                            onClick={handleAutoFillFromCustomer}
                            icon={<LiRefresh />}
                            type="button"
                        >
                            Auto-fill from Customer
                        </Button>
                    </div>
                )
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div className="md:col-span-2">
                    <FormFieldWrapper
                        label="Address Line 1"
                        error={errors.shippingAddress?.addressLine1?.message}
                        required
                    >
                        <Controller
                            name="shippingAddress.addressLine1"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter street address"
                                />
                            )}
                        />
                    </FormFieldWrapper>
                </div>
                <div className="md:col-span-2">
                    <FormFieldWrapper
                        label="Address Line 2"
                        error={errors.shippingAddress?.addressLine2?.message}
                        description="Apartment, suite, unit, building, floor, etc. (optional)"
                    >
                        <Controller
                            name="shippingAddress.addressLine2"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Apartment, suite, etc. (optional)"
                                />
                            )}
                        />
                    </FormFieldWrapper>
                </div>
                <FormFieldWrapper
                    label="City"
                    error={errors.shippingAddress?.city?.message}
                    required
                >
                    <Controller
                        name="shippingAddress.city"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Enter city" />
                        )}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="State/Province"
                    error={errors.shippingAddress?.state?.message}
                    required
                >
                    <Controller
                        name="shippingAddress.state"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Select state" />
                        )}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="Postal Code"
                    error={errors.shippingAddress?.postalCode?.message}
                    required
                >
                    <Controller
                        name="shippingAddress.postalCode"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Enter postal code" />
                        )}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="Country"
                    error={errors.shippingAddress?.country?.message}
                    required
                >
                    <Controller
                        name="shippingAddress.country"
                        control={control}
                        render={({ field }) => (
                            <Select
                                isSearchable
                                options={countryListOptions}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                                value={countryListOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                placeholder="Choose country"
                                customInputDisplay={(selectedItem) => (
                                    <SelectInputWithPrefix
                                        label={selectedItem?.label}
                                        showPrefix={Boolean(
                                            selectedItem?.value,
                                        )}
                                        prefix={
                                            selectedItem && (
                                                <img
                                                    src={`/img/countries/${selectedItem?.img}.png`}
                                                    className="w-4 h-4 rounded-full"
                                                    alt={selectedItem?.label}
                                                />
                                            )
                                        }
                                    />
                                )}
                                customOption={({
                                    option,
                                    selected,
                                    CheckIcon,
                                }) => (
                                    <SelectOptionWithPrefix
                                        selected={selected}
                                        checkIcon={CheckIcon}
                                        label={option?.label}
                                        prefix={
                                            <img
                                                src={`/img/countries/${option?.img}.png`}
                                                className="w-4 h-4 rounded-full"
                                                alt={option?.label}
                                            />
                                        }
                                    />
                                )}
                            />
                        )}
                    />
                </FormFieldWrapper>
            </div>
            <FormFieldWrapper
                label="Shipping Method"
                error={errors.shippingMethod?.message}
                required
                description="Select delivery speed and cost"
            >
                <Controller
                    name="shippingMethod"
                    control={control}
                    render={({ field }) => (
                        <div className="gap-4 flex flex-col w-full">
                            {shippingMethodOptions.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    className={classNames(
                                        'flex justify-between items-center ring-1 border rounded-lg dark:bg-transparent border-gray-200 dark:border-gray-700 py-5 px-4 select-none w-full hover:ring-primary hover:border-primary cursor-pointer transition-colors',
                                        field.value === item.value
                                            ? 'ring-primary border-primary'
                                            : 'ring-transparent',
                                    )}
                                    onClick={() => field.onChange(item.value)}
                                >
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={classNames(
                                                'text-2xl',
                                                field.value === item.value
                                                    ? 'text-primary'
                                                    : 'heading-text',
                                            )}
                                        >
                                            {item.icon}
                                        </span>
                                        <div className="flex flex-col items-start ltr:text-left rtl:text-right">
                                            <div className="font-medium heading-text">
                                                {item.label}
                                            </div>
                                            <div>
                                                {item.description} • Estimated:{' '}
                                                {item.estimatedDays}
                                            </div>
                                        </div>
                                    </div>
                                    {item.cost && (
                                        <div className="text-right">
                                            <div className="font-medium heading-text text-base">
                                                ${item.cost.toFixed(2)}
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                />
            </FormFieldWrapper>
        </SectionCard>
    )
}

export default ShippingSection
