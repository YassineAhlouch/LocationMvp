import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import IconFrame from '@/components/shared/IconFrame'
import { LiLockPassword, LiEye, LiEyeSlash, LiCross } from '@/icons'
import { z } from 'zod'
import type { SecurityStrength } from '../types'
import type { MouseEvent } from 'react'

interface PasswordChangeModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: PasswordChangeFormData) => Promise<void>
    isSubmitting?: boolean
}

const passwordChangeSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                'Password must contain uppercase, lowercase, number and special character',
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>

const getPasswordStrength = (password: string): SecurityStrength => {
    if (password.length === 0) return 'weak'

    let score = 0

    // Length check
    if (password.length >= 8) score++
    if (password.length >= 12) score++

    // Character variety checks
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[@$!%*?&]/.test(password)) score++

    if (score <= 2) return 'weak'
    if (score <= 4) return 'medium'
    if (score <= 5) return 'strong'
    return 'very-secure'
}

const getStrengthDisplay = (strength: SecurityStrength) => {
    switch (strength) {
        case 'very-secure':
            return {
                text: 'Very secure',
                color: 'text-success',
                bgColor: 'bg-success',
            }
        case 'strong':
            return {
                text: 'Strong',
                color: 'text-success',
                bgColor: 'bg-success',
            }
        case 'medium':
            return {
                text: 'Medium',
                color: 'text-warning',
                bgColor: 'bg-warning',
            }
        case 'weak':
            return { text: 'Weak', color: 'text-error', bgColor: 'bg-error' }
        default:
            return {
                text: 'Unknown',
                color: 'text-gray-500',
                bgColor: 'bg-gray-500',
            }
    }
}

const PasswordChangeModal = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
}: PasswordChangeModalProps) => {
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
    const [newPasswordVisible, setNewPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

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
        resolver: zodResolver(passwordChangeSchema),
    })

    const newPassword = watch('newPassword')
    const passwordStrength = getPasswordStrength(newPassword)
    const strengthDisplay = getStrengthDisplay(passwordStrength)

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleFormSubmit = async (data: PasswordChangeFormData) => {
        await onSubmit(data)
        handleClose()
    }

    const createPasswordVisibilityToggle = (
        visible: boolean,
        setVisible: (visible: boolean) => void,
        fieldName: string,
    ) => (
        <button
            type="button"
            onClick={(e: MouseEvent) => {
                e.preventDefault()
                setVisible(!visible)
            }}
            aria-label={`${visible ? 'Hide' : 'Show'} ${fieldName}`}
            tabIndex={0}
            className="heading-text text-base"
        >
            {visible ? <LiEye /> : <LiEyeSlash />}
        </button>
    )

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            className="p-0"
            closable={false}
            aria-labelledby="password-modal-title"
            aria-describedby="password-modal-description"
        >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <IconFrame variant="layered">
                        <LiLockPassword className="text-xl heading-text" />
                    </IconFrame>
                    <div className="min-w-0 flex-1">
                        <h5>Change Password</h5>
                        <p className="hidden sm:block">
                            Update password to keep account secure.
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
                        aria-label="Close password change dialog"
                        icon={
                            <LiCross className="text-lg" aria-hidden="true" />
                        }
                    />
                </div>
            </div>

            <div className="p-3 sm:p-4">
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormItem
                        label="Current Password"
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
                                    placeholder="Enter your current password"
                                    suffix={createPasswordVisibilityToggle(
                                        currentPasswordVisible,
                                        setCurrentPasswordVisible,
                                        'current password',
                                    )}
                                    disabled={isSubmitting}
                                    aria-describedby="current-password-help"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="New Password"
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
                                        placeholder="Enter your new password"
                                        suffix={createPasswordVisibilityToggle(
                                            newPasswordVisible,
                                            setNewPasswordVisible,
                                            'new password',
                                        )}
                                        disabled={isSubmitting}
                                        aria-describedby="new-password-help password-strength"
                                        {...field}
                                    />
                                    {newPassword && (
                                        <div
                                            className="flex items-center gap-2"
                                            role="status"
                                            aria-live="polite"
                                            aria-label={`Password strength: ${strengthDisplay.text}`}
                                        >
                                            <div
                                                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1"
                                                role="progressbar"
                                                aria-valuenow={
                                                    passwordStrength === 'weak'
                                                        ? 25
                                                        : passwordStrength ===
                                                            'medium'
                                                          ? 50
                                                          : passwordStrength ===
                                                              'strong'
                                                            ? 75
                                                            : 100
                                                }
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                aria-label="Password strength indicator"
                                                id="password-strength"
                                            >
                                                <div
                                                    className={`h-1 rounded-full transition-all duration-300 ${strengthDisplay.bgColor}`}
                                                    style={{
                                                        width:
                                                            passwordStrength ===
                                                            'weak'
                                                                ? '25%'
                                                                : passwordStrength ===
                                                                    'medium'
                                                                  ? '50%'
                                                                  : passwordStrength ===
                                                                      'strong'
                                                                    ? '75%'
                                                                    : '100%',
                                                    }}
                                                />
                                            </div>
                                            <span
                                                className={`text-xs font-medium ${strengthDisplay.color}`}
                                                aria-hidden="true"
                                            >
                                                {strengthDisplay.text}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Confirm New Password"
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
                                    placeholder="Confirm your new password"
                                    suffix={createPasswordVisibilityToggle(
                                        confirmPasswordVisible,
                                        setConfirmPasswordVisible,
                                        'confirm password',
                                    )}
                                    disabled={isSubmitting}
                                    aria-describedby="confirm-password-help"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                        <Button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            Update Password
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default PasswordChangeModal
