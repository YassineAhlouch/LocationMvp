import { useCallback, useMemo, type ReactNode } from 'react'
import useSWR from 'swr'
import DataContext from '../context/DataContext'
import useQueryParamPagingState from '@/utils/hooks/useQueryParamPagingState'
import {
    apiGetMarketData,
    apiGetMarketStatistics,
} from '@/services/CryptoService'
import type {
    GetMarketDataResponse,
    GetMarketStatisticsResponse,
    MarketType,
    MarketFilters,
} from '../types'

type MarketContextProps = {
    children: ReactNode
}

const MarketContext = ({ children }: MarketContextProps) => {
    // Use URL parameters as single source of truth for all state
    // This enables: bookmarkable URLs, shareable links, proper browser back/forward navigation
    const { pagingState, filterState, setQueryParams } =
        useQueryParamPagingState({
            pageIndex: 1,
            pageSize: 20,
            sortOrder: 'desc',
            sortKey: 'marketCap',
        })

    const filters: MarketFilters = useMemo(() => {
        return {
            search: (filterState.search as string) || '',
            tab: filterState.tab || 'all',
            priceRange: [0, 100000], // These could also be URL params if needed
            volumeRange: [0, 100000000000], // These could also be URL params if needed
            changeFilter:
                (filterState.changeFilter as MarketFilters['changeFilter']) ||
                'all',
            volumeFilter: filterState.volumeFilter
                ? (filterState.volumeFilter as string).split(',')
                : undefined,
            priceFilter: filterState.priceFilter
                ? (filterState.priceFilter as string).split(',')
                : undefined,
        }
    }, [
        filterState.search,
        filterState.tab,
        filterState.changeFilter,
        filterState.volumeFilter,
        filterState.priceFilter,
    ])

    // Fetch market data with SWR
    const {
        data: marketDataResponse,
        isLoading: isMarketDataLoading,
        error: marketDataError,
        mutate: mutateMarketData,
    } = useSWR(
        [
            '/api/crypto/market',
            {
                ...pagingState,
                ...filterState,
                marketType: filters.tab,
                query: filters.search,
            },
        ],
        ([, params]) =>
            apiGetMarketData<GetMarketDataResponse, Record<string, unknown>>(
                params,
            ),
        {
            revalidateOnFocus: false,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
        },
    )

    // Fetch market statistics with SWR
    const {
        data: statisticsResponse,
        isLoading: isStatisticsLoading,
        error: statisticsError,
    } = useSWR(
        '/api/crypto/market/statistics',
        () =>
            apiGetMarketStatistics<
                GetMarketStatisticsResponse,
                Record<string, unknown>
            >({}),
        {
            revalidateOnFocus: false,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
        },
    )

    const isLoading = isMarketDataLoading || isStatisticsLoading

    const setData = useCallback(
        (callback: (data: GetMarketDataResponse) => GetMarketDataResponse) => {
            if (marketDataResponse) {
                mutateMarketData(callback(marketDataResponse), false)
            }
        },
        [marketDataResponse, mutateMarketData],
    )

    const handleSetActiveTab = useCallback(
        (tab: MarketType) => {
            setQueryParams(
                {
                    tab,
                },
                true,
            )
        },
        [setQueryParams],
    )

    // Handle filter changes - update URL parameters
    const setFilters = useCallback(
        (newFilters: Partial<MarketFilters>) => {
            const updatedParams: Record<string, unknown> = {
                pageIndex: 1,
            }

            if (newFilters.search !== undefined) {
                updatedParams.search = newFilters.search
            }
            if (newFilters.changeFilter !== undefined) {
                updatedParams.changeFilter = newFilters.changeFilter
            }
            if (newFilters.volumeFilter !== undefined) {
                updatedParams.volumeFilter =
                    newFilters.volumeFilter.length > 0
                        ? newFilters.volumeFilter.join(',')
                        : ''
            }
            if (newFilters.priceFilter !== undefined) {
                updatedParams.priceFilter =
                    newFilters.priceFilter.length > 0
                        ? newFilters.priceFilter.join(',')
                        : ''
            }

            setQueryParams(updatedParams)
        },
        [setQueryParams],
    )

    const refreshData = useCallback(() => {
        mutateMarketData()
    }, [mutateMarketData])

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            marketData: marketDataResponse?.data || null,
            statistics: statisticsResponse || null,
            activeTab: filters.tab as MarketType,
            filters,
            pagingState,
            filterState,
            isLoading,
            error: marketDataError || statisticsError,
            setActiveTab: handleSetActiveTab,
            setFilters,
            setQueryParams,
            setData,
            refreshData,
        }),
        [
            marketDataResponse?.data,
            statisticsResponse,
            filters,
            pagingState,
            filterState,
            isLoading,
            marketDataError,
            statisticsError,
            handleSetActiveTab,
            setFilters,
            setQueryParams,
            setData,
            refreshData,
        ],
    )

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    )
}

export default MarketContext
