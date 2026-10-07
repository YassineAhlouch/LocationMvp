import React, { useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormItem, Input, Select, Upload, Popover } from '@/components/ui'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import { LiMapPin, LiAlertCircle } from '@/icons'
import { useKYCStore } from '../store/kycStore'
import { businessAddressSchema } from '../utils/validationSchemas'
import { countryList } from '@/constants/countries.constant'
import sleep from '@/utils/sleep'
import type { BusinessAddress } from '../types'

const BusinessAddressComponent = () => {
    const { businessData, updateBusinessData, validateFileUpload } =
        useKYCStore()

    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = useForm<BusinessAddress>({
        resolver: zodResolver(businessAddressSchema),
        defaultValues: businessData.businessAddress,
        mode: 'onChange',
    })

    // Update store whenever form values change
    const watchedValues = watch()

    React.useEffect(() => {
        const subscription = watch((value) => {
            updateBusinessData('businessAddress', value)
        })
        return () => subscription.unsubscribe()
    }, [watch, updateBusinessData])

    const handleBeforeUpload = (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return false

        const file = fileList[0]
        const validation = validateFileUpload(file, 'proofOfAddress')

        if (!validation.valid) {
            console.error(validation.error)
            return false // Prevent upload
        }

        return true // Allow upload
    }

    const handleFileUpload = async (files: File[]) => {
        if (files.length === 0) return

        const file = files[0]

        // Simulate file upload
        await sleep(1000)
        setValue('proofOfAddress', file)
    }

    const handleFileRemove = () => {
        setValue('proofOfAddress', null)
    }

    const currentFile = watchedValues.proofOfAddress as File | null

    const countryListOptions = useMemo(() => {
        return countryList.map((country) => ({
            value: country.value,
            label: country.label,
            img: country.value,
        }))
    }, [])

    return (
        <div>
            <div className="mb-8 -mt-4">
                <p>
                    Please provide your company's registered business address.
                </p>
            </div>
            <Form>
                <FormItem
                    label="Registered Address"
                    invalid={Boolean(errors.registeredAddress)}
                    errorMessage={errors.registeredAddress?.message}
                    asterisk
                >
                    <Controller
                        name="registeredAddress"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Enter complete registered address"
                            />
                        )}
                    />
                </FormItem>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <FormItem
                        label="City"
                        invalid={Boolean(errors.city)}
                        errorMessage={errors.city?.message}
                        asterisk
                    >
                        <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Enter city" />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="State / Province"
                        invalid={Boolean(errors.state)}
                        errorMessage={errors.state?.message}
                        asterisk
                    >
                        <Controller
                            name="state"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter state or province"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Postal Code"
                        invalid={Boolean(errors.postalCode)}
                        errorMessage={errors.postalCode?.message}
                        asterisk
                    >
                        <Controller
                            name="postalCode"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter postal code"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Country"
                        invalid={Boolean(errors.country)}
                        errorMessage={errors.country?.message}
                        asterisk
                    >
                        <Controller
                            name="country"
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
                </div>

                <FormItem
                    label="Proof of Address"
                    invalid={Boolean(errors.proofOfAddress)}
                    errorMessage={errors.proofOfAddress?.message}
                    asterisk
                    extra={
                        <Popover
                            renderTrigger={
                                <LiAlertCircle className="text-base" />
                            }
                            width={400}
                            placement="top"
                            trigger="hover"
                        >
                            <div className="space-y-2 heading-text">
                                <h6>Acceptable Business Address Documents:</h6>
                                <ul className="space-y-1">
                                    <li>
                                        • Business utility bill (electricity,
                                        water, gas, internet)
                                    </li>
                                    <li>• Business bank statement</li>
                                    <li>• Commercial lease agreement</li>
                                    <li>
                                        • Government-issued business address
                                        verification
                                    </li>
                                </ul>
                                <p>
                                    Document must be dated within the last 3
                                    months and clearly show the company name and
                                    address.
                                </p>
                            </div>
                        </Popover>
                    }
                >
                    <div className="space-y-3">
                        <Upload
                            draggable
                            accept=".jpg,.jpeg,.png,.pdf"
                            multiple={false}
                            uploadLimit={1}
                            beforeUpload={handleBeforeUpload}
                            onChange={(_, files) => handleFileUpload(files)}
                            onFileRemove={() => handleFileRemove()}
                            fileList={currentFile ? [currentFile] : []}
                            className="bg-gray-50 dark:bg-gray-800"
                        >
                            <div className="flex flex-col items-center justify-center min-h-30 py-8">
                                <div className="mb-2">
                                    <LiMapPin className="heading-text text-3xl" />
                                </div>
                                <p className="text-center">
                                    <span className="heading-text">
                                        Click to upload
                                    </span>
                                    <span> or drag and drop</span>
                                </p>
                                <p className="text-xs mt-1">
                                    Upload business address verification
                                    document (Max 5MB)
                                </p>
                            </div>
                        </Upload>
                    </div>
                </FormItem>
            </Form>
        </div>
    )
}

export default BusinessAddressComponent
