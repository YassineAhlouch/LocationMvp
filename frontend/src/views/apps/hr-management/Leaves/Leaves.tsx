import LeaveContext from './components/LeaveContext'
import LeaveHeader from '@/views/apps/hr-management/Leaves/components/LeaveHeader'
import LeaveContent from '@/views/apps/hr-management/Leaves/components/LeaveContent'
import Container from '@/components/shared/Container'

const Leaves = () => {
    return (
        <LeaveContext>
            <Container className="px-4 h-full">
                <LeaveHeader />
                <LeaveContent />
            </Container>
        </LeaveContext>
    )
}

export default Leaves
