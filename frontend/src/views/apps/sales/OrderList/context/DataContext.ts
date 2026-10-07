import { createContext } from 'react'
import type { GetOrderListResponse } from '../types'
import type { TableQueries } from '@/@types/common'

type DataContextProps = {
    data: GetOrderListResponse | null
    pagingState: TableQueries
    filterState: Record<string, string>
    isLoading: boolean
    setQueryParams: (params: Record<string, unknown>) => void
    setData: (
        callback: (data: GetOrderListResponse) => GetOrderListResponse,
    ) => void
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
    setQueryParams: () => {},
    setData: () => {},
})

export default DataContext
