import type { ReactNode } from 'react'
import { FormItem } from '@/components/ui/Form'
import classNames from '@/utils/classNames'

interface FormFieldWrapperProps {
    label?: string | ReactNode
    error?: string
    required?: boolean
    description?: string | ReactNode
    children: ReactNode
    className?: string
    formItemClass?: string
    labelClass?: string
    border?: boolean
}

const FormFieldWrapper = ({
    label,
    error,
    required = false,
    description,
    children,
    className,
    formItemClass,
    labelClass,
    border = true,
}: FormFieldWrapperProps) => {
    return (
        <div
            className={classNames(
                'flex flex-col gap-3 py-4',
                'sm:py-5',
                'md:grid md:grid-cols-3 md:gap-6 md:py-6 md:items-start',
                border && 'border-b border-gray-200 dark:border-gray-800',
                className,
            )}
        >
            <div className={labelClass}>
                <div
                    className={classNames(
                        'heading-text font-medium',
                        description ? 'text-base' : '',
                    )}
                >
                    {label}
                </div>
                {description && <div className="mt-1">{description}</div>}
            </div>
            <div className="md:col-span-2">
                <FormItem
                    invalid={Boolean(error)}
                    errorMessage={error}
                    className={classNames(
                        'mb-0 max-w-full md:max-w-[700px]',
                        formItemClass,
                    )}
                    asterisk={required}
                >
                    {children}
                </FormItem>
            </div>
        </div>
    )
}

export default FormFieldWrapper
