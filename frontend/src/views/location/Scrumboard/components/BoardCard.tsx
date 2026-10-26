import { memo } from 'react'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import { useScrumboardStore } from '../store/scrumboardStore'
import { priorityMap } from '../utils'
import { LiClock, LiUser } from '@/icons'
import dayjs from 'dayjs'
import classNames from '@/utils/classNames'
import type { DragEvent } from 'react'
import type { Task } from '../types'

/** DataTransfer key used to carry the dragged ticket id to a column drop target. */
export const TICKET_DRAG_KEY = 'application/x-ticket-id'

type BoardCardProps = {
    task: Task
    isOverlay?: boolean
}

const MAX_CHARACTERS = 70

const DraggablePresentation = memo(({ task }: BoardCardProps) => {
    return (
        <>
            <div className="p-3">
                <div className="heading-text font-medium text-base">
                    {task.subject}
                </div>
                <div className="mt-1">
                    {task.description.length > MAX_CHARACTERS
                        ? task.description.slice(0, MAX_CHARACTERS) + '...'
                        : task.description}
                </div>
            </div>
            <div className="px-3 pb-3 flex justify-between">
                <Tag
                    className="gap-1 inline-flex items-center bg-transparent"
                    prefix={
                        <span
                            className={classNames(
                                'h-2.5 w-2.5 rounded-xs',
                                priorityMap[task.priority].color,
                            )}
                        ></span>
                    }
                >
                    {task.priority}
                </Tag>
                <span className="flex items-center gap-1">
                    <LiClock className="text-base" />
                    <span className="leading-none  heading-text">
                        {dayjs(task.dueDate).format('MMM DD')}
                    </span>
                </span>
            </div>
            <div className="flex items-center px-3 py-2.5 border-t border-gray-200 dark:border-gray-600">
                {task.members.length > 0 ? (
                    <UsersAvatarGroup
                        avatarProps={{
                            size: 25,
                        }}
                        users={task.members}
                    />
                ) : (
                    <span
                        title="Not assigned — click for details"
                        className="flex items-center w-[25px] h-[25px] rounded-full border border-gray-300 dark:border-gray-600 border-dashed justify-center text-gray-400"
                    >
                        <LiUser className="text-sm" />
                    </span>
                )}
            </div>
        </>
    )
})

const BoardCard = ({ task }: BoardCardProps) => {
    const setSelectedTask = useScrumboardStore((state) => state.setSelectedTask)
    const setTaskDialogOpen = useScrumboardStore(
        (state) => state.setTaskDialogOpen,
    )

    const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData(TICKET_DRAG_KEY, task.id)
    }

    const handleClick = () => {
        setSelectedTask(task.id)
        setTaskDialogOpen(true)
    }

    return (
        <Card
            draggable
            onDragStart={handleDragStart}
            onClick={handleClick}
            bordered={false}
            className="dark:bg-gray-700 cursor-grab active:cursor-grabbing"
            bodyClass="p-0"
        >
            <DraggablePresentation task={task} />
        </Card>
    )
}

export default BoardCard
