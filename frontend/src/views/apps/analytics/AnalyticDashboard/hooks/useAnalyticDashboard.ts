import useSWR from 'swr'
import { apiGetAnalyticDashboard } from '@/services/AnalyticService'
import type { AnalyticDashboardData } from '../types'

const useAnalyticDashboard = () => {
    const { data, error, isLoading, mutate } = useSWR<AnalyticDashboardData>(
        '/api/analytic/dashboard',
        () => apiGetAnalyticDashboard<AnalyticDashboardData>(),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        dashboardData: data,
        isLoading,
        error,
        mutate,
    }
}

export default useAnalyticDashboard
