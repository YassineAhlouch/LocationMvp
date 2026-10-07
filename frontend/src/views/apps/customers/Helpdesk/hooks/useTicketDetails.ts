import { apiGetHelpdeskTicket } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams } from 'react-router'
import type { TicketDetails } from '../types'

const useTicketDetails = () => {
    const param = useParams()

    const selectedTicket = param.ticketId

    const { data, isLoading, mutate } = useSWR(
        [
            `/api/helpdesk/tickets${selectedTicket}`,
            { id: selectedTicket || '' },
        ],
        ([, params]) => {
            if (selectedTicket) {
                return apiGetHelpdeskTicket<TicketDetails, { id: string }>(
                    params,
                )
            }
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    return {
        ticketDetails: data,
        selectedTicket,
        isLoading,
        mutate,
    }
}

export default useTicketDetails
