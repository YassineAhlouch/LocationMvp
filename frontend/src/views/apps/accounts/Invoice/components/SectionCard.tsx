import classNames from '@/utils/classNames'
import type { ReactNode } from 'react'

type SectionCardProps = {
    title: string
    description?: string
    children: ReactNode
    extra?: ReactNode
    border?: boolean
    className?: string
}

const SectionCard = ({
    title,
    description,
    children,
    className,
    border = true,
    extra,
}: SectionCardProps) => {
    return (
        <div
            className={classNames(
                'py-4',
                border && 'border-b border-gray-200 dark:border-gray-700',
                className,
            )}
        >
            <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="pt-2">
                    <h5>{title}</h5>
                    {description && <p className="mt-1">{description}</p>}
                </div>
                {extra}
            </div>
            {children}
        </div>
    )
}

export default SectionCard
