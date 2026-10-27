import Table from '@/components/ui/Table'
import ListGroup from './ListGroup'
import ListContainer from './ListContainer'
import useTasksData from '../hooks/useTasksData'
import { useTasksStore } from '../store/tasksStore'
import { apiUpdateTask } from '@/services/TaskService'
import dayjs from 'dayjs'
import type { Task } from '../types'

const TaskList = () => {
    const { groups, tasks, setTasks, setData } = useTasksData()

    const setTaskDialog = useTasksStore((state) => state.setTaskDialog)

    const dateRange = useTasksStore((state) => state.dateRange)

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
     * Move a task into another group (drag & drop). Persisted immediately
     * with PATCH /api/v1/tasks/{id}.
     */
    const handleMoveTask = (taskId: string, groupId: string) => {
        setTasks((allTasks) => {
            const task = allTasks.find((t) => t.id === taskId)
            if (!task || task.columnId === groupId) {
                return allTasks
            }

            apiUpdateTask({ id: taskId, column_id: groupId }).catch(() => {})

            return allTasks.map((t) =>
                t.id === taskId ? { ...t, columnId: groupId } : t,
            )
        })
    }

    const handleDataChange = (payload: {
        key: string
        value: string
        id: string
    }) => {
        if (payload.key === 'ticket') {
            setTaskDialog({
                open: true,
                id: payload.id,
            })
            return
        }
        setData(payload)
    }

    return (
        <Table
            compact
            hoverable={false}
            className="border-b border-gray-200 dark:border-gray-800"
            verticalDivider={{
                head: true,
                body: true,
            }}
        >
            <ListContainer>
                {groups.map((col) => (
                    <ListGroup
                        key={col.id}
                        group={col}
                        tasks={tasks.filter(
                            (task) =>
                                task.columnId === col.id && isWithinRange(task),
                        )}
                        onMoveTask={handleMoveTask}
                        onDataChange={handleDataChange}
                    />
                ))}
            </ListContainer>
        </Table>
    )
}

export default TaskList
