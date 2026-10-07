import { useState, useEffect, useCallback } from 'react'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'
import BasicInfoStep from './BasicInfoStep'
import JobInfoStep from './JobInfoStep'
import AccountInfoStep from './AccountInfoStep'
import useEmployeeData from '../hooks/useEmployeeData'
import { useEmployeeStore } from '../store/employeeStore'
import useResponsive from '@/utils/hooks/useResponsive'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type {
    EmployeeDocument,
    Employee,
    Gender,
    EmploymentType,
    EmployeeStatus,
    CurrentStatus,
} from '../types'

const employeeFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Invalid email format'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    gender: z.string(),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    profilePhoto: z.any().optional(),
    documents: z.array(z.any()).optional(),
    department: z.string().min(1, 'Department is required'),
    designation: z.string().min(1, 'Designation is required'),
    employmentType: z.string(),
    joiningDate: z.string().min(1, 'Joining date is required'),
    reportingManager: z.string().optional(),
    workLocation: z.string().optional(),
    employeeId: z.string().min(1, 'Employee ID is required'),
    loginEmail: z.string().email('Invalid email format'),
    status: z.string(),
})

type EmployeeFormData = z.infer<typeof employeeFormSchema>

const AddEmployeeDrawer = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { createEmployee, updateEmployee } = useEmployeeData()
    const { showAddEmployee, editEmployee, closeAddEmployee } =
        useEmployeeStore()
    const { smaller } = useResponsive()

    const isEditMode = Boolean(editEmployee)
    const title = isEditMode ? 'Edit Employee' : 'Add New Employee'
    const drawerWidth = smaller.sm ? 350 : 450

    const generateEmployeeId = () => {
        const timestamp = Date.now().toString().slice(-4)
        return `EMP${timestamp}`
    }

    const getDefaultValues = useCallback(() => {
        if (editEmployee) {
            return {
                firstName: editEmployee.personalInfo.firstName,
                lastName: editEmployee.personalInfo.lastName,
                email: editEmployee.personalInfo.email,
                phone: editEmployee.personalInfo.phone,
                gender: editEmployee.personalInfo.gender,
                dateOfBirth: editEmployee.personalInfo.dateOfBirth,
                department: editEmployee.jobInfo.department,
                designation: editEmployee.jobInfo.designation,
                employmentType: editEmployee.jobInfo.employmentType,
                joiningDate: editEmployee.jobInfo.joiningDate,
                reportingManager: editEmployee.jobInfo.reportingManager || '',
                workLocation: editEmployee.jobInfo.workLocation || '',
                employeeId: editEmployee.employeeId,
                loginEmail: editEmployee.accountInfo.loginEmail,
                profilePhoto: editEmployee.personalInfo.profilePhoto,
                documents: editEmployee.documents || [],
                status: editEmployee.accountInfo.status,
            }
        }
        return {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            gender: 'prefer-not-to-say',
            dateOfBirth: '',
            department: '',
            designation: '',
            employmentType: 'full-time',
            joiningDate: '',
            reportingManager: '',
            workLocation: '',
            employeeId: generateEmployeeId(),
            loginEmail: '',
            profilePhoto: undefined,
            documents: [],
            status: 'active',
        }
    }, [editEmployee])

    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: getDefaultValues(),
    })

    // Reset form when editEmployee changes
    useEffect(() => {
        form.reset(getDefaultValues())
        setCurrentStep(0) // Reset to first step when switching between add/edit
    }, [editEmployee, form, getDefaultValues])

    const steps = [
        { title: 'Basic Info', description: 'Personal information' },
        { title: 'Job Info', description: 'Employment details' },
        { title: 'Account Info', description: 'Account setup' },
    ]

    const validateCurrentStep = async () => {
        const values = form.getValues()

        try {
            switch (currentStep) {
                case 0: // Basic Info
                    await z
                        .object({
                            firstName: employeeFormSchema.shape.firstName,
                            lastName: employeeFormSchema.shape.lastName,
                            email: employeeFormSchema.shape.email,
                            phone: employeeFormSchema.shape.phone,
                            gender: employeeFormSchema.shape.gender,
                            dateOfBirth: employeeFormSchema.shape.dateOfBirth,
                        })
                        .parseAsync({
                            firstName: values.firstName,
                            lastName: values.lastName,
                            email: values.email,
                            phone: values.phone,
                            gender: values.gender,
                            dateOfBirth: values.dateOfBirth,
                        })
                    break
                case 1: // Job Info
                    await z
                        .object({
                            department: employeeFormSchema.shape.department,
                            designation: employeeFormSchema.shape.designation,
                            employmentType:
                                employeeFormSchema.shape.employmentType,
                            joiningDate: employeeFormSchema.shape.joiningDate,
                        })
                        .parseAsync({
                            department: values.department,
                            designation: values.designation,
                            employmentType: values.employmentType,
                            joiningDate: values.joiningDate,
                        })
                    break
                case 2: // Account Info
                    await z
                        .object({
                            employeeId: employeeFormSchema.shape.employeeId,
                            loginEmail: employeeFormSchema.shape.loginEmail,
                            status: employeeFormSchema.shape.status,
                        })
                        .parseAsync({
                            employeeId: values.employeeId,
                            loginEmail: values.loginEmail,
                            status: values.status,
                        })
                    break
            }
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.issues.forEach((err) => {
                    form.setError(err.path[0] as keyof EmployeeFormData, {
                        message: err.message,
                    })
                })
            }
            return false
        }
    }

    const handleNext = async () => {
        const isValid = await validateCurrentStep()
        if (isValid && currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        const isValid = await validateCurrentStep()
        if (!isValid) return

        setIsSubmitting(true)

        try {
            const formData = form.getValues()

            // Process documents - the BasicInfoStep already handles the unified format
            const processedDocuments: EmployeeDocument[] = []

            if (formData.documents && Array.isArray(formData.documents)) {
                formData.documents.forEach((item, index) => {
                    if (item && typeof item === 'object' && 'id' in item) {
                        // It's already an EmployeeDocument
                        processedDocuments.push(item as EmployeeDocument)
                    } else {
                        // It's a new File, convert to EmployeeDocument
                        const file = item as File
                        processedDocuments.push({
                            id: `doc-${formData.employeeId}-${Date.now()}-${index}`,
                            name: file.name,
                            type: file.type,
                            url: `/documents/${formData.employeeId}/${file.name}`,
                            uploadedAt: new Date().toISOString().split('T')[0],
                            uploadedBy: 'current-user',
                        })
                    }
                })
            }

            const employeeData = {
                personalInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    fullName: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    gender: formData.gender as Gender,
                    dateOfBirth: formData.dateOfBirth,
                    profilePhoto: formData.profilePhoto,
                },
                jobInfo: {
                    department: formData.department,
                    designation: formData.designation,
                    role: formData.designation, // Use designation as role for now
                    employmentType: formData.employmentType as EmploymentType,
                    joiningDate: formData.joiningDate,
                    reportingManager: formData.reportingManager,
                    workLocation: formData.workLocation,
                },
                accountInfo: {
                    loginEmail: formData.loginEmail,
                    status: formData.status as EmployeeStatus,
                    currentStatus: 'working' as CurrentStatus,
                    createdBy: 'current-user',
                    updatedBy: 'current-user',
                },
                documents: processedDocuments,
                employeeId: formData.employeeId,
            }

            if (isEditMode && editEmployee) {
                // Update existing employee
                updateEmployee(editEmployee.id, employeeData)
            } else {
                // Create new employee - need to generate a complete Employee object
                const newEmployee: Employee = {
                    id: Date.now().toString(), // Generate a temporary ID
                    employeeId: formData.employeeId,
                    personalInfo: employeeData.personalInfo,
                    jobInfo: employeeData.jobInfo,
                    accountInfo: employeeData.accountInfo,
                    documents: processedDocuments,
                    createdAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0],
                }
                createEmployee(newEmployee)
            }

            handleClose()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        form.reset()
        setCurrentStep(0)
        closeAddEmployee()
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <BasicInfoStep form={form} />
            case 1:
                return <JobInfoStep form={form} />
            case 2:
                return <AccountInfoStep form={form} />
            default:
                return null
        }
    }

    const getFooterButtons = () => {
        const buttons = []

        // Previous button (visible from step 2 onwards)
        if (currentStep > 0) {
            buttons.push(
                <Button
                    key="previous"
                    variant="default"
                    onClick={handlePrevious}
                >
                    Previous
                </Button>,
            )
        }

        // Next/Submit button
        if (currentStep < steps.length - 1) {
            buttons.push(
                <Button key="next" variant="solid" onClick={handleNext}>
                    Next
                </Button>,
            )
        } else {
            buttons.push(
                <Button
                    key="submit"
                    variant="solid"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                >
                    {isEditMode ? 'Update Employee' : 'Create Employee'}
                </Button>,
            )
        }

        return (
            <>
                <Button key="cancel" onClick={handleClose}>
                    Cancel
                </Button>
                <div className="flex items-center gap-2">{buttons}</div>
            </>
        )
    }

    return (
        <Drawer
            isOpen={showAddEmployee}
            onClose={handleClose}
            closable={false}
            width={drawerWidth}
            footer={
                <div className="flex items-center justify-between gap-2 w-full">
                    {getFooterButtons()}
                </div>
            }
            bodyClass="p-0"
        >
            {/* Steps */}
            <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200 dark:border-gray-800">
                <h5>{title}</h5>
                <div className="font-semibold heading-text underline">
                    Step {currentStep + 1} of {steps.length}
                </div>
            </div>

            {/* Step Content */}
            <div className="p-4">{renderStepContent()}</div>
        </Drawer>
    )
}

export default AddEmployeeDrawer
