import { apiGetScrumBoards } from '@/services/ProjectService'
import { useScrumboardStore } from '../store/scrumboardStore'
import useSWR from 'swr'
import type { GetScrumboardResponse, Column, Task, ProjectMeta } from '../types'

const useScrumboard = () => {
    const setDisplayedColumns = useScrumboardStore(
        (state) => state.setDisplayedColumns,
    )
    const { data, isLoading, mutate } = useSWR(
        [`/api/projects/scrumboard`],
        () => apiGetScrumBoards<GetScrumboardResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
            onSuccess: (data) => {
                setDisplayedColumns(data.columns.map((col) => col.id))
            },
        },
    )

    const setColumns = (callback: (data: Column[]) => Column[]) => {
        if (data) {
            const columns = callback(data.columns)
            mutate(
                {
                    tasks: data.tasks,
                    columns,
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
                    columns: data.columns,
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
                    columns: data.columns,
                    projectMeta,
                },
                false,
            )
        }
    }

    return {
        columns: data?.columns || [],
        tasks: data?.tasks || [],
        projectMeta: data?.projectMeta || null,
        setColumns,
        setTasks,
        setProjectMeta,
        isLoading,
    }
}

export default useScrumboard
