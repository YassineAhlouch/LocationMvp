import { createContext } from 'react'
import type { MarketDataContextProps } from '../types'

const DataContext = createContext<MarketDataContextProps>({
    marketData: null,
    statistics: null,
    activeTab: 'all',
    filters: {
        tab: 'all',
        search: '',
        priceRange: [0, 100000],
        volumeRange: [0, 100000000000],
        changeFilter: 'all',
    },
    pagingState: {
        pageIndex: 1,
        pageSize: 20,
        query: '',
        sortOrder: 'desc',
        sortKey: 'marketCap',
    },
    filterState: {},
    isLoading: false,
    error: null,

    // Actions
    setActiveTab: () => {},
    setFilters: () => {},
    setQueryParams: () => {},
    setData: () => {},
    refreshData: () => {},
})

export default DataContext
