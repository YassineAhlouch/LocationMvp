import { useState } from 'react'
import Popover from '@/components/ui/Popover'
import Calendar from '@/components/ui/Calendar'

const Controlled = () => {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | null>(null)

    const handleCalendarChange = (date: Date | null) => {
        setOpen(false)
        setDate(date)
    }

    return (
        <div>
            <Popover
                title={date ? date.toDateString() : 'Select a date'}
                open={open}
                placement="bottom-start"
                onOpenChange={setOpen}
                style={{ width: 280 }}
            >
                <Calendar value={date} onChange={handleCalendarChange} />
            </Popover>
        </div>
    )
}

export default Controlled
