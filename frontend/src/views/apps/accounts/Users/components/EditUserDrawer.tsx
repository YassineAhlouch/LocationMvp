import { useEffect } from 'react'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { FormItem, Form } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import sleep from '@/utils/sleep'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import { getStatusColor } from '../utils'
import classNames from '@/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { User } from '../types'

const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'auditor', label: 'Auditor' },
    { value: 'user', label: 'User' },
    { value: 'guest', label: 'Guest' },
    { value: 'support', label: 'Support' },
    { value: 'developer', label: 'Developer' },
    { value: 'compliance', label: 'Compliance' },
]

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

// Validation schema
const validationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email format'),
    status: z.string().min(1, 'Status is required'),
    role: z.array(z.string()).min(1, 'At least one role is required'),
})

type FormSchema = z.infer<typeof validationSchema>

type EditUserDrawerProps = {
    isOpen: boolean
    onClose: () => void
    user: User | null
    onSave: (userId: string, data: Partial<User>) => Promise<void>
    loading?: boolean
}

const EditUserDrawer = ({
    isOpen,
    onClose,
    user,
    onSave,
    loading = false,
}: EditUserDrawerProps) => {
    const { smaller } = useResponsive()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormSchema>({
        defaultValues: {
            name: '',
            email: '',
            status: 'active',
            role: [],
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                status: user.status,
                role: user.role,
            })
        }
    }, [user, reset])

    const handleFormSubmit = async (data: FormSchema) => {
        if (!user) return
        await sleep(500)
        onSave(user.id, data)
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleClose}
            title={`Edit User: ${user?.name || ''}`}
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
                        Update
                    </Button>
                </div>
            }
        >
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <FormItem
                    label="Full Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Enter full name" />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Email"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
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
                    label="Status"
                    invalid={Boolean(errors.status)}
                    errorMessage={errors.status?.message}
                >
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={statusOptions}
                                value={statusOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                                placeholder="Select status"
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
                                            <Badge
                                                className={classNames(
                                                    'w-3 h-3 rounded-full',
                                                    option.color,
                                                )}
                                            />
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
                    label="Roles"
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
            </Form>
        </Drawer>
    )
}

export default EditUserDrawer
