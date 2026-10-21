import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import Button from '@/components/ui/Button'
import RangeCalendar from '@/components/ui/DatePicker/RangeCalendar'
import useTranslation from '@/utils/hooks/useTranslation'
import { LiChevronDown } from '@/icons'
import {
    FloatingPortal,
    autoUpdate,
    flip,
    offset,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from '@floating-ui/react'
import type { CommonProps, TypeAttributes } from '@/components/ui/@types/common'

dayjs.extend(quarterOfYear)

export type DateRange = { from: Date; to: Date }

export type PeriodPreset = 'today' | 'week' | 'month' | 'quarter' | 'year'

const PRESETS: {
    key: PeriodPreset
    labelKey: string
    defaultLabel: string
}[] = [
    { key: 'today', labelKey: 'period.today', defaultLabel: 'Today' },
    { key: 'week', labelKey: 'period.thisWeek', defaultLabel: 'This Week' },
    { key: 'month', labelKey: 'period.thisMonth', defaultLabel: 'This Month' },
    {
        key: 'quarter',
        labelKey: 'period.thisQuarter',
        defaultLabel: 'This Quarter',
    },
    { key: 'year', labelKey: 'period.thisYear', defaultLabel: 'This Year' },
]

/** The from/to window for a named preset. */
export const presetRange = (preset: PeriodPreset): DateRange => {
    const now = dayjs()

    switch (preset) {
        case 'today':
            return {
                from: now.startOf('day').toDate(),
                to: now.endOf('day').toDate(),
            }
        case 'week':
            return {
                from: now.startOf('week').toDate(),
                to: now.endOf('week').toDate(),
            }
        case 'quarter':
            return {
                from: now.startOf('quarter').toDate(),
                to: now.endOf('quarter').toDate(),
            }
        case 'year':
            return {
                from: now.startOf('year').toDate(),
                to: now.endOf('year').toDate(),
            }
        case 'month':
        default:
            return {
                from: now.startOf('month').toDate(),
                to: now.endOf('month').toDate(),
            }
    }
}

/** Default window: the current calendar month. */
export const currentMonthRange = (): DateRange => presetRange('month')

const isSameRange = (a: DateRange, b: DateRange) =>
    dayjs(a.from).isSame(b.from, 'day') && dayjs(a.to).isSame(b.to, 'day')

/** The preset a range aligns with exactly, if any. */
export const activePreset = (range: DateRange): PeriodPreset | null =>
    PRESETS.find((preset) => isSameRange(presetRange(preset.key), range))
        ?.key ?? null

/**
 * The window immediately before `range`. It snaps to the previous
 * day/week/month/quarter/year when the range matches a preset, otherwise it
 * shifts back by the same number of days.
 */
export const previousPeriod = (range: DateRange): DateRange => {
    const preset = activePreset(range)
    const start = dayjs(range.from)
    const end = dayjs(range.to)

    switch (preset) {
        case 'today':
            return {
                from: start.subtract(1, 'day').toDate(),
                to: end.subtract(1, 'day').toDate(),
            }
        case 'week':
            return {
                from: start.subtract(1, 'week').toDate(),
                to: end.subtract(1, 'week').toDate(),
            }
        case 'month':
            return {
                from: start.subtract(1, 'month').toDate(),
                to: end.subtract(1, 'month').toDate(),
            }
        case 'quarter':
            return {
                from: start.subtract(1, 'quarter').toDate(),
                to: end.subtract(1, 'quarter').toDate(),
            }
        case 'year':
            return {
                from: start.subtract(1, 'year').toDate(),
                to: end.subtract(1, 'year').toDate(),
            }
        default: {
            const days = end.diff(start, 'day') + 1
            const comparisonEnd = start.subtract(1, 'day')
            return {
                from: comparisonEnd.subtract(days - 1, 'day').toDate(),
                to: comparisonEnd.toDate(),
            }
        }
    }
}

export interface PeriodPickerProps extends CommonProps {
    value: DateRange
    onChange: (range: DateRange) => void
    size?: TypeAttributes.ControlSize
}

/**
 * Period picker: quick presets (day/week/month/quarter/year) plus a calendar
 * to pin an exact from/to window. The trigger shows the active preset name, or
 * the concrete date range when the selection does not match a preset.
 */
const PeriodPicker = ({
    value,
    onChange,
    className,
    size,
}: PeriodPickerProps) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    const active = activePreset(value)

    const label = useMemo(() => {
        if (active) {
            const preset = PRESETS.find((item) => item.key === active)
            return t(preset?.labelKey ?? '', preset?.defaultLabel)
        }
        return `${dayjs(value.from).format('DD MMM YYYY')} – ${dayjs(
            value.to,
        ).format('DD MMM YYYY')}`
    }, [active, value, t])

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        placement: 'bottom-end',
        middleware: [offset(10), flip(), shift()],
        whileElementsMounted: autoUpdate,
    })

    const { getReferenceProps, getFloatingProps } = useInteractions([
        useClick(context),
        useDismiss(context),
        useRole(context, { role: 'dialog' }),
    ])

    const handlePreset = (preset: PeriodPreset) => {
        onChange(presetRange(preset))
        setOpen(false)
    }

    const handleCalendarChange = ([start, end]: [Date | null, Date | null]) => {
        if (start && end) {
            onChange({ from: start, to: end })
            setOpen(false)
        }
    }

    return (
        <>
            <Button
                ref={refs.setReference}
                size={size}
                className={className}
                icon={<LiChevronDown className="text-sm" />}
                iconAlignment="end"
                {...getReferenceProps()}
            >
                {label}
            </Button>
            {open && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className="picker"
                        {...getFloatingProps()}
                    >
                        <div className="picker-panel">
                            <div className="flex flex-col sm:flex-row">
                                <div className="flex shrink-0 gap-1 overflow-x-auto border-gray-200 p-2 sm:w-36 sm:flex-col sm:overflow-visible sm:border-e dark:border-gray-700">
                                    {PRESETS.map((preset) => (
                                        <Button
                                            key={preset.key}
                                            size="sm"
                                            block
                                            variant={
                                                active === preset.key
                                                    ? 'solid'
                                                    : 'ghost'
                                            }
                                            className="shrink-0 justify-start whitespace-nowrap sm:shrink"
                                            onClick={() =>
                                                handlePreset(preset.key)
                                            }
                                        >
                                            {t(
                                                preset.labelKey,
                                                preset.defaultLabel,
                                            )}
                                        </Button>
                                    ))}
                                </div>
                                <div className="p-2">
                                    <RangeCalendar
                                        value={[value.from, value.to]}
                                        onChange={handleCalendarChange}
                                        firstDayOfWeek="monday"
                                        dateViewCount={1}
                                        defaultMonth={value.from}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </FloatingPortal>
            )}
        </>
    )
}

export default PeriodPicker
