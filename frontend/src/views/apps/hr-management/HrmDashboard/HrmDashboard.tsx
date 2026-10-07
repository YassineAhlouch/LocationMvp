import HrmDashboardLoaders from './components/HrmDashboardLoaders'
import HrmDashboardContainer from './components/HrmDashboardContainer'
import TurnoverRate from './components/TurnoverRate'
import JobLevelDistribution from './components/JobLevelDistribution'
import PayrollBurnRate from './components/PayrollBurnRate'
import EmployeeQualityScore from './components/EmployeeQualityScore'
import EventsCenter from './components/EventsCenter'
import ComplianceIssuesWidget from './components/ComplianceIssues'
import useHrmDashboard from './hooks/useHrmDashboard'

const HrmDashboard = () => {
    const { dashboardData, isLoading } = useHrmDashboard()

    if (isLoading || !dashboardData) {
        return <HrmDashboardLoaders />
    }

    return (
        <HrmDashboardContainer
            turnoverWidget={<TurnoverRate data={dashboardData.turnover} />}
            jobLevelWidget={
                <JobLevelDistribution data={dashboardData.jobLevel} />
            }
            payrollWidget={<PayrollBurnRate data={dashboardData.payroll} />}
            employeeQualityWidget={
                <EmployeeQualityScore data={dashboardData.employeeQuality} />
            }
            complianceWidget={
                <ComplianceIssuesWidget data={dashboardData.compliance} />
            }
            eventsWidget={<EventsCenter data={dashboardData.actions} />}
        />
    )
}

export default HrmDashboard
