import ScrumboardHeader from './components/ScrumboardHeader'
import Board from './components/Board'
import TaskDetailsDialog from './components/TaskDetailsDialog'
import AddTaskDialog from './components/AddTaskDialog'
import ColumnDialog from './components/ColumnDialog'
import DeleteColumnDialog from './components/DeleteColumnDialog'

const Scrumboard = () => {
    return (
        <div className="flex flex-col h-full">
            <ScrumboardHeader />
            <Board />
            <TaskDetailsDialog />
            <AddTaskDialog />
            <ColumnDialog />
            <DeleteColumnDialog />
        </div>
    )
}

export default Scrumboard
