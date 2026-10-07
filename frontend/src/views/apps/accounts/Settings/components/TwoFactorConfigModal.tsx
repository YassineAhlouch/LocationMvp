import { useMemo, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Select from '@/components/ui/Select'
import { FormItem, Form } from '@/components/ui/Form'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import IconFrame from '@/components/shared/IconFrame'
import classNames from '@/utils/classNames'
import { countryList } from '@/constants/countries.constant'
import {
    LiShieldLock,
    LiShieldZap,
    LiMessages,
    LiMailDash,
    LiCross,
} from '@/icons'
import { z } from 'zod'
import type { TwoFactorMethod } from '../types'

type TwoFactorConfigModalProps = {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: TwoFactorFormData) => Promise<void>
    currentMethod?: TwoFactorMethod
    isSubmitting?: boolean
}

const twoFactorSchema = z
    .object({
        method: z.enum(['sms', 'app', 'email']),
        phoneNumber: z.string().optional(),
        email: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.method === 'sms' && !data.phoneNumber) {
                return false
            }
            if (data.method === 'email' && !data.email) {
                return false
            }
            return true
        },
        {
            message: 'Phone number is required for SMS method',
            path: ['phoneNumber'],
        },
    )

export type TwoFactorFormData = z.infer<typeof twoFactorSchema>

const methodOptions = [
    {
        value: 'app' as TwoFactorMethod,
        label: 'Authenticator App',
        description:
            'Use an authenticator app like Google Authenticator or Authy',
        icon: <LiShieldZap />,
    },
    {
        value: 'sms' as TwoFactorMethod,
        label: 'SMS',
        description: 'Receive verification codes via text message',
        icon: <LiMessages />,
    },
    {
        value: 'email' as TwoFactorMethod,
        label: 'Email',
        description: 'Receive verification codes via email',
        icon: <LiMailDash />,
    },
]

const TwoFactorConfigModal = ({
    isOpen,
    onClose,
    onSubmit,
    currentMethod,
    isSubmitting = false,
}: TwoFactorConfigModalProps) => {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<TwoFactorFormData>({
        defaultValues: {
            method: currentMethod,
            phoneNumber: '',
            email: '',
        },
        resolver: zodResolver(twoFactorSchema),
    })

    useEffect(() => {
        reset({
            method: currentMethod,
            phoneNumber: '',
            email: '',
        })
    }, [currentMethod, reset])

    const selectedMethod = watch('method')

    const dialCodeList = useMemo(() => {
        return countryList.map((country) => ({
            value: country.dialCode,
            label: country.dialCode,
            img: country.value,
        }))
    }, [])

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleFormSubmit = async (data: TwoFactorFormData) => {
        await onSubmit(data)
        handleClose()
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            className="p-0"
            closable={false}
            aria-labelledby="two-factor-modal-title"
            aria-describedby="two-factor-modal-description"
        >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <IconFrame variant="layered">
                        <LiShieldLock className="text-xl heading-text" />
                    </IconFrame>
                    <div className="min-w-0 flex-1">
                        <h5 className="text-base sm:text-lg font-semibold">
                            Configure 2FA
                        </h5>
                        <p className="hidden sm:block">
                            Choose your preferred 2FA method
                        </p>
                    </div>
                </div>
                <Button
                    variant="subtle"
                    size="sm"
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    icon={<LiCross className="text-lg" />}
                    aria-label="Close two-factor authentication configuration dialog"
                />
            </div>

            <div className="p-3 sm:p-4">
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormItem
                        label="Authentication Method"
                        invalid={Boolean(errors.method)}
                        errorMessage={errors.method?.message}
                    >
                        <Controller
                            name="method"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-y-2">
                                    {methodOptions.map((option) => {
                                        const isSelected =
                                            option.value === selectedMethod
                                        return (
                                            <button
                                                key={option.value}
                                                className={classNames(
                                                    'border border-gray-200 dark:border-gray-700 rounded-lg p-3 transition-colors flex items-center justify-between gap-2 hover:bg-gray-50 dark:hover:bg-gray-800',
                                                    isSelected
                                                        ? 'border-primary dark:border-primary'
                                                        : 'border-gray-200 dark:border-gray-700',
                                                )}
                                                type="button"
                                                onClick={() =>
                                                    field.onChange(option.value)
                                                }
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span>
                                                        <Avatar
                                                            className={classNames(
                                                                isSelected
                                                                    ? 'bg-primary-subtle text-primary'
                                                                    : 'heading-text',
                                                            )}
                                                            icon={
                                                                <span className="text-xl">
                                                                    {
                                                                        option.icon
                                                                    }
                                                                </span>
                                                            }
                                                        />
                                                    </span>
                                                    <span className="flex flex-col items-start">
                                                        <span className="font-medium heading-text">
                                                            {option.label}
                                                        </span>
                                                        <span className="text-xs font-medium">
                                                            {option.description}
                                                        </span>
                                                    </span>
                                                </span>
                                                {isSelected && (
                                                    <span className="rounded-full border-6 border-primary flex">
                                                        <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        />
                    </FormItem>
                    {selectedMethod === 'sms' && (
                        <FormItem
                            label="Phone Number"
                            invalid={Boolean(errors.phoneNumber)}
                            errorMessage={errors.phoneNumber?.message}
                        >
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="w-full sm:w-32">
                                            <Select
                                                options={dialCodeList}
                                                defaultValue={dialCodeList[0]}
                                                placeholder="Code"
                                                isDisabled={isSubmitting}
                                                customInputDisplay={(
                                                    selectedItem,
                                                ) => (
                                                    <SelectInputWithPrefix
                                                        label={
                                                            selectedItem?.label
                                                        }
                                                        showPrefix={Boolean(
                                                            selectedItem?.value,
                                                        )}
                                                        prefix={
                                                            selectedItem && (
                                                                <img
                                                                    src={`/img/countries/${selectedItem?.img}.png`}
                                                                    className="w-5 h-5 rounded-full"
                                                                    alt={
                                                                        selectedItem?.label
                                                                    }
                                                                />
                                                            )
                                                        }
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                type="tel"
                                                placeholder="Enter your phone number"
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </div>
                                    </div>
                                )}
                            />
                        </FormItem>
                    )}
                    {selectedMethod === 'email' && (
                        <FormItem
                            label="Email Address"
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        placeholder="Enter your email address"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    )}
                    {selectedMethod === 'app' && (
                        <div
                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4"
                            role="region"
                            aria-labelledby="setup-instructions-title"
                        >
                            <h6 className="mb-2" id="setup-instructions-title">
                                Setup Instructions
                            </h6>
                            <ol className="space-y-1 list-decimal list-inside">
                                <li>
                                    Download an authenticator app like Google
                                    Authenticator or Authy
                                </li>
                                <li>
                                    Scan the QR code that will be provided after
                                    saving
                                </li>
                                <li>
                                    Enter the 6-digit code from your app to
                                    verify setup
                                </li>
                            </ol>
                        </div>
                    )}

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
                            disabled={currentMethod === selectedMethod}
                        >
                            {currentMethod
                                ? 'Update Method'
                                : 'Enable Two-Factor Auth'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default TwoFactorConfigModal
