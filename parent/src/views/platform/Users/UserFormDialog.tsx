import { useEffect, useMemo, useState } from 'react'
import { Button, Dialog, Form, FormItem, Input, Notification, Select, Switcher, toast } from '@/components/ui'
import { Controller, useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    apiCreateUser,
    apiGetAgencies,
    apiGetRoles,
    apiUpdateUser,
} from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import type {
    PlatformAgency,
    PlatformRole,
    PlatformUser,
    UserPayload,
} from '@/@types/platform'

const schema = z.object({
    agency_id: z.coerce.number().int().positive('Agency is required'),
    role_id: z.coerce.number().int().positive('Role is required'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    password: z.string().optional(),
    is_active: z.boolean(),
})

type UserFormSchema = z.infer<typeof schema>

type UserFormDialogProps = {
    isOpen: boolean
    user: PlatformUser | null
    defaultAgencyId?: number | null
    onClose: () => void
    onSaved: () => void
}

const emptyValues: UserFormSchema = {
    agency_id: 0,
    role_id: 0,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    is_active: true,
}

const UserFormDialog = ({
    isOpen,
    user,
    defaultAgencyId,
    onClose,
    onSaved,
}: UserFormDialogProps) => {
    const isCreate = !user
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [agencies, setAgencies] = useState<PlatformAgency[]>([])
    const [roles, setRoles] = useState<PlatformRole[]>([])

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<UserFormSchema>({
        // Numbers are coerced by zod, so the schema's input and output types
        // differ; the form works with the parsed (output) shape.
        resolver: zodResolver(schema) as unknown as Resolver<UserFormSchema>,
        defaultValues: emptyValues,
    })

    useEffect(() => {
        if (!isOpen) {
            return
        }

        if (user) {
            reset({
                agency_id: user.agency.id ?? 0,
                role_id: user.role.id ?? 0,
                first_name: user.first_name ?? '',
                last_name: user.last_name ?? '',
                email: user.email,
                phone: user.phone ?? '',
                password: '',
                is_active: user.is_active,
            })
        } else {
            reset({ ...emptyValues, agency_id: defaultAgencyId ?? 0 })
        }
    }, [isOpen, user, defaultAgencyId, reset])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        apiGetAgencies({ per_page: 100 })
            .then((response) => setAgencies(response.data))
            .catch(() => setAgencies([]))

        apiGetRoles()
            .then((response) => setRoles(response))
            .catch(() => setRoles([]))
    }, [isOpen])

    const agencyOptions = useMemo(
        () =>
            agencies.map((agency) => ({
                value: agency.id,
                label: agency.name,
            })),
        [agencies],
    )

    const roleOptions = useMemo(
        () =>
            roles
                .filter((role) => role.is_active)
                .map((role) => ({ value: role.id, label: role.name })),
        [roles],
    )

    const onSubmit = async (values: UserFormSchema) => {
        if (isCreate && (!values.password || values.password.length < 8)) {
            setError('password', {
                message: 'Password must be at least 8 characters',
            })
            return
        }

        setIsSubmitting(true)

        const payload: UserPayload = {
            agency_id: values.agency_id,
            role_id: values.role_id,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone: values.phone || null,
            is_active: values.is_active,
        }

        if (values.password) {
            payload.password = values.password
        }

        try {
            if (user) {
                await apiUpdateUser(user.id, payload)
                toast.push(
                    <Notification type="success" title="User updated" />,
                )
            } else {
                await apiCreateUser(payload)
                toast.push(
                    <Notification type="success" title="User created" />,
                )
            }
            onSaved()
            onClose()
        } catch (error) {
            toast.push(
                <Notification type="danger">{apiErrorMessage(error)}</Notification>,
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={640}
            closable={!isSubmitting}
            shouldCloseOnOverlayClick={!isSubmitting}
            shouldCloseOnEsc={!isSubmitting}
        >
            <div className="max-h-[80vh] overflow-y-auto pr-1">
                <h5 className="mb-6 heading-text">
                    {isCreate ? 'Create user' : `Edit ${user?.full_name}`}
                </h5>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormItem
                            label="Agency"
                            asterisk
                            invalid={Boolean(errors.agency_id)}
                            errorMessage={errors.agency_id?.message}
                        >
                            <Controller
                                name="agency_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isSearchable
                                        isDisabled={isSubmitting}
                                        placeholder="Select agency"
                                        options={agencyOptions}
                                        value={
                                            agencyOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) ?? null
                                        }
                                        onChange={(option) =>
                                            field.onChange(
                                                option?.value ?? 0,
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Role"
                            asterisk
                            invalid={Boolean(errors.role_id)}
                            errorMessage={errors.role_id?.message}
                        >
                            <Controller
                                name="role_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isSearchable
                                        isDisabled={isSubmitting}
                                        placeholder="Select role"
                                        options={roleOptions}
                                        value={
                                            roleOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) ?? null
                                        }
                                        onChange={(option) =>
                                            field.onChange(
                                                option?.value ?? 0,
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="First name"
                            asterisk
                            invalid={Boolean(errors.first_name)}
                            errorMessage={errors.first_name?.message}
                        >
                            <Controller
                                name="first_name"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} disabled={isSubmitting} />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Last name"
                            asterisk
                            invalid={Boolean(errors.last_name)}
                            errorMessage={errors.last_name?.message}
                        >
                            <Controller
                                name="last_name"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} disabled={isSubmitting} />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Email"
                            asterisk
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} disabled={isSubmitting} />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Phone">
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} disabled={isSubmitting} />
                                )}
                            />
                        </FormItem>
                    </div>

                    <FormItem
                        label={
                            isCreate ? 'Password' : 'New password (optional)'
                        }
                        asterisk={isCreate}
                        invalid={Boolean(errors.password)}
                        errorMessage={errors.password?.message}
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder={
                                        isCreate
                                            ? 'At least 8 characters'
                                            : 'Leave blank to keep current'
                                    }
                                    disabled={isSubmitting}
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
                                    onChange={(checked) =>
                                        field.onChange(checked)
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isSubmitting}
                        >
                            {isCreate ? 'Create user' : 'Save changes'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default UserFormDialog
