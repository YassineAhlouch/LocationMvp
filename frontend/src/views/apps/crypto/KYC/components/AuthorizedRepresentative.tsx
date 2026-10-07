import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormItem, Input, Upload, Popover } from '@/components/ui'
import { LiPassport, LiDocument, LiAlertCircle } from '@/icons'
import { useKYCStore } from '../store/kycStore'
import { representativeSchema } from '../utils/validationSchemas'
import sleep from '@/utils/sleep'
import type { BusinessRepresentative } from '../types'

const AuthorizedRepresentative = () => {
    const { businessData, updateBusinessData, validateFileUpload } =
        useKYCStore()

    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = useForm<BusinessRepresentative>({
        resolver: zodResolver(representativeSchema),
        defaultValues: businessData.representative,
        mode: 'onChange',
    })

    const watchedValues = watch()

    React.useEffect(() => {
        const subscription = watch((value) => {
            updateBusinessData('representative', value)
        })
        return () => subscription.unsubscribe()
    }, [watch, updateBusinessData])

    const handleBeforeUpload = (
        fileList: FileList | null,
        fieldName: keyof BusinessRepresentative,
    ) => {
        if (!fileList || fileList.length === 0) return false

        const file = fileList[0]
        const validation = validateFileUpload(
            file,
            fieldName as 'idDocument' | 'proofOfAuthorization',
        )

        if (!validation.valid) {
            console.error(validation.error)
            return false
        }

        return true
    }

    const handleFileUpload = async (
        files: File[],
        fieldName: keyof BusinessRepresentative,
    ) => {
        if (files.length === 0) return

        const file = files[0]

        // Simulate file upload
        await sleep(1000)
        setValue(fieldName, file)
    }

    const handleFileRemove = (fieldName: keyof BusinessRepresentative) => {
        setValue(fieldName, null)
    }

    const renderFileUpload = (
        fieldName: keyof BusinessRepresentative,
        label: string,
        accept: string,
        description: string,
        multiple: boolean = false,
    ) => {
        const currentFile = watchedValues[fieldName] as File | null

        return (
            <FormItem
                label={label}
                invalid={Boolean(errors[fieldName])}
                errorMessage={errors[fieldName]?.message}
                asterisk
            >
                <div className="space-y-3">
                    <Upload
                        draggable
                        accept={accept}
                        multiple={multiple}
                        uploadLimit={multiple ? 5 : 1}
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
                            <div className="mb-2 heading-text text-4xl">
                                {fieldName === 'proofOfAuthorization' ? (
                                    <LiDocument />
                                ) : (
                                    <LiPassport />
                                )}
                            </div>
                            <p className="text-center">
                                <span className="heading-text">
                                    Click to upload
                                </span>
                                <span> or drag and drop</span>
                            </p>
                            <p className="text-xs mt-1 text-center max-w-80">
                                {description}
                            </p>
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
                    Please provide information about the person authorized to
                    act on behalf of the company.
                </p>
            </div>
            <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
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
                                    placeholder="Enter representative's full name"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Position / Title"
                        invalid={Boolean(errors.position)}
                        errorMessage={errors.position?.message}
                        asterisk
                    >
                        <Controller
                            name="position"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter position or title (e.g., CEO, Director)"
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
                                    placeholder="Enter representative's email"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Contact Number"
                        invalid={Boolean(errors.contactNumber)}
                        errorMessage={errors.contactNumber?.message}
                        asterisk
                    >
                        <Controller
                            name="contactNumber"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="tel"
                                    placeholder="Enter representative's phone number"
                                />
                            )}
                        />
                    </FormItem>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderFileUpload(
                        'idDocument',
                        'ID Document of Representative',
                        '.jpg,.jpeg,.png,.pdf',
                        "Upload representative's ID document (front, back, and any additional pages) (Max 5MB each)",
                        true,
                    )}

                    <FormItem
                        label="Proof of Authorization"
                        invalid={Boolean(errors.proofOfAuthorization)}
                        errorMessage={errors.proofOfAuthorization?.message}
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
                                    <h6>Acceptable Authorization Documents:</h6>
                                    <ul className="space-y-1">
                                        <li>
                                            • Board resolution appointing the
                                            representative
                                        </li>
                                        <li>• Power of attorney document</li>
                                        <li>
                                            • Official authorization letter from
                                            the company
                                        </li>
                                        <li>
                                            • Corporate secretary certificate
                                        </li>
                                    </ul>
                                    <p>
                                        The document must clearly state the
                                        representative's authority to act on
                                        behalf of the company.
                                    </p>
                                </div>
                            </Popover>
                        }
                    >
                        <div className="space-y-3">
                            <Upload
                                draggable
                                accept=".pdf,.jpg,.jpeg,.png"
                                multiple={true}
                                uploadLimit={5}
                                beforeUpload={(fileList) =>
                                    handleBeforeUpload(
                                        fileList,
                                        'proofOfAuthorization',
                                    )
                                }
                                onChange={(_, files) =>
                                    handleFileUpload(
                                        files,
                                        'proofOfAuthorization',
                                    )
                                }
                                onFileRemove={() =>
                                    handleFileRemove('proofOfAuthorization')
                                }
                                fileList={
                                    watchedValues.proofOfAuthorization
                                        ? [watchedValues.proofOfAuthorization]
                                        : []
                                }
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
                                    <p className="text-xs mt-1 text-center max-w-80">
                                        Upload board resolution, power of
                                        attorney, or authorization letter (Max
                                        10MB)
                                    </p>
                                </div>
                            </Upload>
                        </div>
                    </FormItem>
                </div>
            </Form>
        </div>
    )
}

export default AuthorizedRepresentative
