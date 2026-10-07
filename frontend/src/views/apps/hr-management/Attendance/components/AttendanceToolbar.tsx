import { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Segment from '@/components/ui/Segment'
import DebouceInput from '@/components/shared/DebouceInput'
import { LiAdd, LiTextAlignLeft, LiElement3 } from '@/icons'
import useAttendanceData from '../hooks/useAttendanceData'
import { useAttendanceStore } from '../store/attendanceStore'
import { getAttendanceStatusOptions } from '../utils'
import { LuSearch } from 'react-icons/lu'
import type { ViewMode } from '../types'

type AttendanceToolbarProps = {
    onAddRecord: () => void
}

const AttendanceToolbar = ({ onAddRecord }: AttendanceToolbarProps) => {
    const { setQueryParams, filterState, selectedDate } = useAttendanceData()
    const { viewMode, setViewMode } = useAttendanceStore()
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' })
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const date = dayjs(selectedDate)
        const startOfWeek = date.startOf('week')
        const endOfWeek = date.endOf('week')

        setDateRange({
            startDate: startOfWeek.format('YYYY-MM-DD'),
            endDate: endOfWeek.format('YYYY-MM-DD'),
        })
    }, [selectedDate])

    const viewOptions = [
        { value: 'list', label: <LiTextAlignLeft /> },
        { value: 'period', label: <LiElement3 /> },
    ]

    const handleViewChange = (value: string) => {
        setViewMode(value as ViewMode)
        setQueryParams({
            query: '',
            status: 'all',
            pageIndex: 1,
        })
        if (searchInputRef.current) {
            searchInputRef.current.value = ''
        }
    }

    const statusOptions = getAttendanceStatusOptions()

    const handleSearch = (query: string) => {
        setQueryParams({ query, pageIndex: 1 })
    }

    const handleStatusFilter = (
        option: { value: string; label: string } | null,
    ) => {
        setQueryParams({
            status: option?.value || 'all',
            pageIndex: 1,
        })
    }

    const selectedStatus = statusOptions.find(
        (option) => option.value === (filterState.status || 'all'),
    )

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:flex-1">
                    <div className="w-full sm:w-auto">
                        <DebouceInput
                            ref={searchInputRef}
                            className="lg:max-w-[250px]"
                            prefix={
                                <LuSearch className="text-base heading-text" />
                            }
                            placeholder="Search by name, department..."
                            wait={300}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleSearch(e.target.value)}
                        />
                    </div>
                    {viewMode === 'list' && (
                        <div className="w-full sm:min-w-[150px] sm:w-auto">
                            <Select
                                options={statusOptions}
                                value={selectedStatus}
                                onChange={handleStatusFilter}
                                placeholder="Filter by status"
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    {viewMode === 'period' && (
                        <div className="font-medium heading-text text-center sm:text-left">
                            {dateRange.startDate &&
                                dateRange.endDate &&
                                `${dayjs(dateRange.startDate).format('MMM D')} - ${dayjs(dateRange.endDate).format('MMM D, YYYY')}`}
                        </div>
                    )}
                    <div className="flex items-center gap-2 justify-between sm:justify-end">
                        <Segment value={viewMode} onChange={handleViewChange}>
                            {viewOptions.map((option) => (
                                <Segment.Item
                                    key={option.value}
                                    value={option.value}
                                    className="px-2"
                                >
                                    {option.label}
                                </Segment.Item>
                            ))}
                        </Segment>
                        <Button icon={<LiAdd />} onClick={onAddRecord}>
                            Add Record
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttendanceToolbar
