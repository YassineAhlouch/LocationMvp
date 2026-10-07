import { useEffect } from 'react'
import dayjs from 'dayjs'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import DatePicker from '@/components/ui/DatePicker'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import { apiGetUsersList } from '@/services/AccountService'
import useLeaveData from '../hooks/useLeaveData'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'

const addLeaveSchema = z.object({
    employeeId: z.string().min(1, 'Employee is required'),
    type: z.enum(['annualLeave', 'sickLeave', 'casualLeave'], {
        message: 'Leave type is required',
    }),
    startDate: z.date().refine((date) => date !== null, {
        message: 'Start date is required',
    }),
    endDate: z.date().refine((date) => date !== null, {
        message: 'End date is required',
    }),
    reason: z.string().optional(),
    halfDay: z.boolean().optional(),
})

type AddLeaveFormData = z.infer<typeof addLeaveSchema>

type User = {
    id: string
    name: string
    title: string
    img?: string
}

type AddLeaveRequestFormProps = {
    selectedDate?: Date
    onSuccess?: () => void
    onCancel?: () => void
}

const AddLeaveRequestForm = ({
    selectedDate,
    onSuccess,
    onCancel,
}: AddLeaveRequestFormProps) => {
    const { createLeaveRequest } = useLeaveData()

    // Use SWR to fetch users
    const { data: usersData, isLoading: usersLoading } = useSWR(
        '/rbac/users',
        () =>
            apiGetUsersList<{ list: User[] }, Record<string, unknown>>({
                pageIndex: 1,
                pageSize: 100,
            }),
    )

    const form = useForm<AddLeaveFormData>({
        resolver: zodResolver(addLeaveSchema),
        defaultValues: {
            employeeId: '',
            type: 'annualLeave',
            startDate: selectedDate || dayjs().toDate(),
            endDate: selectedDate || dayjs().toDate(),
            reason: '',
            halfDay: false,
        },
    })

    // Set default dates when selectedDate changes
    useEffect(() => {
        if (selectedDate) {
            form.setValue('startDate', selectedDate)
            form.setValue('endDate', selectedDate)
        }
    }, [selectedDate, form])

    console.log('usersData', usersData)

    const users = usersData?.list || []
    console.log('users', users)
    const employeeOptions = users.map((user) => ({
        value: user.id,
        label: user.name,
        title: user.title,
        img: user.img,
    }))

    const leaveTypeOptions = [
        { value: 'annualLeave', label: 'Annual Leave' },
        { value: 'sickLeave', label: 'Sick Leave' },
        { value: 'casualLeave', label: 'Casual Leave' },
    ]

    const handleSubmit = async (data: AddLeaveFormData) => {
        try {
            const selectedEmployee = users.find(
                (user) => user.id === data.employeeId,
            )

            const leaveRequest = {
                employee: {
                    id: selectedEmployee?.id || '',
                    name: selectedEmployee?.name || '',
                    title: selectedEmployee?.title || '',
                    avatar: selectedEmployee?.img,
                },
                type:
                    data.type === 'annualLeave'
                        ? 'Annual Leave'
                        : data.type === 'sickLeave'
                          ? 'Sick Leave'
                          : 'Casual Leave',
                startDate: dayjs(data.startDate).toISOString(),
                endDate: dayjs(data.endDate).toISOString(),
                reason: data.reason,
                halfDay: data.halfDay,
            }

            await createLeaveRequest(leaveRequest)
            toast.push(
                <Notification type="success" title="Success">
                    Leave request submitted successfully
                </Notification>,
            )
            form.reset()
            onSuccess?.()
        } catch {
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to submit leave request
                </Notification>,
            )
        }
    }

    const handleCancel = () => {
        form.reset()
        onCancel?.()
    }

    return (
        <Form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormItem
                label="Employee"
                invalid={Boolean(form.formState.errors.employeeId)}
                errorMessage={form.formState.errors.employeeId?.message}
            >
                <Controller
                    name="employeeId"
                    control={form.control}
                    render={({ field }) => (
                        <Select
                            options={employeeOptions}
                            value={employeeOptions.find(
                                (option) => option.value === field.value,
                            )}
                            onChange={(option) =>
                                field.onChange(option?.value || '')
                            }
                            placeholder={
                                usersLoading
                                    ? 'Loading employees...'
                                    : 'Select employee'
                            }
                            isDisabled={usersLoading}
                            customInputDisplay={(selectedItem) => (
                                <SelectInputWithPrefix
                                    label={
                                        selectedItem ? (
                                            <span className="heading-text">
                                                {selectedItem.label}
                                            </span>
                                        ) : null
                                    }
                                    showPrefix={Boolean(selectedItem?.value)}
                                    prefix={
                                        <Avatar
                                            src={selectedItem?.img}
                                            size={20}
                                            shape="circle"
                                            alt={selectedItem?.label}
                                        />
                                    }
                                />
                            )}
                            customOption={({ option, selected, CheckIcon }) => (
                                <SelectOptionWithPrefix
                                    selected={selected}
                                    checkIcon={CheckIcon}
                                    label={
                                        <div className="flex flex-col">
                                            <span className="font-medium heading-text">
                                                {option?.label}
                                            </span>
                                            <span className="text-xs font-normal">
                                                {option?.title}
                                            </span>
                                        </div>
                                    }
                                    prefix={
                                        <Avatar
                                            src={option.img}
                                            size={25}
                                            shape="circle"
                                            alt={option.label}
                                        />
                                    }
                                />
                            )}
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Leave Type"
                invalid={Boolean(form.formState.errors.type)}
                errorMessage={form.formState.errors.type?.message}
            >
                <Controller
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                        <Select
                            options={leaveTypeOptions}
                            value={leaveTypeOptions.find(
                                (option) => option.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                            placeholder="Select leave type"
                        />
                    )}
                />
            </FormItem>

            <div className="grid grid-cols-2 gap-4">
                <FormItem
                    label="Start Date"
                    invalid={Boolean(form.formState.errors.startDate)}
                    errorMessage={form.formState.errors.startDate?.message}
                >
                    <Controller
                        name="startDate"
                        control={form.control}
                        render={({ field }) => (
                            <DatePicker
                                placeholder="Select start date"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="End Date"
                    invalid={Boolean(form.formState.errors.endDate)}
                    errorMessage={form.formState.errors.endDate?.message}
                >
                    <Controller
                        name="endDate"
                        control={form.control}
                        render={({ field }) => (
                            <DatePicker
                                placeholder="Select end date"
                                value={field.value}
                                onChange={field.onChange}
                                minDate={form.watch('startDate')}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <FormItem
                label="Reason (Optional)"
                invalid={Boolean(form.formState.errors.reason)}
                errorMessage={form.formState.errors.reason?.message}
            >
                <Controller
                    name="reason"
                    control={form.control}
                    render={({ field }) => (
                        <Input
                            textArea
                            rows={3}
                            placeholder="Enter reason for leave..."
                            {...field}
                        />
                    )}
                />
            </FormItem>

            <FormItem>
                <Controller
                    name="halfDay"
                    control={form.control}
                    render={({ field }) => (
                        <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                        >
                            Half Day Leave
                        </Checkbox>
                    )}
                />
            </FormItem>

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="default"
                    onClick={handleCancel}
                    disabled={form.formState.isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="solid"
                    loading={form.formState.isSubmitting}
                >
                    Submit Request
                </Button>
            </div>
        </Form>
    )
}

export default AddLeaveRequestForm
