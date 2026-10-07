import { useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormItem, Input, Select, DatePicker } from '@/components/ui'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import { useKYCStore } from '../store/kycStore'
import { companyInfoSchema } from '../utils/validationSchemas'
import { BUSINESS_TYPE_OPTIONS } from '../utils/constants'
import { countryList } from '@/constants/countries.constant'
import type { BusinessCompanyInfo } from '../types'

const CompanyInformation = () => {
    const { businessData, updateBusinessData } = useKYCStore()

    const {
        control,
        formState: { errors },
        watch,
    } = useForm<BusinessCompanyInfo>({
        resolver: zodResolver(companyInfoSchema),
        defaultValues: businessData.companyInfo,
        mode: 'onChange',
    })

    const countryListOptions = useMemo(() => {
        return countryList.map((country) => ({
            value: country.value,
            label: country.label,
            img: country.value,
        }))
    }, [])

    useEffect(() => {
        const subscription = watch((value) => {
            updateBusinessData('companyInfo', value)
        })
        return () => subscription.unsubscribe()
    }, [watch, updateBusinessData])

    return (
        <div>
            <div className="mb-8 -mt-4">
                <p>
                    Please provide your company's official registration details.
                </p>
            </div>
            <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <FormItem
                        label="Company Name"
                        invalid={Boolean(errors.companyName)}
                        errorMessage={errors.companyName?.message}
                        asterisk
                    >
                        <Controller
                            name="companyName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter your company name"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Registration Number"
                        invalid={Boolean(errors.registrationNumber)}
                        errorMessage={errors.registrationNumber?.message}
                        asterisk
                    >
                        <Controller
                            name="registrationNumber"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter company registration number"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Country of Incorporation"
                        invalid={Boolean(errors.countryOfIncorporation)}
                        errorMessage={errors.countryOfIncorporation?.message}
                        asterisk
                    >
                        <Controller
                            name="countryOfIncorporation"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isSearchable
                                    options={countryListOptions}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    value={countryListOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    placeholder="Choose country of incorporation"
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
                                                        alt={
                                                            selectedItem?.label
                                                        }
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
                    </FormItem>

                    <FormItem
                        label="Business Type"
                        invalid={Boolean(errors.businessType)}
                        errorMessage={errors.businessType?.message}
                        asterisk
                    >
                        <Controller
                            name="businessType"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select business type"
                                    options={BUSINESS_TYPE_OPTIONS}
                                    value={BUSINESS_TYPE_OPTIONS.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value || '')
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Incorporation Date"
                        invalid={Boolean(errors.incorporationDate)}
                        errorMessage={errors.incorporationDate?.message}
                        asterisk
                    >
                        <Controller
                            name="incorporationDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    placeholder="Select incorporation date"
                                    inputFormat="YYYY-MM-DD"
                                    disableDate={(date: Date) =>
                                        date > new Date()
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Company Email"
                        invalid={Boolean(errors.companyEmail)}
                        errorMessage={errors.companyEmail?.message}
                        asterisk
                    >
                        <Controller
                            name="companyEmail"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter company email address"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Company Phone"
                        invalid={Boolean(errors.companyPhone)}
                        errorMessage={errors.companyPhone?.message}
                        asterisk
                    >
                        <Controller
                            name="companyPhone"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="tel"
                                    placeholder="Enter company phone number"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Website (Optional)"
                        invalid={Boolean(errors.website)}
                        errorMessage={errors.website?.message}
                    >
                        <Controller
                            name="website"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="url"
                                    placeholder="Enter company website URL"
                                />
                            )}
                        />
                    </FormItem>
                </div>
            </Form>
        </div>
    )
}

export default CompanyInformation
