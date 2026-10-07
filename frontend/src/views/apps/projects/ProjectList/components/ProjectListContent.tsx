import { useMemo } from 'react'
import Container from '@/components/shared/Container'
import ListView from './ListView'
import GridView from './GridView'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import { useProjectListStore } from '../store/useProjectListStore'
import useProjectListData from '../hooks/useProjectListData'
import { LiBoxSearch } from '@/icons'

import type { ActionPayload } from '../types'
const ProjectListContent = () => {
    const { data, isLoading, setData } = useProjectListData()
    const status = useProjectListStore((state) => state.selectedStatus)
    const query = useProjectListStore((state) => state.query)
    const view = useProjectListStore((state) => state.view)

    const handleChange = (payload: ActionPayload) => {
        if (payload.type === 'delete') {
            setData((prevData) =>
                prevData.filter((item) => item.id !== payload.id),
            )
        }

        if (payload.type === 'favorite') {
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === payload.id
                        ? { ...item, favorite: !item.favorite }
                        : item,
                ),
            )
        }

        if (payload.type === 'statusChange') {
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === payload.id
                        ? { ...item, status: payload.status }
                        : item,
                ),
            )
        }
    }

    const projectList = useMemo(() => {
        return data.filter((item) => {
            const matchesQuery = query
                ? item.name.toLowerCase().includes(query.toLowerCase())
                : true
            const matchesStatus = status ? item.status === status : true
            return matchesQuery && matchesStatus
        })
    }, [data, query, status])

    return (
        <Container className="p-4">
            {view === 'list' && (
                <ListView
                    data={projectList}
                    isLoading={isLoading}
                    onChange={handleChange}
                />
            )}
            {view === 'grid' && (
                <GridView
                    data={projectList}
                    isLoading={isLoading}
                    onChange={handleChange}
                />
            )}
            {projectList.length === 0 && !isLoading && (
                <div className="flex-1 flex flex-col items-center justify-center mt-2">
                    <EmptyState
                        variant="wave"
                        size={280}
                        offset={-48}
                        illustration={
                            <IconFrame>
                                <LiBoxSearch className="text-xl heading-text" />
                            </IconFrame>
                        }
                    >
                        <div className="text-center space-y-2">
                            <h3>No Project Found</h3>
                            <p className="max-w-[400px]">
                                No projects found for the selected filters.
                            </p>
                        </div>
                    </EmptyState>
                </div>
            )}
        </Container>
    )
}

export default ProjectListContent
