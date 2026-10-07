import { Suspense, lazy } from 'react'
import { Spinner } from '@/components/ui'
import { useLeavesStore } from '../store/leavesStore'

const CalendarView = lazy(
    () => import('@/views/apps/hr-management/Leaves/components/CalendarView'),
)
const LeavesView = lazy(
    () => import('@/views/apps/hr-management/Leaves/components/LeavesView'),
)

const LeaveContent = () => {
    const { selectedView } = useLeavesStore()

    const renderContent = () => {
        switch (selectedView) {
            case 'calendars':
                return <CalendarView />
            case 'leaves':
                return <LeavesView />
            default:
                return <CalendarView />
        }
    }

    return (
        <div className="flex-1 overflow-hidden h-[calc(100%-100px)]">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-full">
                        <Spinner size={40} />
                    </div>
                }
            >
                {renderContent()}
            </Suspense>
        </div>
    )
}

export default LeaveContent
