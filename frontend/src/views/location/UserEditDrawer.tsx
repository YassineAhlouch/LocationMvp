import { useEffect, useState } from 'react'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import { Form, FormItem } from '@/components/ui/Form'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { Controller, useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { apiUpdateUser, apiGetRoles } from '@/services/LocationService'
import type { Role, StaffUser, StaffUserPayload } from '@/@types/location'
import useResponsive from '@/utils/hooks/useResponsive'

type UserEditValues = {
    first_name: string
    last_name: string
    email: string
    phone?: string
    role_id?: number
    is_active: boolean
    password: string
}

const userEditSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    phone: z.string().optional(),
    role_id: z.number({ message: 'Role is required' }),
    is_active: z.boolean(),
    password: z
        .string()
        .optional()
        .refine(
            (value) => !value || value.length >= 8,
            'Password must be at least 8 characters',
        ),
})

type UserEditDrawerProps = {
    isOpen: boolean
    onClose: () => void
    user: StaffUser | null
    onSaved: () => void
}

const UserEditDrawer = ({
    isOpen,
    onClose,
    user,
    onSaved,
}: UserEditDrawerProps) => {
    const { smaller } = useResponsive()
    const [roles, setRoles] = useState<{ value: number; label: string }[]>([])
    const [submitting, setSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserEditValues>({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            role_id: undefined,
            is_active: true,
            password: '',
        },
        resolver: zodResolver(
            userEditSchema,
        ) as unknown as Resolver<UserEditValues>,
    })

    useEffect(() => {
        apiGetRoles({ per_page: 100 })
            .then((res) =>
                setRoles(
                    res.data
                        .filter((role: Role) => role.is_active)
                        .map((role: Role) => ({
                            value: role.id,
                            label: role.name,
                        })),
                ),
            )
            .catch(() => setRoles([]))
    }, [])

    useEffect(() => {
        if (user) {
            reset({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone ?? '',
                role_id: user.role?.id,
                is_active: user.is_active,
                password: '',
            })
        }
    }, [user, reset])

    const handleFormSubmit = async (values: UserEditValues) => {
        if (!user) {
            return
        }
        setSubmitting(true)
        const payload: StaffUserPayload = {
            first_name: values.first_name.trim(),
            last_name: values.last_name.trim(),
            email: values.email.trim(),
            phone: values.phone?.trim() || null,
            role_id: values.role_id as number,
            is_active: values.is_active,
        }
        if (values.password) {
            payload.password = values.password
        }
        try {
            await apiUpdateUser(user.id, payload)
            toast.push(
                <Notification
                    type="success"
                    title="User updated successfully!"
                />,
            )
            reset()
            onClose()
            onSaved()
        } catch {
            toast.push(
                <Notification type="danger" title="Something went wrong" />,
            )
        } finally {
            setSubmitting(false)
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
            title={`Edit User: ${user?.full_name || ''}`}
            width={smaller.sm ? 350 : 400}
            footer={
                <div className="flex w-full items-center justify-end gap-2">
                    <Button onClick={handleClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        type="submit"
                        loading={submitting}
                        onClick={handleSubmit(handleFormSubmit)}
                    >
                        Update
                    </Button>
                </div>
            }
        >
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <FormItem
                    label="First name"
                    invalid={Boolean(errors.first_name)}
                    errorMessage={errors.first_name?.message}
                >
                    <Controller
                        name="first_name"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Yasmine" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Last name"
                    invalid={Boolean(errors.last_name)}
                    errorMessage={errors.last_name?.message}
                >
                    <Controller
                        name="last_name"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Benali" {...field} />
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
                                type="email"
                                placeholder="staff@location.ma"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Phone">
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="+212 6 00 00 00 00"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Role"
                    invalid={Boolean(errors.role_id)}
                    errorMessage={errors.role_id?.message}
                >
                    <Controller
                        name="role_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select role"
                                options={roles}
                                value={roles.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Active">
                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                            <Switcher
                                checked={field.value}
                                onChange={(checked) => field.onChange(checked)}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="New password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                placeholder="Leave blank to keep current"
                                autoComplete="new-password"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </Form>
        </Drawer>
    )
}

export default UserEditDrawer
