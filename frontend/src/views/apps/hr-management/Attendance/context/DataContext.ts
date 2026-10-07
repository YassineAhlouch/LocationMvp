import { createContext } from 'react'
import type { GetAttendanceResponse } from '../types'
import type { TableQueries } from '@/@types/common'

type DataContextProps = {
    data: GetAttendanceResponse | null
    pagingState: TableQueries
    filterState: Record<string, string>
    selectedDate: string
    isLoading: boolean
    setQueryParams: (params: Record<string, unknown>) => void
    setData: (
        callback: (data: GetAttendanceResponse) => GetAttendanceResponse,
    ) => void
    setSelectedDate: (date: string) => void
}

const DataContext = createContext<DataContextProps>({
    data: null,
    isLoading: false,
    pagingState: {
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sortOrder: '',
        sortKey: '',
    },
    filterState: {},
    selectedDate: new Date().toISOString().split('T')[0],
    setQueryParams: () => {},
    setData: () => {},
    setSelectedDate: () => {},
})

export default DataContext
