import { useMemo } from 'react'
import Table from '@/components/ui/Table'
import ListRow from './ListRow'
import { groupColorMap } from '../utils'
import classNames from '@/utils/classNames'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Group, Task, GroupDragData } from '../types'

type BoardColumnProps = {
    group: Group
    tasks: Task[]
    isOverlay?: boolean
    onAddTask?: (columnId: string) => void
    onDataChange?: (payload: { key: string; value: string; id: string }) => void
}

const ListGroup = ({
    group,
    tasks,
    isOverlay,
    onDataChange,
}: BoardColumnProps) => {
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id)
    }, [tasks])

    const {
        setNodeRef,
        attributes,
        listeners,
        isDragging,
        transform,
        transition,
    } = useSortable({
        id: group.id,
        data: {
            type: 'Group',
            group,
        } satisfies GroupDragData,
        attributes: {
            roleDescription: `Group: ${group.name}`,
        },
    })

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    }

    return (
        <Table.TBody
            ref={setNodeRef}
            style={style}
            className={classNames(
                isOverlay ? '' : isDragging ? 'opacity-30' : '',
            )}
            {...attributes}
            {...listeners}
        >
            <Table.Tr className="bg-gray-50 dark:bg-gray-800">
                <Table.Td
                    colSpan={7}
                    className="hover:bg-gray-50 hover:dark:bg-gray-800"
                >
                    <span className="px-2 py-1 heading-text font-semibold flex items-center gap-2">
                        <span
                            className={classNames(
                                'h-3 w-3 rounded',
                                groupColorMap[group.color],
                            )}
                        ></span>
                        <span className="leading-none">{group.name}</span>
                    </span>
                </Table.Td>
            </Table.Tr>
            <SortableContext items={tasksIds}>
                {tasks.map((task) => (
                    <ListRow
                        key={task.id}
                        task={task}
                        onDataChange={onDataChange}
                    />
                ))}
            </SortableContext>
        </Table.TBody>
    )
}

export default ListGroup
