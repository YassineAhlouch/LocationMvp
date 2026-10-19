import dayjs from 'dayjs'
import DatePicker from '@/components/ui/DatePicker'
import type { CommonProps, TypeAttributes } from '@/components/ui/@types/common'

export interface MonthPickerProps extends CommonProps {
    value: Date
    onChange: (month: Date) => void
    placeholder?: string
    size?: TypeAttributes.ControlSize
    disabled?: boolean
}

/**
 * Month-only date picker. Emits the first day of the selected month so callers
 * can build a `startOf('month')` / `endOf('month')` range from it.
 */
const MonthPicker = ({
    value,
    onChange,
    placeholder,
    className,
    size,
    disabled,
}: MonthPickerProps) => (
    <DatePicker
        value={dayjs(value).startOf('month').toDate()}
        onChange={(date) =>
            onChange(dayjs(date ?? value).startOf('month').toDate())
        }
        inputFormat="MMMM YYYY"
        defaultView="month"
        lockView
        clearable={false}
        disabled={disabled}
        placeholder={placeholder}
        className={className}
        size={size}
    />
)

export default MonthPicker
