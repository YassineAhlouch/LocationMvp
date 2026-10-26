import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import TaskDetails from '@/components/view/TaskDetails'
import { priorityMap, tagsMap } from '../utils'
import { useScrumboardStore } from '../store/scrumboardStore'
import useScrumboardData from '../hooks/useScrumboardData'
import { apiUpdateTask } from '@/services/TaskService'
import dayjs from 'dayjs'
import sleep from '@/utils/sleep'
import { LuX } from 'react-icons/lu'
import type { Task } from '../types'
import type { Dispatch, SetStateAction } from 'react'

const TaskDetailsDialog = () => {
    const selectedTask = useScrumboardStore((state) => state.selectedTask)
    const taskDialogOpen = useScrumboardStore((state) => state.taskDialogOpen)
    const setTaskDialogOpen = useScrumboardStore(
        (state) => state.setTaskDialogOpen,
    )
    const setSelectedTask = useScrumboardStore((state) => state.setSelectedTask)

    const { projectMeta, mutate } = useScrumboardData()

    const handleClose = async () => {
        setTaskDialogOpen(false)
        await sleep(200)
        setSelectedTask('')
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
        setIsSaving(true)

        const userIds =
            payload.members?.map((member) => Number(member.id)) || []

        await apiUpdateTask({
            id: selectedTask,
            subject: payload.subject,
            description: payload.description,
            priority: payload.priority,
            tags: payload.tags,
            due_date: payload.dueDate
                ? dayjs(payload.dueDate).format('YYYY-MM-DD')
                : null,
            visibility: userIds.length > 0 ? 'private' : 'shared',
            user_ids: userIds,
        }).catch(() => {})

        mutate()
        await sleep(300)
        setTaskDialogOpen(false)
        await sleep(200)
        setSelectedTask('')
        setIsSaving(false)
    }

    return (
        <Dialog
            isOpen={taskDialogOpen}
            onClose={handleClose}
            closable={false}
            width={650}
            className="p-0"
        >
            <TaskDetails
                hideTabs
                taskId={selectedTask}
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
