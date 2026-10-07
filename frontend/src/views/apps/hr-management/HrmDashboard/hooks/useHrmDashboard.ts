import useSWR from 'swr'
import { apiGetHrmDashboard } from '@/services/HrmService'
import type { HrmDashboardData } from '../types'

const useHrmDashboard = () => {
    const { data, error, isLoading, mutate } = useSWR<HrmDashboardData>(
        '/api/hrm/dashboard',
        () => apiGetHrmDashboard<HrmDashboardData>(),
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

export default useHrmDashboard
