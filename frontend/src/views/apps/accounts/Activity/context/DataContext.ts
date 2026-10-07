import { createContext } from 'react'
import type { Activities, Filter } from '../types'

type DataContextProps = {
    data: Activities
    isLoading: boolean
    loadable: boolean
    activityIndex: number
    filter: Filter
    onLoadMore: () => void
    onFilterChange: (filter: Filter) => void
}

const DataContext = createContext<DataContextProps>({
    data: [],
    isLoading: false,
    loadable: true,
    activityIndex: 1,
    filter: {},
    onLoadMore: () => {},
    onFilterChange: () => {},
})

export default DataContext
