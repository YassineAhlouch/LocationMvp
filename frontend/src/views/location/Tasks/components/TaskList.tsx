import Table from '@/components/ui/Table'
import ListGroup from './ListGroup'
import ListRow from './ListRow'
import ListContainer from './ListContainer'
import useTasksData from '../hooks/useTasksData'
import { useTasksStore } from '../store/tasksStore'
import { apiUpdateTask } from '@/services/TaskService'

const TaskList = () => {
    const { groups, tasks, setTasks, setData } = useTasksData()

    const setTaskDialog = useTasksStore((state) => state.setTaskDialog)

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
                        tasks={tasks.filter((task) => task.columnId === col.id)}
                        onMoveTask={handleMoveTask}
                        onDataChange={handleDataChange}
                    />
                ))}
            </ListContainer>
        </Table>
    )
}

export default TaskList
