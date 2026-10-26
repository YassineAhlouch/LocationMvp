import { useState } from 'react'
import Table from '@/components/ui/Table'
import ListRow from './ListRow'
import { groupColorMap } from '../utils'
import classNames from '@/utils/classNames'
import type { DragEvent } from 'react'
import type { Group, Task } from '../types'

type ListGroupProps = {
    group: Group
    tasks: Task[]
    isOverlay?: boolean
    onMoveTask?: (taskId: string, groupId: string) => void
    onDataChange?: (payload: { key: string; value: string; id: string }) => void
}

const ListGroup = ({
    group,
    tasks,
    isOverlay,
    onMoveTask,
    onDataChange,
}: ListGroupProps) => {
    const [dropHover, setDropHover] = useState(false)

    // Whole group acts as the drop target: dropping a task row anywhere
    // inside it (header, empty area, other rows) moves it to this group.
    const handleDragOver = (event: DragEvent<HTMLTableSectionElement>) => {
        if (event.dataTransfer.types.includes('application/x-task-id')) {
            event.preventDefault()
            event.dataTransfer.dropEffect = 'move'
            setDropHover(true)
        }
    }

    const handleDragLeave = () => {
        setDropHover(false)
    }

    const handleDrop = (event: DragEvent<HTMLTableSectionElement>) => {
        event.preventDefault()
        setDropHover(false)

        const taskId = event.dataTransfer.getData('application/x-task-id')
        if (taskId) {
            onMoveTask?.(taskId, group.id)
        }
    }

    return (
        <Table.TBody
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={classNames(
                isOverlay ? '' : dropHover ? 'ring-1 ring-primary/40' : '',
            )}
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
            {tasks.map((task) => (
                <ListRow
                    key={task.id}
                    task={task}
                    onDataChange={onDataChange}
                />
            ))}
        </Table.TBody>
    )
}

export default ListGroup
