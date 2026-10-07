import AttendanceTable from './AttendanceTable'
import AttendancePeriodView from './AttendancePeriodView'
import { useAttendanceStore } from '../store/attendanceStore'
import type { AttendanceRecord } from '../types'

type AttendanceViewProps = {
    onMarkAttendance: (record: AttendanceRecord | AttendanceRecord[]) => void
}

const AttendanceView = ({ onMarkAttendance }: AttendanceViewProps) => {
    const { viewMode } = useAttendanceStore()

    return (
        <div className="pb-4">
            {viewMode === 'list' && (
                <AttendanceTable onMarkAttendance={onMarkAttendance} />
            )}
            {viewMode === 'period' && <AttendancePeriodView />}
        </div>
    )
}

export default AttendanceView
