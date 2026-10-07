import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Divider from '@/components/shared/Divider'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import { useScrumboardStore } from '../store/scrumboardStore'
import { priorityMap } from '../utils'
import { LiClock, LiLink3, LiMessage, LiTask } from '@/icons'
import dayjs from 'dayjs'
import classNames from '@/utils/classNames'

import type { Task, TaskDragData } from '../types'

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
            <div className="flex items-center justify-between px-3 py-2.5 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center">
                    <UsersAvatarGroup
                        avatarProps={{
                            size: 25,
                        }}
                        users={task.members}
                    />
                </div>
                <div className="flex items-center leading-normal">
                    <div className="flex items-center gap-1">
                        <LiMessage className="text-base" />
                        <span className="heading-text leading-none">
                            {task.commentCount}
                        </span>
                    </div>
                    <Divider
                        orientation="vertical"
                        className="min-h-3 dark:bg-gray-600"
                    />
                    <div className="flex items-center gap-1">
                        <LiTask className="text-base" />
                        <span className="heading-text leading-none">
                            {task.taskCount}
                        </span>
                    </div>
                    <Divider
                        orientation="vertical"
                        className="min-h-3 dark:bg-gray-600"
                    />
                    <div className="flex items-center gap-1">
                        <LiLink3 className="text-base" />
                        <span className="heading-text leading-none">
                            {task.attachmentCount}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
})

const BoardCard = ({ task, isOverlay }: BoardCardProps) => {
    const setSelectedTask = useScrumboardStore((state) => state.setSelectedTask)
    const setTaskDialogOpen = useScrumboardStore(
        (state) => state.setTaskDialogOpen,
    )

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        } satisfies TaskDragData,
        attributes: {
            roleDescription: 'Task',
        },
    })

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    }

    const handleClick = (taskId: string) => {
        setSelectedTask(taskId)
        setTaskDialogOpen(true)
    }

    return (
        <div onClick={() => handleClick(task.id)}>
            <Card
                ref={setNodeRef}
                style={style}
                bordered={false}
                className={classNames(
                    'dark:bg-gray-700',
                    isOverlay
                        ? 'ring-2 ring-primary'
                        : isDragging
                          ? 'ring-2 opacity-30'
                          : '',
                )}
                bodyClass="p-0"
                {...attributes}
                {...listeners}
            >
                <DraggablePresentation task={task} isOverlay={isOverlay} />
            </Card>
        </div>
    )
}

export default BoardCard
