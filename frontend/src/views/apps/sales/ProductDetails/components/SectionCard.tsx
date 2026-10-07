import classNames from '@/utils/classNames'
import type { ComponentProps, ReactNode } from 'react'

type SectionCardProps = ComponentProps<'div'> & {
    title: string
    description?: string
    bordered?: boolean
    extra?: ReactNode | string
}

const SectionCard = ({
    title,
    description,
    children,
    bordered = true,
    extra,
}: SectionCardProps) => {
    return (
        <div
            className={classNames(
                'py-4',
                bordered && 'border-b border-gray-200 dark:border-gray-700',
            )}
        >
            <div className="mb-6 flex items-center justify-between gap-2">
                <div>
                    <h5>{title}</h5>
                    {description && <p>{description}</p>}
                </div>
                {extra}
            </div>
            {children}
        </div>
    )
}

export default SectionCard
