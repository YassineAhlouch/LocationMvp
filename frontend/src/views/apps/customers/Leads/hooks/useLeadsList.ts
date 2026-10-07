import { apiGetLeadsList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useLeadsListStore } from '../store/leadsListStore'
import type { GetLeadsListResponse } from '../types'
import type { TableQueries } from '@/@types/common'

export default function useLeadsList() {
    const pagingState = useLeadsListStore((state) => state.pagingState)
    const filterData = useLeadsListStore((state) => state.filterData)

    const {
        data: leadsListData,
        error,
        isLoading,
        mutate,
    } = useSWR(
        ['/api/leads', { ...pagingState, ...filterData }],
        ([, params]) =>
            apiGetLeadsList<GetLeadsListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const leadsList = leadsListData?.list || []

    const leadsListTotal = leadsListData?.total || 0

    return {
        leadsList,
        leadsListTotal,
        error,
        isLoading,
        mutate,
    }
}
