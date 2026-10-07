import { Fragment } from 'react'
import Scroll from '@/components/ui/Scroll'
import Checkbox from '@/components/ui/Checkbox'
import Tag from '@/components/ui/Tag'
import Skeleton from '@/components/ui/Skeleton'
import Divider from '@/components/shared/Divider'
import classNames from '@/utils/classNames'
import { useHelpdeskStore } from '../store/helpdeskStore'
import useTicketList from '../hooks/useTicketList'
import { statusMap, priorityMap } from '../utils'
import dayjs from 'dayjs'
import { useParams, useNavigate } from 'react-router'
import { LuTag } from 'react-icons/lu'
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs'
import type { Ticket } from '../types'

type TicketItemProps = {
    data: Ticket
    ticketTicked?: boolean
    ticketSelected?: boolean
    onTicketSelect: (ticket: Ticket) => void
    onTicketTick?: (ticket: Ticket) => void
}

const TicketItem = ({
    data,
    onTicketSelect,
    onTicketTick,
    ticketTicked,
    ticketSelected,
}: TicketItemProps) => {
    return (
        <div
            className={classNames(
                'px-2 py-3 flex gap-2 cursor-pointer rounded-lg',
                ticketSelected
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-100 hover:dark:bg-gray-800',
            )}
            role="button"
            onClick={(e) => {
                e.stopPropagation()
                onTicketSelect(data)
            }}
        >
            <div className="mt-1">
                <Checkbox
                    checked={ticketTicked}
                    onChange={(_, e) => {
                        e.stopPropagation()
                        onTicketTick?.(data)
                    }}
                />
            </div>
            <div className="flex-1">
                <div className="mb-3 flex justify-between gap-2">
                    <div className="flex items-start gap-2">
                        <div>
                            <div className="font-semibold heading-text">
                                {data.subject}
                            </div>
                            <span className="flex items-center gap-1 text-xs font-medium">
                                <LuTag />
                                <span>{data.id}</span>
                            </span>
                        </div>
                    </div>
                    <span className="text-nowrap text-xs heading-text">
                        {dayjs(data.createdAt).format('MMM DD')}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <Tag className="flex items-center gap-1 bg-white dark:bg-transparent py-0.5 px-1.5">
                        <span
                            className={classNames(
                                'h-2.5 w-2.5 rounded-xs',
                                statusMap[data.status]?.color,
                            )}
                        ></span>
                        <span className="heading-text">{data.status}</span>
                    </Tag>
                    <span className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1">
                            <span className="heading-text text-xs">
                                {data.pinned ? (
                                    <BsPinAngleFill className="text-primary" />
                                ) : (
                                    <BsPinAngle />
                                )}
                            </span>
                        </span>
                        <Divider orientation="vertical" className="h-4 mx-0" />
                        <span
                            className={classNames(
                                priorityMap[data.priority]?.color,
                            )}
                            title={`Priority: ${data.priority}`}
                        >
                            {priorityMap[data.priority]?.icon}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}

const TicketList = () => {
    const { ticketList: data, isLoading } = useTicketList()

    const param = useParams()
    const navigate = useNavigate()

    const selectedTicket = param.ticketId
    const tickedTickets = useHelpdeskStore((state) => state.tickedTickets)
    const setTickedTickets = useHelpdeskStore((state) => state.setTickedTickets)
    const setTicketPanelDrawerOpen = useHelpdeskStore(
        (state) => state.setTicketPanelDrawerOpen,
    )

    const handleTicketSelect = (ticket: Ticket) => {
        navigate(`/apps/customers/helpdesk/${ticket.id}`)
        setTicketPanelDrawerOpen(false)
    }

    const handleTicketTick = (ticket: Ticket) => {
        const isTicked = tickedTickets?.some((t) => t.id === ticket.id)
        if (isTicked) {
            setTickedTickets(tickedTickets.filter((t) => t.id !== ticket.id))
        } else {
            setTickedTickets([...tickedTickets, ticket])
        }
    }

    return (
        <>
            <Scroll
                className="h-full"
                contentClassName="h-full"
                scrollbars="vertical"
            >
                <div className="p-2">
                    {data.map((ticket, index) => (
                        <Fragment key={ticket.id}>
                            <TicketItem
                                data={ticket}
                                ticketSelected={selectedTicket === ticket.id}
                                ticketTicked={tickedTickets.some(
                                    (t) => t.id === ticket.id,
                                )}
                                onTicketTick={handleTicketTick}
                                onTicketSelect={handleTicketSelect}
                            />
                            {index < data.length - 1 && (
                                <Divider className="my-1" />
                            )}
                        </Fragment>
                    ))}
                    {isLoading &&
                        Array.from({ length: 10 - data.length }).map(
                            (_, index) => (
                                <Fragment key={index}>
                                    <div
                                        key={index}
                                        className="px-2 py-4 flex gap-2 "
                                    >
                                        <div className="mt-1">
                                            <Checkbox disabled />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-4">
                                            <Skeleton height={10} />
                                            <Skeleton height={10} width="60%" />
                                        </div>
                                    </div>
                                    {index < 10 && <Divider className="my-1" />}
                                </Fragment>
                            ),
                        )}
                    {!isLoading && data.length === 0 && (
                        <div className="p-4 text-center">
                            <span className="text-gray-400">
                                No Ticket Found
                            </span>
                        </div>
                    )}
                </div>
            </Scroll>
        </>
    )
}

export default TicketList
