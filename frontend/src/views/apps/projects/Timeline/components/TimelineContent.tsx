import { useMemo, useCallback } from 'react'
import Gantt from '@/components/shared/Gantt'
import Loading from '@/components/shared/Loading'
import { ViewMode } from '@/components/shared/Gantt/constants'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import { useTimelineStore } from '../store/timelineStore'
import useTimelineData from '../hooks/useTimeLineData'
import {
    getPriorityColor,
    getTaskStatusColor,
    getStartEndDateForProject,
    getBarColor,
    getContrast,
} from '../utils'
import useDirection from '@/utils/hooks/useDirection'
import type { Task } from '@/components/shared/Gantt/types'
import type { Columns } from '@/components/shared/Gantt/types'
import type { TimelineTask, TaskMeta } from '../types'
import classNames from '@/utils/classNames'

type TimelineContentProps = {
    viewMode?: ViewMode
}

const TimelineContent = ({
    viewMode = ViewMode.Month,
}: TimelineContentProps) => {
    const { tasks, isLoading, updateTask } = useTimelineData()

    const [direction] = useDirection()

    const selectedSprint = useTimelineStore((state) => state.selectedSprint)
    const setSelectedTask = useTimelineStore((state) => state.setSelectedTask)

    const ganttTasks: TimelineTask[] = useMemo(() => {
        if (!tasks) return []

        const formattedTasks = tasks
            .filter((task) => {
                if (!selectedSprint) return true
                if (task.type === 'project') {
                    return task.id === selectedSprint
                }
                return task.project === selectedSprint
            })
            .map((task) => ({
                ...task,
                styles: getBarColor(
                    task.type === 'project'
                        ? task.id
                        : (task.project as string),
                ),
            }))

        return formattedTasks
    }, [tasks, selectedSprint])

    const handleExpanderClick = useCallback(
        (task: TimelineTask) => {
            if (!tasks) return
            updateTask(
                tasks.map((t) =>
                    t.id === task.id
                        ? {
                              ...t,
                              hideChildren: !task.hideChildren,
                          }
                        : t,
                ),
            )
        },
        [tasks, updateTask],
    )

    const columns: Columns<unknown>[] = useMemo(
        () => [
            {
                header: 'Task',
                cell: (task) => {
                    return task.expander ? (
                        <button
                            className="flex items-center gap-2 px-2 heading-text absolute left-0 top-0 h-full w-full"
                            onClick={() =>
                                handleExpanderClick(
                                    task as unknown as Task<TaskMeta>,
                                )
                            }
                        >
                            {task.expander}
                            <span className="font-medium">{task.name}</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-2">
                            <span className="font-medium ltr:pl-4 rtl:pr-4">
                                {task.name}
                            </span>
                        </div>
                    )
                },
                width: 250,
            },
            {
                header: 'Assignee',
                cell: (task) => {
                    const timelineTask = tasks?.find(
                        (t) => t.id === task.id,
                    ) as TimelineTask
                    const assignees = timelineTask.meta.assignee || []

                    if (assignees.length === 0) {
                        return (
                            <span className="px-2 font-medium">Unassigned</span>
                        )
                    }

                    if (assignees.length === 1) {
                        return (
                            <div className="flex items-center gap-2 px-2">
                                <Avatar
                                    size={25}
                                    shape="circle"
                                    src={assignees[0].img}
                                    alt={assignees[0].name}
                                >
                                    {assignees[0].name.charAt(0)}
                                </Avatar>
                                <span className="font-medium heading-text">
                                    {assignees[0].name}
                                </span>
                            </div>
                        )
                    }

                    return (
                        <div className="flex items-center gap-1 px-2">
                            <UsersAvatarGroup
                                users={assignees}
                                avatarProps={{ size: 25, shape: 'circle' }}
                            />
                        </div>
                    )
                },
                width: 180,
            },
            {
                header: 'Status',
                cell: (task) => {
                    const timelineTask = tasks?.find(
                        (t) => t.id === task.id,
                    ) as TimelineTask
                    const status = timelineTask?.meta?.status || 'To Do'

                    return (
                        <Tag className=" bg-transparent gap-1">
                            <span
                                className={classNames(
                                    'h-2 w-2 rounded-full',
                                    getTaskStatusColor(status),
                                )}
                            ></span>
                            {status}
                        </Tag>
                    )
                },
                width: 180,
            },
            {
                header: 'Priority',
                cell: (task) => {
                    const timelineTask = tasks?.find(
                        (t) => t.id === task.id,
                    ) as TimelineTask
                    const priority = timelineTask?.meta?.priority || 'Medium'

                    return (
                        <Tag
                            className={classNames(
                                'border-0',
                                getPriorityColor(priority),
                            )}
                        >
                            {priority}
                        </Tag>
                    )
                },
                width: 150,
            },
        ],
        [handleExpanderClick, tasks],
    )

    // Handle task date changes
    const handleDateChange = async (task: TimelineTask) => {
        const timelineTask = tasks?.find((t) => t.id === task.id)
        if (!timelineTask || !tasks) return

        let newTasks = tasks.map((t) => (t.id === task.id ? task : t))
        if (task.project) {
            const [start, end] = getStartEndDateForProject(
                newTasks,
                task.project,
            )
            const project =
                newTasks[newTasks.findIndex((t) => t.id === task.project)]
            if (
                project.start.getTime() !== start.getTime() ||
                project.end.getTime() !== end.getTime()
            ) {
                const changedProject = { ...project, start, end }
                newTasks = newTasks.map((t) =>
                    t.id === task.project ? changedProject : t,
                )
            }
        }
        updateTask(newTasks)
    }

    const handleProgressChange = async (task: TimelineTask) => {
        const timelineTask = tasks?.find((t) => t.id === task.id)
        if (!timelineTask || !tasks) return
        updateTask(tasks?.map((t) => (t.id === task.id ? task : t)))
    }

    const handleTaskSelect = (task: Task, isSelected: boolean) => {
        if (isSelected) {
            const timelineTask = tasks?.find((t) => t.id === task.id)
            setSelectedTask(timelineTask as TimelineTask)
        }
    }
    const handleTaskDoubleClick = (task: TimelineTask) => {
        const timelineTask = tasks?.find(
            (t) => t.id === task.id,
        ) as TimelineTask
        if (timelineTask?.meta?.description) {
            toast.push(
                <Notification type="info">
                    <div className="font-medium">{task.name}</div>
                    <div className="text-sm mt-1">
                        {timelineTask.meta.description}
                    </div>
                </Notification>,
            )
        }
    }

    return (
        <Loading loading={isLoading} className="h-full" type="cover">
            {tasks && (
                <Gantt<TaskMeta>
                    tasks={ganttTasks}
                    columns={columns}
                    viewMode={viewMode}
                    rtl={direction === 'rtl'}
                    headerHeight={70}
                    rowHeight={50}
                    gridColumnsWidth={100}
                    handleWidth={8}
                    locale="en-US"
                    onDateChange={handleDateChange}
                    onProgressChange={handleProgressChange}
                    onSelect={handleTaskSelect}
                    onDoubleClick={handleTaskDoubleClick}
                    onExpanderClick={handleExpanderClick}
                    milestoneClass="fill-[#00a85b]"
                    todayColor="rgba(40, 108, 240, 0.1)"
                    customBarContent={(task) => {
                        const contrast = getContrast(task.project || '')
                        return (
                            <div className="flex items-center gap-1">
                                <UsersAvatarGroup
                                    users={task.meta.assignee}
                                    avatarProps={{
                                        size: 18,
                                        shape: 'circle',
                                        className: 'select-none',
                                    }}
                                />
                                <div
                                    className={classNames(
                                        'font-medium heading-text text-nowrap text-xs truncate select-none',
                                        contrast === 'dark'
                                            ? 'text-white'
                                            : 'text-gray-800',
                                    )}
                                >
                                    {task.name}
                                </div>
                            </div>
                        )
                    }}
                />
            )}
        </Loading>
    )
}

export default TimelineContent
