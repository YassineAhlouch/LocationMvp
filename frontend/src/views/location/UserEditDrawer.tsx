import { useEffect, useMemo, useState } from 'react'
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
import useTranslation from '@/utils/hooks/useTranslation'
import type { Translator } from './shared'

type UserEditValues = {
    first_name: string
    last_name: string
    email: string
    phone?: string
    role_id?: number
    is_active: boolean
    password: string
}

const userEditSchema = (t: Translator) =>
    z.object({
        first_name: z
            .string()
            .min(
                1,
                t(
                    'users.form.validation.firstNameRequired',
                    'First name is required',
                ),
            ),
        last_name: z
            .string()
            .min(
                1,
                t(
                    'users.form.validation.lastNameRequired',
                    'Last name is required',
                ),
            ),
        email: z
            .string()
            .min(
                1,
                t('users.form.validation.emailRequired', 'Email is required'),
            )
            .email(t('users.form.validation.emailInvalid', 'Invalid email')),
        phone: z.string().optional(),
        role_id: z.number({
            message: t('users.form.validation.roleRequired', 'Role is required'),
        }),
        is_active: z.boolean(),
        password: z
            .string()
            .optional()
            .refine(
                (value) => !value || value.length >= 8,
                t(
                    'users.form.validation.passwordMin',
                    'Password must be at least 8 characters',
                ),
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
    const { t } = useTranslation()
    const { smaller } = useResponsive()
    const [roles, setRoles] = useState<{ value: number; label: string }[]>([])
    const [submitting, setSubmitting] = useState(false)

    const schema = useMemo(() => userEditSchema(t), [t])

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
        resolver: zodResolver(schema) as unknown as Resolver<UserEditValues>,
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
                    title={t(
                        'users.form.toast.updated',
                        'User updated successfully!',
                    )}
                />,
            )
            reset()
            onClose()
            onSaved()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title={t('users.form.toast.error', 'Something went wrong')}
                />,
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
            title={t('users.form.editTitle', 'Edit User: {{name}}', {
                name: user?.full_name || '',
            })}
            width={smaller.sm ? 350 : 400}
            footer={
                <div className="flex w-full items-center justify-end gap-2">
                    <Button onClick={handleClose} disabled={submitting}>
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button
                        variant="solid"
                        type="submit"
                        loading={submitting}
                        onClick={handleSubmit(handleFormSubmit)}
                    >
                        {t('users.form.update', 'Update')}
                    </Button>
                </div>
            }
        >
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <FormItem
                    label={t('users.form.firstName', 'First name')}
                    invalid={Boolean(errors.first_name)}
                    errorMessage={errors.first_name?.message}
                >
                    <Controller
                        name="first_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t(
                                    'users.form.placeholderFirstName',
                                    'Yasmine',
                                )}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('users.form.lastName', 'Last name')}
                    invalid={Boolean(errors.last_name)}
                    errorMessage={errors.last_name?.message}
                >
                    <Controller
                        name="last_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t(
                                    'users.form.placeholderLastName',
                                    'Benali',
                                )}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('users.form.email', 'Email')}
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder={t(
                                    'users.form.placeholderEmail',
                                    'staff@location.ma',
                                )}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label={t('users.form.phone', 'Phone')}>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t(
                                    'users.form.placeholderPhone',
                                    '+212 6 00 00 00 00',
                                )}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('users.form.role', 'Role')}
                    invalid={Boolean(errors.role_id)}
                    errorMessage={errors.role_id?.message}
                >
                    <Controller
                        name="role_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t(
                                    'users.form.placeholderRole',
                                    'Select role',
                                )}
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
                <FormItem label={t('users.form.active', 'Active')}>
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
                    label={t('users.form.newPassword', 'New password')}
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                placeholder={t(
                                    'users.form.placeholderNewPassword',
                                    'Leave blank to keep current',
                                )}
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
