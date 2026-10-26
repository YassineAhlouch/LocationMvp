import TaskList from './components/TaskList'
import TasksHeader from './components/TasksHeader'
import TaskDetailsDialog from './components/TaskDetailsDialog'
import AddTaskDialog from './components/AddTaskDialog'
import Button from '@/components/ui/Button'
import { useTasksStore } from './store/tasksStore'
import { LiAdd } from '@/icons'

const Tasks = () => {
    const setAddTaskDialogOpen = useTasksStore(
        (state) => state.setAddTaskDialogOpen,
    )

    return (
        <div className="flex flex-col h-full">
            <TasksHeader />
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <h5>Tasks</h5>
                <Button
                    variant="solid"
                    size="sm"
                    icon={<LiAdd />}
                    onClick={() => setAddTaskDialogOpen(true)}
                >
                    Add Task
                </Button>
            </div>
            <TaskList />
            <TaskDetailsDialog />
            <AddTaskDialog />
        </div>
    )
}

export default Tasks
