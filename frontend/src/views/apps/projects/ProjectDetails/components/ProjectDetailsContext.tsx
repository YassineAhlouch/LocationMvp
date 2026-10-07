import DataContext from '../context/DataContext'
import { apiGetProject } from '@/services/ProjectService'
import { useParams } from 'react-router'
import useSWR from 'swr'
import type { ReactNode } from 'react'
import type { GetProjectDetailsResponse } from '../types'

type ProjectDetailsContextProps = {
    children: ReactNode
}

const ProjectDetailsContext = ({ children }: ProjectDetailsContextProps) => {
    const { projectId } = useParams()
    const { data, isLoading, mutate } = useSWR(
        `project/${projectId}`,
        () => {
            if (projectId) {
                return apiGetProject<GetProjectDetailsResponse, { id: string }>(
                    { id: projectId },
                )
            }
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const setData = (
        updater: (
            draft: GetProjectDetailsResponse,
        ) => GetProjectDetailsResponse,
    ) => {
        mutate(
            (prev) => {
                if (!prev) return prev
                const next = structuredClone(prev)
                return updater(next)
            },
            { revalidate: false },
        )
    }

    return (
        <DataContext.Provider
            value={{
                data: data || null,
                isLoading,
                setData,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default ProjectDetailsContext
