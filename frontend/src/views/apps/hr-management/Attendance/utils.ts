import type { AttendanceStatus } from './types'
import { colors } from '@/constants/colors.constant'
import { LuCheck, LuX, LuClock, LuCalendar, LuGlobe } from 'react-icons/lu'

// Get attendance status configuration
export const getAttendanceStatusConfig = (status: AttendanceStatus) => {
    const statusConfig = {
        present: {
            className: `${colors.emerald.iconBg} ${colors.emerald.iconText}`,
            label: 'Present',
            icon: LuCheck,
        },
        absent: {
            className: `${colors.red.iconBg} ${colors.red.iconText}`,
            label: 'Absent',
            icon: LuX,
        },
        late: {
            className: `${colors.yellow.iconBg} ${colors.yellow.iconText}`,
            label: 'Late',
            icon: LuClock,
        },
        on_leave: {
            className: `${colors.blue.iconBg} ${colors.blue.iconText}`,
            label: 'On Leave',
            icon: LuCalendar,
        },
        remote: {
            className: `${colors.purple.iconBg} ${colors.purple.iconText}`,
            label: 'Remote',
            icon: LuGlobe,
        },
    }
    return statusConfig[status]
}

// Get attendance status options for dropdowns
export const getAttendanceStatusOptions = () => [
    { value: 'all', label: 'All Status' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'on_leave', label: 'On Leave' },
    { value: 'remote', label: 'Remote' },
]
