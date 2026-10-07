import { apiGetCustomer } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams } from 'react-router'
import type { Lead } from '../types'

const useLeadDetails = () => {
    const param = useParams()
    const leadId = param.leadId

    const { data, isLoading, mutate } = useSWR(
        [`/api/lead/${leadId}`, { id: leadId as string }],
        ([, params]) => apiGetCustomer<Lead, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    return {
        data,
        isLoading,
        mutate,
        param,
        leadId: leadId as string,
    }
}

export default useLeadDetails
