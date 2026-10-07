import Avatar from '@/components/ui/Avatar'
import { useMemo } from 'react'
import { useTasksStore } from '../store/tasksStore'
import type { ReactNode } from 'react'

const AssineeSelectorListProvider = ({
    children,
}: {
    children: (
        list: Array<{
            value: string
            label: string
            indicator: string | ReactNode
        }>,
    ) => ReactNode
}) => {
    const allMembers = useTasksStore((state) => state.allMembers)

    const assignees = useMemo(
        () =>
            allMembers.map((assignee) => ({
                value: assignee.id,
                label: assignee.name,
                indicator: (
                    <Avatar src={assignee.img} shape="circle" size={25} />
                ),
            })) || [],
        [allMembers],
    )

    return children(assignees)
}

export default AssineeSelectorListProvider
