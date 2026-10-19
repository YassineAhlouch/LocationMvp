import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import IconFrame from '@/components/shared/IconFrame'
import useTranslation from '@/utils/hooks/useTranslation'
import { LiLockPassword, LiEye, LiEyeSlash, LiCross } from '@/icons'
import { z } from 'zod'
import type { MouseEvent } from 'react'
import type { SecurityStrength } from '../types'
import type { Translator } from '@/views/location/shared'

interface PasswordChangeModalProps {
    isOpen: boolean
    onClose: () => void
    /** Resolves true when the password changed; false keeps the modal open. */
    onSubmit: (data: PasswordChangeFormData) => Promise<boolean>
    isSubmitting?: boolean
}

const passwordChangeSchema = (t: Translator) =>
    z
        .object({
            currentPassword: z
                .string()
                .min(
                    1,
                    t(
                        'settings.security.validation.currentRequired',
                        'Current password is required',
                    ),
                ),
            newPassword: z
                .string()
                .min(
                    8,
                    t(
                        'settings.security.validation.newMin',
                        'Password must be at least 8 characters',
                    ),
                )
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    t(
                        'settings.security.validation.newComplexity',
                        'Password must contain uppercase, lowercase, number and special character',
                    ),
                ),
            confirmPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: t(
                'settings.security.validation.mismatch',
                "Passwords don't match",
            ),
            path: ['confirmPassword'],
        })

type PasswordChangeFormData = z.infer<ReturnType<typeof passwordChangeSchema>>

const STRENGTH_META: Record<
    SecurityStrength,
    {
        key: string
        fallback: string
        color: string
        bgColor: string
        percent: number
    }
> = {
    weak: {
        key: 'settings.security.strength.weak',
        fallback: 'Weak',
        color: 'text-error',
        bgColor: 'bg-error',
        percent: 25,
    },
    medium: {
        key: 'settings.security.strength.medium',
        fallback: 'Medium',
        color: 'text-warning',
        bgColor: 'bg-warning',
        percent: 50,
    },
    strong: {
        key: 'settings.security.strength.strong',
        fallback: 'Strong',
        color: 'text-success',
        bgColor: 'bg-success',
        percent: 75,
    },
    'very-secure': {
        key: 'settings.security.strength.verySecure',
        fallback: 'Very secure',
        color: 'text-success',
        bgColor: 'bg-success',
        percent: 100,
    },
}

const getPasswordStrength = (password: string): SecurityStrength => {
    if (password.length === 0) {
        return 'weak'
    }

    let score = 0

    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[@$!%*?&]/.test(password)) score++

    if (score <= 2) return 'weak'
    if (score <= 4) return 'medium'
    if (score <= 5) return 'strong'

    return 'very-secure'
}

const PasswordChangeModal = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
}: PasswordChangeModalProps) => {
    const { t } = useTranslation()
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
    const [newPasswordVisible, setNewPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

    const schema = useMemo(() => passwordChangeSchema(t), [t])

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<PasswordChangeFormData>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        resolver: zodResolver(schema),
    })

    const strength = STRENGTH_META[getPasswordStrength(watch('newPassword'))]
    const strengthText = t(strength.key, strength.fallback)

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleFormSubmit = async (data: PasswordChangeFormData) => {
        const success = await onSubmit(data)

        if (success) {
            handleClose()
        }
    }

    const visibilityToggle = (
        visible: boolean,
        onToggle: () => void,
        fieldLabel: string,
    ) => (
        <button
            type="button"
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
                onToggle()
            }}
            aria-label={
                visible
                    ? t('settings.security.hide', 'Hide {{field}}', {
                          field: fieldLabel,
                      })
                    : t('settings.security.show', 'Show {{field}}', {
                          field: fieldLabel,
                      })
            }
        >
            {visible ? <LiEye /> : <LiEyeSlash />}
        </button>
    )

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            className="p-0"
            aria-labelledby="password-change-title"
        >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <IconFrame variant="layered">
                        <LiLockPassword className="text-xl heading-text" />
                    </IconFrame>
                    <div className="min-w-0 flex-1">
                        <h5 id="password-change-title">
                            {t(
                                'settings.security.modal.title',
                                'Change password',
                            )}
                        </h5>
                        <p className="hidden sm:block">
                            {t(
                                'settings.security.modal.description',
                                'Update your password to keep your account secure.',
                            )}
                        </p>
                    </div>
                </div>
                <div>
                    <Button
                        variant="subtle"
                        type="button"
                        size="sm"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        aria-label={t('common.close', 'Close')}
                        icon={
                            <LiCross className="text-lg" aria-hidden="true" />
                        }
                    />
                </div>
            </div>

            <div className="p-3 sm:p-4">
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormItem
                        label={t(
                            'settings.security.modal.currentPassword',
                            'Current password',
                        )}
                        invalid={Boolean(errors.currentPassword)}
                        errorMessage={errors.currentPassword?.message}
                    >
                        <Controller
                            name="currentPassword"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type={
                                        currentPasswordVisible
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder={t(
                                        'settings.security.modal.currentPasswordPlaceholder',
                                        'Enter your current password',
                                    )}
                                    suffix={visibilityToggle(
                                        currentPasswordVisible,
                                        () =>
                                            setCurrentPasswordVisible(
                                                (visible) => !visible,
                                            ),
                                        t(
                                            'settings.security.modal.currentPassword',
                                            'Current password',
                                        ),
                                    )}
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label={t(
                            'settings.security.modal.newPassword',
                            'New password',
                        )}
                        invalid={Boolean(errors.newPassword)}
                        errorMessage={errors.newPassword?.message}
                    >
                        <Controller
                            name="newPassword"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-2">
                                    <Input
                                        type={
                                            newPasswordVisible
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder={t(
                                            'settings.security.modal.newPasswordPlaceholder',
                                            'Enter your new password',
                                        )}
                                        suffix={visibilityToggle(
                                            newPasswordVisible,
                                            () =>
                                                setNewPasswordVisible(
                                                    (visible) => !visible,
                                                ),
                                            t(
                                                'settings.security.modal.newPassword',
                                                'New password',
                                            ),
                                        )}
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                    <div
                                        className="flex items-center gap-2"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        <div
                                            className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1"
                                            role="progressbar"
                                            aria-valuenow={strength.percent}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label={t(
                                                'settings.security.strength.label',
                                                'Password strength',
                                            )}
                                        >
                                            <div
                                                className={`h-1 rounded-full transition-all duration-300 ${strength.bgColor}`}
                                                style={{
                                                    width: `${strength.percent}%`,
                                                }}
                                            />
                                        </div>
                                        <span
                                            className={`text-xs font-medium ${strength.color}`}
                                            aria-hidden="true"
                                        >
                                            {strengthText}
                                        </span>
                                    </div>
                                </div>
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label={t(
                            'settings.security.modal.confirmPassword',
                            'Confirm new password',
                        )}
                        invalid={Boolean(errors.confirmPassword)}
                        errorMessage={errors.confirmPassword?.message}
                    >
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type={
                                        confirmPasswordVisible
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder={t(
                                        'settings.security.modal.confirmPasswordPlaceholder',
                                        'Confirm your new password',
                                    )}
                                    suffix={visibilityToggle(
                                        confirmPasswordVisible,
                                        () =>
                                            setConfirmPasswordVisible(
                                                (visible) => !visible,
                                            ),
                                        t(
                                            'settings.security.modal.confirmPassword',
                                            'Confirm new password',
                                        ),
                                    )}
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                        <Button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            {t(
                                'settings.security.modal.update',
                                'Update password',
                            )}
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default PasswordChangeModal
