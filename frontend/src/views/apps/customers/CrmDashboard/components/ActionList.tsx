import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Checkbox from '@/components/ui/Checkbox'
import Tag from '@/components/ui/Tag'
import Scroll from '@/components/ui/Scroll'
import Badge from '@/components/ui/Badge'
import classNames from '@/utils/classNames'
import { calculateOverdueDays } from '../utils/dataTransformers'
import type { ActionListProps } from '../types'

const getServerityColors = (priority: string) => {
    switch (priority) {
        case 'urgent':
            return 'bg-error'
        case 'medium':
            return 'bg-warning'
        case 'low':
            return 'bg-success'
        default:
            return ''
    }
}

const ActionList = ({
    data,
    timeHorizon,
    onToggleComplete,
}: ActionListProps) => {
    const filteredActions = useMemo(() => {
        const now = new Date()
        const filtered = data.filter((action) => {
            const dueDate = new Date(action.dueDate)
            const diffDays = Math.ceil(
                (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
            )

            if (timeHorizon === 'week') {
                return diffDays <= 7
            }
            if (timeHorizon === 'month') {
                return diffDays <= 30
            }
            // Quarter
            return diffDays <= 90
        })

        return filtered.map((action) => ({
            ...action,
            overdueDays: calculateOverdueDays(action.dueDate),
        }))
    }, [data, timeHorizon])

    return (
        <Card className="h-full flex flex-col">
            <div className="mb-4">
                <h5>Actions List</h5>
            </div>
            <Scroll.FlexSize className="max-h-[350px]">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredActions.map((action) => (
                        <div key={action.id} className="py-2">
                            <div className="flex items-start gap-3 ltr:pr-2 rtl:pl-2">
                                <Checkbox
                                    checked={action.completed}
                                    onChange={() => onToggleComplete(action.id)}
                                    className="mt-1"
                                />
                                <div className="flex-1 flex items-center justify-between min-w-0">
                                    <div>
                                        <div
                                            className={classNames(
                                                'font-semibold',
                                                action.completed
                                                    ? 'line-through opacity-30'
                                                    : 'heading-text',
                                            )}
                                        >
                                            {action.title}
                                        </div>
                                        <p className="text-xs">
                                            {action.description}
                                        </p>
                                    </div>
                                    <Tag className="bg-transparent gap-1">
                                        <Badge
                                            className={getServerityColors(
                                                action.priority,
                                            )}
                                        />
                                        <span className="capitalize">
                                            {action.priority}
                                        </span>
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Scroll.FlexSize>
        </Card>
    )
}

export default ActionList
