import { Dialog, Segment } from '@/components/ui'
import { useLeavesStore } from '../store/leavesStore'
import AddLeaveRequestForm from './AddLeaveRequestForm'
import CreateHolidayForm from './CreateHolidayForm'

type CreateDialogProps = {
    isOpen: boolean
    selectedDate?: Date
    activeTab: 'holiday' | 'leave'
}

const CreateDialog = ({
    isOpen,
    selectedDate,
    activeTab,
}: CreateDialogProps) => {
    const { closeAllDialogs, setCreateDialogTab } = useLeavesStore()

    const segmentOptions = [
        { value: 'holiday', label: 'Create Holiday' },
        { value: 'leave', label: 'Add Leave Request' },
    ]

    const handleClose = () => {
        closeAllDialogs()
    }

    const handleSegmentChange = (value: string) => {
        setCreateDialogTab(value as 'holiday' | 'leave')
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} closable={false}>
            <div className="mb-4">
                <Segment
                    value={activeTab}
                    onChange={handleSegmentChange}
                    className="w-full"
                >
                    {segmentOptions.map((option) => (
                        <Segment.Item key={option.value} value={option.value}>
                            {option.label}
                        </Segment.Item>
                    ))}
                </Segment>
            </div>

            {/* Holiday Form */}
            {activeTab === 'holiday' && (
                <CreateHolidayForm
                    selectedDate={selectedDate}
                    onSuccess={handleClose}
                    onCancel={handleClose}
                />
            )}

            {/* Leave Request Form */}
            {activeTab === 'leave' && (
                <AddLeaveRequestForm
                    selectedDate={selectedDate}
                    onSuccess={handleClose}
                    onCancel={handleClose}
                />
            )}
        </Dialog>
    )
}

export default CreateDialog
