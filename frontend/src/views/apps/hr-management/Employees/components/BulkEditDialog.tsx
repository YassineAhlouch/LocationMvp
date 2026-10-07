import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Radio from '@/components/ui/Radio'
import { Form, FormItem } from '@/components/ui/Form'
import { useEmployeeStore } from '../store/employeeStore'
import useEmployeeData from '../hooks/useEmployeeData'
import { statusOptions } from '../utils'
import sleep from '@/utils/sleep'

const bulkEditSchema = z.object({
    status: z.enum(['active', 'inactive', 'terminated']),
})

type BulkEditFormData = z.infer<typeof bulkEditSchema>

const BulkEditDialog = () => {
    const { selectedEmployees, clearSelection, showBulkEdit, closeBulkEdit } =
        useEmployeeStore()
    const { bulkUpdateEmployees } = useEmployeeData()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BulkEditFormData>({
        resolver: zodResolver(bulkEditSchema),
        defaultValues: {
            status: 'active',
        },
    })

    const handleFormSubmit = async (data: BulkEditFormData) => {
        setIsSubmitting(true)
        await sleep(500)
        bulkUpdateEmployees(selectedEmployees, data.status)
        clearSelection()
        reset()
        closeBulkEdit()
        setIsSubmitting(false)
    }

    const handleClose = () => {
        reset()
        closeBulkEdit()
    }

    return (
        <Dialog isOpen={showBulkEdit} onClose={closeBulkEdit}>
            <div>
                <h5>Edit Employee Status</h5>
                <p className="text-sm mb-4">
                    Update status for {selectedEmployees.length} selected
                    employee{selectedEmployees.length > 1 ? 's' : ''}
                </p>

                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormItem
                        invalid={Boolean(errors.status)}
                        errorMessage={errors.status?.message}
                    >
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <div className="mt-2">
                                    <Radio.Group
                                        vertical
                                        value={field.value}
                                        onChange={field.onChange}
                                    >
                                        {statusOptions.map((option) => (
                                            <Radio
                                                className="items-start"
                                                key={option.value}
                                                value={option.value}
                                            >
                                                <div className="-mt-0.5">
                                                    <div className="font-medium heading-text">
                                                        {option.label}
                                                    </div>
                                                    <p className="mt-1 font-normal">
                                                        {option.description}
                                                    </p>
                                                </div>
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </div>
                            )}
                        />
                    </FormItem>
                </Form>
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    variant="solid"
                    loading={isSubmitting}
                    onClick={handleSubmit(handleFormSubmit)}
                >
                    Update Status
                </Button>
            </div>
        </Dialog>
    )
}

export default BulkEditDialog
