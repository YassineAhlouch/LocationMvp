import useSWR from 'swr'
import { apiGetCrmDashboard } from '@/services/CustomersService'
import { useCrmDashboardStore } from '@/views/apps/customers/CrmDashboard/store/crmDashboardStore'
import type { UseCrmDashboardReturn, CrmDashboardData } from '../types'

const useCrmDashboard = (): UseCrmDashboardReturn => {
    const { filters } = useCrmDashboardStore()

    // Create a key that includes filter parameters for automatic refetching
    const swrKey = {
        url: '/crm/dashboard',
        teamSelection: filters.teamSelection,
        timeHorizon: filters.timeHorizon,
    }

    const { data, error, isLoading, mutate } = useSWR<CrmDashboardData>(
        swrKey,
        () =>
            apiGetCrmDashboard({
                teamSelection: filters.teamSelection,
                timeHorizon: filters.timeHorizon,
            }),
        {
            revalidateOnFocus: true,
            refreshInterval: 30000, // 30 seconds
            revalidateOnReconnect: true,
        },
    )

    return {
        dashboardData: data || null,
        isLoading,
        error: error || null,
        refresh: mutate,
    }
}

export default useCrmDashboard
