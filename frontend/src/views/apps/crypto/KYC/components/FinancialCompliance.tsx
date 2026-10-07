import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormItem, Input, Select, Upload, Popover } from '@/components/ui'
import { LiDocument, LiAlertCircle } from '@/icons'
import { useKYCStore } from '../store/kycStore'
import { financialComplianceSchema } from '../utils/validationSchemas'
import {
    BUSINESS_SOURCE_OF_FUNDS_OPTIONS,
    ANNUAL_REVENUE_RANGE_OPTIONS,
} from '../utils/constants'
import sleep from '@/utils/sleep'
import type { BusinessFinancialCompliance } from '../types'

const FinancialCompliance = () => {
    const { businessData, updateBusinessData, validateFileUpload } =
        useKYCStore()

    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = useForm<BusinessFinancialCompliance>({
        resolver: zodResolver(financialComplianceSchema),
        defaultValues: businessData.financialCompliance,
        mode: 'onChange',
    })

    // Update store whenever form values change
    const watchedValues = watch()
    const sourceOfFunds = watch('sourceOfFunds')

    React.useEffect(() => {
        const subscription = watch((value) => {
            updateBusinessData('financialCompliance', value)
        })
        return () => subscription.unsubscribe()
    }, [watch, updateBusinessData])

    const handleBeforeUpload = (
        fileList: FileList | null,
        fieldName: keyof BusinessFinancialCompliance,
    ) => {
        if (!fileList || fileList.length === 0) return false

        const file = fileList[0]
        const validation = validateFileUpload(
            file,
            fieldName as 'registrationCertificate' | 'businessLicense',
        )

        if (!validation.valid) {
            console.error(validation.error)
            return false // Prevent upload
        }

        return true // Allow upload
    }

    const handleFileUpload = async (
        files: File[],
        fieldName: keyof BusinessFinancialCompliance,
    ) => {
        if (files.length === 0) return

        const file = files[0]

        // Simulate file upload
        await sleep(1000)
        setValue(fieldName, file)
    }

    const handleFileRemove = (fieldName: keyof BusinessFinancialCompliance) => {
        setValue(fieldName, null)
    }

    const renderFileUpload = (
        fieldName: keyof BusinessFinancialCompliance,
        label: string,
        accept: string,
        description: string,
        required: boolean = true,
        popoverContent?: React.ReactNode,
    ) => {
        const currentFile = watchedValues[fieldName] as File | null

        return (
            <FormItem
                label={label}
                invalid={Boolean(errors[fieldName])}
                errorMessage={errors[fieldName]?.message}
                asterisk={required}
                extra={
                    popoverContent ? (
                        <Popover
                            renderTrigger={
                                <LiAlertCircle className="text-base" />
                            }
                            width={400}
                            placement="top"
                            trigger="hover"
                        >
                            {popoverContent}
                        </Popover>
                    ) : undefined
                }
            >
                <div className="space-y-3">
                    <Upload
                        draggable
                        accept={accept}
                        multiple={false}
                        uploadLimit={1}
                        beforeUpload={(fileList) =>
                            handleBeforeUpload(fileList, fieldName)
                        }
                        onChange={(_, files) =>
                            handleFileUpload(files, fieldName)
                        }
                        onFileRemove={() => handleFileRemove(fieldName)}
                        fileList={currentFile ? [currentFile] : []}
                        className="bg-gray-50 dark:bg-gray-800"
                    >
                        <div className="flex flex-col items-center justify-center min-h-30 py-8">
                            <div className="mb-2">
                                <LiDocument className="heading-text text-4xl" />
                            </div>
                            <p className="text-center">
                                <span className="heading-text">
                                    Click to upload
                                </span>
                                <span> or drag and drop</span>
                            </p>
                            <p className="text-xs mt-1">{description}</p>
                        </div>
                    </Upload>
                </div>
            </FormItem>
        )
    }

    return (
        <div>
            <div className="mb-8 -mt-4">
                <p>
                    Please provide financial information and compliance
                    documents for your business.
                </p>
            </div>

            <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <FormItem
                        label="Source of Funds"
                        invalid={Boolean(errors.sourceOfFunds)}
                        errorMessage={errors.sourceOfFunds?.message}
                        asterisk
                    >
                        <Controller
                            name="sourceOfFunds"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select source of funds"
                                    options={BUSINESS_SOURCE_OF_FUNDS_OPTIONS}
                                    value={BUSINESS_SOURCE_OF_FUNDS_OPTIONS.find(
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
                        label="Annual Revenue Range"
                        invalid={Boolean(errors.annualRevenueRange)}
                        errorMessage={errors.annualRevenueRange?.message}
                        asterisk
                    >
                        <Controller
                            name="annualRevenueRange"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select annual revenue range"
                                    options={ANNUAL_REVENUE_RANGE_OPTIONS}
                                    value={ANNUAL_REVENUE_RANGE_OPTIONS.find(
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
                        label="Tax ID / VAT Number"
                        invalid={Boolean(errors.taxId)}
                        errorMessage={errors.taxId?.message}
                        asterisk
                    >
                        <Controller
                            name="taxId"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter tax ID or VAT number"
                                />
                            )}
                        />
                    </FormItem>

                    {sourceOfFunds === 'other' && (
                        <FormItem
                            label="Please Specify Source of Funds"
                            invalid={Boolean(errors.sourceOfFundsOther)}
                            errorMessage={errors.sourceOfFundsOther?.message}
                            asterisk
                            className="col-span-2"
                        >
                            <Controller
                                name="sourceOfFundsOther"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        textArea
                                        placeholder="Please specify your source of funds"
                                    />
                                )}
                            />
                        </FormItem>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderFileUpload(
                        'registrationCertificate',
                        'Company Registration Certificate',
                        '.pdf,.jpg,.jpeg,.png',
                        'Upload official company registration certificate (Max 10MB)',
                        true,
                        <div className="space-y-2 heading-text">
                            <h6>Required Documents:</h6>
                            <ul className="space-y-1">
                                <li>
                                    • Company registration certificate from the
                                    relevant authority
                                </li>
                                <li>
                                    • All documents must be current and clearly
                                    legible
                                </li>
                                <li>
                                    • Documents in languages other than English
                                    may require certified translation
                                </li>
                            </ul>
                        </div>,
                    )}

                    {renderFileUpload(
                        'businessLicense',
                        'Business License (Optional)',
                        '.pdf,.jpg,.jpeg,.png',
                        'Upload business license if applicable (Max 10MB)',
                        false,
                        <div className="space-y-2 heading-text">
                            <h6>Business License Information:</h6>
                            <ul className="space-y-1">
                                <li>
                                    • Business license (if required in your
                                    jurisdiction)
                                </li>
                                <li>• Professional licenses or permits</li>
                                <li>• Industry-specific certifications</li>
                            </ul>
                            <p>
                                Upload only if your business requires specific
                                licensing or permits to operate.
                            </p>
                        </div>,
                    )}
                </div>
            </Form>
        </div>
    )
}

export default FinancialCompliance
