import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import classNames from '@/utils/classNames'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import Dialog from '@/components/ui/Dialog'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import FullCalendar from '@/components/shared/FullCalendar'
import Loading from '@/components/shared/Loading'
import { getColorClasses } from '@/components/shared/FullCalendar/utils'
import useDirection from '@/utils/hooks/useDirection'
import { LiChevronLeft, LiChevronRight } from '@/icons'
import ReservationForm from './forms/ReservationForm'
import {
    apiGetReservation,
    apiGetReservationCalendar,
    apiUpdateReservation,
} from '@/services/LocationService'
import {
    apiErrorMessage,
    reservationCalendarColor,
    reservationStatusOptions,
} from './shared'
import type {
    Reservation,
    ReservationCalendarItem,
} from '@/@types/location'
import type { FullCalendarEvent } from '@/components/shared/FullCalendar/types'

const reservationTitle = (item: ReservationCalendarItem) =>
    `${item.reservation_number} · ${item.primary_client?.full_name ?? 'Unassigned'}`

type CustomEventProps = {
    event: FullCalendarEvent
    item?: ReservationCalendarItem
}

/** A status dot plus the booking label, mirroring the HRM leaves calendar. */
const CustomEvent = ({ event, item }: CustomEventProps) => (
    <div className="flex min-w-0 items-center gap-1.5">
        <span
            className={classNames(
                getColorClasses(
                    item
                        ? reservationCalendarColor[item.status]
                        : reservationCalendarColor.pending,
                ).bullet,
                'h-2.5 w-2.5 shrink-0 rounded-full',
            )}
        />
        <span className="truncate font-medium heading-text">
            {item ? reservationTitle(item) : event.title}
        </span>
    </div>
)

const ReservationCalendar = () => {
    const [items, setItems] = useState<ReservationCalendarItem[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Reservation | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [opening, setOpening] = useState(false)
    const [direction] = useDirection()

    const fetchItems = useCallback((silent = false) => {
        if (!silent) {
            setLoading(true)
        }
        return apiGetReservationCalendar()
            .then(setItems)
            .catch((error) =>
                toast.push(
                    <Notification type="danger" title="Unable to load calendar">
                        {apiErrorMessage(error, 'Please try again.')}
                    </Notification>,
                ),
            )
            .finally(() => {
                if (!silent) {
                    setLoading(false)
                }
            })
    }, [])

    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    const itemById = useMemo(() => {
        const map = new Map<number, ReservationCalendarItem>()
        items.forEach((item) => map.set(item.id, item))
        return map
    }, [items])

    const events = useMemo<FullCalendarEvent[]>(
        () =>
            items.map((item) => ({
                id: item.id,
                startDate: item.pickup_datetime,
                endDate: item.expected_return_datetime,
                title: reservationTitle(item),
                color: reservationCalendarColor[item.status],
                description: `${item.rental_days} day(s)`,
                type: item.status,
            })),
        [items],
    )

    const openCreate = (date: Date) => {
        setEditing(null)
        setSelectedDate(date)
        setDialogOpen(true)
    }

    const handleCellClick = (date: Date) => openCreate(date)

    const handleEventClick = (event: FullCalendarEvent) => {
        setOpening(true)
        apiGetReservation(Number(event.id))
            .then((reservation) => {
                setEditing(reservation)
                setSelectedDate(null)
                setDialogOpen(true)
            })
            .catch((error) =>
                toast.push(
                    <Notification type="danger" title="Unable to open booking">
                        {apiErrorMessage(error, 'Please try again.')}
                    </Notification>,
                ),
            )
            .finally(() => setOpening(false))
    }

    const handleChange = (
        _events: FullCalendarEvent[],
        event: FullCalendarEvent,
    ) => {
        const item = items.find((entry) => entry.id === Number(event.id))
        if (!item) {
            return
        }

        const pickup = dayjs(event.startDate)
        const expectedReturn = dayjs(event.endDate)

        // Optimistic move so the event stays where it was dropped while the
        // server validates availability.
        setItems((previous) =>
            previous.map((entry) =>
                entry.id === item.id
                    ? {
                          ...entry,
                          pickup_datetime: pickup.toISOString(),
                          expected_return_datetime:
                              expectedReturn.toISOString(),
                      }
                    : entry,
            ),
        )

        apiUpdateReservation(item.id, {
            pickup_datetime: pickup.format('YYYY-MM-DD HH:mm:ss'),
            expected_return_datetime:
                expectedReturn.format('YYYY-MM-DD HH:mm:ss'),
        })
            .then(() =>
                toast.push(
                    <Notification type="success" title="Booking rescheduled" />,
                ),
            )
            .catch((error) =>
                toast.push(
                    <Notification type="danger" title="Unable to reschedule">
                        {apiErrorMessage(error, 'Please try again.')}
                    </Notification>,
                ),
            )
            .finally(() => fetchItems(true))
    }

    const renderPreviousButton = (handlePrevious: () => void) => (
        <Button icon={<LiChevronLeft />} onClick={handlePrevious} />
    )

    const renderNextButton = (handleNext: () => void) => (
        <Button icon={<LiChevronRight />} onClick={handleNext} />
    )

    return (
        <Container className="px-4 h-full">
            <div className="flex h-full flex-col">
                <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4>Reservation Calendar</h4>
                        <p className="mt-1">
                            Manage vehicle reservations on a calendar
                        </p>
                        <div className="mt-3 hidden flex-wrap items-center gap-x-4 gap-y-1.5 lg:flex">
                            {reservationStatusOptions.map((option) => (
                                <span
                                    key={option.value}
                                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
                                >
                                    <span
                                        className={classNames(
                                            getColorClasses(
                                                reservationCalendarColor[
                                                    option.value
                                                ],
                                            ).bullet,
                                            'h-2 w-2 rounded-full',
                                        )}
                                    />
                                    {option.label}
                                </span>
                            ))}
                        </div>
                    </div>
                    <Button
                        variant="solid"
                        onClick={() => openCreate(new Date())}
                    >
                        New reservation
                    </Button>
                </div>

                <div className="min-h-0 flex-1 pb-4">
                    <Loading
                        loading={loading || opening}
                        type="cover"
                        className="h-full"
                    >
                        <div className="h-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <FullCalendar
                                events={events}
                                onCellClick={handleCellClick}
                                onEventClick={handleEventClick}
                                onChange={handleChange}
                                renderEvent={({ event }) => ({
                                    className:
                                        'border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 bg-gray-50',
                                    content: (
                                        <CustomEvent
                                            event={event}
                                            item={itemById.get(Number(event.id))}
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
                                            ? renderPreviousButton(
                                                  handlePrevious,
                                              )
                                            : renderNextButton(handlePrevious)}
                                        <Button
                                            onClick={() =>
                                                setSelectedDate(
                                                    dayjs().toDate(),
                                                )
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
                </div>
            </div>

            <Dialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                width={880}
                className="max-h-[90vh] overflow-y-auto"
            >
                <ReservationForm
                    reservation={editing}
                    initialDate={selectedDate}
                    isOpen={dialogOpen}
                    onCancel={() => setDialogOpen(false)}
                    onSaved={() => {
                        setDialogOpen(false)
                        fetchItems(true)
                    }}
                />
            </Dialog>
        </Container>
    )
}

export default ReservationCalendar