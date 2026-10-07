import { useState } from 'react'
import Gantt from '@/components/shared/Gantt'
import { ViewMode } from '@/components/shared/Gantt/constants'
import type { Task, BarTask } from '@/components/shared/Gantt/types'

type TaskMeta = {
    indicatorColor?: string
}

const currentDate = new Date()

const initialTasks: Task<TaskMeta>[] = [
    {
        id: 'ProjectSample',
        name: 'Website Redesign',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
        progress: 45,
        type: 'project',
        hideChildren: false,
        displayOrder: 1,
        styles: {
            progressClass: 'fill-indigo-500',
            wrapperClass: 'fill-indigo-100',
        },
    },
    {
        id: 'Task 1',
        name: 'Design Phase',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
        progress: 85,
        type: 'task',
        project: 'ProjectSample',
        displayOrder: 2,
        indicatorColor: '#3b82f6',
        styles: {
            progressClass: 'fill-white stroke-gray-300',
            wrapperClass: 'fill-gray-100 stroke-gray-300',
        },
    },
    {
        id: 'Task 2',
        name: 'Development',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
        progress: 65,
        type: 'task',
        project: 'ProjectSample',
        dependencies: ['Task 1'],
        displayOrder: 3,
        indicatorColor: '#10b981',
        styles: {
            progressClass: 'fill-white stroke-gray-300',
            wrapperClass: 'fill-gray-100 stroke-gray-300',
        },
    },
    {
        id: 'Task 3',
        name: 'Code Review',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
        progress: 35,
        type: 'task',
        project: 'ProjectSample',
        displayOrder: 4,
        indicatorColor: '#f59e0b',
        styles: {
            progressClass: 'fill-white stroke-gray-300',
            wrapperClass: 'fill-gray-100 stroke-gray-300',
        },
    },
    {
        id: 'Task 4',
        name: 'Testing',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
        progress: 20,
        type: 'task',
        project: 'ProjectSample',
        dependencies: ['Task 2', 'Task 3'],
        displayOrder: 5,
        indicatorColor: '#8b5cf6',
        styles: {
            progressClass: 'fill-white stroke-gray-300',
            wrapperClass: 'fill-gray-100 stroke-gray-300',
        },
    },
    {
        id: 'Task 5',
        name: 'Documentation',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 16),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
        progress: 15,
        type: 'task',
        project: 'ProjectSample',
        displayOrder: 6,
        indicatorColor: '#ec4899',
        styles: {
            progressClass: 'fill-white stroke-gray-300',
            wrapperClass: 'fill-gray-100 stroke-gray-300',
        },
    },
    {
        id: 'Task 6',
        name: 'Launch',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
        progress: 50,
        type: 'milestone',
        project: 'ProjectSample',
        dependencies: ['Task 4', 'Task 5'],
        displayOrder: 7,
    },
]

const CustomRender = () => {
    const [tasks, setTasks] = useState<Task<TaskMeta>[]>(initialTasks)

    const handleDateChange = (task: Task<TaskMeta>) => {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    }

    const handleProgressChange = (task: Task<TaskMeta>) => {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    }

    const handleExpanderClick = (task: Task<TaskMeta>) => {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    }

    const customBarContent = (barTask: BarTask<TaskMeta>) => {
        if (barTask.type === 'milestone' || barTask.type === 'project') {
            return null
        }

        return (
            <div className="flex items-center gap-1">
                <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: barTask.indicatorColor }}
                />
                <div className="font-medium heading-text text-nowrap text-xs truncate select-none">
                    {barTask.name}
                </div>
            </div>
        )
    }

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <Gantt<TaskMeta>
                tasks={tasks}
                viewMode={ViewMode.Day}
                customBarContent={customBarContent}
                onDateChange={handleDateChange}
                onProgressChange={handleProgressChange}
                onExpanderClick={handleExpanderClick}
                todayColor="rgba(40, 108, 240, 0.1)"
                milestoneClass="fill-rose-500"
            />
        </div>
    )
}

export default CustomRender
