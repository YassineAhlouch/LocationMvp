import { apiGetTasks, apiUpdateTask } from '@/services/TaskService'
import { useScrumboardStore } from '../store/scrumboardStore'
import useSWR from 'swr'
import type { GetTasksResponse, Column, Task, ProjectMeta } from '../types'

/*
 * Real API: GET /api/v1/tasks -> { tasks, groups, projectMeta }.
 * Columns are the task_groups table; every change below is persisted
 * through PATCH /api/v1/tasks/{id}.
 */
const useScrumboard = () => {
    const setDisplayedColumns = useScrumboardStore(
        (state) => state.setDisplayedColumns,
    )
    const { data, isLoading, mutate } = useSWR(
        [`/api/v1/tasks/scrumboard`],
        () => apiGetTasks<GetTasksResponse>(),
        {
            revalidateOnFocus: false,
            onSuccess: (data) => {
                setDisplayedColumns(data.groups.map((col) => col.id))
            },
        },
    )

    const persistColumnMove = (taskId: string, columnId: string) => {
        apiUpdateTask({ id: taskId, column_id: columnId }).catch(() => {})
    }

    const setColumns = (callback: (data: Column[]) => Column[]) => {
        if (data) {
            const groups = callback(data.groups)
            mutate(
                {
                    tasks: data.tasks,
                    groups,
                    projectMeta: data.projectMeta,
                },
                false,
            )
        }
    }

    const setTasks = (callback: (data: Task[]) => Task[]) => {
        if (data) {
            const tasks = callback(data.tasks)
            mutate(
                {
                    tasks,
                    groups: data.groups,
                    projectMeta: data.projectMeta,
                },
                false,
            )
        }
    }
    const setProjectMeta = (callback: (data: ProjectMeta) => ProjectMeta) => {
        if (data) {
            const projectMeta = callback(data.projectMeta)
            mutate(
                {
                    tasks: data.tasks,
                    groups: data.groups,
                    projectMeta,
                },
                false,
            )
        }
    }

    return {
        columns: data?.groups || [],
        tasks: data?.tasks || [],
        projectMeta: data?.projectMeta || null,
        persistColumnMove,
        setColumns,
        setTasks,
        setProjectMeta,
        isLoading,
        mutate,
    }
}

export default useScrumboard
