import useSWR from 'swr'
import DataContext from '../context/DataContext'
import useQueryParamPagingState from '@/utils/hooks/useQueryParamPagingState'
import { useAttendanceStore } from '../store/attendanceStore'
import { apiGetAttendanceData } from '@/services/HrmService'
import type { ReactNode } from 'react'
import type { GetAttendanceResponse } from '../types'

type AttendanceContextProps = {
    children: ReactNode
}

const AttendanceContext = ({ children }: AttendanceContextProps) => {
    const { pagingState, filterState, setQueryParams } =
        useQueryParamPagingState()
    const { selectedDate, setSelectedDate } = useAttendanceStore()

    const { data, isLoading, mutate } = useSWR(
        [
            '/api/hrm/attendance',
            { date: selectedDate, ...pagingState, ...filterState },
        ],
        ([, params]) => apiGetAttendanceData<GetAttendanceResponse>(params),
        {
            revalidateOnFocus: false,
        },
    )

    // Optimistic updates using sleep() for simulation
    const setData = (
        callback: (data: GetAttendanceResponse) => GetAttendanceResponse,
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
                selectedDate,
                isLoading,
                setData,
                setQueryParams,
                setSelectedDate,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default AttendanceContext
