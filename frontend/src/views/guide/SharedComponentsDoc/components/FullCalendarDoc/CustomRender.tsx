import { useState } from 'react'
import FullCalendar from '@/components/shared/FullCalendar'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import type { FullCalendarEvent } from '@/components/shared/FullCalendar'
import type { CalendarView } from '@/components/shared/FullCalendar/types'
import { LiChevronLeft, LiChevronRight } from '@/icons'
import dayjs from 'dayjs'

const viewOptions = [
    { label: 'Agenda', value: 'agenda' },
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
]

const initialEvents: FullCalendarEvent[] = [
    {
        id: 1,
        title: 'Team Standup',
        startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            5,
            9,
            0,
        ).toISOString(),
        endDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            5,
            9,
            30,
        ).toISOString(),
        color: 'blue',
        description: 'Daily standup meeting',
        type: 'meeting',
    },
    {
        id: 2,
        title: 'Project Review',
        startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            12,
        ).toISOString(),
        endDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            14,
        ).toISOString(),
        color: 'purple',
        description: 'Quarterly project review',
        type: 'event',
    },
    {
        id: 3,
        title: 'Workshop',
        startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            20,
            14,
            0,
        ).toISOString(),
        endDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            20,
            17,
            0,
        ).toISOString(),
        color: 'emerald',
        description: 'Technical workshop',
        type: 'event',
    },
]

const CustomRender = () => {
    const [currentView, setCurrentView] = useState<CalendarView>('month')
    const [events, setEvents] = useState<FullCalendarEvent[]>(initialEvents)
    const [selectedCell, setSelectedCell] = useState<Date | null>(null)
    const [selectedEvent, setSelectedEvent] =
        useState<FullCalendarEvent | null>(null)

    const handleCellClick = (date: Date) => {
        console.log('onCellClick', date)
        setSelectedCell(date)
    }

    const handleEventClick = (event: FullCalendarEvent) => {
        console.log('onEventClick', event)
        setSelectedEvent(event)
    }

    const handleChange = (
        updatedEvents: FullCalendarEvent[],
        changedEvent: FullCalendarEvent,
    ) => {
        console.log('onChange', { updatedEvents, changedEvent })
        setEvents(updatedEvents)
    }

    return (
        <div>
            <FullCalendar
                events={events}
                renderHeaderStart={({ selectedDate }) => (
                    <div className="flex items-center gap-2">
                        <h5>{dayjs(selectedDate).format('MMMM YYYY')}</h5>
                    </div>
                )}
                renderHeaderEnd={({
                    handlePrevious,
                    handleNext,
                    setSelectedDate,
                    setView,
                }) => (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handlePrevious}
                                icon={<LiChevronLeft />}
                            />
                            <Button onClick={() => setSelectedDate(new Date())}>
                                Today
                            </Button>
                            <Button
                                onClick={handleNext}
                                icon={<LiChevronRight />}
                            />
                        </div>
                        <Select
                            className="w-[100px]"
                            options={viewOptions}
                            value={viewOptions.find(
                                (opt) => opt.value === currentView,
                            )}
                            onChange={(selected) => {
                                const newView = selected?.value as CalendarView
                                setCurrentView(newView)
                                setView(newView)
                            }}
                        />
                    </div>
                )}
                renderEvent={({ event }) => ({
                    content: (
                        <div className="flex items-center gap-1">
                            <span
                                className={`w-2 h-2 rounded-full bg-${event.color}-500`}
                            />
                            <span className="truncate font-medium">
                                {event.title}
                            </span>
                        </div>
                    ),
                    className:
                        'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg',
                })}
                onCellClick={handleCellClick}
                onEventClick={handleEventClick}
                onChange={handleChange}
            />
            {selectedCell && (
                <p className="mt-4 text-sm text-gray-500">
                    Selected cell: {selectedCell.toDateString()}
                </p>
            )}
            {selectedEvent && (
                <p className="mt-2 text-sm text-gray-500">
                    Selected event: {selectedEvent.title}
                </p>
            )}
        </div>
    )
}

export default CustomRender
