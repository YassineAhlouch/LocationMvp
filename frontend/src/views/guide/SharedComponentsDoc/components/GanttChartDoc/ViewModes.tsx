import { useState } from 'react'
import Gantt from '@/components/shared/Gantt'
import { ViewMode } from '@/components/shared/Gantt/constants'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import type { Task } from '@/components/shared/Gantt/types'

const currentDate = new Date()

const initialTasks: Task[] = [
    {
        id: 'Project1',
        name: 'Product Launch',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 2,
            15,
        ),
        progress: 35,
        type: 'project',
        hideChildren: false,
        displayOrder: 1,
    },
    {
        id: 'Task 1',
        name: 'Market Research',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
        progress: 100,
        type: 'task',
        project: 'Project1',
        displayOrder: 2,
    },
    {
        id: 'Task 2',
        name: 'Product Design',
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        end: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            10,
        ),
        progress: 60,
        type: 'task',
        project: 'Project1',
        dependencies: ['Task 1'],
        displayOrder: 3,
    },
    {
        id: 'Task 3',
        name: 'Development',
        start: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            5,
        ),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1),
        progress: 20,
        type: 'task',
        project: 'Project1',
        dependencies: ['Task 2'],
        displayOrder: 4,
    },
    {
        id: 'Task 4',
        name: 'Beta Testing',
        start: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 2,
            1,
        ),
        end: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 2,
            10,
        ),
        progress: 0,
        type: 'task',
        project: 'Project1',
        dependencies: ['Task 3'],
        displayOrder: 5,
    },
    {
        id: 'Task 5',
        name: 'Launch Day',
        start: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 2,
            15,
        ),
        end: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 2,
            15,
        ),
        progress: 0,
        type: 'milestone',
        project: 'Project1',
        dependencies: ['Task 4'],
        displayOrder: 6,
    },
]

const viewModeOptions = [
    { label: 'Day', value: ViewMode.Day },
    { label: 'Week', value: ViewMode.Week },
    { label: 'Month', value: ViewMode.Month },
]

const ViewModes = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week)

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
        <div className="space-y-4">
            <InputGroup>
                {viewModeOptions.map((option) => (
                    <Button
                        key={option.value}
                        active={viewMode === option.value}
                        onClick={() => setViewMode(option.value)}
                    >
                        {option.label}
                    </Button>
                ))}
            </InputGroup>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <Gantt
                    tasks={tasks}
                    viewMode={viewMode}
                    onDateChange={handleDateChange}
                    onProgressChange={handleProgressChange}
                    onExpanderClick={handleExpanderClick}
                />
            </div>
        </div>
    )
}

export default ViewModes
