import { apiGetCustomersList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { GetCustomersListResponse } from '../types'
import type { TableQueries } from '@/@types/common'

export default function useCustomerList() {
    const {
        pagingState,
        filterData,
        setPagingState,
        selectedRows,
        setSelectedRows,
        setSelectAllRows,
        setFilterData,
    } = useCustomerListStore((state) => state)

    const {
        data: customerListData,
        error,
        isLoading,
        mutate,
    } = useSWR(
        ['/api/customers', { ...pagingState, ...filterData }],
        ([, params]) =>
            apiGetCustomersList<GetCustomersListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const customerList = customerListData?.list || []

    const customerListTotal = customerListData?.total || 0

    return {
        customerList,
        customerListTotal,
        error,
        isLoading,
        pagingState,
        filterData,
        mutate,
        setPagingState,
        selectedRows,
        setSelectedRows,
        setSelectAllRows,
        setFilterData,
    }
}
