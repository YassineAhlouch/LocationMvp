import useSWR from 'swr'
import { apiGetSalesDashboardData } from '@/services/SalesService'
import { useSalesDashboardStore } from '@/views/apps/sales/SalesDashboard/store/salesDashboardStore'
import type { SalesDashboardResponse } from '../types'

const useSalesDashboard = () => {
    const { getApiParams } = useSalesDashboardStore()

    const apiParams = getApiParams()

    const swrKey = ['/api/sales/dashboard-data', apiParams]

    const { data, error, isLoading } = useSWR(
        swrKey,
        () =>
            apiGetSalesDashboardData<SalesDashboardResponse, typeof apiParams>(
                apiParams,
            ),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const dashboardData = data?.data
    const isError = !!error

    const errorState = isError
        ? {
              type: 'network' as const,
              message: error?.message || 'Failed to load dashboard data',
              retryable: true,
              fallbackData: dashboardData,
          }
        : null

    return {
        isLoading: isLoading && !dashboardData,
        error: errorState,
        isError,
        meta: data?.meta,
        metrics: dashboardData?.metrics,
        revenueTrend: dashboardData?.revenueTrend,
        topSellingCategories: dashboardData?.topSellingCategories,
        supportingMetrics: dashboardData?.supportingMetrics,
        topCampaigns: dashboardData?.topCampaigns,
    }
}

export default useSalesDashboard
