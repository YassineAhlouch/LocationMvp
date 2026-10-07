import Card from '@/components/ui/Card'
import Container from '@/components/shared/Container'
import AttendanceContext from './components/AttendanceContext'
import AttendanceHeader from './components/AttendanceHeader'
import AttendanceMetrics from './components/AttendanceMetrics'
import AttendanceToolbar from './components/AttendanceToolbar'
import AttendanceView from './components/AttendanceView'
import MarkAttendanceDialog from './components/MarkAttendanceDialog'
import { useAttendanceStore } from './store/attendanceStore'
import type { AttendanceRecord } from './types'

const AttendanceContent = () => {
    const { setSelectedRecord, setMarkAttendanceOpen } = useAttendanceStore()

    const handleMarkAttendance = (
        record: AttendanceRecord | AttendanceRecord[],
    ) => {
        if (Array.isArray(record)) {
            setSelectedRecord(null)
        } else {
            setSelectedRecord(record)
        }
        setMarkAttendanceOpen(true)
    }

    const handleAddRecord = () => {
        setSelectedRecord(null)
        setMarkAttendanceOpen(true)
    }

    return (
        <Container>
            <AttendanceHeader />
            <AttendanceMetrics />
            <Card bodyClass="p-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <AttendanceToolbar onAddRecord={handleAddRecord} />
                </div>
                <AttendanceView onMarkAttendance={handleMarkAttendance} />
            </Card>
            <MarkAttendanceDialog />
        </Container>
    )
}

const Attendance = () => {
    return (
        <AttendanceContext>
            <AttendanceContent />
        </AttendanceContext>
    )
}

export default Attendance
