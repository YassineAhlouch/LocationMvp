import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import TaskDetails from '@/components/view/TaskDetails'
import { priorityMap, tagsMap } from '../utils'
import { useTasksStore } from '../store/tasksStore'
import useTasksData from '../hooks/useTasksData'
import sleep from '@/utils/sleep'
import { LuX } from 'react-icons/lu'
import type { Task } from '../types'
import type { Dispatch, SetStateAction } from 'react'

const TaskDetailsDialog = () => {
    const taskDialog = useTasksStore((state) => state.taskDialog)
    const setTaskDialog = useTasksStore((state) => state.setTaskDialog)

    const { projectMeta } = useTasksData()

    const handleClose = async () => {
        setTaskDialog({
            ...taskDialog,
            open: false,
        })
        await sleep(200)
        setTaskDialog({
            id: '',
            open: false,
        })
    }

    const handleSave = async (
        payload: Pick<
            Task,
            | 'subject'
            | 'description'
            | 'members'
            | 'tags'
            | 'priority'
            | 'dueDate'
        >,
        setIsSaving: Dispatch<SetStateAction<boolean>>,
    ) => {
        console.log('payload', payload)
        setIsSaving(true)
        await sleep(500)
        handleClose()
        setIsSaving(false)
    }

    return (
        <Dialog
            isOpen={taskDialog.open}
            onClose={handleClose}
            closable={false}
            width={650}
            className="p-0"
        >
            <TaskDetails
                taskId={taskDialog.id}
                cornerContent={
                    <Button
                        size="sm"
                        variant="ghost"
                        icon={<LuX />}
                        onClick={handleClose}
                    />
                }
                onSave={handleSave}
                onCancel={handleClose}
                priorityList={priorityMap}
                tagsList={tagsMap}
                assigneeList={projectMeta?.allMembers || []}
            />
        </Dialog>
    )
}

export default TaskDetailsDialog
