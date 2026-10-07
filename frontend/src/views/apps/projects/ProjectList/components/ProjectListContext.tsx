import DataContext from '../context/DataContext'
import { apiGetProjects } from '@/services/ProjectService'
import useSWR from 'swr'
import type { ReactNode } from 'react'
import type { GetProjectListResponse } from '../types'

type ProjectListContextProps = {
    children: ReactNode
}
const ProjectListContext = ({ children }: ProjectListContextProps) => {
    const {
        data = [],
        isLoading,
        mutate,
    } = useSWR(
        [`/api/projects/`],
        () => apiGetProjects<GetProjectListResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    const setData = (
        callback: (data: GetProjectListResponse) => GetProjectListResponse,
    ) => {
        if (data) {
            mutate(callback(data), false)
        }
    }

    return (
        <DataContext.Provider
            value={{
                data,
                isLoading,
                setData,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default ProjectListContext
