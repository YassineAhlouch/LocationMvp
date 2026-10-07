import { useState, useCallback, useMemo } from 'react'
import Select from '@/components/ui/Select'
import { DatePicker } from '@/components/ui/DatePicker'
import { useAnnouncementsStore } from '../store/announcementsStore'
import { debounce } from 'lodash'
import type { DateRange, SortOption } from '../types'

const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest)' },
    { value: 'date-asc', label: 'Date (Oldest)' },
    { value: 'reactions', label: 'Most Reactions' },
    { value: 'comments', label: 'Most Comments' },
]

const AnnouncementFilters = () => {
    const { dateRange, sortBy, setDateRange, setSortBy } =
        useAnnouncementsStore()
    const [localDateRange, setLocalDateRange] = useState<
        [Date | null, Date | null]
    >([
        dateRange?.start ? new Date(dateRange.start) : null,
        dateRange?.end ? new Date(dateRange.end) : null,
    ])

    const debouncedSetDateRange = useMemo(
        () =>
            debounce((range: DateRange | null) => {
                setDateRange(range)
            }, 300),
        [setDateRange],
    )

    const handleDateRangeChange = useCallback(
        (dates: [Date | null, Date | null]) => {
            setLocalDateRange(dates)

            if (dates[0] && dates[1]) {
                const range: DateRange = {
                    start: dates[0].toISOString(),
                    end: dates[1].toISOString(),
                }
                debouncedSetDateRange(range)
            } else {
                debouncedSetDateRange(null)
            }
        },
        [debouncedSetDateRange],
    )

    const handleSortChange = useCallback(
        (option: { value: string; label: string } | null) => {
            if (option) {
                setSortBy(option.value as SortOption)
            }
        },
        [setSortBy],
    )

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <DatePicker.DatePickerRange
                placeholder="Select date range"
                value={localDateRange}
                onChange={handleDateRangeChange}
                className="w-full sm:w-64"
            />

            <Select
                placeholder="Sort by"
                options={sortOptions}
                value={sortOptions.find((opt) => opt.value === sortBy)}
                onChange={handleSortChange}
                className="w-full sm:w-48"
            />
        </div>
    )
}

export default AnnouncementFilters
