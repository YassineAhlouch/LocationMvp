import { useMemo } from 'react'
import dayjs from 'dayjs'
import InputGroup from '@/components/ui/InputGroup'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import FullCalendar from '@/components/shared/FullCalendar'
import Loading from '@/components/shared/Loading'
import useLeaveData from '../hooks/useLeaveData'
import { useLeavesStore } from '../store/leavesStore'
import CreateDialog from './CreateDialog'
import LeaveDetailsDialog from './LeaveDetailsDialog'
import { getEventColors } from '../utils'
import classNames from '@/utils/classNames'
import useDirection from '@/utils/hooks/useDirection'
import { LiChevronLeft, LiChevronRight } from '@/icons'
import type { FullCalendarEvent } from '@/components/shared/FullCalendar/types'
import type { LeaveCalendarEvent } from '../types'

type CustomEventProps = {
    event: FullCalendarEvent
    calendarEvents?: LeaveCalendarEvent[]
}

const CustomEvent = ({ event, calendarEvents }: CustomEventProps) => {
    const employeeCount = useMemo(() => {
        const originalEvent = calendarEvents?.find((e) => e.id === event.id)
        return originalEvent ? originalEvent.employees.length : 0
    }, [calendarEvents, event.id])

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                <Badge
                    className={classNames(
                        getEventColors(event.type),
                        'h-2.5 w-2.5',
                    )}
                />
                <span className="font-medium heading-text">{event.title}</span>
            </div>
            {employeeCount > 0 ? (
                <span className="heading-text font-semibold text-xs h-4 w-4 rounded flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                    {employeeCount}
                </span>
            ) : null}
        </div>
    )
}

const CalendarView = () => {
    const { calendarEvents, calendarLoading, updateEvent } = useLeaveData()
    const { openCreateDialog, openLeaveDetailsDialog, dialogs } =
        useLeavesStore()

    const [direction] = useDirection()

    const events = useMemo(() => {
        if (!calendarEvents) return []

        return calendarEvents.map((event) => ({
            id: event.id,
            startDate: event.startDate,
            endDate: event.endDate,
            title: event.title,
            color: event.color,
            description: event.description,
            type: event.type,
            disabled: false,
        })) as FullCalendarEvent[]
    }, [calendarEvents])

    const handleCellClick = (date: Date) => {
        openCreateDialog(date, 'holiday')
    }

    const handleEventClick = (event: FullCalendarEvent) => {
        const originalEvent = calendarEvents?.find((e) => e.id === event.id)
        if (originalEvent) {
            openLeaveDetailsDialog(originalEvent)
        }
    }

    const renderPreviousButton = (handlePrevious: () => void) => (
        <Button icon={<LiChevronLeft />} onClick={handlePrevious} />
    )

    const renderNextButton = (handleNext: () => void) => (
        <Button icon={<LiChevronRight />} onClick={handleNext} />
    )

    return (
        <div className="h-full flex flex-col">
            <Loading loading={calendarLoading} type="cover">
                <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <FullCalendar
                        events={events}
                        onCellClick={handleCellClick}
                        onEventClick={handleEventClick}
                        onChange={(_, event) => {
                            updateEvent(event)
                        }}
                        renderEvent={({ event }) => ({
                            className:
                                'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800',
                            content: (
                                <CustomEvent
                                    event={event}
                                    calendarEvents={calendarEvents}
                                />
                            ),
                        })}
                        renderHeaderEnd={({
                            setSelectedDate,
                            handlePrevious,
                            handleNext,
                        }) => (
                            <InputGroup>
                                {direction === 'ltr'
                                    ? renderPreviousButton(handlePrevious)
                                    : renderNextButton(handlePrevious)}
                                <Button
                                    onClick={() =>
                                        setSelectedDate(dayjs().toDate())
                                    }
                                >
                                    Today
                                </Button>
                                {direction === 'ltr'
                                    ? renderNextButton(handleNext)
                                    : renderPreviousButton(handleNext)}
                            </InputGroup>
                        )}
                    />
                </div>
            </Loading>
            <CreateDialog
                isOpen={dialogs.create.isOpen}
                selectedDate={dialogs.create.selectedDate}
                activeTab={dialogs.create.activeTab}
            />
            <LeaveDetailsDialog
                isOpen={dialogs.leaveDetails.isOpen}
                event={dialogs.leaveDetails.selectedEvent}
                selectedEmployee={dialogs.leaveDetails.selectedEmployee}
            />
        </div>
    )
}

export default CalendarView
