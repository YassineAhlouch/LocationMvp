import type { ReactNode } from 'react'

type PageHeadingProps = {
    title: string
    description?: string
    extra?: ReactNode
}

/**
 * Consistent page title + description with an optional right-aligned action
 * (usually the primary "Create" button).
 */
const PageHeading = ({ title, description, extra }: PageHeadingProps) => {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h3>{title}</h3>
                {description && <p className="mt-1">{description}</p>}
            </div>
            {extra && <div>{extra}</div>}
        </div>
    )
}

export default PageHeading
