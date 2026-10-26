import { useMemo, useState } from 'react'
import BoardCard from './BoardCard'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dropdown from '@/components/ui/Dropdown'
import Scroll from '@/components/ui/Scroll'
import { columnColorMap } from '../utils'
import classNames from '@/utils/classNames'
import { LiAdd, LiTrash, LiSetting2 } from '@/icons'
import { LiEllipsis } from '@/icons'
import type { DragEvent } from 'react'
import type { Column, Task } from '../types'

type BoardColumnProps = {
    column: Column
    tasks: Task[]
    isOverlay?: boolean
    onAddTask?: (columnId: string) => void
    onEditColumn?: (columnId: string) => void
    onDeleteColumn?: (columnId: string) => void
    onMoveTicket?: (taskId: string, columnId: string) => void
}

const BoardColumn = ({
    column,
    tasks,
    isOverlay,
    onAddTask,
    onEditColumn,
    onDeleteColumn,
    onMoveTicket,
}: BoardColumnProps) => {
    const [dropHover, setDropHover] = useState(false)

    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id)
    }, [tasks])

    // Whole column is the drop target: dropping a ticket anywhere inside it
    // (header, empty area, other tickets) moves it to this column.
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        if (event.dataTransfer.types.includes('application/x-ticket-id')) {
            event.preventDefault()
            event.dataTransfer.dropEffect = 'move'
            setDropHover(true)
        }
    }

    const handleDragLeave = () => {
        setDropHover(false)
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setDropHover(false)

        const taskId = event.dataTransfer.getData('application/x-ticket-id')
        if (taskId) {
            onMoveTicket?.(taskId, column.id)
        }
    }

    return (
        <div
            className={classNames(
                'h-full w-[320px] flex flex-col flex-shrink-0 snap-center',
                isOverlay ? 'ring-2 ring-primary rounded-xl' : '',
            )}
        >
            <Card
                className={classNames(
                    'h-full flex flex-col bg-gray-100 dark:bg-gray-800 shadow-none',
                    dropHover ? 'ring-2 ring-primary/50' : '',
                )}
                bodyClass="p-3 h-full relative flex flex-col"
                bordered={false}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 gap-2 pb-4 mt-1 px-2">
                        <span
                            className={classNames(
                                'w-2.5 h-2.5 rounded-[3px]',
                                columnColorMap[column.color],
                            )}
                        ></span>
                        <h6 className="font-semibold leading-none">
                            {column.name}
                        </h6>
                    </div>
                    <Dropdown
                        placement="bottom-end"
                        renderTitle={
                            <Button
                                size="sm"
                                variant="ghost"
                                icon={<LiEllipsis />}
                            />
                        }
                    >
                        <Dropdown.Item
                            eventKey="addTicket"
                            onClick={() => onAddTask?.(column.id)}
                        >
                            <LiAdd className="text-base" />
                            <span>Add ticket</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="config"
                            onClick={() => onEditColumn?.(column.id)}
                        >
                            <LiSetting2 className="text-base" />
                            <span>Edit column</span>
                        </Dropdown.Item>
                        <Dropdown.Item variant="divider" />
                        <Dropdown.Item
                            className="text-error"
                            eventKey="delete"
                            onClick={() => onDeleteColumn?.(column.id)}
                        >
                            <LiTrash className="text-base" />
                            <span className="text-error">Delete</span>
                        </Dropdown.Item>
                    </Dropdown>
                </div>
                <div
                    className="relative flex-1"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="absolute top-0 left-0 right-0 bottom-0">
                        <Scroll
                            className="h-full"
                            contentClassName="h-full flex flex-col gap-4 p-1"
                            scrollbars="vertical"
                        >
                            {tasks.map((task) => (
                                <BoardCard key={task.id} task={task} />
                            ))}
                        </Scroll>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default BoardColumn
