import Container from '@/components/shared/Container'
import Revenueheader from './components/RevenueHeader'
import RevenueTrendsChart from './components/RevenueTrendsChart'
import RevenueBreakdownTable from './components/RevenueBreakdownTable'

const Revenue = () => {
    return (
        <Container>
            <div className="space-y-4">
                <Revenueheader />
                <RevenueTrendsChart />
                <RevenueBreakdownTable />
            </div>
        </Container>
    )
}

export default Revenue
