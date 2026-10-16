import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { apiCreateUser, apiGetRoles } from '@/services/LocationService'
import type { StaffUserPayload } from '@/@types/location'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import useTranslation from '@/utils/hooks/useTranslation'
import type { Translator } from './shared'

type UserFormValues = {
    first_name: string
    last_name: string
    email: string
    phone?: string
    role_id?: number
    password: string
    password_confirmation: string
    is_active: boolean
}

const userSchema = (t: Translator) =>
    z
        .object({
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
                    t(
                        'users.form.validation.emailRequired',
                        'Email is required',
                    ),
                )
                .email(t('users.form.validation.emailInvalid', 'Invalid email')),
            phone: z.string().optional(),
            role_id: z.number({
                message: t('users.form.validation.roleRequired', 'Role is required'),
            }),
            password: z
                .string()
                .min(
                    8,
                    t(
                        'users.form.validation.passwordMin',
                        'Password must be at least 8 characters',
                    ),
                ),
            password_confirmation: z
                .string()
                .min(
                    1,
                    t(
                        'users.form.validation.passwordConfirmationRequired',
                        'Please confirm the password',
                    ),
                ),
            is_active: z.boolean(),
        })
        .refine((data) => data.password === data.password_confirmation, {
            message: t(
                'users.form.validation.passwordsMismatch',
                'Passwords do not match',
            ),
            path: ['password_confirmation'],
        })

const defaultFormValues: UserFormValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    is_active: true,
}

const AjouterUtilisateur = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const goToListe = () => navigate(`${APPS_PREFIX_PATH}/utilisateurs/liste`)
    const [roles, setRoles] = useState<{ value: number; label: string }[]>([])
    const [submitting, setSubmitting] = useState(false)

    const schema = useMemo(() => userSchema(t), [t])

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(schema) as unknown as Resolver<UserFormValues>,
        defaultValues: defaultFormValues,
    })

    useEffect(() => {
        apiGetRoles({ per_page: 100 })
            .then((res) =>
                setRoles(
                    res.data
                        .filter((role) => role.is_active)
                        .map((role) => ({ value: role.id, label: role.name })),
                ),
            )
            .catch(() => setRoles([]))
    }, [])

    const onSubmit = handleSubmit(async (values) => {
        setSubmitting(true)
        const payload: StaffUserPayload = {
            first_name: values.first_name.trim(),
            last_name: values.last_name.trim(),
            email: values.email.trim(),
            phone: values.phone?.trim() || null,
            password: values.password,
            role_id: values.role_id as number,
            is_active: values.is_active,
        }
        try {
            await apiCreateUser(payload)
            toast.push(
                <Notification
                    type="success"
                    title={t(
                        'users.form.toast.created',
                        'User created successfully!',
                    )}
                />,
            )
            reset(defaultFormValues)
            goToListe()
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
    })

    return (
        <Container className="p-4">
            <Card className="rounded-xl">
                <div className="p-4">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold dark:text-gray-100">
                            {t('users.form.addTitle', 'Add user')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t(
                                'users.form.addSubtitle',
                                'Add a new staff member',
                            )}
                        </p>
                    </div>
                    <Form onSubmit={onSubmit}>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                                (o) => o.value === field.value,
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
                                            onChange={(checked) =>
                                                field.onChange(checked)
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label={t('users.form.password', 'Password')}
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
                                                'users.form.placeholderPasswordMin',
                                                'Min. 8 characters',
                                            )}
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label={t(
                                    'users.form.passwordConfirmation',
                                    'Confirm password',
                                )}
                                invalid={Boolean(errors.password_confirmation)}
                                errorMessage={
                                    errors.password_confirmation?.message
                                }
                            >
                                <Controller
                                    name="password_confirmation"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="password"
                                            placeholder={t(
                                                'users.form.placeholderPasswordRepeat',
                                                'Repeat password',
                                            )}
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={goToListe}
                            >
                                {t('common.cancel', 'Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                loading={submitting}
                            >
                                {t('users.form.create', 'Add user')}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </Container>
    )
}

export default AjouterUtilisateur
