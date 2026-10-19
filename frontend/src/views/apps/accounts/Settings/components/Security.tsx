import { useState } from 'react'
import Button from '@/components/ui/Button'
import FormFieldWrapper from './FormFieldWrapper'
import PasswordChangeModal from './PasswordChangeModal'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { apiUpdateProfilePassword } from '@/services/AccountService'
import useTranslation from '@/utils/hooks/useTranslation'

type ApiError = { response?: { data?: { message?: string } } }

/**
 * Account security for the signed-in staff member: today that is password
 * rotation, verified against the current password server-side. Two-factor
 * auth and device management are intentionally absent — they are not backed
 * by anything in the API.
 */
const Security = () => {
    const { t } = useTranslation()
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handlePasswordChange = async (data: {
        currentPassword: string
        newPassword: string
        confirmPassword: string
    }) => {
        setIsSubmitting(true)

        try {
            await apiUpdateProfilePassword({
                current_password: data.currentPassword,
                password: data.newPassword,
                password_confirmation: data.confirmPassword,
            })
            toast.push(
                <Notification
                    type="success"
                    title={t(
                        'settings.security.updated',
                        'Password updated',
                    )}
                />,
            )

            return true
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={
                        (error as ApiError)?.response?.data?.message ||
                        t(
                            'settings.security.updateFailed',
                            'Could not update the password',
                        )
                    }
                />,
            )

            // Keep the modal open so the fields are not lost on a failed save.
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className="space-y-4">
                <div className="py-4">
                    <div className="mb-4">
                        <h5>{t('settings.security.title', 'Account security')}</h5>
                        <p>
                            {t(
                                'settings.security.description',
                                'Update your password to keep your account secure.',
                            )}
                        </p>
                    </div>
                    <FormFieldWrapper
                        label={t('settings.security.password', 'Password')}
                        description={t(
                            'settings.security.passwordHint',
                            'Use at least 8 characters.',
                        )}
                        border={false}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div
                                className="heading-text font-mono tracking-wider"
                                aria-hidden="true"
                            >
                                ••••••••••••••••
                            </div>
                            <Button
                                type="button"
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="self-start sm:self-center"
                            >
                                {t(
                                    'settings.security.changePassword',
                                    'Change password',
                                )}
                            </Button>
                        </div>
                    </FormFieldWrapper>
                </div>
            </div>
            <PasswordChangeModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                isSubmitting={isSubmitting}
                onSubmit={handlePasswordChange}
            />
        </>
    )
}

export default Security
