import { useState } from 'react'
import Gantt from '@/components/shared/Gantt'
import { ViewMode } from '@/components/shared/Gantt/constants'
import type { Task } from '@/components/shared/Gantt'

const currentDate = new Date()

const initialTasks: Task[] = [
    {
        id: 'ProjectSample',
        name: 'Some Project',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        progress: 25,
        type: 'project',
        hideChildren: false,
        displayOrder: 1,
    },
    {
        id: 'Task 0',
        name: 'Idea',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            2,
            12,
            28,
        ),
        progress: 45,
        type: 'task',
        project: 'ProjectSample',
        displayOrder: 2,
    },
    {
        id: 'Task 1',
        name: 'Research',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        progress: 25,
        type: 'task',
        project: 'ProjectSample',
        dependencies: ['Task 0'],
        displayOrder: 3,
    },
    {
        id: 'Task 2',
        name: 'Discussion with team',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        progress: 10,
        type: 'task',
        project: 'ProjectSample',
        dependencies: ['Task 1'],
        displayOrder: 4,
    },
    {
        id: 'Task 3',
        name: 'Developing',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
        progress: 27,
        type: 'task',
        project: 'ProjectSample',
        dependencies: ['Task 2'],
        displayOrder: 5,
    },
    {
        id: 'Task 4',
        name: 'Review',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
        progress: 70,
        type: 'task',
        project: 'ProjectSample',
        dependencies: ['Task 2'],
        displayOrder: 6,
    },
    {
        id: 'Task 5',
        name: 'Release',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        progress: 0,
        type: 'milestone',
        project: 'ProjectSample',
        dependencies: ['Task 4'],
        displayOrder: 7,
    },
]

const Example = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)

    const handleDateChange = (task: Task) => {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    }

    const handleProgressChange = (task: Task) => {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    }

    const handleExpanderClick = (task: Task) => {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    }

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <Gantt
                tasks={tasks}
                viewMode={ViewMode.Day}
                onDateChange={handleDateChange}
                onProgressChange={handleProgressChange}
                onExpanderClick={handleExpanderClick}
            />
        </div>
    )
}

export default Example
