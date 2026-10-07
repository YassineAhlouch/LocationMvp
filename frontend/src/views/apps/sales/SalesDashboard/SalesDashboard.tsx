import SalesDashboardContainer from './components/SalesDashboardContainer'
import SalesDashboardLoaders from './components/SalesDashboardLoaders'
import SalesDashboardHeader from './components/SalesDashboardHeader'
import MetricCard from './components/MetricCard'
import RevenueOrder from './components/RevenueOrder'
import TopSellingCategories from './components/TopSellingCategories'
import AverageOrderValue from './components/AverageOrderValue'
import CustomerSegment from './components/CustomerSegment'
import TrafficAnalysis from './components/TrafficAnalysis'
import TopPerformingCampaigns from './components/TopPerformingCampaigns'
import useSalesDashboard from './hooks/useSalesDashboard'
import formatCurrency from '@/utils/formatCurrency'
import {
    LiPercentageCircle,
    LiUserAdd,
    LiBarChartUp,
    LiWalletMoney,
} from '@/icons'

const SalesDashboard = () => {
    const {
        isLoading,
        metrics,
        revenueTrend,
        topSellingCategories,
        supportingMetrics,
        topCampaigns,
    } = useSalesDashboard()

    if (isLoading) {
        return <SalesDashboardLoaders />
    }

    return (
        <SalesDashboardContainer
            header={
                <SalesDashboardHeader
                    userName="Angelina"
                    currentDate={new Date()}
                />
            }
            metrics={
                <>
                    <MetricCard
                        title="Conversion Rate"
                        value={`${metrics?.conversionRate.value || 0}%`}
                        change={metrics?.conversionRate.change || 0}
                        icon={<LiPercentageCircle />}
                    />
                    <MetricCard
                        title="Acquisition Cost"
                        value={metrics?.customerAcquisitionCost.value || 0}
                        change={metrics?.customerAcquisitionCost.change || 0}
                        icon={<LiUserAdd />}
                        formatter={formatCurrency}
                    />
                    <MetricCard
                        title="Average Revenue"
                        value={metrics?.averageRevenue.value || 0}
                        change={metrics?.averageRevenue.change || 0}
                        icon={<LiBarChartUp />}
                        formatter={formatCurrency}
                    />
                    <MetricCard
                        title="Expense Total"
                        value={metrics?.expenseTotal.value || 0}
                        change={metrics?.expenseTotal.change || 0}
                        icon={<LiWalletMoney />}
                        formatter={formatCurrency}
                    />
                </>
            }
            revenueTrend={
                <RevenueOrder
                    data={revenueTrend?.current || []}
                    comparisonData={revenueTrend?.previous || []}
                    totalRevenue={revenueTrend?.total || 0}
                    change={revenueTrend?.change || 0}
                    totalOrders={revenueTrend?.totalOrders || 0}
                    ordersChange={revenueTrend?.ordersChange || 0}
                    timeRange="thisMonth"
                />
            }
            topSellingCategories={
                <TopSellingCategories
                    data={topSellingCategories || []}
                    loading={false}
                />
            }
            averageOrderValue={
                <AverageOrderValue
                    data={
                        supportingMetrics?.averageOrderValue || {
                            value: 0,
                            change: 0,
                            chartData: [],
                        }
                    }
                />
            }
            customerSegment={
                <CustomerSegment
                    data={
                        supportingMetrics?.customerSegment || {
                            chartData: [],
                            newCustomers: {
                                total: 0,
                                percentage: 0,
                                change: 0,
                            },
                            returningCustomers: {
                                total: 0,
                                percentage: 0,
                                change: 0,
                            },
                            totalCustomers: 0,
                            retentionRate: 0,
                            revenueSplit: {
                                newPercentage: 0,
                                returningPercentage: 0,
                            },
                            repeatPurchaseRatio: 0,
                        }
                    }
                />
            }
            totalSessions={
                <TrafficAnalysis
                    data={
                        supportingMetrics?.totalSessions || {
                            value: 0,
                            change: 0,
                            chartData: [],
                            sources: [],
                            bounceRate: { value: 0, change: 0 },
                        }
                    }
                />
            }
            topCampaigns={<TopPerformingCampaigns data={topCampaigns || []} />}
        />
    )
}

export default SalesDashboard
