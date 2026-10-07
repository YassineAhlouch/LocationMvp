import DataContext from '../context/DataContext'
import useQueryParamPagingState from '@/utils/hooks/useQueryParamPagingState'
import { apiGetReports } from '@/services/AnalyticService'
import useSWR from 'swr'
import { useMemo } from 'react'
import type { ReactNode } from 'react'
import type { GetReportsResponse } from '../types'

type ReportsContextProps = {
    children: ReactNode
}

const ReportsContext = ({ children }: ReportsContextProps) => {
    const { pagingState, filterState, setQueryParams } =
        useQueryParamPagingState({
            pageSize: 25,
        })

    const apiParams = useMemo(
        () => ({
            ...pagingState,
            ...filterState,
        }),
        [pagingState, filterState],
    )

    const { data, isLoading, mutate } = useSWR(
        ['/api/analytic/reports', apiParams],
        async ([, params]) =>
            apiGetReports<GetReportsResponse, Record<string, unknown>>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const setData = (
        callback: (data: GetReportsResponse) => GetReportsResponse,
    ) => {
        if (data) {
            mutate(callback(data), false)
        }
    }

    return (
        <DataContext.Provider
            value={{
                data: data || null,
                pagingState,
                filterState,
                isLoading,
                setData,
                setQueryParams,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default ReportsContext
