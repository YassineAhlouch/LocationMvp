import { useEffect } from 'react'
import Alert from '@/components/ui/Alert'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { FormItem, Form } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import toast from '@/components/ui/toast'
import SelectedUsersList from './SelectedUsersList'
import sleep from '@/utils/sleep'
import Notification from '@/components/ui/Notification'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import { getStatusColor, roleOptions } from '../utils'
import classNames from '@/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { User } from '../types'

const statusOptions = [
    {
        value: 'active',
        label: 'Active',
        color: getStatusColor('active'),
    },
    {
        value: 'inactive',
        label: 'Inactive',
        color: getStatusColor('inactive'),
        disabled: true,
    },
    {
        value: 'suspended',
        label: 'Suspended',
        color: getStatusColor('suspended'),
    },
]

// Validation schema - only status and roles for bulk edit
const validationSchema = z.object({
    status: z.string().optional(),
    role: z.array(z.string()).optional(),
})

type FormSchema = z.infer<typeof validationSchema>

type BulkEditUserDrawerProps = {
    isOpen: boolean
    onClose: () => void
    users: User[]
    onSave: (data: Partial<User>) => Promise<void>
    loading?: boolean
}

const BulkEditUserDrawer = ({
    isOpen,
    onClose,
    users,
    onSave,
    loading = false,
}: BulkEditUserDrawerProps) => {
    const { smaller } = useResponsive()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormSchema>({
        defaultValues: {
            status: '',
            role: [],
        },
        resolver: zodResolver(validationSchema),
    })

    // Reset form when drawer opens
    useEffect(() => {
        if (isOpen) {
            reset({
                status: '',
                role: [],
            })
        }
    }, [isOpen, reset])

    const handleFormSubmit = async (data: FormSchema) => {
        try {
            const updateData: Partial<User> = {}
            if (data.status && data.status !== '') {
                updateData.status = data.status
            }
            if (data.role && data.role.length > 0) {
                updateData.role = data.role
            }

            if (Object.keys(updateData).length === 0) {
                toast.push(
                    <Notification type="warning" title="No Changes">
                        Please select at least one field to update.
                    </Notification>,
                )
                return
            }

            await sleep(500)
            await onSave(updateData)

            toast.push(
                <Notification type="success" title="Users Updated">
                    {users.length} user{users.length > 1 ? 's' : ''} updated
                    successfully.
                </Notification>,
            )
            onClose()
        } catch (error) {
            console.error('Failed to update users:', error)
            toast.push(
                <Notification type="danger" title="Update Failed">
                    Failed to update users. Please try again.
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleClose}
            title={`Bulk Edit ${users.length} User${users.length > 1 ? 's' : ''}`}
            width={smaller.sm ? 350 : 400}
            footer={
                <div className="flex items-center justify-end gap-2 w-full">
                    <Button
                        onClick={handleClose}
                        disabled={isSubmitting || loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting || loading}
                        onClick={handleSubmit(handleFormSubmit)}
                    >
                        Update All
                    </Button>
                </div>
            }
        >
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="space-y-4">
                    <div className="heading-text font-medium mb-2">
                        Selected Users ({users.length}):
                    </div>
                    <SelectedUsersList users={users} />
                    <FormItem
                        label="Status (Optional)"
                        invalid={Boolean(errors.status)}
                        errorMessage={errors.status?.message}
                    >
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={[
                                        {
                                            value: '',
                                            label: 'Keep current status',
                                            color: 'bg-gray-400',
                                        },
                                        ...statusOptions,
                                    ]}
                                    value={
                                        statusOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        ) || {
                                            value: '',
                                            label: 'Keep current status',
                                            color: 'bg-gray-400',
                                        }
                                    }
                                    onChange={(option) =>
                                        field.onChange(option?.value || '')
                                    }
                                    placeholder="Select new status"
                                    customInputDisplay={(selectedItem) => (
                                        <SelectInputWithPrefix
                                            label={selectedItem?.label}
                                            prefix={
                                                selectedItem && (
                                                    <Badge
                                                        className={classNames(
                                                            'w-3 h-3 rounded-full',
                                                            selectedItem.color,
                                                        )}
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
                                            label={option.label}
                                            prefix={
                                                option.color && (
                                                    <Badge
                                                        className={classNames(
                                                            'w-3 h-3 rounded-full',
                                                            option.color,
                                                        )}
                                                    />
                                                )
                                            }
                                            selected={selected}
                                            checkIcon={CheckIcon}
                                        />
                                    )}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label={
                            <span className="flex items-center gap-2">
                                Role
                            </span>
                        }
                        invalid={Boolean(errors.role)}
                        errorMessage={errors.role?.message}
                    >
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <Checkbox.Group
                                        vertical
                                        className="w-full gap-0"
                                        value={field.value}
                                        onChange={field.onChange}
                                    >
                                        {roleOptions.map((role) => (
                                            <Checkbox
                                                key={role.value}
                                                value={role.value}
                                                className="flex-row-reverse justify-between hover:text-gray-900 py-1.5"
                                            >
                                                {role.label}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                </div>
                            )}
                        />
                    </FormItem>
                    <Alert type="info" showIcon>
                        <span className="font-medium">Note:</span> Only the
                        fields you modify will be updated. Empty fields will
                        keep current values.
                    </Alert>
                </div>
            </Form>
        </Drawer>
    )
}

export default BulkEditUserDrawer
