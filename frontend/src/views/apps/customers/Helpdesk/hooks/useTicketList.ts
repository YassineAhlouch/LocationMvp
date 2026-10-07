import { useHelpdeskStore } from '../store/helpdeskStore'
import { apiGetHelpdeskTickets } from '@/services/CustomersService'
import useSWR from 'swr'
import type { GetHelpdeskTicketsResponse } from '../types'
import type { TableQueries } from '@/@types/common'

const useTicketList = () => {
    const pagingState = useHelpdeskStore((state) => state.pagingState)
    const filterData = useHelpdeskStore((state) => state.filterData)

    const {
        data: helpdeskTicketsData,
        error,
        isLoading,
        mutate,
    } = useSWR(
        ['/api/helpdesk/tickets', { ...pagingState, ...filterData }],
        ([, params]) =>
            apiGetHelpdeskTickets<GetHelpdeskTicketsResponse, TableQueries>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    const ticketList = helpdeskTicketsData?.list || []

    const ticketListTotal = helpdeskTicketsData?.total || 0

    return {
        ticketList,
        ticketListTotal,
        error,
        isLoading,
        mutate,
    }
}

export default useTicketList
