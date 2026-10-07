import { useMemo } from 'react'
import BoardCard from './BoardCard'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dropdown from '@/components/ui/Dropdown'
import Scroll from '@/components/ui/Scroll'
import { columnColorMap } from '../utils'
import classNames from '@/utils/classNames'
import { LiAdd, LiTrash, LiSetting2 } from '@/icons'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { LuEllipsis } from 'react-icons/lu'
import type { Column, Task, ColumnDragData } from '../types'

type BoardColumnProps = {
    column: Column
    tasks: Task[]
    isOverlay?: boolean
    onAddTask?: (columnId: string) => void
    onEditColumn?: (columnId: string) => void
    onDeleteColumn?: (columnId: string) => void
}

const BoardColumn = ({
    column,
    tasks,
    isOverlay,
    onAddTask,
    onEditColumn,
    onDeleteColumn,
}: BoardColumnProps) => {
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id)
    }, [tasks])

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        } satisfies ColumnDragData,
        attributes: {
            roleDescription: `Column: ${column.name}`,
        },
    })

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={classNames(
                'h-full w-[320px] flex flex-col flex-shrink-0 snap-center bg-gray-100 dark:bg-gray-800 shadow-none',
                isOverlay
                    ? 'ring-2 ring-primary'
                    : isDragging
                      ? 'ring-2 opacity-30'
                      : '',
            )}
            bodyClass="p-3 h-full relative flex flex-col"
            bordered={false}
        >
            <div className="flex items-center justify-between">
                <div
                    className="flex items-center flex-1 gap-2 pb-4 mt-1 px-2"
                    {...attributes}
                    {...listeners}
                >
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
                            icon={<LuEllipsis />}
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
            <div className="relative flex-1">
                <div className="absolute top-0 left-0 right-0 bottom-0 ">
                    <Scroll
                        className="h-full"
                        contentClassName="h-full flex flex-col gap-4 p-1"
                        scrollbars="vertical"
                    >
                        <SortableContext items={tasksIds}>
                            {tasks.map((task) => (
                                <BoardCard key={task.id} task={task} />
                            ))}
                        </SortableContext>
                    </Scroll>
                </div>
            </div>
        </Card>
    )
}

export default BoardColumn
