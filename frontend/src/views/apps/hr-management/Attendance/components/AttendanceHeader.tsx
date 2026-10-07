import dayjs from 'dayjs'
import DatePicker from '@/components/ui/DatePicker'
import useAttendanceData from '../hooks/useAttendanceData'

const AttendanceHeader = () => {
    const { selectedDate, setSelectedDate } = useAttendanceData()

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const dateString = dayjs(date).format('YYYY-MM-DD')
            setSelectedDate(dateString)
        }
    }

    return (
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h4>Attendance</h4>
                <p>Track and manage employee attendance records</p>
            </div>
            <div className="flex items-center gap-3">
                <DatePicker
                    value={new Date(selectedDate)}
                    onChange={handleDateChange}
                    placeholder="Select date"
                    inputFormat="DD MMM YYYY"
                    clearable={false}
                />
            </div>
        </div>
    )
}

export default AttendanceHeader
