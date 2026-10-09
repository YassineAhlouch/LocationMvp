import type { ReactNode } from 'react'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import IconFrame from '@/components/shared/IconFrame'
import classNames from '@/utils/classNames'

export type StatCardItem = {
    id: string
    label: ReactNode
    value: ReactNode
    icon: ReactNode
}

type StatCardsProps = {
    items: StatCardItem[]
    loading?: boolean
}

/** Divider/breakpoint classes for the four-up KPI grid shared by list pages. */
const getBorderClass = (index: number) => {
    let borderClass = ''

    if (index === 0 || index === 2) {
        borderClass =
            'border-b border-r-0 md:border-b-0 md:ltr:border-r md:rtl:border-l border-gray-200 dark:border-gray-700 pb-4 md:pb-0'
    }
    if (index === 1) {
        borderClass =
            'border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700 pb-4 md:pb-0'
    }
    return borderClass
}

const StatCards = ({ items, loading = false }: StatCardsProps) => (
    <Card bodyClass="px-0 md:px-2">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-y-4">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className={classNames('px-4', getBorderClass(index))}
                >
                    <div className="flex items-center gap-4">
                        <IconFrame>
                            <span className="text-xl heading-text">
                                {item.icon}
                            </span>
                        </IconFrame>
                        <div>
                            <span>{item.label}</span>
                            <div className="flex items-end gap-4">
                                <div className="flex items-center gap-1">
                                    {loading ? (
                                        <Skeleton className="h-6 w-10" />
                                    ) : (
                                        <h6 className="font-semibold">
                                            {item.value}
                                        </h6>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
)

export default StatCards
