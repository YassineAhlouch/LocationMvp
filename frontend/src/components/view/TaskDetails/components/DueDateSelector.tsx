import { useState } from 'react'
import Calendar from '@/components/ui/Calendar'
import Popover from '@/components/ui/Popover'
import dayjs from 'dayjs'
import type { ComponentProps } from 'react'

type DuedateSelectorProps = ComponentProps<'div'> & {
    value?: string
    onValueChange: (value: string) => void
}
const DuedateSelector = ({
    children,
    value,
    onValueChange,
}: DuedateSelectorProps) => {
    const [datePickerOpen, setDatePickerOpen] = useState(false)

    const handleValueChange = (date: Date) => {
        onValueChange(dayjs(date).toISOString())
        setDatePickerOpen(false)
    }

    return (
        <Popover
            renderTrigger={children}
            open={datePickerOpen}
            placement="bottom-start"
            onOpenChange={setDatePickerOpen}
            style={{ width: 280 }}
        >
            <Calendar
                value={dayjs(value).toDate()}
                onChange={handleValueChange}
            />
        </Popover>
    )
}

export default DuedateSelector
