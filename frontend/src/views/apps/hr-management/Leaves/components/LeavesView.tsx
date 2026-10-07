import Container from '@/components/shared/Container'
import LeaveStatistics from './LeaveStatistics'
import LeaveTables from './LeaveTables'

const LeavesView = () => {
    return (
        <Container className="h-full overflow-auto">
            <div className="space-y-6">
                <LeaveStatistics />
                <LeaveTables />
            </div>
        </Container>
    )
}

export default LeavesView
