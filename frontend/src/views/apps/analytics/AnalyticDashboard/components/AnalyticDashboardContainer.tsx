import Container from '@/components/shared/Container'
import type { ReactNode } from 'react'

type AnalyticDashboardContainerProps = {
    recurringRevenueHealth: ReactNode
    channels: ReactNode
    cashRunway: ReactNode
    nrr: ReactNode
    churn: ReactNode
    plans: ReactNode
    atRiskAccounts: ReactNode
    platformStability: ReactNode
    trialFunnel: ReactNode
}

const AnalyticDashboardContainer = ({
    recurringRevenueHealth,
    channels,
    cashRunway,
    nrr,
    churn,
    plans,
    atRiskAccounts,
    platformStability,
    trialFunnel,
}: AnalyticDashboardContainerProps) => {
    return (
        <Container>
            <div className="space-y-4">
                <div>
                    <h4>Analytics Dashboard</h4>
                    <p className="mt-1">
                        Real-time business intelligence and key metrics
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {recurringRevenueHealth}
                    {channels}
                    {cashRunway}
                    {nrr}
                    {churn}
                    {plans}
                    {atRiskAccounts}
                    {trialFunnel}
                    {platformStability}
                </div>
            </div>
        </Container>
    )
}

export default AnalyticDashboardContainer
