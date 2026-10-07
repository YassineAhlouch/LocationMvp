import useSWR from 'swr'
import { apiGetProjectDashboard } from '@/services/ProjectService'
import type { DashboardData } from '../types'

const useProjectDashboard = () => {
    const { data, error, isLoading, mutate } = useSWR<DashboardData>(
        '/api/projects/dashboard',
        async () => {
            const response = await apiGetProjectDashboard<DashboardData>()
            return response
        },
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

export default useProjectDashboard
