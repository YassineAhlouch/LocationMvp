import { createContext } from 'react'
import type { GetReportsResponse } from '../types'
import type { TableQueries } from '@/@types/common'

type DataContextProps = {
    data: GetReportsResponse | null
    pagingState: TableQueries
    filterState: Record<string, string>
    isLoading: boolean
    setQueryParams: (params: Record<string, unknown>) => void
    setData: (
        callback: (data: GetReportsResponse) => GetReportsResponse,
    ) => void
}

const DataContext = createContext<DataContextProps>({
    data: null,
    isLoading: false,
    pagingState: {
        pageIndex: 1,
        pageSize: 25,
        query: '',
        sortOrder: '',
        sortKey: '',
    },
    filterState: {},
    setQueryParams: () => {},
    setData: () => {},
})

export default DataContext
