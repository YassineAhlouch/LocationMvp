import DataContext from '../context/DataContext'
import useQueryParamPagingState from '@/utils/hooks/useQueryParamPagingState'
import { apiGetProductList } from '@/services/SalesService'
import useSWR from 'swr'
import type { GetProductListResponse } from '../types'
import type { ReactNode } from 'react'

type ProductListContextProps = {
    children: ReactNode
}

const ProductListContext = ({ children }: ProductListContextProps) => {
    const { pagingState, filterState, setQueryParams } =
        useQueryParamPagingState()

    const { data, isLoading, mutate } = useSWR(
        ['/api/products', { ...pagingState, filterState }],
        ([, params]) =>
            apiGetProductList<GetProductListResponse, Record<string, unknown>>({
                ...params,
            }),
        {
            revalidateOnFocus: false,
        },
    )

    const setData = (
        callback: (data: GetProductListResponse) => GetProductListResponse,
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

export default ProductListContext
