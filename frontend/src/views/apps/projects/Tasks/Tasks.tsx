import TaskList from './components/TaskList'
import TasksHeader from './components/TasksHeader'
import TaskDetailsDialog from './components/TaskDetailsDialog'

const Tasks = () => {
    return (
        <div className="flex flex-col h-full">
            <TasksHeader />
            <TaskList />
            <TaskDetailsDialog />
        </div>
    )
}

export default Tasks
