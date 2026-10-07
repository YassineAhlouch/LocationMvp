import { useCallback } from 'react'
import useSWR from 'swr'
import DataContext from '../context/DataContext'
import { apiGetTimelineProjects } from '@/services/ProjectService'
import dayjs from 'dayjs'
import type { ReactNode } from 'react'
import type {
    GetProjectTimelineResponse,
    TimelineTask,
    TimelineProject,
} from '../types'

type TimelineContextProps = {
    children: ReactNode
}

const TimelineContext = ({ children }: TimelineContextProps) => {
    const { data, isLoading, error, mutate } =
        useSWR<GetProjectTimelineResponse>(
            '/api/projects/timeline',
            async () => {
                const apiData =
                    await apiGetTimelineProjects<GetProjectTimelineResponse>()
                const tasks = apiData.tasks.map((task) => ({
                    ...task,
                    start: dayjs(task.start).toDate(),
                    end: dayjs(task.end).toDate(),
                }))
                return {
                    ...apiData,
                    tasks,
                }
            },
            {
                revalidateOnFocus: false,
            },
        )

    const tasks = data?.tasks

    const updateTask = async (updatedData: TimelineTask[]) => {
        if (data) {
            mutate(
                {
                    ...data,
                    tasks: updatedData,
                },
                false,
            )
        }
    }

    const updateProject = (
        callback: (data: TimelineProject) => TimelineProject,
    ) => {
        if (data) {
            const projects = callback(data.projects)
            mutate(
                {
                    ...data,
                    projects,
                },
                false,
            )
        }
    }

    const refetch = useCallback(() => {
        mutate()
    }, [mutate])

    const contextValue = {
        projects: data?.projects,
        sprints: data?.sprints,
        tasks,
        isLoading,
        error: error,
        updateTask,
        updateProject,
        refetch,
    }

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    )
}

export default TimelineContext
