import { Segment } from '@/components/ui'
import { useLeavesStore } from '../store/leavesStore'

const LeaveHeader = () => {
    const { selectedView, setSelectedView } = useLeavesStore()

    const viewOptions = [
        { value: 'calendars', label: 'Calendars' },
        { value: 'leaves', label: 'Leaves' },
    ]

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
            <div>
                <h4>Leave Management</h4>
                <p className="mt-1">
                    Manage employee leave requests and company holidays
                </p>
            </div>
            <Segment
                value={selectedView}
                onChange={(value) =>
                    setSelectedView(value as 'calendars' | 'leaves')
                }
                className="w-full sm:w-auto"
            >
                {viewOptions.map((option) => (
                    <Segment.Item key={option.value} value={option.value}>
                        {option.label}
                    </Segment.Item>
                ))}
            </Segment>
        </div>
    )
}

export default LeaveHeader
