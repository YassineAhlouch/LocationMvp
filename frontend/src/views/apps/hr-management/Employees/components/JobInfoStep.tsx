import { Controller, type UseFormReturn } from 'react-hook-form'
import useSWR from 'swr'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import { FormItem } from '@/components/ui/Form'
import { apiGetDepartments } from '@/services/HrmService'
import type { Department } from '../types'

type EmployeeFormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    gender: string
    dateOfBirth: string
    profilePhoto?: File
    documents?: File[]
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

type JobInfoStepProps = {
    form: UseFormReturn<EmployeeFormData>
}

const JobInfoStep = ({ form }: JobInfoStepProps) => {
    const {
        control,
        formState: { errors },
    } = form

    // Fetch departments
    const { data: departments } = useSWR(
        '/api/hrm/departments',
        () => apiGetDepartments<Department[]>(),
        { revalidateOnFocus: false },
    )

    const employmentTypeOptions = [
        { value: 'full-time', label: 'Full-time' },
        { value: 'part-time', label: 'Part-time' },
        { value: 'contract', label: 'Contract' },
        { value: 'intern', label: 'Intern' },
        { value: 'freelance', label: 'Freelance' },
    ]

    const departmentOptions =
        departments?.map((dept) => ({
            value: dept.name,
            label: dept.name,
        })) || []

    return (
        <>
            <FormItem
                label="Department"
                invalid={Boolean(errors.department)}
                errorMessage={errors.department?.message as string}
            >
                <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={departmentOptions}
                            value={departmentOptions.find(
                                (option) => option.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                            placeholder="Select department"
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Designation"
                invalid={Boolean(errors.designation)}
                errorMessage={errors.designation?.message as string}
            >
                <Controller
                    name="designation"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Enter job designation" />
                    )}
                />
            </FormItem>
            <FormItem
                label="Employment Type"
                invalid={Boolean(errors.employmentType)}
                errorMessage={errors.employmentType?.message as string}
            >
                <Controller
                    name="employmentType"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={employmentTypeOptions}
                            value={employmentTypeOptions.find(
                                (option) => option.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                            placeholder="Select employment type"
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Joining Date"
                invalid={Boolean(errors.joiningDate)}
                errorMessage={errors.joiningDate?.message as string}
            >
                <Controller
                    name="joiningDate"
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
                            placeholder="Select joining date"
                            inputFormat="YYYY-MM-DD"
                            clearable
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Reporting Manager (Optional)"
                invalid={Boolean(errors.reportingManager)}
                errorMessage={errors.reportingManager?.message as string}
            >
                <Controller
                    name="reportingManager"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Enter reporting manager name"
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Work Location (Optional)"
                invalid={Boolean(errors.workLocation)}
                errorMessage={errors.workLocation?.message as string}
            >
                <Controller
                    name="workLocation"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Enter work location" />
                    )}
                />
            </FormItem>
        </>
    )
}

export default JobInfoStep
