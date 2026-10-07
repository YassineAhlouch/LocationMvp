import { useState, useMemo, useCallback } from 'react'
import Gantt from '@/components/shared/Gantt'
import { ViewMode } from '@/components/shared/Gantt/constants'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import type { Task, Columns, BarTask } from '@/components/shared/Gantt/types'
import classNames from '@/utils/classNames'

type TaskMeta = {
    assignee?: {
        name: string
        img?: string
    }
    status?: 'To Do' | 'In Progress' | 'Done'
    priority?: 'Low' | 'Medium' | 'High'
}

const statusColors: Record<string, string> = {
    'To Do': 'bg-gray-500',
    'In Progress': 'bg-blue-500',
    Done: 'bg-emerald-500',
}

const priorityColors: Record<string, string> = {
    Low: 'bg-gray-100 text-gray-600',
    Medium: 'bg-amber-100 text-amber-600',
    High: 'bg-red-100 text-red-600',
}

const currentDate = new Date()

const initialTasks: Task<TaskMeta>[] = [
    {
        id: 'Project1',
        name: 'Q1 Sprint',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
        progress: 55,
        type: 'project',
        hideChildren: false,
        displayOrder: 1,
    },
    {
        id: 'Task 1',
        name: 'User Authentication',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 6),
        progress: 100,
        type: 'task',
        project: 'Project1',
        displayOrder: 2,
        assignee: { name: 'John Doe', img: '/img/avatars/thumb-1.jpg' },
        status: 'Done',
        priority: 'High',
    },
    {
        id: 'Task 2',
        name: 'Dashboard UI',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
        progress: 80,
        type: 'task',
        project: 'Project1',
        dependencies: ['Task 1'],
        displayOrder: 3,
        assignee: { name: 'Jane Smith', img: '/img/avatars/thumb-2.jpg' },
        status: 'In Progress',
        priority: 'High',
    },
    {
        id: 'Task 3',
        name: 'API Integration',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
        progress: 40,
        type: 'task',
        project: 'Project1',
        displayOrder: 4,
        assignee: { name: 'Bob Wilson' },
        status: 'In Progress',
        priority: 'Medium',
    },
    {
        id: 'Task 4',
        name: 'Documentation',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
        progress: 0,
        type: 'task',
        project: 'Project1',
        dependencies: ['Task 2', 'Task 3'],
        displayOrder: 5,
        assignee: { name: 'Alice Brown', img: '/img/avatars/thumb-3.jpg' },
        status: 'To Do',
        priority: 'Low',
    },
    {
        id: 'Task 5',
        name: 'Release',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
        progress: 0,
        type: 'milestone',
        project: 'Project1',
        dependencies: ['Task 4'],
        displayOrder: 6,
    },
]

const WithColumns = () => {
    const [tasks, setTasks] = useState<Task<TaskMeta>[]>(initialTasks)

    const handleExpanderClick = useCallback((task: Task<TaskMeta>) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === task.id
                    ? { ...t, hideChildren: !task.hideChildren }
                    : t,
            ),
        )
    }, [])

    const columns: Columns<TaskMeta>[] = useMemo(
        () => [
            {
                header: 'Task',
                cell: (task) =>
                    task.expander ? (
                        <button
                            className="flex items-center gap-2 px-2 heading-text absolute left-0 top-0 h-full w-full"
                            onClick={() => handleExpanderClick(task)}
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
                    ),
                width: 200,
            },
            {
                header: 'Assignee',
                cell: (task) => {
                    const assignee = task.assignee
                    if (!assignee) return <span className="px-2">—</span>
                    return (
                        <div className="flex items-center gap-2 px-2">
                            <Avatar size={24} shape="circle" src={assignee.img}>
                                {assignee.name.charAt(0)}
                            </Avatar>
                            <span className="heading-text">
                                {assignee.name}
                            </span>
                        </div>
                    )
                },
                width: 160,
            },
            {
                header: 'Status',
                cell: (task) => {
                    const status = task.status
                    if (!status) return null
                    return (
                        <div className="flex items-center gap-1.5 px-2">
                            <span
                                className={classNames(
                                    'h-2 w-2 rounded-full',
                                    statusColors[status],
                                )}
                            />
                            <span>{status}</span>
                        </div>
                    )
                },
                width: 120,
            },
            {
                header: 'Priority',
                cell: (task) => {
                    const priority = task.priority
                    if (!priority) return null
                    return (
                        <div className="px-2">
                            <Tag
                                className={classNames(
                                    'border-0',
                                    priorityColors[priority],
                                )}
                            >
                                {priority}
                            </Tag>
                        </div>
                    )
                },
                width: 100,
            },
        ],
        [handleExpanderClick],
    )

    const handleDateChange = (task: Task<TaskMeta>) => {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    }

    const customBarContent = (barTask: BarTask<TaskMeta>) => {
        if (barTask.type === 'milestone' || barTask.type === 'project') {
            return null
        }
        return (
            <div className="font-medium text-white text-nowrap text-xs truncate select-none">
                {barTask.name}
            </div>
        )
    }

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <Gantt<TaskMeta>
                tasks={tasks}
                columns={columns}
                viewMode={ViewMode.Day}
                customBarContent={customBarContent}
                onDateChange={handleDateChange}
                onExpanderClick={handleExpanderClick}
            />
        </div>
    )
}

export default WithColumns
