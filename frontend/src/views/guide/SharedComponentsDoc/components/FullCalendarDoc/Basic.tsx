import { useState } from 'react'
import FullCalendar from '@/components/shared/FullCalendar'
import type { FullCalendarEvent } from '@/components/shared/FullCalendar'

const initialEvents: FullCalendarEvent[] = [
    {
        id: 1,
        title: 'All Day Event',
        startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1,
        ).toISOString(),
        endDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1,
        ).toISOString(),
        color: 'orange',
        description: 'An all day event',
        type: 'event',
    },
    {
        id: 2,
        title: 'Long Event',
        startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            7,
        ).toISOString(),
        endDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            10,
        ).toISOString(),
        color: 'red',
        description: 'A multi-day event',
        type: 'event',
    },
    {
        id: 3,
        title: 'Repeating Event',
        startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            9,
            16,
            0,
        ).toISOString(),
        endDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            9,
            17,
            0,
        ).toISOString(),
        color: 'blue',
        description: 'A repeating event',
        type: 'meeting',
    },
    {
        id: 4,
        title: 'Birthday Party',
        startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            19,
            7,
            0,
        ).toISOString(),
        endDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            19,
            10,
            0,
        ).toISOString(),
        color: 'purple',
        description: 'Birthday celebration',
        type: 'event',
    },
    {
        id: 5,
        title: 'Meeting',
        startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            18,
            14,
            30,
        ).toISOString(),
        endDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            18,
            15,
            30,
        ).toISOString(),
        color: 'blue',
        description: 'Team meeting',
        type: 'meeting',
    },
    {
        id: 6,
        title: 'Dinner',
        startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            18,
            20,
            0,
        ).toISOString(),
        endDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            18,
            22,
            0,
        ).toISOString(),
        color: 'emerald',
        description: 'Dinner reservation',
        type: 'event',
    },
]

const Basic = () => {
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

export default Basic
