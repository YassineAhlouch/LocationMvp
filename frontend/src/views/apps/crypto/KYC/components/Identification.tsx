import { useEffect } from 'react'
import Input from '@/components/ui/Input'
import DatePicker from '@/components/ui/DatePicker'
import Upload from '@/components/ui/Upload'
import { Form, FormItem } from '@/components/ui/Form'
import { useKYCStore } from '../store/kycStore'
import { identificationSchema } from '../utils/validationSchemas'
import { ID_TYPE_OPTIONS } from '../utils/constants'
import sleep from '@/utils/sleep'
import { LiIdendityCard } from '@/icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { IndividualIdentification } from '../types'
import classNames from '@/utils/classNames'

const Identification = () => {
    const { individualData, updateIndividualData, validateFileUpload } =
        useKYCStore()

    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = useForm<IndividualIdentification>({
        resolver: zodResolver(identificationSchema),
        defaultValues: individualData.identification,
        mode: 'onChange',
    })

    // Update store whenever form values change
    const watchedValues = watch()

    useEffect(() => {
        const subscription = watch((value) => {
            updateIndividualData('identification', value)
        })
        return () => subscription.unsubscribe()
    }, [watch, updateIndividualData])

    const handleBeforeUpload = (
        fileList: FileList | null,
        fieldName: keyof IndividualIdentification,
    ) => {
        if (!fileList || fileList.length === 0) return false

        const file = fileList[0]
        const validation = validateFileUpload(
            file,
            fieldName as 'idDocumentFront' | 'idDocumentBack',
        )

        if (!validation.valid) {
            // Handle validation error - in a real app you'd show a toast
            console.error(validation.error)
            return false // Prevent upload
        }

        return true // Allow upload
    }

    const handleFileUpload = async (
        files: File[],
        fieldName: keyof IndividualIdentification,
    ) => {
        if (files.length === 0) return

        const file = files[0]

        // Simulate file upload
        await sleep(1000)
        setValue(fieldName, file)
    }

    const handleFileRemove = (fieldName: keyof IndividualIdentification) => {
        setValue(fieldName, null)
    }

    const renderFileUpload = (
        fieldName: keyof IndividualIdentification,
        label: string,
        accept: string,
        description: string,
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
                                <LiIdendityCard className="heading-text text-4xl" />
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
                    Please provide your identification documents for
                    verification.
                </p>
            </div>
            <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <FormItem
                        label="ID Type"
                        invalid={Boolean(errors.idType)}
                        errorMessage={errors.idType?.message}
                        className="col-span-2"
                        asterisk
                    >
                        <Controller
                            name="idType"
                            control={control}
                            render={({ field }) => (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {ID_TYPE_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={classNames(
                                                'rounded-lg border p-4 transition-colors duration-150',
                                                option.value === field.value
                                                    ? 'border-primary dark:border-primary outline outline-primary'
                                                    : 'border-gray-200 dark:border-gray-800',
                                            )}
                                            onClick={() =>
                                                field.onChange(option.value)
                                            }
                                        >
                                            <span className="flex items-center justify-start gap-2">
                                                <span
                                                    className={classNames(
                                                        'rounded-full h-4 w-4 bg-white dark:bg-gray-700 border-2 flex items-center justify-center',
                                                        option.value ===
                                                            field.value
                                                            ? 'border-primary dark:border-primary'
                                                            : 'border-gray-200 dark:border-gray-800',
                                                    )}
                                                >
                                                    <span
                                                        className={classNames(
                                                            'w-1.5 h-1.5 rounded-full',
                                                            option.value ===
                                                                field.value
                                                                ? 'bg-primary dark:bg-primary'
                                                                : '',
                                                        )}
                                                    ></span>
                                                </span>
                                                <span className="heading-text font-medium">
                                                    {option.label}
                                                </span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="ID Number"
                        invalid={Boolean(errors.idNumber)}
                        errorMessage={errors.idNumber?.message}
                        asterisk
                    >
                        <Controller
                            name="idNumber"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter your ID number"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Issue Date"
                        invalid={Boolean(errors.issueDate)}
                        errorMessage={errors.issueDate?.message}
                        asterisk
                    >
                        <Controller
                            name="issueDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    placeholder="Select issue date"
                                    inputFormat="YYYY-MM-DD"
                                    disableDate={(date: Date) =>
                                        date > new Date()
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Expiry Date"
                        invalid={Boolean(errors.expiryDate)}
                        errorMessage={errors.expiryDate?.message}
                        asterisk
                    >
                        <Controller
                            name="expiryDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    placeholder="Select expiry date"
                                    inputFormat="YYYY-MM-DD"
                                    disableDate={(date: Date) =>
                                        date < new Date()
                                    }
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderFileUpload(
                        'idDocumentFront',
                        'ID Document (Front)',
                        '.jpg,.jpeg,.png,.pdf',
                        'Upload the front side of your ID document (Max 5MB)',
                    )}

                    {renderFileUpload(
                        'idDocumentBack',
                        'ID Document (Back)',
                        '.jpg,.jpeg,.png,.pdf',
                        'Upload the back side of your ID document (Max 5MB)',
                    )}
                </div>
            </Form>
        </div>
    )
}

export default Identification
