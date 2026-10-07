import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Upload from '@/components/ui/Upload'
import DatePicker from '@/components/ui/DatePicker'
import { FormItem } from '@/components/ui/Form'
import Avatar from '@/components/ui/Avatar'
import FileIcon from '@/components/shared/FileIcon'
import { LiUser, LiTrash, LiAdd } from '@/icons'
import { Controller } from 'react-hook-form'
import type { EmployeeDocument } from '../types'
import type { UseFormReturn } from 'react-hook-form'

type EmployeeFormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    gender: string
    dateOfBirth: string
    profilePhoto?: File
    documents?: (File | EmployeeDocument)[]
    department: string
    designation: string
    employmentType: string
    joiningDate: string
    reportingManager?: string
    workLocation?: string
    employeeId: string
    loginEmail: string
    status: string
}

type BasicInfoStepProps = {
    form: UseFormReturn<EmployeeFormData>
}

// Document item type for unified handling
type DocumentItem = {
    id: string
    name: string
    type: string
    isExisting: boolean
    file?: File
    url?: string
    uploadedAt?: string
    uploadedBy?: string
}

const BasicInfoStep = ({ form }: BasicInfoStepProps) => {
    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = form

    const profilePhoto = watch('profilePhoto')
    const formDocuments = watch('documents')

    // State for unified document management
    const [documents, setDocuments] = useState<DocumentItem[]>([])

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' },
    ]

    // Initialize documents from form data
    useEffect(() => {
        if (formDocuments && Array.isArray(formDocuments)) {
            const documentItems: DocumentItem[] = formDocuments.map(
                (item, index) => {
                    // Check if it's an existing EmployeeDocument
                    if (
                        item &&
                        typeof item === 'object' &&
                        'id' in item &&
                        'url' in item
                    ) {
                        const doc = item as EmployeeDocument
                        return {
                            id: doc.id,
                            name: doc.name,
                            type: doc.type,
                            isExisting: true,
                            url: doc.url,
                            uploadedAt: doc.uploadedAt,
                            uploadedBy: doc.uploadedBy,
                        }
                    } else {
                        // It's a new File
                        const file = item as File
                        return {
                            id: `new-${Date.now()}-${index}`,
                            name: file.name,
                            type: file.type,
                            isExisting: false,
                            file: file,
                        }
                    }
                },
            )
            setDocuments(documentItems)
        } else {
            setDocuments([])
        }
    }, [formDocuments])

    const handlePhotoUpload = (file: File) => {
        setValue('profilePhoto', file)
    }

    const handleDocumentUpload = (_: File, fileList: File[]) => {
        const newDocuments: DocumentItem[] = fileList.map((file, index) => ({
            id: `new-${Date.now()}-${index}`,
            name: file.name,
            type: file.type,
            isExisting: false,
            file: file,
        }))

        // Add new documents to existing ones
        setDocuments((prev) => [...prev, ...newDocuments])
    }

    const handleRemoveDocument = (documentId: string) => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    }

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return <FileIcon type="pdf" size={25} />
        if (type.includes('image')) return <FileIcon type="jpg" size={25} />
        if (type.includes('word') || type.includes('document'))
            return <FileIcon type="docx" size={25} />
        if (type.includes('excel') || type.includes('spreadsheet'))
            return <FileIcon type="xlsx" size={25} />
        return '📎'
    }

    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true

        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }

        return valid
    }
    return (
        <div>
            <FormItem>
                <div className="flex items-center gap-2">
                    <div className="rounded-full p-0.5 border border-gray-200 dark:border-gray-800 inline-flex">
                        <Avatar
                            size={70}
                            shape="circle"
                            src={
                                profilePhoto instanceof File
                                    ? URL.createObjectURL(profilePhoto)
                                    : profilePhoto
                            }
                            icon={<LiUser className="text-3xl" />}
                            className="heading-text"
                        />
                    </div>
                    <Upload
                        accept="image/*"
                        showList={false}
                        uploadLimit={1}
                        beforeUpload={beforeUpload}
                        onChange={handlePhotoUpload}
                    >
                        <Button type="button">Upload Photo</Button>
                    </Upload>
                </div>
            </FormItem>
            <FormItem
                label="First Name"
                invalid={Boolean(errors.firstName)}
                errorMessage={errors.firstName?.message as string}
            >
                <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Enter first name" />
                    )}
                />
            </FormItem>

            <FormItem
                label="Last Name"
                invalid={Boolean(errors.lastName)}
                errorMessage={errors.lastName?.message as string}
            >
                <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Enter last name" />
                    )}
                />
            </FormItem>
            <FormItem
                label="Email"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message as string}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="email"
                            placeholder="Enter email address"
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Phone"
                invalid={Boolean(errors.phone)}
                errorMessage={errors.phone?.message as string}
            >
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="tel"
                            placeholder="Enter phone number"
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Gender"
                invalid={Boolean(errors.gender)}
                errorMessage={errors.gender?.message as string}
            >
                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={genderOptions}
                            value={genderOptions.find(
                                (option) => option.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                            placeholder="Select gender"
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Date of Birth"
                invalid={Boolean(errors.dateOfBirth)}
                errorMessage={errors.dateOfBirth?.message as string}
            >
                <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) =>
                                field.onChange(
                                    date
                                        ? date.toISOString().split('T')[0]
                                        : '',
                                )
                            }
                            placeholder="Select date of birth"
                            inputFormat="YYYY-MM-DD"
                            clearable
                        />
                    )}
                />
            </FormItem>

            <FormItem label="Related Documents (Optional)">
                <div className="space-y-4">
                    {/* Document List */}
                    {documents.length > 0 && (
                        <Card bodyClass="p-0 divide-y divide-gray-200 dark:divide-gray-700">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-4"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="text-2xl">
                                            {getFileIcon(doc.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium heading-text truncate">
                                                {doc.name}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                            handleRemoveDocument(doc.id)
                                        }
                                        icon={<LiTrash />}
                                    />
                                </div>
                            ))}
                        </Card>
                    )}
                    <Upload
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleDocumentUpload}
                        showList={false}
                        className="w-full"
                    >
                        <Button
                            block
                            icon={<LiAdd />}
                            className="border-dashed"
                        >
                            Upload Documents
                        </Button>
                    </Upload>
                </div>
            </FormItem>
        </div>
    )
}

export default BasicInfoStep
