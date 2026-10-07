import { useEffect } from 'react'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import DatePicker from '@/components/ui/DatePicker'
import { Form, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import useLeaveData from '../hooks/useLeaveData'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Holiday form schema
const createHolidaySchema = z.object({
    title: z.string().min(1, 'Holiday title is required'),
    startDate: z.date().refine((date) => date !== null, {
        message: 'Start date is required',
    }),
    endDate: z.date().refine((date) => date !== null, {
        message: 'End date is required',
    }),
    description: z.string().optional(),
    isMultiDay: z.boolean().optional(),
})

type CreateHolidayFormData = z.infer<typeof createHolidaySchema>

type CreateHolidayFormProps = {
    selectedDate?: Date
    onSuccess?: () => void
    onCancel?: () => void
}

const CreateHolidayForm = ({
    selectedDate,
    onSuccess,
    onCancel,
}: CreateHolidayFormProps) => {
    const { createHoliday } = useLeaveData()

    const form = useForm<CreateHolidayFormData>({
        resolver: zodResolver(createHolidaySchema),
        defaultValues: {
            title: '',
            startDate: selectedDate || dayjs().toDate(),
            endDate: selectedDate || dayjs().toDate(),
            description: '',
            isMultiDay: false,
        },
    })

    const isMultiDay = form.watch('isMultiDay')

    // Set default dates when selectedDate changes
    useEffect(() => {
        if (selectedDate) {
            form.setValue('startDate', selectedDate)
            form.setValue('endDate', selectedDate)
        }
    }, [selectedDate, form])

    // Update end date when multi-day is toggled off
    useEffect(() => {
        if (!isMultiDay) {
            const startDate = form.watch('startDate')
            if (startDate) {
                form.setValue('endDate', startDate)
            }
        }
    }, [isMultiDay, form])

    const handleSubmit = async (data: CreateHolidayFormData) => {
        try {
            const holiday = {
                title: data.title,
                startDate: dayjs(data.startDate).toISOString(),
                endDate: dayjs(data.endDate).toISOString(),
                description:
                    data.description || `Public Holiday - ${data.title}`,
            }

            await createHoliday(holiday)
            toast.push(
                <Notification type="success" title="Success">
                    Holiday created successfully
                </Notification>,
            )
            form.reset()
            onSuccess?.()
        } catch {
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create holiday
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
                label="Holiday Title"
                invalid={Boolean(form.formState.errors.title)}
                errorMessage={form.formState.errors.title?.message}
            >
                <Controller
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                        <Input
                            placeholder="e.g., Christmas Day, Independence Day"
                            {...field}
                        />
                    )}
                />
            </FormItem>

            <FormItem>
                <Controller
                    name="isMultiDay"
                    control={form.control}
                    render={({ field }) => (
                        <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                        >
                            Multi-day holiday
                        </Checkbox>
                    )}
                />
            </FormItem>

            <div className={isMultiDay ? 'grid grid-cols-2 gap-4' : ''}>
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

                {isMultiDay && (
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
                )}
            </div>

            <FormItem
                label="Description (Optional)"
                invalid={Boolean(form.formState.errors.description)}
                errorMessage={form.formState.errors.description?.message}
            >
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <Input
                            textArea
                            rows={3}
                            placeholder="Enter holiday description..."
                            {...field}
                        />
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
                    Create Holiday
                </Button>
            </div>
        </Form>
    )
}

export default CreateHolidayForm
