import type { ReactNode } from 'react'
import { FormItem } from '@/components/ui/Form'
import classNames from '@/utils/classNames'

type FormFieldWrapperProps = {
    label?: string | ReactNode
    error?: string
    required?: boolean
    description?: string
    children: ReactNode
    className?: string
}

const FormFieldWrapper = ({
    label,
    error,
    required = false,
    description,
    children,
    className,
}: FormFieldWrapperProps) => {
    return (
        <FormItem
            label={label}
            invalid={Boolean(error)}
            errorMessage={error}
            className={classNames(className)}
            asterisk={required}
        >
            {children}
            {description && !error && (
                <p className="mt-1 text-xs">{description}</p>
            )}
        </FormItem>
    )
}

export default FormFieldWrapper
