import type { ReactNode } from 'react'
import { FormItem } from '@/components/ui/Form'
import classNames from '@/utils/classNames'

interface FormFieldWrapperProps {
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
        </FormItem>
    )
}

export default FormFieldWrapper
