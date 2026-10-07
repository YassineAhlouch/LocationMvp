import { useState, useMemo, useCallback } from 'react'
import DataContext from '../context/DataContext'
import { apiGetActivityLogs } from '@/services/AccountService'
import useSWR from 'swr'
import type { ReactNode } from 'react'
import type { GetActivityLogResponse, Filter, Activities } from '../types'

type ProjectListContextProps = {
    children: ReactNode
}
const ActivityContext = ({ children }: ProjectListContextProps) => {
    const [filter, setFilter] = useState<Filter>({})
    const [activities, setActivities] = useState<Record<number, Activities>>({})
    const [loadable, setLoadable] = useState(true)
    const [activityIndex, setActivityIndex] = useState(1)

    const resetActivitiesOnFilterChange = useCallback(() => {
        setActivities({})
        setActivityIndex(1)
    }, [])

    const { isLoading } = useSWR(
        [
            `/api/activity-logs?activityIndex=${activityIndex}&filter=${JSON.stringify(filter)}`,
        ],
        () =>
            apiGetActivityLogs<GetActivityLogResponse, Record<string, unknown>>(
                { filter, activityIndex },
            ),
        {
            revalidateOnFocus: false,

            onSuccess: (data) => {
                if (data) {
                    setActivities((prev) => ({
                        ...prev,
                        [activityIndex]: data.list,
                    }))
                    setLoadable(data.loadable)
                }
            },
        },
    )

    const data = useMemo(() => {
        return (
            Object.entries(activities)
                .map(([, value]) => value)
                .flatMap((item) => item)
        )
    }, [activities])

    const handleLoadMore = useCallback(() => {
        setActivityIndex((prev) => prev + 1)
    }, [])

    const handleFilterChange = (newFilter: Filter) => {
        setFilter(newFilter)
        resetActivitiesOnFilterChange()
    }

    return (
        <DataContext.Provider
            value={{
                data: data ? data : [],
                isLoading,
                loadable,
                activityIndex,
                filter,
                onLoadMore: handleLoadMore,
                onFilterChange: handleFilterChange,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default ActivityContext
