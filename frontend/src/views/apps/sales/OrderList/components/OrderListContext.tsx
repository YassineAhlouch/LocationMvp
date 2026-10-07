import DataContext from '../context/DataContext'
import { apiGetOrderList } from '@/services/SalesService'
import useQueryParamPagingState from '@/utils/hooks/useQueryParamPagingState'
import useSWR from 'swr'
import type { ReactNode } from 'react'
import type { GetOrderListResponse } from '../types'

type OrderListContextProps = {
    children: ReactNode
}

const OrderListContext = ({ children }: OrderListContextProps) => {
    const { pagingState, filterState, setQueryParams } =
        useQueryParamPagingState()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { range: _, ...restFilterState } = filterState

    const { data, isLoading, mutate } = useSWR(
        ['/api/order-list', { ...pagingState, ...restFilterState }],
        ([, params]) =>
            apiGetOrderList<GetOrderListResponse, Record<string, unknown>>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    const setData = (
        updater: (draft: GetOrderListResponse) => GetOrderListResponse,
    ) => {
        mutate(
            (prev) => {
                if (!prev) return prev
                const next = structuredClone(prev)
                return updater(next)
            },
            { revalidate: false },
        )
    }

    return (
        <DataContext.Provider
            value={{
                data: data || null,
                isLoading,
                setData,
                setQueryParams,
                pagingState,
                filterState,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default OrderListContext
