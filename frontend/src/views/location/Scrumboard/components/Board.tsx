import BoardCard from './BoardCard'
import BoardColumn from './BoardColumn'
import BoardContainer from './BoardContainer'
import useScrumboardData from '../hooks/useScrumboardData'
import { useScrumboardStore } from '../store/scrumboardStore'
import { apiUpdateTask } from '@/services/TaskService'
import dayjs from 'dayjs'
import type { Task } from '../types'

const Board = () => {
    const { columns, tasks, setTasks, mutate } = useScrumboardData()

    const setSelectedColumn = useScrumboardStore(
        (state) => state.setSelectedColumn,
    )
    const setAddTaskDialogOpen = useScrumboardStore(
        (state) => state.setAddTaskDialogOpen,
    )
    const setColumnDialog = useScrumboardStore((state) => state.setColumnDialog)
    const setDeleteColumnDialogOpen = useScrumboardStore(
        (state) => state.setDeleteColumnDialogOpen,
    )
    const query = useScrumboardStore((state) => state.query)
    const displayedColumns = useScrumboardStore(
        (state) => state.displayedColumns,
    )
    const dateRange = useScrumboardStore((state) => state.dateRange)

    /** Task passes the date filter: undated tasks always show. */
    const isWithinRange = (task: Task) => {
        if (!dateRange) {
            return true
        }
        if (!task.dueDate) {
            return true
        }
        const due = dayjs(task.dueDate)
        const from = dayjs(dateRange.from).startOf('day')
        const to = dayjs(dateRange.to).endOf('day')
        return (
            (due.isAfter(from) || due.isSame(from)) &&
            (due.isBefore(to) || due.isSame(to))
        )
    }

    /**
     * Move a ticket into another column (drag & drop). Persisted immediately
     * with PATCH /api/v1/tasks/{id}.
     */
    const handleMoveTicket = (taskId: string, columnId: string) => {
        setTasks((allTasks) => {
            const task = allTasks.find((t) => t.id === taskId)
            if (!task || task.columnId === columnId) {
                return allTasks
            }

            apiUpdateTask({ id: taskId, column_id: columnId }).catch(() => {})

            return allTasks.map((t) =>
                t.id === taskId ? { ...t, columnId } : t,
            )
        })
        mutate()
    }

    const handleAddTask = (columnId: string) => {
        setSelectedColumn(columnId)
        setAddTaskDialogOpen(true)
    }

    const handleConfigColumn = (columnId: string) => {
        setSelectedColumn(columnId)
        setColumnDialog({
            open: true,
            type: 'edit',
        })
    }

    const handleDeleteColumn = (columnId: string) => {
        setDeleteColumnDialogOpen(true)
        setSelectedColumn(columnId)
    }

    return (
        <BoardContainer>
            {columns
                .filter((col) => displayedColumns.includes(col.id))
                .map((col) => (
                    <BoardColumn
                        key={col.id}
                        column={col}
                        tasks={tasks.filter(
                            (task) =>
                                task.columnId === col.id &&
                                task.subject
                                    .toLocaleLowerCase()
                                    .includes(query.toLowerCase()) &&
                                isWithinRange(task),
                        )}
                        onAddTask={handleAddTask}
                        onEditColumn={handleConfigColumn}
                        onDeleteColumn={handleDeleteColumn}
                        onMoveTicket={handleMoveTicket}
                    />
                ))}
        </BoardContainer>
    )
}

export default Board
