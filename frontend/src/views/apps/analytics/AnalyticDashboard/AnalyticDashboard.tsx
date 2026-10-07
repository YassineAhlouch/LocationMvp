import useAnalyticDashboard from './hooks/useAnalyticDashboard'
import AnalyticDashboardContainer from './components/AnalyticDashboardContainer'
import AnalyticDashboardLoaders from './components/AnalyticDashboardLoaders'
import RecurringRevenueHealth from './components/RecurringRevenueHealth'
import AcquisitionChannels from './components/AcquisitionChannels'
import CashRunway from './components/CashRunway'
import NetRevenueRetention from './components/NetRevenueRetention'
import ChurnMetrics from './components/ChurnMetrics'
import RevenuePlan from './components/RevenuePlan'
import AtRiskAccounts from './components/AtRiskAccounts'
import PlatformStability from './components/PlatformStability'
import TrialFunnel from './components/TrialFunnel'

const AnalyticDashboard = () => {
    const { dashboardData, isLoading } = useAnalyticDashboard()

    if (isLoading || !dashboardData) {
        return <AnalyticDashboardLoaders />
    }

    return (
        <AnalyticDashboardContainer
            recurringRevenueHealth={
                <RecurringRevenueHealth data={dashboardData.arr} />
            }
            channels={<AcquisitionChannels data={dashboardData.channels} />}
            cashRunway={<CashRunway data={dashboardData.cashRunway} />}
            nrr={<NetRevenueRetention data={dashboardData.nrr} />}
            churn={<ChurnMetrics data={dashboardData.churn} />}
            plans={<RevenuePlan data={dashboardData.plans} />}
            atRiskAccounts={
                <AtRiskAccounts data={dashboardData.atRiskAccounts} />
            }
            platformStability={
                <PlatformStability data={dashboardData.platformStability} />
            }
            trialFunnel={<TrialFunnel data={dashboardData.trialFunnel} />}
        />
    )
}

export default AnalyticDashboard
