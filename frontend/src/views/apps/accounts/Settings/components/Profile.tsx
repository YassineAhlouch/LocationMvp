import { useCallback, useEffect, useMemo, useState } from 'react'
import { Form } from '@/components/ui/Form'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import FormFieldWrapper from './FormFieldWrapper'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { useSessionUser } from '@/store/authStore'
import {
    apiGetProfile,
    apiUpdateProfile,
    apiUploadAvatar,
} from '@/services/AccountService'
import { PROFILE_SWR_KEY } from '@/constants/account.constant'
import acronym from '@/utils/acronym'
import useTranslation from '@/utils/hooks/useTranslation'
import { Controller, useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import type { User } from '@/@types/auth'

type ProfileFormValues = {
    first_name: string
    last_name: string
    email: string
    phone: string
}

const AVATAR_SIZE = 64
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']

type ApiError = { response?: { data?: { message?: string } } }

/**
 * The signed-in staff member's own details. Reads and writes the real
 * /v1/profile endpoint; the session store is refreshed from every response so
 * the header avatar and name follow the form immediately.
 */
const Profile = () => {
    const { t } = useTranslation()
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser)

    const [saving, setSaving] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)

    const { data, mutate } = useSWR(PROFILE_SWR_KEY, apiGetProfile, {
        revalidateOnFocus: false,
    })

    const current = data ?? user

    const schema = useMemo(
        () =>
            z.object({
                first_name: z
                    .string()
                    .min(
                        1,
                        t(
                            'settings.profile.validation.firstNameRequired',
                            'First name is required',
                        ),
                    ),
                last_name: z
                    .string()
                    .min(
                        1,
                        t(
                            'settings.profile.validation.lastNameRequired',
                            'Last name is required',
                        ),
                    ),
                email: z
                    .string()
                    .min(
                        1,
                        t(
                            'settings.profile.validation.emailRequired',
                            'Email is required',
                        ),
                    )
                    .email(
                        t(
                            'settings.profile.validation.emailInvalid',
                            'Enter a valid email address',
                        ),
                    ),
                phone: z.string(),
            }),
        [t],
    )

    const toFormValues = useCallback((source: User): ProfileFormValues => ({
        first_name: source.first_name ?? '',
        last_name: source.last_name ?? '',
        email: source.email ?? '',
        phone: source.phone ?? '',
    }), [])

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        defaultValues: toFormValues(user),
        resolver: zodResolver(schema) as unknown as Resolver<ProfileFormValues>,
    })

    // Re-seed the form and the store whenever the server confirms the record
    // — on first load, or after a save made on another device.
    useEffect(() => {
        if (data) {
            reset(toFormValues(data))
            setUser({
                ...data,
                userName: data.full_name || data.userName,
                email: data.email,
            })
        }
    }, [data, reset, setUser, toFormValues])

    const refresh = async (updated: User) => {
        setUser({
            ...updated,
            userName: updated.full_name || updated.userName,
            email: updated.email,
        })
        await mutate(updated, { revalidate: false })
    }

    const beforeUpload = (files: FileList | null) => {
        if (files) {
            for (const file of files) {
                if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
                    return t(
                        'settings.profile.avatarType',
                        'Upload a JPEG, PNG or WebP image.',
                    )
                }
            }
        }

        return true
    }

    const handleAvatarUpload = async (file: File) => {
        setUploadingAvatar(true)

        try {
            const updated = await apiUploadAvatar(file)
            await refresh(updated)
            toast.push(
                <Notification
                    type="success"
                    title={t('settings.profile.avatarUpdated', 'Photo updated')}
                />,
            )
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title={t(
                        'settings.profile.avatarFailed',
                        'Could not upload the photo',
                    )}
                />,
            )
        } finally {
            setUploadingAvatar(false)
        }
    }

    const handleFormSubmit = async (values: ProfileFormValues) => {
        setSaving(true)

        try {
            const updated = await apiUpdateProfile({
                first_name: values.first_name.trim(),
                last_name: values.last_name.trim(),
                email: values.email.trim(),
                phone: values.phone.trim() || null,
            })
            await refresh(updated)
            toast.push(
                <Notification
                    type="success"
                    title={t('settings.profile.updated', 'Profile updated')}
                />,
            )
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={
                        (error as ApiError)?.response?.data?.message ||
                        t(
                            'settings.profile.updateFailed',
                            'Could not update your profile',
                        )
                    }
                />,
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="space-y-4">
                <div className="py-4">
                    <div className="mb-4">
                        <h5>{t('settings.profile.title', 'Basic information')}</h5>
                        <p>
                            {t(
                                'settings.profile.description',
                                'Edit your name, email and contact details.',
                            )}
                        </p>
                    </div>
                    <div>
                        <FormFieldWrapper
                            label={t('settings.profile.avatar', 'Photo')}
                            description={t(
                                'settings.profile.avatarHint',
                                'JPEG, PNG or WebP, up to 4 MB.',
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <Avatar
                                    size={AVATAR_SIZE}
                                    shape="circle"
                                    src={current.avatar ?? undefined}
                                    alt={current.full_name ?? ''}
                                >
                                    {acronym(
                                        current.full_name ??
                                            current.userName ??
                                            '',
                                    )}
                                </Avatar>
                                <Upload
                                    showList={false}
                                    uploadLimit={1}
                                    accept="image/jpeg,image/png,image/webp"
                                    disabled={uploadingAvatar}
                                    beforeUpload={beforeUpload}
                                    onChange={(file) =>
                                        handleAvatarUpload(file)
                                    }
                                >
                                    <Button
                                        type="button"
                                        loading={uploadingAvatar}
                                    >
                                        {t(
                                            'settings.profile.uploadAvatar',
                                            'Upload photo',
                                        )}
                                    </Button>
                                </Upload>
                            </div>
                        </FormFieldWrapper>
                        <FormFieldWrapper
                            label={t('settings.profile.firstName', 'First name')}
                            error={errors.first_name?.message}
                        >
                            <Controller
                                name="first_name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder={t(
                                            'settings.profile.placeholderFirstName',
                                            'Yassine',
                                        )}
                                        {...field}
                                    />
                                )}
                            />
                        </FormFieldWrapper>
                        <FormFieldWrapper
                            label={t('settings.profile.lastName', 'Last name')}
                            error={errors.last_name?.message}
                        >
                            <Controller
                                name="last_name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder={t(
                                            'settings.profile.placeholderLastName',
                                            'Ahlouch',
                                        )}
                                        {...field}
                                    />
                                )}
                            />
                        </FormFieldWrapper>
                        <FormFieldWrapper
                            label={t('settings.profile.email', 'Email')}
                            error={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        placeholder={t(
                                            'settings.profile.placeholderEmail',
                                            'staff@location.ma',
                                        )}
                                        {...field}
                                    />
                                )}
                            />
                        </FormFieldWrapper>
                        <FormFieldWrapper
                            label={t('settings.profile.phone', 'Phone')}
                            error={errors.phone?.message}
                        >
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder={t(
                                            'settings.profile.placeholderPhone',
                                            '+212 6 00 00 00 00',
                                        )}
                                        {...field}
                                    />
                                )}
                            />
                        </FormFieldWrapper>
                    </div>
                </div>
                <div className="py-4 flex items-center justify-end gap-2">
                    <Button
                        type="button"
                        disabled={saving}
                        onClick={() => reset(toFormValues(current))}
                    >
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button type="submit" variant="solid" loading={saving}>
                        {t('common.save', 'Save')}
                    </Button>
                </div>
            </div>
        </Form>
    )
}

export default Profile
