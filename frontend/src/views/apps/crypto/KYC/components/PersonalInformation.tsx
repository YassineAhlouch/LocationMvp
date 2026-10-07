import { useEffect, useMemo } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import { Form, FormItem } from '@/components/ui/Form'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import { useKYCStore } from '../store/kycStore'
import { personalInfoSchema } from '../utils/validationSchemas'
import { GENDER_OPTIONS } from '../utils/constants'
import { countryList } from '@/constants/countries.constant'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { IndividualPersonalInfo } from '../types'

const PersonalInformation = () => {
    const { individualData, updateIndividualData } = useKYCStore()

    const {
        control,
        formState: { errors },
        watch,
    } = useForm<IndividualPersonalInfo>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: individualData.personalInfo,
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
            updateIndividualData('personalInfo', value)
        })
        return () => subscription.unsubscribe()
    }, [watch, updateIndividualData])

    return (
        <div>
            <div className="mb-8 -mt-4">
                <p>Please fill out your personal information</p>
            </div>
            <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <FormItem
                        label="Full Name"
                        invalid={Boolean(errors.fullName)}
                        errorMessage={errors.fullName?.message}
                        asterisk
                    >
                        <Controller
                            name="fullName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Date of Birth"
                        invalid={Boolean(errors.dateOfBirth)}
                        errorMessage={errors.dateOfBirth?.message}
                        asterisk
                    >
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    placeholder="Select your date of birth"
                                    inputFormat="YYYY-MM-DD"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Nationality"
                        invalid={Boolean(errors.nationality)}
                        errorMessage={errors.nationality?.message}
                        asterisk
                    >
                        <Controller
                            name="nationality"
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
                                    placeholder="Choose nationality"
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
                        label="Email Address"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                        asterisk
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter your email address"
                                    autoComplete="email"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Phone Number"
                        invalid={Boolean(errors.phoneNumber)}
                        errorMessage={errors.phoneNumber?.message}
                        asterisk
                    >
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    autoComplete="tel"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Gender (Optional)"
                        invalid={Boolean(errors.gender)}
                        errorMessage={errors.gender?.message}
                    >
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select your gender"
                                    options={GENDER_OPTIONS}
                                    value={GENDER_OPTIONS.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    isCreatable
                                />
                            )}
                        />
                    </FormItem>
                </div>
            </Form>
        </div>
    )
}

export default PersonalInformation
